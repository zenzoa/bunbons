let bunbonBodies = [
    40,
    41
]

let bunbonBabyBodies = [
    0,
    1,
    2,
    3
]

let earsStartIndex = 60
let bunbonEars = {
    none: 0,
    pointy: earsStartIndex + 0,
    nubs: earsStartIndex + 1,
    long: earsStartIndex + 2,
    short: earsStartIndex + 3,
    lop: earsStartIndex + 4,
    fin: earsStartIndex + 5,
}

let tailsStartIndex = 80
let bunbonTails = {
    none: 0,
    fin: tailsStartIndex + 0,
    curly: tailsStartIndex + 1,
    pony: tailsStartIndex + 2,
    deer: tailsStartIndex + 3,
    stinger: tailsStartIndex + 4,
    nub: tailsStartIndex + 5,
    long: tailsStartIndex + 6,
    slug: tailsStartIndex + 7,
    puff: tailsStartIndex + 8,
}

let backsStartIndex = 100
let bunbonBacks = {
    none: 0,
    featherwings: backsStartIndex + 0,
    leaf: backsStartIndex + 1,
    frills: backsStartIndex + 2,
    bugwings: backsStartIndex + 3,
    fin: backsStartIndex + 4,
    spikes: backsStartIndex + 5,
    shell: backsStartIndex + 6,
}

let headsStartIndex = 120
let bunbonHeads = {
    none: 0,
    antlers: headsStartIndex + 0,
    dongle: headsStartIndex + 1,
    spikes: headsStartIndex + 2,
    gem: headsStartIndex + 3,
    horns: headsStartIndex + 4,
    antennae: headsStartIndex + 5,
    unicorn: headsStartIndex + 6,
}

let patternsStartIndex = 140
let bunbonPatterns = {
    none: 0,
    fluff: patternsStartIndex + 0,
    lateralstripe: patternsStartIndex + 1,
    stripes: patternsStartIndex + 2,
    speckles: patternsStartIndex + 3,
    blobs: patternsStartIndex + 4,
    band: patternsStartIndex + 5,
    spots: patternsStartIndex + 6,
    freckles: patternsStartIndex + 7,
}

let facesStartIndex = 20
let bunbonFaces = {
    blank: facesStartIndex + 0,
    blink: facesStartIndex + 1,
    smile: facesStartIndex + 2,
    grin: facesStartIndex + 3,
    laugh: facesStartIndex + 4,
    gasp: facesStartIndex + 5,
    blush: facesStartIndex + 6,
    moue: facesStartIndex + 7,
    angry: facesStartIndex + 8,
    frown: facesStartIndex + 9,
    sleep1: facesStartIndex + 10,
    sleep2: facesStartIndex + 11,
    eat1: facesStartIndex + 12,
    eat2: facesStartIndex + 13
}

let bunbonBlastoffImages = {
    rocket1: 48,
    rocket2: 49
}

let replacementColors = [
    [252, 203, 163],
    [246, 129, 129],
    [240, 79, 120],
    [131, 28, 93]
]

let bunbonColors = {
    'grey': [
        [253, 247, 237],
        [199, 220, 208],
        [155, 171, 178],
        [98, 85, 101]
    ],
    'black': [
        [141, 140, 150],
        [98, 85, 101],
        [69, 61, 76],
        [23, 17, 26]
    ],
    'dust': [
        [253, 247, 237],
        [234, 200, 182],
        [207, 158, 158],
        [112, 83, 83]
    ],
    'chocolate': [
        [254, 243, 192],
        [207, 158, 158],
        [150, 108, 108],
        [98, 35, 47]
    ],
    'gold': [
        [254, 243, 192],
        [250, 203, 62],
        [237, 149, 47],
        [175, 56, 87]
    ],
    'yellow': [
        [253, 247, 237],
        [255, 238, 104],
        [250, 203, 62],
        [237, 149, 47]
    ],
    'red': [
        [250, 203, 62],
        [255, 127, 112],
        [234, 75, 75],
        [130, 28, 93]
    ],
    'cream': [
        [255, 255, 255],
        [255, 232, 207],
        [234, 200, 182],
        [207, 158, 158]
    ],
    'blush': [
        [254, 243, 192],
        [255, 183, 164],
        [246, 129, 129],
        [175, 56, 87]
    ],
    'pink': [
        [253, 203, 176],
        [246, 129, 129],
        [240, 79, 120],
        [131, 28, 93]
    ],
    'purple': [
        [254, 243, 192],
        [240, 179, 221],
        [194, 120, 208],
        [102, 78, 170]
    ],
    'green': [
        [228, 249, 152],
        [145, 219, 105],
        [30, 188, 115],
        [22, 90, 76]
    ],
    'aqua': [
        [228, 249, 152],
        [114, 214, 206],
        [86, 152, 204],
        [102, 78, 170]
    ],
    'blue': [
        [228, 249, 152],
        [124, 184, 231],
        [118, 130, 222],
        [71, 53, 121]
    ]
}

let introBunbonColors = ['grey', 'black', 'dust', 'chocolate', 'cream']
let introBunbonSecondaryColors = ['grey', 'black', 'dust', 'chocolate', 'cream']
let introBunbonEars = ['long', 'short', 'lop']
let introBunbonTails = ['none', 'puff', 'deer']
let introBunbonPatterns = ['none', 'spots', 'freckles']

class Bunbon extends GameObject {

