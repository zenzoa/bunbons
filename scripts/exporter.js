function nameToHex(name) {

    let chars = split(name, '')
    let charInts = unchar(chars)
    let charHexes = charInts.map(charInt => hex(charInt, 2))
    return join(charHexes, '')

}

function unhexName(hexName) {

    let charHexes = Array.from(hexName.matchAll(/../g), m => m[0])
    let charInts = unhex(charHexes)
    let chars = char(charInts)
    return join(chars, '')

}

function chromosomeToString(chromosome) {

    let chromosomeString = ''

    let color =  hex(Object.keys(bunbonColors).findIndex(x => x === chromosome.color), 2)
    let secondaryColor = hex(Object.keys(bunbonColors).findIndex(x => x === chromosome.secondaryColor), 2)
    chromosomeString += color + secondaryColor

    let ears = hex(Object.keys(bunbonEars).findIndex(x => x === chromosome.ears), 2)
    let tail = hex(Object.keys(bunbonTails).findIndex(x => x === chromosome.tail), 2)
    let back = hex(Object.keys(bunbonBacks).findIndex(x => x === chromosome.back), 2)
    let head = hex(Object.keys(bunbonHeads).findIndex(x => x === chromosome.head), 2)
    let pattern = hex(Object.keys(bunbonPatterns).findIndex(x => x === chromosome.pattern), 2)
    chromosomeString += ears + tail + back + head + pattern

    let earsUsePrimaryColor = chromosome.earsUsePrimaryColor ? '1' : '0'
    let tailUsesPrimaryColor = chromosome.tailUsesPrimaryColor ? '1' : '0'
    chromosomeString += earsUsePrimaryColor + tailUsesPrimaryColor

    let ageToAdulthood = hex(floor(chromosome.ageToAdulthood), 3)
    let maxSpeed = hex(floor(chromosome.maxSpeed * 10000), 3)
    let restChance = hex(floor(chromosome.restChance * 100000), 3)
    let jumpChance = hex(floor(chromosome.jumpChance * 10000), 3)
    chromosomeString += ageToAdulthood + maxSpeed + restChance + jumpChance

    let hungerRate = hex(floor(chromosome.hungerRate), 2)
    let boredomRate = hex(floor(chromosome.boredomRate), 2)
    let lonelinessRate = hex(floor(chromosome.lonelinessRate), 2)
    let sleepinessRate = hex(floor(chromosome.sleepinessRate), 2)
    chromosomeString += hungerRate + boredomRate + lonelinessRate + sleepinessRate

    return chromosomeString

}

function parseChromosomeString(chromosomeString) {

    let chromosome = {
        color: Object.keys(bunbonColors)[unhex(chromosomeString.substring(0, 2))],
        secondaryColor: Object.keys(bunbonColors)[unhex(chromosomeString.substring(2, 4))],
        ears: Object.keys(bunbonEars)[unhex(chromosomeString.substring(4, 6))],
        tail: Object.keys(bunbonTails)[unhex(chromosomeString.substring(6, 8))],
        back: Object.keys(bunbonBacks)[unhex(chromosomeString.substring(8, 10))],
        head: Object.keys(bunbonHeads)[unhex(chromosomeString.substring(10, 12))],
        pattern: Object.keys(bunbonPatterns)[unhex(chromosomeString.substring(12, 14))],
        earsUsePrimaryColor: chromosomeString[14] === '1',
        tailUsesPrimaryColor: chromosomeString[15] === '1',
        ageToAdulthood: unhex(chromosomeString.substring(16, 19)),
        maxSpeed: unhex(chromosomeString.substring(19, 22)) / 10000,
        restChance: unhex(chromosomeString.substring(22, 25)) / 100000,
        jumpChance: unhex(chromosomeString.substring(25, 28)) / 10000,
        hungerRate: unhex(chromosomeString.substring(28, 30)),
        boredomRate: unhex(chromosomeString.substring(30, 32)),
        lonelinessRate: unhex(chromosomeString.substring(32, 34)),
        sleepinessRate: unhex(chromosomeString.substring(34, 36))
    }

    return chromosome
    
}

function dnaToString(dna) {

    let dnaString = ''

    dna.parents.forEach(parent => {
        dnaString += nameToHex(parent) + 'O'
    })

    dnaString += 'X'

    dna.chromosomes.forEach(chromosome => {
        dnaString += chromosomeToString(chromosome) + 'X'
    })

    dnaString += chromosomeToString(dna)
    
    return dnaString

}

