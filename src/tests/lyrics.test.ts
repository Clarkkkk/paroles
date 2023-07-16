import { describe, expect, test } from 'vitest'
import { Lyrics } from '../lyrics'

const example = `
[ar:USA for africa]
[ti:We are the world]
[length:07:00.19]
[ve:v1.0.0]
[00:25.32]There comes a time
[00:28.57]When we hear a certain call
[00:31.82]When the world must come together as one
[00:37.57]There are people dying
[00:41.57]Oh it's time to lend a hand
[00:45.32]To life, the greatest gift of all
[00:52.32]We can't go on pretending day by day
[00:58.32]That someone somewhere will soon make a change
[01:04.57]We are all a part of god's great big family
[01:11.57]And the truth, you know, love is all we need
[01:17.82]We are the world
[01:20.57]We are the children
[01:23.82]We are the ones
[01:25.82]Who make a brighter day
[01:27.57]So let's start giving
[01:30.82]There's a choice we're making
[01:34.21]We're saving our own lives
[01:37.97]It's true, we make a better days
[01:40.47]Just you and me
`

describe('Lyrics', () => {
    const lyrics = new Lyrics(example)

    test('info', () => {
        expect(lyrics.info).toMatchInlineSnapshot(`
          {
            "artist": "USA for africa",
            "length": "07:00.19",
            "title": "We are the world",
            "version": "v1.0.0",
          }
        `)
    })

    test('at', () => {
        expect(lyrics.at(0)).toMatchInlineSnapshot(`
          {
            "text": "There comes a time",
            "time": 25.32,
          }
        `)
        expect(lyrics.at(3)).toMatchInlineSnapshot(`
          {
            "text": "There are people dying",
            "time": 37.57,
          }
        `)
        expect(lyrics.at(-1)).toMatchInlineSnapshot(`
          {
            "text": "Just you and me",
            "time": 100.47,
          }
        `)
        expect(lyrics.at(19)).toMatchInlineSnapshot('undefined')
    })

    test('atTime', () => {
        expect(lyrics.atTime(-1)).toMatchInlineSnapshot(`
          {
            "text": "There comes a time",
            "time": 25.32,
          }
        `)
        expect(lyrics.atTime(29)).toMatchInlineSnapshot(`
          {
            "text": "When we hear a certain call",
            "time": 28.57,
          }
        `)
        expect(lyrics.atTime(1 * 60 + 40)).toMatchInlineSnapshot(`
          {
            "text": "It's true, we make a better days",
            "time": 97.97,
          }
        `)
        expect(lyrics.atTime(2 * 60)).toMatchInlineSnapshot(`
          {
            "text": "Just you and me",
            "time": 100.47,
          }
        `)
    })

    test('offset', () => {
        const offsetLyrics = new Lyrics(`
[ar:USA for africa]
[ti:We are the world]
[length:07:00.19]
[offset:-1000]
[ve:v1.0.0]
[00:25.32]There comes a time
[00:28.57]When we hear a certain call
[00:31.82]When the world must come together as one
[00:37.57]There are people dying
        `)

        expect(offsetLyrics.atTime(29)).toMatchInlineSnapshot(`
          {
            "text": "There comes a time",
            "time": 25.32,
          }
        `)

        offsetLyrics.setOffset(0)
        expect(offsetLyrics.atTime(29)).toMatchInlineSnapshot(`
          {
            "text": "When we hear a certain call",
            "time": 28.57,
          }
        `)
    })

    test('toString', () => {
        expect(lyrics.toString()).toMatchInlineSnapshot(`
          "[ar:USA for africa]
          [ti:We are the world]
          [length:07:00.19]
          [ve:v1.0.0]
          [00:25.32]There comes a time
          [00:28.57]When we hear a certain call
          [00:31.82]When the world must come together as one
          [00:37.57]There are people dying
          [00:41.57]Oh it's time to lend a hand
          [00:45.32]To life, the greatest gift of all
          [00:52.32]We can't go on pretending day by day
          [00:58.32]That someone somewhere will soon make a change
          [01:04.57]We are all a part of god's great big family
          [01:11.57]And the truth, you know, love is all we need
          [01:17.82]We are the world
          [01:20.57]We are the children
          [01:23.82]We are the ones
          [01:25.82]Who make a brighter day
          [01:27.57]So let's start giving
          [01:30.82]There's a choice we're making
          [01:34.21]We're saving our own lives
          [01:37.97]It's true, we make a better days
          [01:40.47]Just you and me"
        `)
    })
})