    constructor(pos, bunbonDNA) {

        super(26, 22)

        bunbonCount++
        
        if (!bunbonDNA) bunbonDNA = Bunbon.randomDNA()
        this.dna = bunbonDNA
        this.parents = this.dna.parents

        this.name = NameGenerator.generate()
        this.pos = pos

        this.offsetX = -3
        this.offsetY = -10
        this.animationTimer = 0
        this.animationFrame = 0
        this.faceTimer = 0
        this.speechBubbleTimer = 0

        this.tempOffsetX = 0
        this.tempOffsetY = 0

        this.color = this.dna.color
        this.secondaryColor = this.dna.secondaryColor
        this.pattern = this.dna.pattern
        this.ears = this.dna.ears
        this.tail = this.dna.tail
        this.back = this.dna.back
        this.head = this.dna.head
        this.face = random(Object.keys(bunbonFaces))
        this.earsUsePrimaryColor = this.dna.earsUsePrimaryColor
        this.tailUsesPrimaryColor = this.dna.tailUsesPrimaryColor

        this.isBaby = true
        this.age = 0
        this.ageTimer = 0
        this.ageToAdulthood = this.dna.ageToAdulthood

        this.score = 0
        this.maxScore = 600

        this.canBlastOff = false

        this.speed = 0
        this.maxSpeed = this.dna.maxSpeed

        this.restChance = this.dna.restChance
        this.maxRestLength = 500

        this.maxSleepLength = 1000

        this.jumpChance = this.dna.jumpChance
        this.maxJumpHeight = 20

        this.maxChatLength = 500
        this.chatPartner = null
    
        this.nearGoal = this.pos
        this.farGoal = this.pos
        this.timesBlocked = 0
        this.wanderCounter = 0
        this.goalType = 'wander'

        this.state = null

        this.drives = {
            hunger: 0,
            boredom: 0,
            loneliness: 0,
            sleepiness: 0
        }
        this.highestDrive = 'hunger'
        this.highestDriveValue = 0
        this.averageDriveValue = 0

        this.rates = {
            hunger: this.dna.hungerRate,
            boredom: this.dna.boredomRate,
            loneliness: this.dna.lonelinessRate,
            sleepiness: this.dna.sleepinessRate
        }

        this.foodOpinions = {}
        this.toyOpinions = {}
        this.friendOpinions = {}

        let primaryColorSpritesheet = colorSpritesheets[this.color]
        let secondaryColorSpritesheet = colorSpritesheets[this.secondaryColor]

        // save sprites]
        this.babyspriteImgs = [
            primaryColorSpritesheet.getSprite(bunbonBabyBodies[0]),
            primaryColorSpritesheet.getSprite(bunbonBabyBodies[1]),
            primaryColorSpritesheet.getSprite(bunbonBabyBodies[0] + 2),
            primaryColorSpritesheet.getSprite(bunbonBabyBodies[1] + 2)
        ]

        let makeSpriteImg = (animationFrame, isOutline, isBlastingOff, blastOffFrame) => {
            let bodySprite = (animationFrame === 0 ? bunbonBodies[0] : bunbonBodies[1]) + (isOutline ? 10 : 0)
            let patternSprite = bunbonPatterns[this.pattern] + (animationFrame === 0 ? 0 : 20) + (isOutline ? 10 : 0)
            let rocketSprite = (blastOffFrame === 0 ? bunbonBlastoffImages['rocket1'] : bunbonBlastoffImages['rocket2']) + (isOutline ? 10 : 0)
            let earsSprite = bunbonEars[this.ears] + (isOutline ? 10 : 0)
            let tailSprite = bunbonTails[this.tail] + (isOutline ? 10 : 0)
            let backSprite = bunbonBacks[this.back] + (isOutline ? 10 : 0)
            let headSprite = bunbonHeads[this.head] + (isOutline ? 10 : 0)

            let patternSpritesheet = this.pattern === 'fluff' ? primaryColorSpritesheet : secondaryColorSpritesheet
            let earsSpritesheet = this.earsUsePrimaryColor ? primaryColorSpritesheet : secondaryColorSpritesheet
            let tailSpritesheet = (this.tailUsesPrimaryColor || this.tail === 'slug') ? primaryColorSpritesheet : secondaryColorSpritesheet

            let x = 8
            let y = 8
            let tailX = x - 1
            let rocketX = x - 4
            let decorationY = animationFrame === 0 ? y : y + 2

            let spriteImg = createImage(48, 48)
            primaryColorSpritesheet.copySprite(spriteImg, bodySprite, x, y)
            if (this.pattern !== 'none') patternSpritesheet.copySprite(spriteImg, patternSprite, x, y)
            if (this.tail !== 'none') tailSpritesheet.copySprite(spriteImg, tailSprite, tailX, decorationY)
            if (this.back !== 'none') secondaryColorSpritesheet.copySprite(spriteImg, backSprite, x, decorationY)
            if (isBlastingOff) primaryColorSpritesheet.copySprite(spriteImg, rocketSprite, rocketX, decorationY + 2)
            if (this.ears !== 'none') earsSpritesheet.copySprite(spriteImg, earsSprite, x, decorationY)
            if (this.head !== 'none') secondaryColorSpritesheet.copySprite(spriteImg, headSprite, x, decorationY)
            
            return spriteImg
        }

        this.outlineImgs = [
            makeSpriteImg(0, /* isOutline */ true),
            makeSpriteImg(1, /* isOutline */ true),
            makeSpriteImg(0, /* isOutline */ true, /* isBlastingOff */ true, /* blastOffFrame */ 0),
            makeSpriteImg(0, /* isOutline */ true, /* isBlastingOff */ true, /* blastOffFrame */ 1)
        ]

        this.spriteImgs = [
            makeSpriteImg(0, /* isOutline */ false),
            makeSpriteImg(1, /* isOutline */ false),
            makeSpriteImg(0, /* isOutline */ false, /* isBlastingOff */ true, /* blastOffFrame */ 0),
            makeSpriteImg(0, /* isOutline */ false, /* isBlastingOff */ true, /* blastOffFrame */ 1)
        ]

        this.faceImgs = {}
        Object.keys(bunbonFaces).forEach(faceName => {
            this.faceImgs[faceName] = primaryColorSpritesheet.getSprite(bunbonFaces[faceName])
        })

        this.adultIcon = primaryColorSpritesheet.getSprite(7)
        this.babyIcon = primaryColorSpritesheet.getSprite(8)

        this.rocketIcon1 = primaryColorSpritesheet.getSprite(17)
        this.rocketIcon2 = primaryColorSpritesheet.getSprite(18)
    }

