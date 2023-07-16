import type { Lyrics } from './lyrics'

type LyricsPlayerEvent = 'update'
type LyricsPlayerEventHandler<T extends LyricsPlayerEvent> = T extends 'update'
    ? (currentLine: string, index: number) => void
    : () => void

export class LyricsPlayer {
    public lyrics: Lyrics
    public currentTime: number
    private _subscribtions: Array<() => void>
    private _currentLine: string | undefined

    constructor(lyrics: Lyrics) {
        this.lyrics = lyrics
        this.currentTime = 0
        this._subscribtions = []
    }

    updateTime(time: number) {
        this.currentTime = time

        if (this._currentLine !== this.getCurrentLine()) {
            this._currentLine = this.getCurrentLine()
            this._subscribtions.forEach((cb) => cb())
        }
    }

    getCurrentLine() {
        return this.lyrics.atTime(this.currentTime)?.text || ''
    }

    getCurrentIndex() {
        return this.lyrics.getIndexByTime(this.currentTime)
    }

    on<T extends LyricsPlayerEvent = LyricsPlayerEvent>(
        e: T,
        handler: LyricsPlayerEventHandler<T>
    ) {
        if (e === 'update') {
            const callback = () => {
                const index = this.getCurrentIndex()
                const currentLine = this.lyrics.lines.at(index)
                handler(currentLine?.text || '', index)
            }
            this._subscribtions.push(callback)
        }
    }

    reset() {
        this.currentTime = 0
        this._subscribtions = []
        this._currentLine = undefined
    }
}
