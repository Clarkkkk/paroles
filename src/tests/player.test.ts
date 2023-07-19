import { describe, expect, test, vi } from 'vitest'
import { Lyrics } from '../lyrics'
import { LyricsPlayer } from '../player'

const example = `
[ar:USA for africa]
[ti:We are the world]
[length:07:00.19]
[ve:v1.0.0]
[00:25.32]There comes a time
[00:28.57]When we hear a certain call
[00:31.82]When the world must come together as one
`

describe('Lyrics', () => {
    const lyrics = new Lyrics(example)

    test('update and event', () => {
        const player = new LyricsPlayer(lyrics)
        const callback = vi.fn((line, index) => {
            return { line, index }
        })
        player.on('linechange', callback)

        player.updateTime(0)
        expect(callback).toHaveBeenNthCalledWith(1, 'There comes a time', 0)

        player.updateTime(26)
        expect(callback).toHaveBeenNthCalledWith(1, 'There comes a time', 0)

        player.updateTime(29)
        expect(callback).toHaveBeenNthCalledWith(2, 'When we hear a certain call', 1)

        player.updateTime(32)
        expect(callback).toHaveBeenNthCalledWith(3, 'When the world must come together as one', 2)

        player.updateTime(26)
        expect(callback).toHaveBeenNthCalledWith(4, 'There comes a time', 0)

        player.off('linechange', callback)
        player.updateTime(30)
        expect(callback).toHaveBeenCalledTimes(4)
    })
})