    static randomChromosome() {
        return {
            color: random(Object.keys(bunbonColors)),
            secondaryColor: random(Object.keys(bunbonColors)),

            ears: random(Object.keys(bunbonEars)),
            tail: random(Object.keys(bunbonTails)),
            back: random(Object.keys(bunbonBacks)),
            head: random(Object.keys(bunbonHeads)),
            pattern: random(Object.keys(bunbonPatterns)),

            earsUsePrimaryColor: random([true, false]),
            tailUsesPrimaryColor: random([true, false]),

            ageToAdulthood: random(120, 480), // 2 - 8 minutes
            maxSpeed: random(0.2, 0.8),
            restChance: random(0.001, 0.02),
            jumpChance: random(0.01, 0.1),
            hungerRate: floor(random() * 100),
            boredomRate: floor(random() * 100),
            lonelinessRate: floor(random() * 100),
            sleepinessRate: floor(random() * 100)
        }
    }

    static randomDNA(partialChromosome) {

        let chromosome = Bunbon.randomChromosome()

        if (partialChromosome) {
            Object.keys(chromosome).forEach(gene => {
                if (partialChromosome[gene]) chromosome[gene] = partialChromosome[gene]
            })
        }

        let dna = {
            parents: [],
            chromosomes: [chromosome, chromosome]
        }

        Object.keys(dna.chromosomes[0]).forEach(gene => {
            let chromosome = dna.chromosomes[random([0, 1])]
            dna[gene] = chromosome[gene]
        })

        return dna

    }

    static canBreed(parent1, parent2) {

        // don't breed if parents have laid an egg recently
        if (parent1.eggCooldownTimer || parent2.eggCooldownTimer) {
            return false
        }

        // don't breed if either parent is too young
        if (parent1.isBaby || parent2.isBaby) {
            return false
        }

        // don't breed if parents are too closely related
        let sharedParents = parent1.parents.filter(p => parent2.parents.includes(p))
        if (
            sharedParents.length >= 1 ||
            parent1.parents.includes(parent2.name) ||
            parent2.parents.includes(parent1.name) ||
            parent1.name === parent2.name
        ) {
            return false
        }

        // don't breed if on credits screen
        if (currentScreen instanceof Credits) {
            return false
        }

        // don't breed if there are too many bunbons on the current planet
        let bunbonCount = currentScreen.objects.filter(o => o instanceof Bunbon).length
        if (bunbonCount >= 6) {
            return false
        }

        return true

    }

    static breed(parent1, parent2) {

        // make sure bunbons can breed
        if (!DEBUG && !Bunbon.canBreed(parent1, parent2)) return

        if (LOG_STORIES) console.log(parent1.name, 'and', parent2.name, 'laid an egg')

        // set up baby's dna
        let dna1 = parent1.dna
        let dna2 = parent2.dna
        let chromosome1 = random(dna1.chromosomes)
        let chromosome2 = random(dna2.chromosomes)
        let combinedDNA = {
            parents: [parent1.name, parent2.name],
            chromosomes: [chromosome1, chromosome2]
        }

        // pick random parent for each of baby's gene (or a random mutation)
        Object.keys(chromosome1).forEach(gene => {
            let chromosome
            if (random() < MUTATION_RATE) {
                chromosome = Bunbon.randomChromosome()
                if (DEBUG) console.log('a mutation occurred in gene', gene)
            } else {
                chromosome = combinedDNA.chromosomes[random([0, 1])]
            }
            combinedDNA[gene] = chromosome[gene]
        })

        // lay egg between the two parents
        let x = (parent1.pos.x + parent2.pos.x) / 2
        let y = (parent1.pos.y + parent2.pos.y) / 2
        Bunbon.layEgg(combinedDNA, { x, y })

        // set cooldown timer on parents
        parent1.eggCooldownTimer = FRAME_RATE * 60
        parent2.eggCooldownTimer = FRAME_RATE * 60

        // draw heart
        parent1.heartTimer = SCREEN_HEIGHT
        parent1.heartX = x
        parent1.heartY = Math.min(parent1.pos.y, parent2.pos.y) - parent1.height

    }

    static layEgg(bunbonDNA, pos) {

        pos = pos || currentScreen.randomPoint()
        let egg = new Egg(pos, bunbonDNA)
        currentScreen.objects.push(egg)

    }

