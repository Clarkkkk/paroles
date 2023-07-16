# lyrics-player

[![NPM version][npm-image]][npm-url] [![NPM Downloads][npm-download]][npm-url] [![License][license]][license-url] [![Minified Size][minified-size]][npm-url] [![Build Status][build-status]][github-actions]

A simple LRC format lyrics parser and runner

## Install

```sh
npm i lyrics-player
```

Or

```sh
pnpm add lyrics-player
```

```sh
yarn add lyrics-player
```

## Usage

### Parse lyrics

```js
const text = `
  [ti:Title]
  [ar:Lyrics artist]
  [00:25.32]There comes a time
  [00:28.57]When we hear a certain call
`
const lyrics = new Lyrics(text)

console.log(lyrics.info.title) // Title
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

- `clone()`: clone and return a new `Lyrics` object
- `toString()`: return the raw text of the `Lyrics` object
- `at(index: number)`: return the lyrics line at the index
- `atTime(time: number)`: return the lyrics line based on the time (milliseconds)

### `LyricsPlayer`

- `updateTime(time: number)`: update the current play time, should be synchronized with the song play time
- `getCurrentLine()`: get the current lyrics line based on the current play time
- `on(event, callback)`: subscribe the event and the callback will be called when event triggers. 
    - `update` event: triggered when current lyrics line changes. Current lyrics line and index is available in callback `callback(currentLine: text, index: number)`

## Acknowledgment

If you found it useful somehow, I would be grateful if you could leave a star in the project's GitHub repository.

Thank you.

[npm-url]: https://www.npmjs.com/package/lyrics-player
[npm-image]: https://badge.fury.io/js/lyrics-player.svg
[npm-download]: https://img.shields.io/npm/dw/lyrics-player
[license]: https://img.shields.io/github/license/Clarkkkk/lyrics-player
[license-url]: https://github.com/Clarkkkk/lyrics-player/blob/main/LICENSE.md
[minified-size]: https://img.shields.io/bundlephobia/min/lyrics-player
[build-status]: https://img.shields.io/github/actions/workflow/status/Clarkkkk/lyrics-player/.github%2Fworkflows%2Fpublish.yml
[github-actions]: https://github.com/Clarkkkk/lyrics-player/actions
