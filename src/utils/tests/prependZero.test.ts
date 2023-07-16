import { describe, expect, test } from 'vitest'
import { prependZero } from '../prependZero'

describe('prependZero', () => {
    test('prepend zero to integer', () => {
        expect(prependZero(2, 2)).toBe('02')
        expect(prependZero(12, 2)).toBe('12')
    })

    test('prepend zero to decimal', () => {
        expect(prependZero(2.1, 2)).toBe('02.1')
    })
})