    updateDrive(drive) {
        
        let rate = this.rates[drive] / 10000
        if (random() < rate) {
            this.drives[drive] = constrain(this.drives[drive] + 1, 0, 100)
        }
    
    }

    updateDrives() {

        Object.keys(this.drives).forEach(drive => this.updateDrive(drive))
        this.updateHighestDrive()
        this.highestDriveValue = this.drives[this.highestDrive]
        this.averageDriveValue = (this.drives.hunger + this.drives.boredom + this.drives.loneliness + this.drives.sleepiness) / 4
    
    }

    updateHighestDrive() {

        this.highestDrive = null
        Object.keys(this.drives).forEach(drive => {
            if (!this.highestDrive || this.drives[drive] > this.drives[this.highestDrive]) {
                this.highestDrive = drive
            }
        })

    }

    reduceDrive(drive, amt) {

        this.drives[drive] = constrain(this.drives[drive] - amt, 0, 100)

    }

    pickFarGoal(setGoal, specialObj) {

        if (DEBUG && setGoal) console.log('user set ' + this.name + '\'s goal to:', setGoal)

        this.goalType = null
        this.goalObject = null

        let drives = Object.keys(this.drives)
        drives.sort((a, b) => {
            if (this.drives[a] < this.drives[b]) return -1
            if (this.drives[a] > this.drives[b]) return 1
            return 0
        })

        let chooseGoalObj = (type, opinions, goalType, message) => {
            let bestGoal
            let bestScore = 0
            currentScreen.objects.forEach(obj => {
                if (obj !== this && obj instanceof type && !obj.isRefilling) {
                    let opinion = opinions[obj.name] || 50
                    let distance = Vector.dist(obj.pos, this.pos)
                    let normalizedDistance = 100 - floor(distance / WORLD_DIST * 100)
                    let special = specialObj === obj ? 50 : 0
                    let score = opinion + normalizedDistance + special
                    if (!bestGoal || score > bestScore) {
                        bestGoal = obj
                        bestScore = score
                    }
                }
            })
            if (bestGoal) {
                if (DEBUG) console.log(this.name, message, bestGoal.name)
                this.goalType = goalType
                this.goalObject = bestGoal
                this.farGoal = bestGoal.pos
            }
        }
        
        let foodGoal = (ignoreChance) => {
            let chanceOfFood = random() * 100
            if (specialObj instanceof Food) chanceOfFood /= 5
            if (chanceOfFood < this.drives.hunger || ignoreChance) {
                chooseGoalObj(Food, this.foodOpinions, 'food', 'is going to eat')
            }
        }
        
        let toyGoal = (ignoreChance) => {
            let chanceOfToy = random() * 100
            if (specialObj instanceof Toy) chanceOfToy /= 5
            if (chanceOfToy < this.drives.boredom || ignoreChance) {
                chooseGoalObj(Toy, this.toyOpinions, 'toy', 'is going to play with')
            }
        }

        let friendGoal = (ignoreChance) => {

            let chanceOfFriend = random() * 100
            if (specialObj instanceof Bunbon) chanceOfFriend /= 5
            if (chanceOfFriend < this.drives.loneliness || ignoreChance) {
                chooseGoalObj(Bunbon, this.friendOpinions, 'friend', 'is going to say hi to')
            }

        }

        let sleepGoal = (ignoreChance) => {

            if (this.state === 'chatting') return
            let chanceOfSleep = random() * 100
            if (chanceOfSleep < this.drives.sleepiness || ignoreChance) {
                this.startSleep()
                this.goalType = 'sleep'
            }

        }

        let randomGoal = () => {

            let newGoal
            let attempts = 0
            while (!newGoal || attempts < MAX_ATTEMPTS) {
                let goalX = floor(random(0, WORLD_WIDTH))
                let goalY = floor(random(this.height, WORLD_HEIGHT))
                if (currentScreen.isPositionClear(goalX, goalY)) {
                    newGoal = createVector(goalX, goalY)
                }
                attempts++
            }

            if (newGoal) {
                this.goalType = 'wander'
                this.farGoal = newGoal
            }

        }

        drives.forEach(drive => {
            if (!this.goalType) {
                if (drive === 'hunger' || setGoal === 'food') {
                    foodGoal(setGoal === 'food')
                } else if (drive === 'boredom' || setGoal === 'toy') {
                    toyGoal(setGoal === 'toy')
                } else if (drive === 'loneliness' || setGoal === 'friend') {
                    friendGoal(setGoal === 'friend')
                } else if (drive === 'sleepiness' || setGoal === 'sleep') {
                    sleepGoal(setGoal === 'sleep')
                }
            }
        })
        
        if (!this.goalType) {
            if (this.drives[this.highestDrive] > 50) {
                if (this.highestDrive === 'hunger') this.startThought('food')
                if (this.highestDrive === 'boredom') this.startThought('toy')
                if (this.highestDrive === 'loneliness') this.startThought('friend')
                if (this.highestDrive === 'sleepiness') this.startThought('sleep')
            }
            randomGoal()
        } else if (this.goalType !== 'sleep') {
            this.startThought(this.goalType)
        }

    }

