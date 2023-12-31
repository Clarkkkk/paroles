import type { EndOfLine } from './utils'
import { detectEol, LF, prependZero } from './utils'

const validLineReg = /^\[[^:]+:[^\]]*\]/
const timeListReg = /\[(\d+):(\d+)(?:.(\d+))?\]/g
const metaReg = /\[([a-z]+):([^\]]*)\]/

interface LyricsInfo {
    /** al, Album where the song is from */
    album?: string
    /** ar, Lyrics artist */
    artist?: string
    /** au, Creator of the Songtext */
    author?: string
    /** ti, Lyrics (song) title */
    title?: string
    /** by, Creator of the LRC file */
    creator?: string
    /** +/- Overall timestamp adjustment in seconds, + shifts time up, - shifts down i.e. A positive value let lyrics appear sooner, a negative value delays the lyrics */
    offset?: number
    /** How long the song is */
    length?: string
    /** re, The player or editor that created the LRC file */
    editor?: string
    /** ve, version of program */
    version?: string
}

export interface LyricsLine {
    time: number
    text: string
}

interface LyricsMergeOption {
    override?: boolean
    resolveInfo?: (original: LyricsInfo, affiliate: LyricsInfo) => LyricsInfo
    resolveConflict?: (original: string, affiliate: string) => string
}

interface LyricsOption {
    resolveConflict?:
        | 'merge'
        | 'preserve'
        | 'overwrite'
        | ((line1: string, line2: string) => string)
}

const defaultLyricsOption: LyricsOption = {
    resolveConflict: 'merge'
}

interface LyricsParseOption {
    eol: EndOfLine
    resolveConflict?: LyricsOption['resolveConflict']
}

const defaultLyricsParseOption: LyricsParseOption = {
    eol: LF,
    resolveConflict: 'merge'
}

export class Lyrics {
    private _offset: number
    private _option: LyricsOption
    public eol: EndOfLine
    public info: LyricsInfo
    public lines: LyricsLine[]

    constructor(lyrics?: string | Lyrics)
    constructor(lyrics: string | Lyrics, option?: LyricsOption)
    constructor(lyrics?: string | Lyrics, option?: LyricsOption) {
        this._option = {
            ...defaultLyricsOption,
            ...(option || {})
        }
        if (typeof lyrics === 'string') {
            this.eol = detectEol(lyrics)
            const obj = Lyrics.parse(lyrics, {
                eol: this.eol,
                resolveConflict: this._option.resolveConflict
            })
            this.info = obj.info
            this.lines = obj.lines
            this._offset = obj.info.offset || 0
        } else if (typeof lyrics === 'undefined') {
            this.eol = LF
            this.info = {}
            this.lines = []
            this._offset = 0
        } else {
            const cloned = lyrics.clone()
            this.eol = cloned.eol
            this.info = cloned.info
            this.lines = cloned.lines
            this._offset = cloned.info.offset || 0
            this._option = cloned._option
        }
    }

    clone(): Lyrics {
        return new Lyrics(this.toString())
    }

    toString(): string {
        return Lyrics.stringify(this)
    }

    at(index: number) {
        return this.lines.at(index)
    }

    getIndexByTime(time: number) {
        const index = this.lines.findIndex((item) => item.time - this._offset > time)
        return index <= 0 ? index : index - 1
    }

    atTime(time: number) {
        const index = this.getIndexByTime(time)
        return this.lines.at(index)
    }

    setOffset(sec: number) {
        this._offset = sec
    }

