import { readFileSync } from "fs";

// https://adventofcode.com/2023/day/5

const file = `${__dirname}/input.txt`;

// dest  source  range
const example = `seeds: 79 14 55 13
seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

function parseNumbers(line: string) {
    return line
        .trim()
        .split(" ")
        .map((n) => parseInt(n.trim()))
        .filter((n) => !Number.isNaN(n));
}

const snakeCaseToCamelCase = (str: string) => str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));

type MetaMap = {
    seedToSoil: MapEntry[],
    soilToFertilizer: MapEntry[],
    fertilizerToWater: MapEntry[],
    waterToLight: MapEntry[],
    lightToTemperature: MapEntry[],
    temperatureToHumidity: MapEntry[],
    humidityToLocation: MapEntry[]
}

type MapEntry = {
    source: number,
    destination: number,
    range: number,
}

function parseInput(input: string) {
    const maps: MetaMap = {
        seedToSoil: [],
        soilToFertilizer: [],
        fertilizerToWater: [],
        waterToLight: [],
        lightToTemperature: [],
        temperatureToHumidity: [],
        humidityToLocation: []
    }
    const [seedsLine, ...mapInput] = input.trim().split("\n")
    const seeds = parseNumbers(seedsLine)
    console.log(seedsLine)
    let currentMap = ''
    
    mapInput.filter(line => line.trim().length > 0).forEach(line => {
        const isMapLine = line.trim().endsWith('map:')
        if (isMapLine) {
            currentMap = line.trim().replace(' map:', '')
            return
        }
        const mapName = snakeCaseToCamelCase(currentMap) as keyof typeof maps
        const parsedNumbers = parseNumbers(line)
        const entry = {
            destination: parsedNumbers[0],
            source: parsedNumbers[1],
            range: parsedNumbers[2]
        }
        maps[mapName].push(entry)
    })
    
    return { seeds, maps }
}

const isInRange = (value: number, entry: MapEntry) => value >= entry.source && value <= entry.source + entry.range

function sourceToDestination(source: number, mapEnties: MapEntry[]) {
    const entry = mapEnties.find(entry => isInRange(source, entry))
    if (!entry) {
       return source
    }

    const offSet = entry.destination - entry.source
    return source + offSet
}

function seedToLocation(seed: number, maps: MetaMap) {
    const soil = sourceToDestination(seed, maps.seedToSoil)
    const fertilizer = sourceToDestination(soil, maps.soilToFertilizer)
    const water = sourceToDestination(fertilizer, maps.fertilizerToWater)
    const light = sourceToDestination(water, maps.waterToLight)
    const temperature = sourceToDestination(light, maps.lightToTemperature)
    const humidity = sourceToDestination(temperature, maps.temperatureToHumidity)
    const location = sourceToDestination(humidity, maps.humidityToLocation)
    return location

}

function task1() {
    const input =readFileSync(file, "utf-8");
    const { seeds, maps } = parseInput(input)

    const locations = seeds.map(seed => seedToLocation(seed, maps))

    const lowestLoc = Math.min(...locations)
    console.log(locations)
    console.log({lowestLoc})

}

const rangeOverlaps = (range1: [number, number], range2: [number, number]) => {
    const [start1, end1] = range1
    const [start2, end2] = range2
    return start1 <= end2 && end1 >= start2
}

const checkRangeOverLap = (range1: [number, number], range2: [number, number]) => {
    const start1 = range1[0]
    const start2 = range2[0]
    const end1 = range1[0] + range1[1]
    const end2 = range2[0] + range2[1]
    return start1 <= end2 && end1 >= start2
}

function task2() {
    const input =  readFileSync(file, "utf-8");
    const { seeds, maps } = parseInput(input)
    let seedRanges: [number, number][] = []//[[79,14]]
    for(let i = 0;i<seeds.length;i+=2) {
        const range = [seeds[i], seeds[i+1]]
        const [start, end] = range
        if(!seedRanges.some(range => checkRangeOverLap([start, end], range))) {
            seedRanges.push([start, end])
        }
    }
    // console.log({seedRanges})
    let min = Infinity
    seedRanges.forEach(([start, end]) => {

        for(let i = start;i<start + end;i++) {
            const location = seedToLocation(i, maps)
            if (location < min) {
                min = location
            }
        }
    })
    
    console.log({min})
}
function main() {
    task1();
    // task2();
}

main();