    pickNearGoal() {

        if (this.goalType === 'wander') {
            if (this.state !== 'jumping' && random() < this.restChance) {
                this.startRest()
                return
            }
            if (this.state !== 'jumping' && random() < this.jumpChance) {
                this.startJump()
            }
        }

        this.speed = random(this.maxSpeed / 2, this.maxSpeed)

        if (this.wanderCounter) {

            let newGoal
            let attempts = 0
            while (!newGoal && attempts < MAX_ATTEMPTS) {
                let oldAngle = Vector.sub(this.nearGoal, this.pos).heading()
                let newAngle = (oldAngle + random(-PI / 4, PI / 4))
                let dist = random(0, this.width)
                let testVec = Vector.fromAngle(newAngle, dist)
                let testGoal = Vector.add(this.pos, testVec)
                if (currentScreen.isPositionClear(testGoal.x, testGoal.y)) {
                    newGoal = testGoal
                }
                attempts++
            }

            if (newGoal) this.nearGoal = newGoal

            return

        }

        let newGoalMag = floor(random(0, this.width))
        let newGoalVec = Vector.random2D().setMag(newGoalMag)
        let newGoal = Vector.add(this.pos, newGoalVec)
        if (this.isCloser(newGoal, this.nearGoal, this.farGoal)) {
            if (currentScreen.isPositionClear(newGoal.x, newGoal.y)) {
                this.nearGoal = newGoal
                if (this.timesBlocked > 0) this.timesBlocked--
            } else {
                this.timesBlocked++
                if (this.timesBlocked > 10) {
                    this.wanderCounter = 20
                }
            }
        }

    }

    isCloser(pointA, pointB, goal) {

        let distA = Vector.dist(pointA, goal)
        let distB = Vector.dist(pointB, goal)
        return distA < distB

    }

    isAtGoal(goal) {

        if (this.goalType === 'friend') {
            return Vector.dist(this.pos, goal) <= this.width
        } else {
            if (this.pos === goal) return true
            return Vector.dist(this.pos, goal) <= this.width / 4
        }

    }

    moveToGoal() {

        this.animationTimer += 6

        // update moving goal
        if (this.goalObject) {
            this.farGoal = this.goalObject.pos
        }

        let d = Vector.sub(this.nearGoal, this.pos)
        if (d.x < -2) this.isFlipped = true
        if (d.x > 2) this.isFlipped = false
        d.setMag(this.speed)
        this.pos = Vector.add(this.pos, d)

        // don't check goals while jumping
        if (this.state === 'jumping') return

        // check goals
        if (this.isAtGoal(this.nearGoal)) {
            this.pickNearGoal()
            if (this.wanderCounter) this.wanderCounter--
        }
        if (this.isAtGoal(this.farGoal)) {
            this.onReachingGoal()
        }
        if (this.goalObject && (this.goalObject.isRefilling || !currentScreen.isPositionClear(this.goalObject.pos.x, this.goalObject.pos.y))) {
            if (DEBUG) console.log(this.name, 'goal no longer available')
            this.pickFarGoal()
        }

    }

    onReachingGoal() {

        let goalName = this.goalObject ? this.goalObject.name : ''

        if (this.goalType === 'food') {

            if (!this.goalObject.isRefilling) {
                this.startEat()
                this.goalObject.onPush(this)
                if (!this.foodOpinions[goalName]) {
                    this.foodOpinions[goalName] = floor(random(0, 100))
                    if (LOG_STORIES) console.log(this.name, 'tried new food,', goalName, '(opinion:', this.foodOpinions[goalName] + '%)')
                } else {
                    if (LOG_STORIES) console.log(this.name, 'ate', goalName)
                }
                let opinion = this.foodOpinions[goalName]
                let rate = opinion >= 50 ? 2 : 1
                this.reduceDrive('hunger', this.goalObject.driveReduction * rate)
            }

        } else if (this.goalType === 'toy') {

            this.startPlay()
            this.goalObject.onPush(this)
            if (!this.toyOpinions[goalName]) {
                this.toyOpinions[goalName] = floor(random(0, 100))
                if (LOG_STORIES) console.log(this.name, 'tried new toy,', goalName, '(opinion:', this.toyOpinions[goalName] + '%)')
            } else {
                if (LOG_STORIES) console.log(this.name, 'played with', goalName)
            }
            let opinion = this.toyOpinions[goalName]
            let rate = opinion >= 50 ? 2 : 1
            this.reduceDrive('boredom', this.goalObject.driveReduction * rate)

        } else if (this.goalType === 'friend') {

            if (!this.friendOpinions[goalName]) {
                this.friendOpinions[goalName] = floor(random(0, 100))
                if (LOG_STORIES) console.log(this.name, 'met a new friend,', goalName, '(opinion:', this.friendOpinions[goalName] + '%)')
            }
            this.startChat(this.goalObject)
            
        }

        this.pickFarGoal()

    }

    startThought(thoughtType) {

        this.isThinking = true
        this.thoughtType = thoughtType
        this.thoughtTimer = 0
        this.thoughtLength = floor(random(60, 120))
        if (LOG_STORIES) console.log(this.name, 'is thinking about', this.thoughtType)
    
    }

    thought() {

        this.thoughtTimer++
        if (this.thoughtTimer > this.thoughtLength) {
            this.isThinking = false
        }

    }

    startEat() {

        this.state = 'eating'
        this.eatTimer = 0
        this.eatLength = floor(random(30, 60))

    }

    eat() {

        this.animationTimer += 6

        if (this.animationFrame === 1) {
            this.face = 'eat1'
        } else {
            this.face = 'eat2'
        }

        this.eatTimer++

        if (this.eatTimer > this.eatLength) {
            this.state = null
        }

    }