    merge(lyrics: string | Lyrics, options?: LyricsMergeOption) {
        const affiliate = new Lyrics(lyrics)
        if (options?.resolveInfo) {
            this.info = options.resolveInfo(this.info, affiliate.info)
        } else if (options?.override) {
            this.info = {
                ...this.info,
                ...affiliate.info
            }
        } else {
            this.info = {
                ...affiliate.info,
                ...this.info
            }
        }

        for (const line of affiliate.lines) {
            let previousIndex = this.getIndexByTime(line.time)
            previousIndex = previousIndex === -1 ? this.lines.length - 1 : previousIndex
            if (this.lines[previousIndex].time === line.time) {
                if (options?.resolveConflict) {
                    this.lines[previousIndex] = {
                        time: line.time,
                        text: options.resolveConflict(this.lines[previousIndex].text, line.text)
                    }
                } else if (options?.override) {
                    this.lines[previousIndex] = {
                        time: line.time,
                        text: line.text
                    }
                } else {
                    continue
                }
            } else if (previousIndex === this.lines.length - 1) {
                this.lines.push(line)
            } else if (previousIndex === 0 && line.time < this.lines[previousIndex].time) {
                this.lines.unshift(line)
            } else {
                this.lines.splice(previousIndex + 1, 0, line)
            }
        }

        return this
    }

    insert(lines: LyricsLine | LyricsLine[]) {
        const arr = Array.isArray(lines) ? lines : [lines]
        for (const line of arr) {
            let index = this.getIndexByTime(line.time)
            index = index === -1 ? this.lines.length - 1 : index
            if (this.lines[index].time === line.time) {
                this.lines[index] = line
            } else if (index === this.lines.length - 1) {
                this.lines.push(line)
            } else if (index === 0 && line.time < this.lines[index].time) {
                this.lines.unshift(line)
            } else {
                this.lines.splice(index + 1, 0, line)
            }
        }

        return this
    }

    remove(line: LyricsLine | string | RegExp) {
        if (typeof line === 'string') {
            this.lines = this.lines.filter((item) => {
                return item.text !== line
            })
        } else if (line instanceof RegExp) {
            this.lines = this.lines.filter((item) => {
                return !line.test(item.text)
            })
        } else {
            let index = this.getIndexByTime(line.time)
            index = index === -1 ? this.lines.length - 1 : index
            if (this.lines[index].time === line.time && this.lines[index].text === line.text) {
                this.lines.splice(index, 1)
            } else {
                console.error('lyrics line not existed')
            }
        }

        return this
    }

    replace(oldLine: LyricsLine, newLine: LyricsLine): Lyrics
    replace(oldLine: string, newLine: string): Lyrics
    replace(oldLine: RegExp, newLine: LyricsLine): Lyrics
    replace(oldLine: RegExp, newLine: string): Lyrics
    replace(oldLine: LyricsLine | string | RegExp, newLine: LyricsLine | string) {
        if (
            (typeof oldLine === 'string' || oldLine instanceof RegExp) &&
            typeof newLine === 'string'
        ) {
            const items = this.lines.filter((l) => {
                if (typeof oldLine === 'string') {
                    return l.text === oldLine
                } else {
                    return oldLine.test(l.text)
                }
            })
            if (items.length) {
                items.forEach((item) => {
                    if (typeof oldLine === 'string') {
                        item.text = newLine
                    } else {
                        item.text = item.text.replace(oldLine, newLine)
                    }
                })
            }
        } else if (isLyricsLine(oldLine) && isLyricsLine(newLine)) {
            const indices: number[] = []
            this.lines.forEach((item, index) => {
                if (item.text === oldLine.text && item.time === oldLine.time) {
                    indices.push(index)
                }
            })
            indices.forEach((index) => {
                this.lines[index] = newLine
            })
        }

        return this
    }

    setInfo(info: LyricsInfo) {
        this.info = {
            ...this.info,
            ...info
        }

        return this
    }

    static stringify(lyrics: Lyrics) {
        const textArr: string[] = []

        for (const [key, val] of Object.entries(lyrics.info)) {
            const abbr = getMetaTypeAbbr(key)
            textArr.push(`[${abbr}:${val}]`)
        }

        const lyricsMap: Record<string, number[]> = {}
        for (const line of lyrics.lines) {
            if (lyricsMap[line.text]) {
                lyricsMap[line.text].push(line.time)
            } else {
                lyricsMap[line.text] = [line.time]
            }
        }

        const lyricsArr = Object.entries(lyricsMap)
            .map(([key, val]) => {
                return {
                    text: key,
                    time: val
                }
            })
            .sort((a, b) => a.time[0] - b.time[0])
            .map((item) => {
                const timeText = item.time.map((t) => `[${formatTime(t)}]`)
                return `${timeText.join('')}${item.text}`
            })

        textArr.push(...lyricsArr)

        return textArr.join(lyrics.eol)
    }

