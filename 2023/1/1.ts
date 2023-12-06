import { readFileSync } from 'node:fs'

const file = `${__dirname}/input.txt`

const example = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
test43co`

const ex2 = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`

const digits = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five':5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9
}

function findDigits(line: string) {

    const wordDigits = new Map<number, number>()
    let cursor = 0
    Object.entries(digits).forEach(([wordDigit, digit]) => {
        const regex = new RegExp(wordDigit, 'g')
        const ind = line.indexOf(wordDigit)
        const m = line.matchAll(regex)
        
        for (const match of m) {
            const index = match.index || 0
            wordDigits.set(index, digit)
        }
    })

    const sortedWordDigits = Array.from(wordDigits.entries())//.sort((a, b) => a[0] - b[0])
    const digitMatches = Array.from(line.matchAll(/\d/g)).map(m => [m.index || 0, parseInt(m[0])] as const)

    const all = digitMatches.concat(sortedWordDigits).sort((a, b) => a[0] - b[0]).map(([_, digit]) => digit)

    // console.log(all)
    return all
    
}


function main() {
    const fileLines = readFileSync(file, "utf-8").trim().split("\n")
    const lines = ex2.trim().split("\n")
    let cnt = 0
    for (const line of fileLines) {
        const res = findDigits(line)
        const calibrationDigits = res.length === 1 ? [res[0], res[0]] : [res[0], res[res.length - 1]]
        const calibrationValue = `${calibrationDigits[0]}${calibrationDigits[1]}`
        console.log(calibrationDigits, calibrationValue)
        cnt += parseInt(calibrationValue)
    }
    console.log(cnt)
}

main()

