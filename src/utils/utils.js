export const defineCommentsLengths = (searchString, commentsNumbers) => {
    let commentsLengths = []
    const spanEnd = '</span>'
    for (let number of commentsNumbers) {
        const spanStart = `<span style="background-color:hsl(40,${number}%,80%);">`
        let searchStringCopy = searchString.slice(0)
        while (true) {
            const spanStartFirstInd = searchStringCopy.indexOf(spanStart)
            if (spanStartFirstInd === -1) break;
            const spanStartLastInd = spanStartFirstInd + spanStart.length - 1
            const spanEndFirstInd = searchStringCopy.indexOf(spanEnd, spanStartLastInd + 1)
            const spanEndLastInd = spanEndFirstInd + spanEnd.length - 1
            commentsLengths.push(spanEndLastInd - spanStartFirstInd + 1)
            searchStringCopy = searchStringCopy.slice(spanEndLastInd + 1)
        }
    }
    return commentsLengths
}


export const removeSpacesFromColorSubstrings = text => {
    let regexp = new RegExp(`:hsl[(].{1,15}[)]`, 'g')
    let colorSubstrings = text.match(regexp)
    if (!colorSubstrings) {
        return text
    }
    for (let substring of colorSubstrings) {
        let startInd = text.indexOf(substring)
        let substringWithoutSpaces = text.slice(startInd, startInd + substring.length).split(' ').join('')
        text = text.slice(0, startInd) + substringWithoutSpaces + text.slice(startInd + substring.length)
    }
    return text
}


export const replaceSpacesAtStringStart = (string, replacer) => {
    let data = ''
    for (let i = 0; i < string.length; i += 1) {
        if (string[i] !== ' ') {
            data += string.slice(i)
            break
        } else {
            data += replacer
        }
    }
    return data
}


export const reverseString = string => {
    return string.split("").reverse().join("")
}