function parseDnaString(dnaString) {

    let dnaParts = dnaString.split('X')
    let parents = dnaParts[0].split('O').filter(x => x !== '').map(s => unhexName(s))
    let chromosome1 = parseChromosomeString(dnaParts[1])
    let chromosome2 = parseChromosomeString(dnaParts[2])
    let dna = parseChromosomeString(dnaParts[3])
    dna.parents = parents
    dna.chromosomes = [chromosome1, chromosome2]
    return dna

}

function bunbonToString(bunbon) {

    let name = nameToHex(bunbon.name) + 'O'

    let isBaby = bunbon.isBaby ? '0' : '1'
    let age = hex(floor(bunbon.age), 4)
    let reachedBestScore = bunbon.reachedBestScore ? '1' : '0'
    let score = hex(floor(bunbon.score), 3)
    let hasBlastedOffBefore = bunbon.hasBlastedOffBefore ? '1' : '0'
    let baseInfo = isBaby + age + reachedBestScore + score + hasBlastedOffBefore

    let hunger = hex(floor(bunbon.drives.hunger), 2)
    let boredom = hex(floor(bunbon.drives.boredom), 2)
    let loneliness = hex(floor(bunbon.drives.loneliness), 2)
    let sleepiness = hex(floor(bunbon.drives.sleepiness), 2)
    let drives = hunger + boredom + loneliness + sleepiness

    let dna = 'Z' + dnaToString(bunbon.dna)

    let foodOpinions = 'Z'
    Object.keys(bunbon.foodOpinions).forEach(key => {
        let value = bunbon.foodOpinions[key]
        foodOpinions += hex(foodList.indexOf(key), 1) + hex(floor(value), 2)
    })

    let toyOpinions = 'Z'
    Object.keys(bunbon.toyOpinions).forEach(key => {
        let value = bunbon.toyOpinions[key]
        toyOpinions += hex(toyList.indexOf(key), 1) + hex(floor(value), 2)
    })

    let friendOpinions = 'Z'
    Object.keys(bunbon.friendOpinions).forEach(key => {
        let value = bunbon.friendOpinions[key]
        friendOpinions += nameToHex(key) + hex(floor(value), 2) + 'O'
    })

    let opinions = foodOpinions + toyOpinions + friendOpinions

    let bunbonString = `${name}${baseInfo}${drives}${dna}${opinions}`

    return bunbonString

}

function parseBunbonString(bunbonString) {

    try {

        let bunbonData = {
            type: 'bunbon',
            x: 0,
            y: 0,
            isInInventory: false
        }

        let bunbonParts = bunbonString.split('Z')

        let baseInfoParts = bunbonParts[0].split('O')
        bunbonData.name = unhexName(baseInfoParts[0])

        bunbonData.isBaby = baseInfoParts[1].substring(0, 1) === '0'
        bunbonData.age = unhex(baseInfoParts[1].substring(1, 5))
        bunbonData.reachedBestScore = baseInfoParts[1].substring(5, 6) === '1'
        bunbonData.score = unhex(baseInfoParts[1].substring(6, 9))
        bunbonData.hasBlastedOffBefore = baseInfoParts[1].substring(9, 10) === '1'

        bunbonData.drives = {
            hunger: unhex(baseInfoParts[1].substring(10, 12)),
            boredom: unhex(baseInfoParts[1].substring(12, 14)),
            loneliness: unhex(baseInfoParts[1].substring(14, 16)),
            sleepiness: unhex(baseInfoParts[1].substring(16, 18))
        }

        bunbonData.dna = parseDnaString(bunbonParts[1])

        bunbonData.foodOpinions = {}
        let foodOpinionChunks = Array.from(bunbonParts[2].matchAll(/.../g), m => m[0])
        foodOpinionChunks.forEach(opinion => {
            let key = foodList[unhex(opinion[0])]
            let value = unhex(opinion.substring(1))
            bunbonData.foodOpinions[key] = value
        })

        bunbonData.toyOpinions = {}
        let toyOpinionChunks = Array.from(bunbonParts[3].matchAll(/.../g), m => m[0])
        toyOpinionChunks.forEach(opinion => {
            let key = toyList[unhex(opinion[0])]
            let value = unhex(opinion.substring(1))
            bunbonData.toyOpinions[key] = value
        })

        bunbonData.friendOpinions = {}
        let friendOpinionChunks = bunbonParts[4].split('O').filter(x => x !== '')
        friendOpinionChunks.forEach(opinion => {
            let key = unhexName(opinion.substring(0, opinion.length - 2))
            let value = unhex(opinion.substring(opinion.length - 2))
            bunbonData.friendOpinions[key] = value
        })

        return bunbonData

    } catch(e) {
        console.log('ERROR: unable to parse bunbon data', e)
    }

}