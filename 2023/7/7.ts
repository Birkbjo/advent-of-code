import { createWriteStream, readFileSync } from "fs";

const example = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const orderMap = {
    A: 13,
    K: 12,
    Q: 11,
    J: 10,
    T: 9,
    "9": 8,
    "8": 7,
    "7": 6,
    "6": 5,
    "5": 4,
    "4": 3,
    "3": 2,
    "2": 1,
};

const orderMapWithJoker = { ...orderMap, J: 0 };

const handOrder = [
    "FiveKind",
    "FourKind",
    "FullHouse",
    "Three of a kind",
    "TwoPair",
    "OnePair",
    "HighCard",
] as const;
type HandType = (typeof handOrder)[number];

//const order = 'A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, 2'.split(', ')

const parse = (input: string) => {
    const lines = input.split("\n");
    const result = lines.map((line) => {
        const [cards, bid] = line.split(" ");
        return { cards, bid: parseInt(bid) };
    });
    return result;
};

type ParsedHand = ReturnType<typeof parse>[number];
type HandWithType = ParsedHand & { handType: HandType };

function countCards(hand: string) {
    const cards = hand.split("");
    const counts = cards.reduce((acc, item) => {
        acc[item] = acc[item] ? acc[item] + 1 : 1;
        return acc;
    }, {} as Record<string, number>);
    return counts;
}

function getHandType(hand: string): HandType {
    const counts = countCards(hand);
    const countsArray = Object.values(counts);
    const maxCount = Math.max(...countsArray);

    if (maxCount === 5) {
        return "FiveKind";
    }
    if (maxCount === 4) {
        return "FourKind";
    }
    if (maxCount === 3) {
        if (countsArray.includes(2)) {
            return "FullHouse";
        }
        return "Three of a kind";
    }
    if (maxCount === 2) {
        // check if there's another pair
        const isTwoPairs = countsArray.some(
            (item, i) => item === 2 && countsArray.indexOf(2) !== i
        );
        return isTwoPairs ? "TwoPair" : "OnePair";
    }
    return "HighCard";
}

const createSortHands = (withJoker: boolean) => {
    const ordering = withJoker ? orderMapWithJoker : orderMap;
    // const handSorter = createSortHand(withJoker);
    return (a: HandWithType, b: HandWithType) => {
        const handTypeOrder =
            handOrder.indexOf(a.handType) - handOrder.indexOf(b.handType);

        // if same card, check highest card in order
        if (handTypeOrder === 0) {
            for (let i = 0; i < a.cards.length; i++) {
                const aCard = a.cards[i] as keyof typeof ordering;
                const bCard = b.cards[i] as keyof typeof ordering;
                const cardOrder = ordering[bCard] - ordering[aCard];
                if (cardOrder !== 0) {
                    return cardOrder;
                }
            }
        }
        return handTypeOrder;
    };
};

const getHandTypeWithJokerRule = (hand: string): HandType => {
    const counts = countCards(hand);

    const numberOfJokers = counts["J"] || 0;
    if (numberOfJokers === 0) {
        return getHandType(hand);
    }
    if (numberOfJokers === 5) {
        return "FiveKind";
    }

    // get the most frequent card that is not a joker
    const mostFreqCardNoJoker = Object.entries(counts).reduce(
        (acc, [card, count]) => {
            if (card === "J") {
                return acc;
            }
            if (count > acc[1]) {
                return [card, count];
            }
            return acc;
        },
        ["", 0]
    );

    // replace all jokers with the most frequent card
    // more frequent cards is always better, so simply replace jokers with this card
    const withJokers = hand.replace(/J/g, mostFreqCardNoJoker[0]);
    // get the handtype where jokers are replaced
    const res = getHandType(withJokers);
    return res;
};

function task1() {
    const input = readFileSync("./7/input.txt", "utf8");
    const hands = parse(input);

    const sorter = createSortHands(false);
    const orderedHands: HandWithType[] = hands
        .map((item) => {
            const handType = getHandType(item.cards);
            return { ...item, handType };
        })
        .sort(sorter);

    const maxRank = orderedHands.length;

    const result = orderedHands.reduce((acc, item, i) => {
        const rank = maxRank - i;
        const handWinnings = item.bid * rank;
        return acc + handWinnings;
    }, 0);

    console.log({ result });
}

function task2() {
    const input = readFileSync("./7/input.txt", "utf8");
    // const input = example
    const hands = parse(input);

    const sorter = createSortHands(true);
    const orderedHands: HandWithType[] = hands
        .map((item) => {
            const handType = getHandTypeWithJokerRule(item.cards);
            return { ...item, handType };
        })
        .sort(sorter);

    const maxRank = orderedHands.length;

    const result = orderedHands.reduce((acc, item, i) => {
        const rank = maxRank - i;
        const handWinnings = item.bid * rank;
        return acc + handWinnings;
    }, 0);

    console.log({ result });
}

function main() {
    task1();
    task2();
}

main();
