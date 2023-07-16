import type { EndOfLine } from './utils'
import { detectEol, LF, prependZero } from './utils'

const validLineReg = /^\[[^:]+:[^\]]*\]/
const timeListReg = /\[(\d+):(\d+)(?:.(\d+))?\]/g
const metaReg = /\[([a-z]+):([^\]]*)\]/

interface LyricsInfo {
    album?: string
    artist?: string
    author?: string
    title?: string
    creator?: string
    offset?: number
    length?: string
    editor?: string
    version?: string
}

export interface LyricsLine {
    time: number
    text: string
}

export class Lyrics {
    private _offset: number
    public eol: EndOfLine
    public info: LyricsInfo
    public lines: LyricsLine[]

    constructor(lyrics: string | Lyrics) {
        if (typeof lyrics === 'string') {
            this.eol = detectEol(lyrics)
            const obj = Lyrics.parse(lyrics, this.eol)
            this.info = obj.info
            this.lines = obj.lines
            this._offset = obj.info.offset || 0
        } else {
            const cloned = lyrics.clone()
            this.eol = cloned.eol
            this.info = cloned.info
            this.lines = cloned.lines
            this._offset = cloned.info.offset || 0
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
                return `${timeText}${item.text}`
            })

        textArr.push(...lyricsArr)

        return textArr.join(lyrics.eol)
    }

    static parse(text: string, eol: EndOfLine = LF) {
        const lines = text
            .split(eol)
            .map((l) => l.trim())
            .filter((l) => validLineReg.test(l))

        const lyricInfo: LyricsInfo = {}
        const lyricLines: LyricsLine[] = []
        for (const line of lines) {
            if (timeListReg.test(line)) {
                const text = line.replace(timeListReg, '').trim()
                const matches = Array.from(line.matchAll(timeListReg))
                matches.forEach((match) => {
                    const min = +match[1]
                    const sec = +(match[2] + '.' + match[3])
                    const time = min * 60 + sec
                    lyricLines.push({
                        time,
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
            return a.time - b.time
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
