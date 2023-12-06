import { readFileSync } from "fs";

// https://adventofcode.com/2023/day/6

const file = `${__dirname}/input.txt`;

const example = `Time:      7  15   30
Distance:  9  40  200`;

function parseNumbers(line: string) {
    return line
        .trim()
        .split(" ")
        .map((n) => parseInt(n.trim()))
        .filter((n) => !Number.isNaN(n));
}

function parseInput(input: string) {
    const lines = input.trim().split("\n");
    const numbers = lines.map((line) => parseNumbers(line));
    const races = numbers[0].map((time, i) => {
        const distance = numbers[1][i];
        return {
            time,
            distance,
            speed: distance / time,
        };
    });
    return races;
}

const calcDistance = (travelTime: number, holdTime: number) =>
    travelTime * holdTime;

function generateBetterTimes(raceTime: number, bestDistance: number) {
    const betterTimes: number[] = [];

    for (let i = 1; i <= raceTime; i++) {
        const holdTime = i;
        const travelTime = raceTime - holdTime;
        const distance = calcDistance(travelTime, holdTime);
        if (distance > bestDistance) {
            betterTimes.push(holdTime);
        }
    }
    return betterTimes;
}

function task1() {
    const input = readFileSync(file, "utf-8");
    const races = parseInput(input);

    const possibleBetterTimes = races.map((race) => {
        return generateBetterTimes(race.time, race.distance);
    });

    const result = possibleBetterTimes.reduce(
        (acc, betterTimes) => acc * betterTimes.length,
        1
    );
    console.log("Task 1 result: ", result);
    // console.log({betterTimes})
}

function task2() {
    const input = readFileSync(file, "utf-8");
    const lines = input.trim().split("\n");
    const numbers = lines.map((line) => parseNumbers(line));
    // gather all times and concat them
    // eg [ 7 15 30] => 71530
    const [time, distance] = numbers.map((input) =>
        input.reduce((acc, nr) => parseInt(`${acc}${nr}`), 0)
    );

    const betterTimes = generateBetterTimes(time, distance);

    const racesLen = betterTimes.length;

    console.log("Task 2 result:", racesLen);
}

function main() {
    task1();
    task2();
}

main();