    startPlay() {

        this.state = 'playing'
        this.playTimer = 0
        this.playLength = floor(random(30, 60))
        this.playFace = random(['smile', 'grin', 'laugh'].filter(x => x !== this.face))
    
    }

    play() {

        this.face = this.playFace
        this.playTimer++
        if (this.playTimer > this.playLength) {
            this.state = null
        }

    }

    startRest() {

        this.state = 'resting'
        this.restTimer = 0
        this.originalPos = this.pos
        this.restLength = floor(random(this.maxRestLength / 2, this.maxRestLength))
    
    }

    rest() {

        this.animationTimer += 2
        this.restTimer++
        if (this.restTimer > this.restLength) {
            this.state = null
            this.pos = this.originalPos
        }

    }

    startSleep() {

        if (LOG_STORIES) console.log(this.name, 'went to sleep')
        this.state = 'sleeping'
        this.sleepTimer = 0
        this.originalPos = this.pos
        this.sleepLength = floor(random(this.maxSleepLength / 2, this.maxSleepLength))
    
    }

    sleep() {

        this.animationTimer += 1

        if (this.animationFrame === 1) {
            this.face = 'sleep1'
        } else {
            this.face = 'sleep2'
        }

        this.reduceDrive('sleepiness', 0.1)
        this.sleepTimer++

        if (this.sleepTimer > this.sleepLength) { //} || this.drives.sleepiness <= 0) {
            if (LOG_STORIES) console.log(this.name, 'woke up')
            this.state = null
            this.pos = this.originalPos
        }
        
    }

    startJump() {

        this.state = 'jumping'
        this.jumpTimer = 0
        this.jumpHeight = floor(random(this.maxJumpHeight / 2, this.maxJumpHeight))
        this.jumpY = 0

    }

    jump() {
        
        this.jumpTimer++
        this.jumpY = this.jumpHeight * sin(this.jumpTimer * 0.15)
        if (this.jumpY <= 0) {
            this.state = null
            this.jumpY = 0
        }

    }

    startChat(chatPartner) {

        if (this.state === 'chatting' || chatPartner.state === 'sleeping') return
        this.chatPartner = chatPartner
        if (LOG_STORIES) console.log(this.name, 'is chatting with', this.chatPartner.name)
        this.state = 'chatting'
        this.chatTimer = 0
        this.chatLength = floor(random(this.maxChatLength / 2, this.maxChatLength))
        this.isFlipped = this.chatPartner.pos.x < this.pos.x
        this.chatPartner.startChat(this)

    }

    chat() {

        if (this.faceTimer === 0 && this.chatPartner) {
            let opinion = this.friendOpinions[this.chatPartner.name]
            if (opinion > random() * 100) {
                this.face = random(['smile', 'grin', 'laugh'])
            } else if (opinion < random() * 50) {
                this.face = random(['blank', 'blink', 'moue'])
            } else {
                this.face = random(['gasp', 'blush'])
            }
            this.faceTimer = floor(random(10, 30))

            if (this.chatPartner.speechBubbleTimer < 10) {
                this.speechBubbleTimer = floor(random(20, 30))
            }
        }

        let opinion = this.chatPartner ? this.friendOpinions[this.chatPartner.name] : 0
        let rate = opinion >= 50 ? 2 : 1
        this.reduceDrive('loneliness', 0.1 * rate)
        this.chatTimer++
        if (this.chatTimer > this.chatLength || !this.chatPartner || this.chatPartner.isInInventory || this.chatPartner.state !== 'chatting') {
            this.endChat()
        }

    }

    endChat() {

        let chatPartner = this.chatPartner
        this.chatPartner = null
        this.state = null
        if (chatPartner && chatPartner.chatPartner === this) {
            if (this.friendOpinions[chatPartner.name]) {

                let opinionBoost = floor(random(0, 11))
                let newOpinion = min(this.friendOpinions[chatPartner.name] + opinionBoost, 100)
                if (LOG_STORIES && opinionBoost) {
                    console.log(
                        this.name + '\'s opinion of', chatPartner.name, 'went from',
                        this.friendOpinions[chatPartner.name] + '%', 'to', newOpinion + '%'
                    )
                }
                this.friendOpinions[chatPartner.name] = newOpinion

                if (this.friendOpinions[chatPartner.name] > 50 && chatPartner.friendOpinions[this.name] > 50) {
                    let willBreed = random() < 0.2
                    if (willBreed) Bunbon.breed(this, chatPartner)
                }

            }
            chatPartner.endChat()
        }

    }

    startBlastOff() {

        if (LOG_STORIES) console.log(this.name, 'is blasting off!')

        this.state = 'blasting-off'
        this.blastOffTimer = 0
        preventClicking = true

    }

    blastOff() {

        this.face = 'laugh'

        this.blastOffTimer++
        if (this.isFlipped) {
            this.pos.x -= this.blastOffTimer * 0.05
        } else {
            this.pos.x += this.blastOffTimer * 0.05
        }
        this.pos.y -= this.blastOffTimer * 0.1

        if ((this.pos.x < -32 || this.pos.x > SCREEN_WIDTH) || (this.pos.y < -32 || this.pos.y > SCREEN_HEIGHT)) {
            currentScreen.blastOff()
            blastedOffBunbons.push(this)
            this.removeMe = true
            bunbonCount--
        }

    }

