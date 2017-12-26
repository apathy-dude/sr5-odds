// Odds of getting values based off of n dice and declaring pre-edge
export function PreEdge(dice: number): number[] {
    if (typeof(dice) !== 'number')
        return []

    if (dice < 1)
        return [1]

    // [0] = chance of not getting a 5 or 6 on a die
    // [>0] = chance of getting a 6 idx - times * chance of getting a 5
    //   + chance of getting a 6 idx times + chance of not getting a 5 or 6
    const explodeOdds: number[] = new Array(8).fill(0)
        .map((a, idx) => Math.pow(1 / 6, idx))
        .map((o, idx) => idx === 0 ? 2 / 3 : o + o * 2 / 3)

    if (dice === 1)
        return explodeOdds

    const explodeBonusOdds: number[][] = new Array(dice)

    explodeBonusOdds[0] = [1]
    explodeBonusOdds[1] = explodeOdds

    // i = number of dice rolled
    for (let i = 2; i < dice; i++)
        explodeBonusOdds[i] = multiply(explodeBonusOdds[i - 1], explodeOdds)

    // Multiply the odds of getting a set number of hits by the chance of them exploding to give more hits
    const odds = Roll(dice)
    return explodeBonusOdds
        .map((ex, idx) => ex.map(e => e * odds[idx]))
        .reduce(addOdds, [])
}

export function PostEdgeTest(dice: number, rolls: number): number[] {
    if (typeof(dice) !== 'number')
        return []

    if (dice < 1)
        return [1]

    const rollList: number[] = new Array(dice).fill(0)
    for (let i = 0; i < rolls; i++) {
        const hits = new Array(dice).fill(0)
            .map(d => Math.floor(Math.random() * 6) + 1)
            .map(d => d > 4 ? d : Math.floor(Math.random() * 6) + 1)
            .filter(dr => dr > 4).length

        rollList[hits]++
    }

    return rollList.map(r => r / rolls)
}

// Odds of getting values based off of n dice and declaring post-edge
// The true odds of this don't map out perfectly since it assumes to
// always post reguardless of number of hits obtained first time.
// So even if rolling 10 dice the odds include post edgeing after
// rolling 9 even though no one would realistically do that.
// Also has issue with getting perfect because it spends edge on
// a glitch which normally isn't allowed
export function PostEdge(dice: number): number[] {
    if (typeof(dice) !== 'number')
        return []

    if (dice < 1)
        return [1]

    // Get dice roll odds
    // Multiply the chance of getting a number of successes with the odds of dice - number of successes
    // Create a new list of odds by adding them all up
    return Roll(dice)
        .map((d, idx) => multiply([d], Roll(dice - idx)))
        .reduce(addOdds, [])
}

// Odds of getting values based off of n dice rolled and not using edge
export function Roll(dice: number): number[] {
    if (typeof(dice) !== 'number')
        return []

    if (dice < 1)
        return [1]

    const rollCache: number[][] = [ [1], [2 / 3, 1 / 3] ]
    while (!rollCache[dice]) {
        const max = rollCache.length - 1
        if (max * 2 <= dice) { // Double it to grow as quickly as possible
            rollCache[max * 2] = multiply(rollCache[max], rollCache[max])
        }
        else { // Add max and next highest that will add together to be at or below target
            let idx = dice - max
            while (!rollCache[idx]) idx--

            rollCache[max + idx] = multiply(rollCache[max], rollCache[idx])
        }
    }

    return rollCache[dice]
}

// Array multiplaction of [1, n] * [m, 1]
function multiply(odds1: number[], odds2: number[]) {
    return odds1
        .map(o1 => odds2.map(o2 => o2 * o1))
        .reduce(addOdds, [])
}

// Merge array [n, m] by putitng it into an array of n + m size
// by adding the value of a cell to x + y value of the target array
// e.g. [ [1,  2,  4],
//        [8, 16, 32] ] => [ 1, 2 + 8, 4 + 16, 32 ] => [ 1, 10, 20, 32 ]
function addOdds(odds: number[], d: number[], idx: number) {
    d.forEach((o, i) => {
        odds[idx + i] = odds[idx + i] || 0
        odds[idx + i] += o
    })
    return odds
}
