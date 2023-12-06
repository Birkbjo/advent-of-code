import { readFileSync } from "fs";

// https://adventofcode.com/2023/day/4

const file = `${__dirname}/input.txt`;

const example = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

function parseNumbers(line: string) {
    return line
        .trim()
        .split(" ")
        .map((n) => parseInt(n.trim()))
        .filter((n) => !Number.isNaN(n));
}

type ScratchCard = {
    id: string;
    winningNumbers: number[];
    numbers: number[];
    winningNumbersForCard: number[];
};

type ScratchCardWon = ScratchCard & {
    wonCards: ScratchCardWon[];
};

function createStructure(file: string) {
    const cards = file
        .trim()
        .split("\n")
        .map((line) => {
            const [id, cardLine] = line.trim().split(":");
            const [winningLine, numbersLine] = cardLine.trim().split("|");
            const winningNumbers = parseNumbers(winningLine.trim());
            const numbers = parseNumbers(numbersLine.trim());
            const numbersSet = new Set(numbers);

            const winningNumbersForCard = winningNumbers.filter((n) =>
                numbersSet.has(n)
            );

            return { id, winningNumbers, numbers, winningNumbersForCard };
        });

    return cards;
}

function task1() {
    // const lines = example.trim().split("\n")
    const input = readFileSync(file, "utf-8");
    const cards = createStructure(input);

    const total = cards.reduce((acc, { id, winningNumbersForCard }) => {
        const pointsBase = winningNumbersForCard.length - 1;
        const cardPoints = pointsBase > -1 ? Math.pow(2, pointsBase) : 0;

        return acc + cardPoints;
    }, 0);

    console.log({ total });
}

type ScratchCardProcessed = ScratchCard & {
    processed: boolean;
};

const wonCards = new Map<string, ScratchCardProcessed[]>();
function processCards(cards: ScratchCardProcessed[]) {
    const cardsWithCopies: ScratchCardProcessed[] = [...cards];
    // console.log(" before ", cardsWithCopies.length);
    cards.forEach((card, index) => {
        if(card.processed) {
            return
        }
        const winningNumbers = card.winningNumbersForCard;
        let cardsWon: ScratchCardProcessed[] = [];
        if (wonCards.has(card.id)) {
            cardsWon = wonCards.get(card.id)!.map((card) => ({...card, processed: false}));
        } else {
            cardsWon = cards
                .slice(index + 1, index + winningNumbers.length + 1)
                .map((card) => ({ ...card, processed: false }));
            wonCards.set(card.id, cardsWon);
        }

        card.processed = true;
        cardsWithCopies.push(...cardsWon);
    });
    return cardsWithCopies.sort((a, b) => a.id.localeCompare(b.id));
}

const hasMoreCardsToProcess = (cards: ScratchCardProcessed[]) =>
    cards.some((card) => !card.processed);

function task2() {
    const input = readFileSync(file, "utf-8");
    const cards = createStructure(input).map((card) => ({
        ...card,
        processed: false,
    }));

    let newCards = cards;
    let i = 0
    while (hasMoreCardsToProcess(newCards)) {
        console.log("processing cards");
        newCards = processCards(newCards)//.sort((a, b) => a.id.localeCompare(b.id));
        // console.log("newCards after", newCards);
        console.log('len', newCards.length)
        i++


    }
    
    // console.log({newCards})

    // const numberOfCards = cards.length
}

function main() {
    task2();
    // task1();
}

main();
