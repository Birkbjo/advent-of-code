import { readFileSync } from "fs";

// https://adventofcode.com/2023/day/3
const ex1 = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

type Coord = readonly [number, number];
type Coords = Coord[];

const isDigit = (symbol: string) =>
    symbol.charCodeAt(0) < 58 && symbol.charCodeAt(0) > 47;
const isSymbol = (symbol: string) => symbol !== "." && !isDigit(symbol);
const coordEquals = (a: Coord, b: Coord) => a[0] === b[0] && a[1] === b[1];

const coordIsRowNeighbour = (a: Coord, b: Coord) =>
    a[0] === b[0] && Math.abs(a[1] - b[1]) === 1;

function getCellNeighbours(grid: string[][], coord: Coord) {
    const neighbours: Coords = [];
    const [x, y] = coord;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const nx = x + i;
            const ny = y + j;
            if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
                neighbours.push([nx, ny]);
            }
        }
    }
    return neighbours;
}

function gatherSymbols(grid: string[][]) {
    const symbolCoords: Coords = [];

    grid.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (isSymbol(symbol)) {
                symbolCoords.push([i, j]);
            }
        });
    });

    console.log("symbolCoords", symbolCoords);
    return symbolCoords;
}

function gatherPotentialGears(grid: string[][]) {
    const gearCoords: Coords = [];

    grid.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol === "*") {
                gearCoords.push([i, j]);
            }
        });
    });

    return gearCoords;
}

function expandDigit(grid: string[][], coord: Coord) {
    const digit = grid[coord[0]][coord[1]];
    if (!isDigit(digit)) throw new Error(`Not a digit: ${coord}`);

    const recurseGatherDigits = (coord: Coord, left: boolean): string => {
        const nextCoord: Coord = left
            ? [coord[0], coord[1] - 1]
            : [coord[0], coord[1] + 1];
        if (nextCoord) {
            try {
                const nextVal = grid[nextCoord[0]][nextCoord[1]];
                if (isDigit(nextVal)) {
                    if (left) {
                        return recurseGatherDigits(nextCoord, left) + nextVal;
                    } else {
                        return nextVal + recurseGatherDigits(nextCoord, left); // + nextVal;
                    }
                } else {
                    return "";
                }
            } catch (e) {
                return "";
            }
        }
        return "";
    };
    const left = recurseGatherDigits(coord, true);
    const right = recurseGatherDigits(coord, false);

    console.log("left", left);
    console.log("right", right);

    return parseInt(left + digit + right);
}
function getSymbolDigits(grid: string[][], symbolCoords: Coord) {
    const neighbours = getCellNeighbours(grid, symbolCoords);

    const digits = neighbours
        .map(([x, y]) => ({ coord: [x, y] as const, value: grid[x][y] }))
        .filter(({ value, coord }, ind, arr) => isDigit(value)); // &&  arr.findIndex(({ coord: arrCoord }) => coordIsRowNeighbour(coord, arrCoord)

    const expandedDigits = digits.map(({ coord }) => ({
        value: expandDigit(grid, coord),
        coord,
    }));

    console.log("expandedDigits", expandedDigits);

    return expandedDigits.filter(({ value, coord }, ind, arr) => {
        const duplicate = arr.findIndex(
            ({ coord: arrCoord, value: valueCoord }) =>
                valueCoord === value && coordIsRowNeighbour(coord, arrCoord)
        ); // && coord[1] === arrCoord[1])
        if (duplicate > -1) {
            return duplicate > ind;
        }
        return true;
    });
}

function mainTask1() {
    const lines = ex1.trim().split("\n");
    const file = readFileSync(`${__dirname}/input.txt`, "utf-8");
    // const lines = file.trim().split("\n");
    const grid = lines.map((line) => line.split(""));

    const symbDigits = gatherSymbols(grid)
        .flatMap((coord) => getSymbolDigits(grid, coord))

    console.log(symbDigits);
    const cnt = symbDigits.reduce((acc, { value }) => acc + value, 0);
    console.log(cnt);
    //    console.log(getCellNeighbours(grid, 1, 3))
}

function mainTask2() {
    // const lines = ex1.trim().split("\n");
    const file = readFileSync(`${__dirname}/input.txt`, "utf-8");
    const lines = file.trim().split("\n");
    const grid = lines.map((line) => line.split(""));

    const potentialGears = gatherPotentialGears(grid);

    const gearDigits = potentialGears.map(gear => getSymbolDigits(grid, gear)).filter(digits => digits.length  === 2)
    const gearRatio = gearDigits.reduce((acc, digits) => acc + digits[0].value * digits[1].value, 0);

    console.log(gearRatio);
}
mainTask2();
