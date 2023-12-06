// https://adventofcode.com/2023/day/2

import { createWriteStream, readFileSync } from "node:fs";

const file = `${__dirname}/input.txt`;

const task1Example = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

function createGames(file: string) {
    const lines = file.trim().split("\n");
    const games = lines.map((line) => {
        const [id, gameLine] = line.split(":");
        const rounds = gameLine.split(";").map((round) =>
            round
                .trim()
                .split(",")
                .map((marble) => {
                    const [count, color] = marble.trim().split(" ");
                    return { count: parseInt(count), color };
                })
        );
        return [id, rounds] as const;
    });
    return games;
}

function task1() {
    const possible = {
        red: 12,
        green: 13,
        blue: 14,
    };
    // const gameFile = readFileSync(file, "utf-8");
    const gameFile = task1Example; //.trim().split("\n");
    const games = createGames(gameFile);

    createWriteStream(`${__dirname}/games.json`).write(
        JSON.stringify(games, null, 2)
    );
    const possibleGames = games.filter(([id, rounds]) => {
        // impossible if any round has more marbes than possible
        const impossibleRound = rounds.some((round) =>
            round.some(
                ({ count, color }) =>
                    count > possible[color as keyof typeof possible]
            )
        );
        return !impossibleRound;
    });
    const possibleGamesIds = possibleGames.map(([id, _]) =>
        parseInt(id.split(" ")[1])
    );

    const idSum = possibleGamesIds.reduce((acc, id) => acc + id);

    console.log("Task 1 sum: ", idSum);
}

function task2() {
    // const gameFile = task1Example
    const gameFile = readFileSync(file, "utf-8");
    const games = createGames(gameFile);

    const minimumGames = games.map(([id, rounds]) => {
        const minimumMarbles = { blue: 0, red: 0, green: 0 };

        rounds.forEach((round) =>
            round.forEach(({ count, color }) => {
                if (
                    count > minimumMarbles[color as keyof typeof minimumMarbles]
                ) {
                    minimumMarbles[color as keyof typeof minimumMarbles] =
                        count;
                }
            })
        );
        const power = Object.values(minimumMarbles).reduce(
            (acc, marble) => acc * marble
        );

        return [power, minimumMarbles] as const;
    });

    const powerSum = minimumGames.reduce((acc, [power, _]) => acc + power, 0);
    console.log('Task 2 sum: ', powerSum);
}

function main() {
    task1();
    task2();
}

main();
