import type { Lyrics } from './lyrics'

type LyricsPlayerEvent = 'linechange' | 'lyricschange'

type LyricsPlayerEventPair =
    | ['linechange', (currentLine: string, index: number) => void]
    | ['lyricschange', () => void]

export class LyricsPlayer {
    public lyrics: Lyrics
    public currentTime: number
    private _subscribtions: Record<LyricsPlayerEvent, Array<() => void>>
    private _currentLine: string | undefined

    constructor(lyrics: Lyrics) {
        this.lyrics = lyrics
        this.currentTime = 0
        this._subscribtions = {
            linechange: [],
            lyricschange: []
        }
    }

    updateTime(time: number) {
        this.currentTime = time

        if (this._currentLine !== this.getCurrentLine()) {
            this._currentLine = this.getCurrentLine()
            this._subscribtions.linechange.forEach((cb) => cb())
        }
    }

    getCurrentLine() {
        return this.lyrics.atTime(this.currentTime)?.text || ''
    }

    getCurrentIndex() {
        return this.lyrics.getIndexByTime(this.currentTime)
    }

    on<T extends LyricsPlayerEventPair = LyricsPlayerEventPair>(...[e, handler]: T) {
        if (e === 'linechange') {
            const callback = () => {
                const index = this.getCurrentIndex()
                const currentLine = this.lyrics.lines.at(index)
                handler(currentLine?.text || '', index)
            }
            this._subscribtions.linechange.push(callback)
        } else if (e === 'lyricschange') {
            const callback = () => handler()
            this._subscribtions.lyricschange.push(callback)
        }
    }

    off<T extends LyricsPlayerEventPair = LyricsPlayerEventPair>(e?: T[0]): void
    off<T extends LyricsPlayerEventPair = LyricsPlayerEventPair>(e?: T[0], handler?: T[1]): void
    off<T extends LyricsPlayerEventPair = LyricsPlayerEventPair>(e?: T[0], handler?: T[1]) {
        if (!e) {
            this._subscribtions = {
                linechange: [],
                lyricschange: []
            }
            return
        }
        const index = this._subscribtions[e].findIndex((item) => item === handler)
        if (index > -1) {
            this._subscribtions.linechange.splice(index, 1)
        } else if (!handler) {
            this._subscribtions.linechange = []
        } else {
            console.error('LyricsPlayer.off(): handler not correct.')
        }
    }

    rewind(lyrics?: Lyrics) {
        this.currentTime = 0
        this._currentLine = undefined
        if (lyrics) {
            this.lyrics = lyrics
            this._subscribtions.lyricschange.forEach((cb) => cb())
        }
    }
}
