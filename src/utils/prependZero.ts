/** 数字不足指定长度时，在前面补0 */
export const prependZero = (num: number | string, length: number): string => {
    const [numStr, decimalStr] = num.toString().split('.')
    if (numStr.length < length) {
        const zeroStr = new Array(length - numStr.length).fill('0').join('')
        return zeroStr + numStr + (decimalStr ? '.' + decimalStr : '')
    } else {
        return numStr + (decimalStr ? '.' + decimalStr : '')
    }
}
