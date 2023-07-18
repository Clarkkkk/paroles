# paroles

[![NPM version][npm-image]][npm-url] [![NPM Downloads][npm-download]][npm-url] [![License][license]][license-url] [![Minified Size][minified-size]][npm-url] [![Build Status][build-status]][github-actions]

A simple LRC format lyrics parser and runner

- support typescript
- support ES module and commonjs
- fully tested
- zero dependencies

## Install

```sh
npm i paroles
```

Or

```sh
pnpm add paroles
```

```sh
yarn add paroles
```

## Usage

### Parse lyrics

```js
const text = `
  [ti:We are the world]
  [ar:USA for africa]
  [00:25.32]There comes a time
  [00:28.57]When we hear a certain call
`
const lyrics = new Lyrics(text)

console.log(lyrics.info.title) // We are the world
console.log(lyrics.lines[0]) // There comes a time
console.log(lyrics.atTime(26)) // There comes a time
```

### Play lyrics

```js
const lyricsPlayer = new LyricsPlayer(lyrics)
lyricsPlayer.on('update', (line) => {
    console.log(line) // There comes a time
})

const audio = ducument.querySelector('audio')
audio.addEventListener('timeupdate', (e) => {
    lyricsPlayer.updateTime(e.target.currentTime)
})
```

## API

### `Lyrics`

- `info`: information contained in lrc text. The abbreviation is replaced with the full word for better readability. Note that `offset`, which is in milliseconds in LRC format, is converted to seconds in `LyricsInfo` for consistency.

    ```ts
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
        /** +/- Overall timestamp adjustment (in seconds), + shifts time up, - shifts down i.e. A positive value let lyrics appear sooner, a negative value delays the lyrics */
        offset?: number
        /** How long the song is (in seconds) */
        length?: string
        /** re, The player or editor that created the LRC file */
        editor?: string
        /** ve, version of program */
        version?: string
    }
    ```

- `lines`: an array consists of every single lyrics line
- `eol`: end of line symbol detected when initialized
- `clone()`: clone and return a new `Lyrics` object
- `toString()`: return the raw text of the `Lyrics` object
- `at(index: number)`: return the lyrics line at the index
- `atTime(time: number)`: return the lyrics line based on the time (in seconds)
- `setOffset(time: number)`: set time offset (in seconds). A positive value let lyrics appear sooner, a negative value delays the lyrics

### `LyricsPlayer`

- `currentTime`: current play time (in seconds).
- `lyrics`: the Lyrics object
- `updateTime(time: number)`: update the current play time (in seconds), should be synchronized with the song play time
- `getCurrentLine()`: get the current lyrics line based on the current play time
- `getCurrentIndex()`: get the current lyrics line index based on the current play time
- `rewind(lyrics?)`: reset `currentTime`. If lyrics is provided, `linechange` will be triggered with the new lyrics.
- `on(event, callback)`: subscribe the event and the callback will be called when event triggers. 
    - `linechange` event: triggered when current lyrics line changes. Current lyrics line and index is available in callback `callback(currentLine: text, index: number)`
    - `lyricschange` event: triggered when `rewind(lyrics)` called and lyrics changes.
- `off(event?, callback?)`: remove the event listener. If `callback` is omited, all listeners belong to that event will be removed. If `event` and `callback` are both omited, all of the event listeners will be removed.

## Migrate from v1

- the package is renamed to `paroles`. Uninstall `lyrics-player` and install `paroles`
- rename `update` event to `linechange` in `LyricsPlayer`
- `LyricsPlayer.reset()` is removed. Use `LyricsPlayer.rewind()` and `LyricsPlayer.off()` together instead

## LRC format

There is no definite and strict specification for LRC format. Therefore, [descriptions on WikiPedia](https://en.wikipedia.org/wiki/LRC_(file_format)) are used to confine the behaviour in `paroles`.

## Credit
This library is inspired by:
- [lrc.js](https://www.npmjs.com/package/lrc.js)
- [lrc-kit](https://www.npmjs.com/package/lrc-kit)

## Acknowledgment

If you found it useful somehow, I would be grateful if you could leave a star in the project's GitHub repository.

Thank you.

[npm-url]: https://www.npmjs.com/package/paroles
[npm-image]: https://badge.fury.io/js/paroles.svg
[npm-download]: https://img.shields.io/npm/dw/paroles
[license]: https://img.shields.io/github/license/Clarkkkk/paroles
[license-url]: https://github.com/Clarkkkk/paroles/blob/main/LICENSE.md
[minified-size]: https://img.shields.io/bundlephobia/min/paroles
[build-status]: https://img.shields.io/github/actions/workflow/status/Clarkkkk/paroles/.github%2Fworkflows%2Fpublish.yml
[github-actions]: https://github.com/Clarkkkk/paroles/actions
