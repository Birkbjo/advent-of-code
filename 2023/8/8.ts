import { createWriteStream, readFileSync } from "fs";

const file = `./8/input.txt`;

const example1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const example2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

type MapElement = [keyof NavMap, keyof NavMap];
type NavMap = Record<string, MapElement>;

type ParsedInput = {
    directions: string;
    navMap: NavMap;
};
function parseInput(input: string): ParsedInput {
    const lines = input
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    const [directions, ...navMapLines] = lines;

    const navMap = navMapLines.reduce((acc, line) => {
        const [key, value] = line.split(" = ");
        const [left, right] = value.slice(1, -1).split(", ");
        acc[key] = [left, right];
        return acc;
    }, {} as NavMap);

    return {
        directions,
        navMap,
    };
}

function getNextLocation(
    currentLocation: string,
    direction: string,
    navMap: NavMap
) {
    const [left, right] = navMap[currentLocation];
    return direction === "L" ? left : right;
}

function task1() {
    const { directions, navMap } = parseInput(readFileSync(file, "utf8"));

    let directionCursor = 0;
    let currentLocation = "AAA";
    let steps = 0;
    while (currentLocation !== "ZZZ") {
        const direction = directions[directionCursor];
        currentLocation = getNextLocation(currentLocation, direction, navMap);
        directionCursor = (directionCursor + 1) % directions.length;
        steps++;
    }
    console.log({ steps });
}

const tasks2Example = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

function calculateStepsToZ(
    startingNode: keyof NavMap,
    { directions, navMap }: ParsedInput
): number {
    let directionCursor = 0;
    let steps = 0;
    let currentLocation = startingNode;
    while (!currentLocation.endsWith("Z")) {
        const direction = directions[directionCursor];
        currentLocation = getNextLocation(currentLocation, direction, navMap);
        directionCursor = (directionCursor + 1) % directions.length;
        steps++;
    }
    return steps;
}
function task2() {
    const parsedInput = parseInput(readFileSync(file, "utf8"));

    let currentLocations = Object.keys(parsedInput.navMap).filter((key) =>
        key.endsWith("A")
    );

    const stepsToZ = currentLocations.map((location) => {
        const steps = calculateStepsToZ(location, parsedInput);
        return [location, steps] as const;
    });

    const lcm = stepsToZ.reduce((acc, [, steps]) => {
        return calculateLeastCommonMultiple(acc, steps);
    }, 1);

    console.log('Task 2: Number of steps', lcm)
}

function main() {
    task2();
}

function calculateLeastCommonMultiple(a: number, b: number) {
    return (a * b) / calculateGreatestCommonDivisor(a, b);
}

function calculateGreatestCommonDivisor(a: number, b: number): number {
    if (b === 0) {
        return a;
    }
    return calculateGreatestCommonDivisor(b, a % b);
}

main();
