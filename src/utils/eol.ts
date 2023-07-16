export const LF = '\n'
export const CRLF = '\r\n'
export type EndOfLine = '\n' | '\r\n'

export function detectEol(text: string) {
    const lfSize = Array.from(text.matchAll(/\n/g)).length
    if (lfSize === 0) {
        return LF
    } else {
        const crlfSize = Array.from(text.matchAll(/\r\n/g)).length
        return crlfSize === lfSize ? CRLF : LF
    }
}