    static parse(text: string, option?: LyricsParseOption) {
        const mergedOption = {
            ...defaultLyricsParseOption,
            ...(option || {})
        }
        const lines = text
            .split(mergedOption.eol)
            .map((l) => l.trim())
            .filter((l) => validLineReg.test(l))

        const lyricInfo: LyricsInfo = {}
        const lyricLines: LyricsLine[] = []
        for (const line of lines) {
            if (timeListReg.test(line)) {
                const text = line.replace(timeListReg, '').trim()
                const matches = Array.from(line.matchAll(timeListReg))
                matches.forEach((match) => {
                    // a bit verbose to avoid queer behavious in JavaScript like 60 + 35.76 === 95.75999999999999
                    const min = +match[1]
                    const sec = +match[2]
                    const decimalStr = (match[3] ? Number(`0.${match[3]}`) : 0).toFixed(2)
                    const integer = (min * 60 + sec).toString()
                    const decimal = decimalStr.slice(1)
                    lyricLines.push({
                        time: Number(integer + decimal),
                        text
                    })
                })
            } else if (metaReg.test(line)) {
                const matches = line.match(metaReg) || ['', '']
                const metaType = getMetaType(matches[1].trim())
                const metaText = matches[2].trim()
                if (metaType) {
                    if (metaType !== 'offset') {
                        lyricInfo[metaType] = metaText || ''
                    } else {
                        const offset = +metaText
                        lyricInfo[metaType] = isNaN(offset) ? 0 : +(offset / 1000).toFixed(2)
                    }
                }
            }
        }

        lyricLines.sort(function (a, b) {
            // if (a.time === b.time) {
            //     console.error(
            //         `Found two lines with the same time: "${a.text}" and "${
            //             b.text
            //         }" at ${formatTime(a.time)}`
            //     )
            // }
            return a.time - b.time
        })

        lyricLines.forEach((item, index, arr) => {
            if (!arr[index + 1] || item.time !== arr[index + 1].time) return
            if (mergedOption.resolveConflict === 'merge') {
                arr[index].text = `${arr[index].text}${mergedOption.eol}${arr[index + 1].text}`
            } else if (mergedOption.resolveConflict === 'overwrite') {
                arr[index].text = arr[index + 1].text
            } else if (typeof mergedOption.resolveConflict === 'function') {
                arr[index].text = mergedOption.resolveConflict(arr[index].text, arr[index + 1].text)
            }
            arr.splice(index + 1, 1)
        })

        return {
            info: lyricInfo,
            lines: lyricLines
        }
    }
}

function getMetaType(t: string): keyof LyricsInfo | undefined {
    switch (t) {
        case 'al':
            return 'album'
        case 'ar':
            return 'artist'
        case 'au':
            return 'author'
        case 'ti':
            return 'title'
        case 'by':
            return 'creator'
        case 'offset':
            return 'offset'
        case 'length':
            return 'length'
        case 're':
            return 'editor'
        case 've':
            return 'version'
        default:
            return undefined
    }
}

function getMetaTypeAbbr(t: string): string {
    switch (t) {
        case 'album':
            return 'al'
        case 'artist':
            return 'ar'
        case 'author':
            return 'au'
        case 'title':
            return 'ti'
        case 'creator':
            return 'by'
        case 'offset':
            return 'offset'
        case 'length':
            return 'length'
        case 'editor':
            return 're'
        case 'version':
            return 've'
        default:
            return ''
    }
}

function formatTime(t: number): string {
    const min = prependZero(Math.floor(t / 60), 2)
    const sec = prependZero((t % 60).toFixed(2), 2)
    return `${min}:${sec}`
}

function isLyricsLine(line: unknown): line is LyricsLine {
    return !!line && typeof line === 'object' && 'text' in line && 'time' in line
}
