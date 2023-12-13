import { readFileSync } from "fs";
import { parse } from "path";

const fileName = `${__dirname}/input.txt`;

const example = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

function parseInput(input: string) {
    const lines = input
        .split("\n")
        .map((l) => l.trim().split(" ").map(Number))
        .filter((n) => !Number.isNaN(n));
    return lines;
}

function getDifferences(numbers: number[]) {
    const differencez: number[][] = [];
    let currDiffs = numbers;
    while (currDiffs.some((n) => n !== 0)) {
        currDiffs = currDiffs
            .map((n, i) => {
                if (i === 0) {
                    return 0;
                }
                return n - currDiffs[i - 1];
            })
            .slice(1);
        differencez.push(currDiffs);
    }
    return differencez.reverse();
}

function extrapolate(numbers: number[]) {
    const differences = getDifferences(numbers);
    const extrapolatedForDiffs = differences.reduce((acc, diffs, i) => {
        const lastDiff = diffs[diffs.length - 1];
        if (i === 0) {
            return [lastDiff];
        }

        const prevLastDiff = acc[i - 1];
        return acc.concat(lastDiff + prevLastDiff);
        // return lastDiff + prevLastDiff;
    }, []);
    const lastExtrapolated =
        extrapolatedForDiffs[extrapolatedForDiffs.length - 1];
    return numbers[numbers.length - 1] + lastExtrapolated;
}

function task1() {
    const input = readFileSync(fileName, "utf8");
    const numbers = parseInput(input);
    const allExtrapolated = numbers.map((n) => extrapolate(n));
    const sum = allExtrapolated.reduce((acc, n) => acc + n, 0);
    console.log({ sum });
}

function extrapolateBackwards(numbers: number[]) {
    const differences = getDifferences(numbers);
    const extrapolatedForDiffs = differences.reduce((acc, diffs, i) => {
        const firstDiff = diffs[0];
        if (i === 0) {
            return [firstDiff];
        }

        const prevFirstDiff = acc[i - 1];
        return acc.concat(firstDiff - prevFirstDiff);
        // return lastDiff + prevLastDiff;
    }, []);
    const lastExtrapolated =
        extrapolatedForDiffs[extrapolatedForDiffs.length - 1];
    return numbers[0] - lastExtrapolated;
}

function task2() {
    const numbers = parseInput(readFileSync(fileName, "utf8"));

    const allExtrapolated = numbers.map((n) => extrapolateBackwards(n));
    const sum = allExtrapolated.reduce((acc, n) => acc + n, 0);
    console.log({ sum });
}

function main() {
    task1();
    task2();
}

main();