    pet() {

        this.animationTimer += min(8, round(mouseVelocity) * 2)

        if (mouseVelocity < 0.1) this.face = 'blank'
        else this.face = 'blink'

        this.reduceDrive('loneliness', 0.1)

    }

    lookAt(obj) {

        if (DEBUG) console.log(this.name, 'looked at', obj.name)
        
        this.pickFarGoal(null, obj)
        this.pickNearGoal()

        if (DEBUG && obj instanceof Bunbon) {
            Bunbon.breed(this, obj)
        }

    }

    updateAge() {

        this.ageTimer++
        if (this.ageTimer >= FRAME_RATE) {
            this.age++
            this.ageTimer = 0
            if (this.isBaby && this.age >= this.ageToAdulthood) {
                if (LOG_STORIES) console.log(this.name, 'has grown up')
                this.isBaby = false
            }
        }

    }

    updateScore() {

        if (!this.isBaby && !this.canBlastOff && this.averageDriveValue < 33 && this.highestDriveValue < 50) {
            this.score += 1 / FRAME_RATE
            this.scoreIncreased = true
            if (this.score > this.maxScore) {
                this.score = this.maxScore
                this.canBlastOff = true
                if (LOG_STORIES) console.log(this.name, 'is ready to blast off!')
            }
        } else {
            this.scoreIncreased = false
        }

    }

    update(forCredits) {

        if (!forCredits) {
            this.updateAge()
            this.updateDrives()
            this.updateScore()
        }

        // update facial expression timer
        this.faceTimer--
        if (this.faceTimer < 0) {
            this.faceTimer = 30
        }

        let updateFace = false

        // handle state of being dragged or pet
        if (currentScreen.objects[currentScreen.selectedObjectIndex] === this && isClicking) {
            if (isDragging) {
                this.state = 'being-dragged'
            } else {
                this.state = 'being-pet'
            }
        } else {
            if (this.state === 'being-dragged' || this.state === 'being-pet') {
                this.state = null
            }
        }

        // check state
        if (this.state === 'blasting-off') {
            this.blastOff()
        } else if (this.state === 'being-dragged') {
            updateFace = true
        } else if (this.state === 'eating') {
            this.eat()
        } else if (this.state === 'chatting') {
            this.chat()
        } else if (this.state === 'sleeping') {
            this.sleep()
        } else if (this.state === 'being-pet') {
            this.pet()
        } else if (this.state === 'playing') {
            this.play()
        } else if (this.state === 'resting') {
            this.rest()
            updateFace = true
        } else if (this.state === 'jumping') {
            this.jump()
            updateFace = true
        } else {
            this.moveToGoal()
            updateFace = true
        }

        // set face based on emotion if wasn't set by activity
        if (this.faceTimer === 0 && updateFace) {
            this.updateFace()
        }

        // update animation
        if (this.animationTimer >= 60) {
            this.animationTimer = 0
            this.animationFrame = this.animationFrame === 0 ? 1 : 0
        }

        // update thought
        if (this.isThinking) {
            this.thought()
        }

        // update speech bubble
        if (this.speechBubbleTimer > 0) {
            this.speechBubbleTimer--
        }

        if (!this.isInInventory) {
            this.tempOffsetX = 0
            this.tempOffsetY = 0
        }

    }

    updateFace() {

        if (random() < 0.2) {
            this.face = 'blink'
            this.faceTimer = 10
        } else if (this.highestDriveValue < 10 || (random() < 0.1 && this.averageDriveValue < 30)) {
            this.face = 'grin'
        } else if (this.highestDriveValue < 30 || (random() < 0.1 && this.averageDriveValue < 60)) {
            this.face = 'smile'
        } else if (this.highestDriveValue > 80 || (random() < 0.1 && this.averageDriveValue > 60)) {
            if (this.highestDrive === 'hunger' || this.highestDrive === 'boredom') {
                this.face = 'angry'
            } else {
                this.face = 'frown'
            }
        } else if (this.highestDriveValue > 60 || (random() < 0.1 && this.averageDriveValue > 30)) {
            this.face = 'moue'
        } else {
            this.face = 'blank'
        }

    }

