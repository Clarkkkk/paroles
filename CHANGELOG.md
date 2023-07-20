# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

# 2.3.0    (2023-07-20)


## **Features**

* add option to handle lines with same time when initializing ([1640c3de](https://github.com/Clarkkkk/paroles/commit/1640c3ded685c2157f5c19a7c876ac6f8e069091))
    
    ### **Description**
    
    - `option.resolveConflict`: used to handle lines with exact same time. can be `merge`, `preserve`, `overwrite` or a custom function, defaults to `merge`. `merge` equals to `(line1, line2) => line1 + this.eol + line2`; `preserve` equals to `(line1, line2) => line1`; `overwrite` equals to `(line1, line2) => line2`
    
    For example:
    ```js
    const lyrics = `
    [00:25.32]There comes a time
    [00:25.32]When we hear a certain call
    [00:31.82]When the world must come together as one
    [00:31.82]There are people dying
    [00:41.57]Oh it's time to lend a hand
    [00:52.32]To life, the greatest gift of all
    [00:52.32]We can't go on pretending day by day
    `
    const lyrics = new Lyrics(lyrics, { resolveConflict: 'merge' })
    console.log(lyrics.lines)
    // [
    //     {
    //         "text": "There comes a time\nWhen we hear a certain call",
    //         "time": 25.32,
    //     },
    //     {
    //         "text": "When the world must come together as one\nThere are people dying",
    //         "time": 31.82,
    //     },
    //     {
    //         "text": "Oh it's time to lend a hand",
    //         "time": 41.57,
    //     },
    //     {
    //         "text": "To life, the greatest gift of all\nWe can't go on pretending day by day",
    //         "time": 52.32,
    //     },
    // ]
    ```
    

## **Documentation**

* update README ([0f207884](https://github.com/Clarkkkk/paroles/commit/0f2078842b82eaa16eadb73f6abad36798dc6102))



# 2.2.1    (2023-07-19)


## **Bug Fixes**

* `LyricsPlayer.off` not unsubscribing properly ([9b47e091](https://github.com/Clarkkkk/paroles/commit/9b47e091a5bb248d286ed4277bd93555dd395ced))
* provide correct index in `linechange` event when the last line comes ([3bef79c4](https://github.com/Clarkkkk/paroles/commit/3bef79c4eea196d8341f2066c8a0f800f6303c78))
* inconsistency in parsing and stringifying due to JavaScript decimal limitations ([ab0d8075](https://github.com/Clarkkkk/paroles/commit/ab0d8075fe90a500418a3ce2fcfccf77854df742))
* error in stringifying lyric lines with same text ([d0d1097c](https://github.com/Clarkkkk/paroles/commit/d0d1097cc18904f90cdce6470ae45aaaa289eb6a))

## **Chores**

* fix typo ([158d8530](https://github.com/Clarkkkk/paroles/commit/158d85302d991cbe493013e3f6cc7da578f332b1))



# 2.2.0    (2023-07-19)


## **Features**

* enhance `insert`, `remove` and `replace` in `Lyrics` ([dc821373](https://github.com/Clarkkkk/paroles/commit/dc82137335c7e3a22867efd08143274f2c65e350))
    
    ### **Description**
    
    - `insert` can receive an array to add several lines at one time now.
    - `remove` can receive a RegExp to match lyrics lines.
    - `remove` will remove all the lines matched the provided string/RegExp now.
    - You can use a RegExp as the first parameter of `replace`. If a RegExp object is provided, it uses `String.prototype.replace` under the hood. For example, `replace(/(abc)xxx/, '$1')` will replace the string with the first capturing group.
    

## **Documentation**

* update README ([92a24a12](https://github.com/Clarkkkk/paroles/commit/92a24a12ec00a9fae67b4a45d889be1125dc16e1))
* use aaron-preset to regenerate the CHANGELOG.md ([a2ed9fc5](https://github.com/Clarkkkk/paroles/commit/a2ed9fc504e459188a3a7612e2f6a7b1bdc64305))

## **Chores**

* modify package.json and fix errors ([21e74e66](https://github.com/Clarkkkk/paroles/commit/21e74e66a64b1d21d267d04cf8dac8157f185557))



# 2.1.0    (2023-07-18)


## **Features**

* add methods for making and modifying lyrics ([d62424b6](https://github.com/Clarkkkk/paroles/commit/d62424b6b4667cab8a50efb67ad19e7b05ce5d17))
    
    ### **Description**
    
    - `setInfo(info: LyricsInfo)`: set `LyricsInfo`. New properties will override the original ones
    - `merge(lyrics: string | Lyrics, option?)`: merge another lyrics. The original lyrics is prior by default if there are conflicts.
        - `option.override`: if `true`, lyrics to merge is prior to, and will overwrite the original one for `LyricsInfo` and lines with the same time.
        - `option.resolveInfo(originalInfo, affiliateInfo)`: manually control how to merge `LyricsInfo`, should return a `LyricsInfo` object. `option.override` for `LyricsInfo` is neglected when use this option.
        - `resolveConflict(originalLine, affiliateLine)`: manually control how to merge two lines with the same time. `option.override` for lyrics lines is neglected when use this option.
    - `insert(line: LyricsLine)`: insert a new line. If there is a line with the same time, the inserted line will replace the original one.
    - `remove(line: LyricsLine | string)`: remove a line. If no such line, it fails in silent.
    - `replace(oldLine: LyricsLine | string, newLine: LyricsLine | string)`: replace a line. If no such line, it fails in silent.
    

## **Documentation**

* update README ([285e2e54](https://github.com/Clarkkkk/paroles/commit/285e2e54ed3561c7d6e56f6c6b0e21420e702b5e))

## **Chores**

* rename the package to `paroles` ([dd8541c4](https://github.com/Clarkkkk/paroles/commit/dd8541c4b4251f2ebed12c0ac6683bfa746dde15))



# 2.0.0    (2023-07-17)


## **Features**

* add `rewind` and `off` for LyricsPlayer ([4f80b568](https://github.com/Clarkkkk/paroles/commit/4f80b568abd5f2033131d836d03e5529b7c41821))
    
    ### **Description**
    
    - LyricsPlayer: add `rewind(lyrics?)`. If optional lyrics is provided, `LyricsPlayer.lyrics` will be updated.
    - LyricsPlayer: add `off(event?, callback?)`, remove the event listener. If `callback` is omited, all listeners belong to that event will be removed. If `event` and `callback` are both omited, all of the event listeners will be removed.
    - LyricsPlayer: add `lyricschange` event: triggered when `rewind(lyrics)` called and lyrics changes.
    
    
    ### **BREAKING CHANGE**
    
    - LyricsPlayer: rename `update` event to `linechange`
    - LyricsPlayer: remove `reset` method. Use `off()` instead
    

## **Documentation**

* update README ([200c017e](https://github.com/Clarkkkk/paroles/commit/200c017ed4d5f50ee77381bdce150b64aea17cc3))



# 1.1.0    (2023-07-16)


## **Features**

* support `offset` in lrc ([eebd3d29](https://github.com/Clarkkkk/paroles/commit/eebd3d29a2bf7a1d2615f6f92541b1d51f32b2fe))
    
    ### **Description**
    
    - add `setOffset`. `setOffset` only set the "runtime" offset, and won't affect `lyrics.info.offset`
    - fix several bugs
    
* add index in `update` callback ([e62de064](https://github.com/Clarkkkk/paroles/commit/e62de064f88831d8f7a1eee1ced75d241d0ba089))

## **Documentation**

* update README etc ([9080d3c3](https://github.com/Clarkkkk/paroles/commit/9080d3c3b5485b19070718ae12d7fd511a9a3cc3))

## **Chores**

* add unit tests ([fa1b80d6](https://github.com/Clarkkkk/paroles/commit/fa1b80d6c6cb3e7c6df3559b64670170c200d974))



# 1.0.2    (2023-07-16)


## **Bug Fixes**

* rename the package ([07239083](https://github.com/Clarkkkk/paroles/commit/072390837bc6a6162943cac9b273f7f22d4fbb60))



# 1.0.1    (2023-07-16)


## **Bug Fixes**

* remove `private` in package.json ([e666b6bb](https://github.com/Clarkkkk/paroles/commit/e666b6bbcf75aa9b0944ef77f2b83c2cae584be3))



# 1.0.0    (2023-07-16)


## **Features**

* Lyrics and LyricsPlayer ([60b4f780](https://github.com/Clarkkkk/paroles/commit/60b4f780faaa4acf90c7c6af3836ef12d60af7b3))

## **Documentation**

* update package.json and README ([f1bc4b1e](https://github.com/Clarkkkk/paroles/commit/f1bc4b1e29e2c0eb4619b68112934e3b387172a7))

## **Chores**

* github actions ([8ef97eef](https://github.com/Clarkkkk/paroles/commit/8ef97eef1323aa2d873875452adf165272afc767))
* update eslint config ([abe9f54b](https://github.com/Clarkkkk/paroles/commit/abe9f54b47ebe5651fb4fc2801d8171b1fce7af8))
* remove template files ([791508f9](https://github.com/Clarkkkk/paroles/commit/791508f902488124494c9fa3bf1c9b12a3aaa31d))