    draw(screen) {

        push()
        translate(floor(this.pos.x), floor(this.pos.y))
        if (this.isFlipped) scale(-1.0, 1.0)

        let jumpOffset = (this.state === 'jumping' && !this.isInInventory) ? this.jumpY : 0
        let x = floor(-(this.width / 2) + this.offsetX + (this.isFlipped ? -this.tempOffsetX : this.tempOffsetX))
        let y = floor(-this.height + this.offsetY - jumpOffset + this.tempOffsetY)

        // draw base
        if (this.isBaby) {

            let spriteIndex = this.animationFrame === 0 ? 0 : 1
            if (this.face === 'blink' || this.face.startsWith('sleep') || this.face.startsWith('eat')) spriteIndex += 2
            
            // draw shadow
            if (!this.isInInventory && !this.isBeingDragged) {
                let shadowImg = this.state === 'jumping' ? 'small-jump' : 'small'
                image(shadowImgs[shadowImg], x, floor(y + jumpOffset) - 1)
            }

            // draw body
            image(this.babyspriteImgs[spriteIndex], x, y)

        } else {

            let spriteIndex = this.animationFrame
            let blastOffFrame = (this.blastOffTimer % 10) < 5 ? 3 : 2
            if (this.state === 'blasting-off') spriteIndex = blastOffFrame
            
            // draw shadow
            if (!this.isInInventory && !this.isBeingDragged && this.state !== 'blasting-off') {
                let shadowImg = this.state === 'jumping' ? 'big-jump' : 'big'
                image(shadowImgs[shadowImg], x, floor(y + jumpOffset))
            }

            // draw body
            image(this.outlineImgs[spriteIndex], x - 8, y - 8)
            image(this.spriteImgs[spriteIndex], x - 8, y - 8)

            // draw face
            let faceY = y + (this.animationFrame === 0 ? 0 : 2)
            image(this.faceImgs[this.face], x, faceY)

        }

        let drawSelectionInfo = false

        if (!this.isInInventory && !this.isBeingDragged && this.state !== 'blasting-off') {

            if (this.state === 'sleeping') {
                // draw dream bubble
                let dreamBubbleX = x + 26
                let dreamBubbleY = y + Math.sin(this.sleepTimer * .1)
                image(bubbleImgs['dreambubble' + (this.isFlipped ? '-flipped' : '')], dreamBubbleX, dreamBubbleY)
            } else if (this.state === 'chatting') {
                // draw speech bubble
                if (this.speechBubbleTimer > 0) {
                    let speechBubbleX = x + 20
                    let speechBubbleY = y + Math.sin(this.speechBubbleTimer * 0.33) - 2
                    image(bubbleImgs['speechbubble'], speechBubbleX, speechBubbleY)
                }
            } else if (this.isThinking) {
                // draw thought bubble
                let thoughtBubbleX = x + 20
                let thoughtBubbleY = y - 4
                image(bubbleImgs['thoughtbubble-' + this.thoughtType], thoughtBubbleX, thoughtBubbleY)
            }

            if (this.heartTimer) {
                image(heartImg, this.heartX - 6, this.heartY - 5)
                this.heartTimer--
                this.heartY--
                this.heartX += random([-1, 0, 0, 0, 0, 0, 0, 0, 0, 1])
            }

            if (this.eggCooldownTimer) {
                this.eggCooldownTimer--
            }

            if (currentScreen.objects[currentScreen.selectedBunbonIndex] === this) {
                drawSelectionInfo = true
            }

        }

        pop()

        // draw selection info
        if (drawSelectionInfo) {
            fill('#444')
            stroke('white')
            strokeWeight(1)
            let selectionX = floor(this.pos.x)
            let selectionY = floor(this.pos.y - this.height - this.jumpY - 3)
            triangle(selectionX, selectionY + 2, selectionX - 3, selectionY - 4, selectionX + 3, selectionY - 4)
            strokeWeight(2)
            text(this.name, selectionX, selectionY - 5)
        }
        
        // draw debug lines
        if (DEBUG) {
            noFill()
            strokeWeight(0.5)
            stroke('lightblue')
            rect(this.pos.x + x - this.offsetX, this.pos.y + y - this.offsetY, this.width, this.height)
            stroke('lightblue')
            line(this.pos.x, this.pos.y, this.nearGoal.x, this.nearGoal.y)
            stroke('blue')
            line(this.pos.x, this.pos.y, this.farGoal.x, this.farGoal.y)
        }

    }

    drawStatOrb() {

        push()
        translate(SCREEN_WIDTH - 42, 0)

        let barLength = (drive) => {
            let normalized = log((drive / 100) * (Math.E - 1) + 1)
            let length = max(2, floor(normalized * 16))
            return length
        }

        let hungerBar = barLength(this.drives.hunger)
        let boredomBar = barLength(this.drives.boredom)
        let lonelinessBar = barLength(this.drives.loneliness)
        let sleepinessBar = barLength(this.drives.sleepiness)

        stroke('white')
        noFill()
        ellipse(18, 18, 32, 32)

        noStroke()
        fill('white')
        quad(
            18 - sleepinessBar, 18,
            18, 18 - hungerBar,
            18 + boredomBar, 18,
            18, 18 + lonelinessBar
        )

        pop()

    }

    drawIcon(x, y) {

        if (this.isBaby) {
            image(this.babyIcon, x - 16, y - 16)
        } else {
            image(this.adultIcon, x - 16, y - 16)
        }

    }

    drawBlastOff(frame) {

        if (frame) {
            image(this.rocketIcon2, -16, -16)
        } else {
            image(this.rocketIcon1, -16, -16)
        }
    
    }

    export() {

        let data = {
            type: 'bunbon',
            dna: this.dna,
            name: this.name,
            x: this.pos.x,
            y: this.pos.y,
            isBaby: this.isBaby,
            age: this.age,
            score: this.score,
            canBlastOff: this.canBlastOff,
            drives: this.drives,
            foodOpinions: this.foodOpinions,
            toyOpinions: this.toyOpinions,
            friendOpinions: this.friendOpinions,
            isInInventory: this.isInInventory
        }
        return data

    }

    static importBunbon(data) {   

        let pos = createVector(data.x, data.y)
        let newBunbon = new Bunbon(pos, data.dna)
        newBunbon.name = data.name
        newBunbon.isBaby = data.isBaby
        newBunbon.age = data.age
        newBunbon.score = data.score
        newBunbon.canBlastOff = data.canBlastOff
        newBunbon.drives = data.drives
        newBunbon.foodOpinions = data.foodOpinions
        newBunbon.toyOpinions = data.toyOpinions
        newBunbon.friendOpinions = data.friendOpinions
        newBunbon.isInInventory = data.isInInventory
        return newBunbon

    }
}