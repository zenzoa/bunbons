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
    long: earsStartIndex + 0,
    short: earsStartIndex + 1,
    floppy: earsStartIndex + 2,
    round: earsStartIndex + 3,
    pointed: earsStartIndex + 4,
    lop: earsStartIndex + 5
}

let tailsStartIndex = 80
let bunbonTails = {
    none: 0,
    short: tailsStartIndex + 0,
    fin: tailsStartIndex + 1,
    fluffy: tailsStartIndex + 2,
    thin: tailsStartIndex + 3,
    curly: tailsStartIndex + 4,
    stubby: tailsStartIndex + 5,
}

let backsStartIndex = 100
let bunbonBacks = {
    none: 0,
    fin: backsStartIndex + 0,
    spikes: backsStartIndex + 1,
    spines: backsStartIndex + 2,
    wavy: backsStartIndex + 3,
    shell: backsStartIndex + 4,
    leaf: backsStartIndex + 5,
}

let headsStartIndex = 120
let bunbonHeads = {
    none: 0,
    horn: headsStartIndex + 0,
    antlers: headsStartIndex + 1,
    gem: headsStartIndex + 2,
    spikes: headsStartIndex + 3,
    horns: headsStartIndex + 4,
    antennae: headsStartIndex + 5,
    ram: headsStartIndex + 6,
}

let patternsStartIndex = 140
let bunbonPatterns = {
    none: 0,
    stripes: patternsStartIndex + 0,
    spots: patternsStartIndex + 1,
    band: patternsStartIndex + 2,
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

let bunbonIcons = {
    adult: 7,
    baby: 8
}

let bunbonBlastoffImages = {
    rocket1: 160,
    rocket2: 161,
    smallRocket1: 17,
    smallRocket2: 18
}

let bunbonSpeechBubble = 9
let bunbonDreamBubble = 15
let bunbonDreamBubbleFlipped = 16

let replacementColors = [
    [255, 209, 171],
    [255, 128, 170],
    [191, 63, 179],
    [104, 43, 130],
]

let bunbonColors = {
    'grey': [
        [255, 255, 255],
        [199, 220, 208],
        [155, 171, 178],
        [105, 79, 98]
    ],
    'black': [
        [155, 171, 178],
        [98, 85, 101],
        [69, 61, 76],
        [23, 17, 26]
    ],
    'dust': [
        [213, 197, 171],
        [171, 148, 122],
        [150, 108, 108],
        [62, 53, 70]
    ],
    'chocolate': [
        [252, 203, 163],
        [230, 144, 78],
        [205, 104, 61],
        [98, 35, 47]
    ],
    'gold': [
        [250, 247, 237],
        [250, 203, 62],
        [238, 142, 46],
        [159, 41, 78]
    ],
    'yellow': [
        [253, 247, 237],
        [255, 238, 104],
        [250, 203, 62],
        [205, 104, 61]
    ],
    'red': [
        [252, 203, 163],
        [245, 125, 74],
        [234, 79, 54],
        [110, 39, 39]
    ],
    'cream': [
        [253, 247, 237],
        [254, 243, 192],
        [253, 203, 176],
        [150, 108, 108]
    ],
    'blush': [
        [253, 247, 237],
        [253, 203, 176],
        [246, 129, 129],
        [131, 28, 93]
    ],
    'pink': [
        [253, 203, 176],
        [246, 129, 129],
        [240, 79, 120],
        [131, 28, 93]
    ],
    'purple': [
        [253, 247, 237],
        [240, 179, 221],
        [194, 120, 208],
        [71, 53, 121]
    ],
    'green': [
        [253, 247, 237],
        [145, 219, 105],
        [30, 188, 115],
        [22, 90, 76]
    ],
    'aqua': [
        [253, 247, 237],
        [114, 214, 206],
        [86, 152, 204],
        [71, 53, 121]
    ],
    'blue': [
        [253, 247, 237],
        [124, 184, 231],
        [114, 111, 213],
        [56, 39, 104]
    ]
}

let bunbonThoughts = {
    'food': 10,
    'toy': 11,
    'friend': 12,
    'sleep': 13,
    'sleep-flipped': 14
}

class BunBon extends GameObject {
    constructor(pos, bunbonDNA) {
        super(24, 22)

        if (!bunbonDNA) bunbonDNA = BunBon.randomDNA()
        this.dna = bunbonDNA
        this.parents = this.dna.parents

        this.name = NameGenerator.generate()
        this.pos = pos || randomPoint()

        this.offsetX = -4
        this.offsetY = -8
        this.animationTimer = 0
        this.animationFrame = 0
        this.faceTimer = 0
        this.speechBubbleTimer = 0

        this.color = this.dna.color
        this.secondaryColor = this.dna.secondaryColor
        this.pattern = this.dna.pattern
        this.ears = this.dna.ears
        this.tail = this.dna.tail
        this.back = this.dna.back
        this.head = this.dna.head
        this.face = random(Object.keys(bunbonFaces))

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

        this.rates = {
            hunger: this.dna.hungerRate,
            boredom: this.dna.boredomRate,
            loneliness: this.dna.lonelinessRate,
            sleepiness: this.dna.sleepinessRate
        }

        this.foodOpinions = {}
        this.toyOpinions = {}
        this.friendOpinions = {}
    }

    static randomDNA() {
        let randomChromosome = () => {
            return {
                color: random(Object.keys(bunbonColors)),
                secondaryColor: random(Object.keys(bunbonColors)),

                ears: random(Object.keys(bunbonEars)),
                tail: random(Object.keys(bunbonTails)),
                back: random(Object.keys(bunbonBacks)),
                head: random(Object.keys(bunbonHeads)),
                pattern: random(Object.keys(bunbonPatterns)),

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

        let chromosome = randomChromosome()

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
        if (parent1.isBaby || parent2.isBaby) {
            if (DEBUG) console.log('PROBLEM:', parent1.name, 'and', parent2.name, 'are not both fully grown')
            return false
        }
        let sharedParents = parent1.parents.filter(p => parent2.parents.includes(p))
        if (
            sharedParents.length >= 1 ||
            parent1.parents.includes(parent2.name) ||
            parent2.parents.includes(parent1.name) ||
            parent1.name === parent2.name
        ) {
            if (DEBUG) console.log('PROBLEM:', parent1.name, 'and', parent2.name, 'are too closely related')
            return false
        }
        return true
    }

    static breed(parent1, parent2) {
        if (DEBUG) console.log('breeding:', parent1.name, 'and', parent2.name)

        let dna1 = parent1.dna
        let dna2 = parent2.dna

        let chromosome1 = random(dna1.chromosomes)
        let chromosome2 = random(dna2.chromosomes)

        let combinedDNA = {
            parents: [parent1.name, parent2.name],
            chromosomes: [chromosome1, chromosome2]
        }

        Object.keys(chromosome1).forEach(gene => {
            let chromosome = combinedDNA.chromosomes[random([0, 1])]
            combinedDNA[gene] = chromosome[gene]
        })

        return combinedDNA
    }

    highestDrive() {
        let highestDrive
        Object.keys(this.drives).forEach(drive => {
            if (!highestDrive || this.drives[drive] > this.drives[highestDrive]) {
                highestDrive = drive
            }
        })
        return highestDrive
    }

    updateDrive(drive) {
        let rate = this.rates[drive] / 10000
        if (random() < rate) {
            this.drives[drive] = constrain(this.drives[drive] + 1, 0, 100)
        }
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
            gameObjects.forEach(obj => {
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
            if (specialObj instanceof BunBon) chanceOfFriend /= 5
            if (chanceOfFriend < this.drives.loneliness || ignoreChance) {
                chooseGoalObj(BunBon, this.friendOpinions, 'friend', 'is going to say hi to')
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
            while (!newGoal) {
                let goalX = floor(random(0, WORLD_WIDTH))
                let goalY = floor(random(this.height, WORLD_HEIGHT))
                if (isPointPassable(goalX, goalY)) {
                    newGoal = createVector(goalX, goalY)
                }
            }
            this.goalType = 'wander'
            this.farGoal = newGoal
        }

        drives.forEach(drive => {
            if (!this.goalType) {
                if (drive === 'hunger' || setGoal === 'food') {
                    foodGoal(setGoal === 'food')
                }
                else if (drive === 'boredom' || setGoal === 'toy') {
                    toyGoal(setGoal === 'toy')
                }
                else if (drive === 'loneliness' || setGoal === 'friend') {
                    friendGoal(setGoal === 'friend')
                }
                else if (drive === 'sleepiness' || setGoal === 'sleep') {
                    sleepGoal(setGoal === 'sleep')
                }
            }
        })
        
        if (!this.goalType) {
            let highestDrive = this.highestDrive()
            if (this.drives[highestDrive] > 50) {
                if (highestDrive === 'hunger') this.startThought('food')
                if (highestDrive === 'boredom') this.startThought('toy')
                if (highestDrive === 'loneliness') this.startThought('friend')
                if (highestDrive === 'sleepiness') this.startThought('sleep')
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
            while (!newGoal) {
                let oldAngle = Vector.sub(this.nearGoal, this.pos).heading()
                let newAngle = (oldAngle + random(-PI / 4, PI / 4))
                let dist = random(0, this.width)
                let testVec = Vector.fromAngle(newAngle, dist)
                let testGoal = Vector.add(this.pos, testVec)
                if (isPointPassable(testGoal.x, testGoal.y)) {
                    newGoal = testGoal
                }
            }
            this.nearGoal = newGoal
            return
        }

        let newGoalMag = floor(random(0, this.width))
        let newGoalVec = Vector.random2D().setMag(newGoalMag)
        let newGoal = Vector.add(this.pos, newGoalVec)
        if (this.isCloser(newGoal, this.nearGoal, this.farGoal)) {
            if (isPointPassable(newGoal.x, newGoal.y)) {
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
        if (this.goalObject && (this.goalObject.isRefilling || !isPointPassable(this.goalObject.pos.x, this.goalObject.pos.y))) {
            if (DEBUG) console.log(this.name, 'goal no longer available')
            this.pickFarGoal()
        }
    }

    onReachingGoal() {
        let goalName = this.goalObject ? this.goalObject.name : ''

        if (this.goalType === 'food') {
            if (!this.goalObject.isRefilling) {
                this.startEat()
                this.goalObject.onPush()
                if (!this.foodOpinions[goalName]) {
                    this.foodOpinions[goalName] = floor(random(0, 100))
                    if (DEBUG) console.log(this.name, 'tried new food,', goalName, '(opinion', this.foodOpinions[goalName] + '%)')
                }
                let opinion = this.foodOpinions[goalName]
                let rate = opinion >= 50 ? 2 : 1
                this.reduceDrive('hunger', this.goalObject.driveReduction * rate)
            }
        }

        else if (this.goalType === 'toy') {
            this.startPlay()
            this.goalObject.onPush()
            if (!this.toyOpinions[goalName]) {
                this.toyOpinions[goalName] = floor(random(0, 100))
                if (DEBUG) console.log(this.name, 'tried new toy,', goalName, '(opinion', this.toyOpinions[goalName] + '%)')
            }
            let opinion = this.toyOpinions[goalName]
            let rate = opinion >= 50 ? 2 : 1
            this.reduceDrive('boredom', this.goalObject.driveReduction * rate)
        }

        else if (this.goalType === 'friend') {
            if (!this.friendOpinions[goalName]) {
                this.friendOpinions[goalName] = floor(random(0, 100))
                if (DEBUG) console.log(this.name, 'met a new friend,', goalName, '(opinion', this.friendOpinions[goalName] + '%)')
            } else if (this.friendOpinions[goalName] > 50 && this.goalObject.friendOpinions[this.name] > 50) {
                BunBon.breed(this, this.goalObject)
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
        if (DEBUG) console.log(this.name, 'is thinking about', this.thoughtType)
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
        if (DEBUG) console.log(this.name, 'went to sleep')
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
            if (DEBUG) console.log(this.name, 'woke up')
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
        if (DEBUG) console.log(this.name, 'is chatting with', this.chatPartner.name)
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
                if (DEBUG && opinionBoost) {
                    console.log(
                        this.name + '\'s opinion of', chatPartner.name, 'went from',
                        this.friendOpinions[chatPartner.name] + '%', 'to', newOpinion + '%'
                    )
                }
                this.friendOpinions[chatPartner.name] = newOpinion
            }
            chatPartner.endChat()
        }
    }

    layEgg(bunbonDNA) {
        let egg = new Egg(bunbonDNA)
        gameObjects.push(egg)
    }

    startBlastOff() {
        if (DEBUG) console.log(this.name, 'is blasting off!')
        this.state = 'blasting-off'
        this.blastOffTimer = 0
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
        }
    }

    pet() {
        this.animationTimer += min(8, round(mouseVelocity) * 2)

        if (mouseVelocity < 0.1) {
            this.face = 'blank'
        } else {
            this.face = 'blink'
        }

        this.reduceDrive('loneliness', 0.1)
    }

    lookAt(obj) {
        if (DEBUG) console.log(this.name, 'looked at', obj.name)
        this.pickFarGoal(null, obj)
        this.pickNearGoal()
        if (obj instanceof BunBon) {
            if (BunBon.canBreed(this, obj)) {
                let combinedDNA = BunBon.breed(this, obj)
                this.layEgg(combinedDNA)
                if (DEBUG) console.log(this.name, 'and', obj.name, 'laid an egg')
            }
        }
    }

    update() {
        // update age
        this.ageTimer++
        if (this.ageTimer >= FRAME_RATE) {
            this.age++
            this.ageTimer = 0
            if (this.isBaby && this.age >= this.ageToAdulthood) {
                if (DEBUG) console.log(this.name, 'has grown up')
                this.isBaby = false
            }
        }

        // update drives
        Object.keys(this.drives).forEach(drive => this.updateDrive(drive))
        let highestDrive = this.highestDrive()
        let highestDriveValue = this.drives[highestDrive]
        let averageDriveValue = (this.drives.hunger + this.drives.boredom + this.drives.loneliness + this.drives.sleepiness) / 4

        // update score
        if (!this.isBaby && !this.canBlastOff && averageDriveValue < 33 && highestDriveValue < 50) {
            this.score += 1 / FRAME_RATE
            this.scoreIncreased = true
            if (this.score > this.maxScore) {
                this.score = this.maxScore
                this.canBlastOff = true
                if (DEBUG) console.log(this.name, 'is ready to blast off!')
            }
        } else {
            this.scoreIncreased = false
        }

        // update facial expression timer
        let updateFace = false
        this.faceTimer--
        if (this.faceTimer < 0) {
            this.faceTimer = 30
        }

        // handle state of being dragged or pet
        if (selectedObject === this && mouseIsPressed) {
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
        }
        else if (this.state === 'being-dragged') {
            updateFace = true
        }
        else if (this.state === 'eating') {
            this.eat()
        }
        else if (this.state === 'chatting') {
            this.chat()
        }
        else if (this.state === 'sleeping') {
            this.sleep()
        }
        else if (this.state === 'being-pet') {
            this.pet()
        }
        else if (this.state === 'playing') {
            this.play()
        }
        else if (this.state === 'resting') {
            this.rest()
            updateFace = true
        }
        else if (this.state === 'jumping') {
            this.jump()
            updateFace = true
        }
        else {
            this.moveToGoal()
            updateFace = true
        }

        // set face based on emotion if wasn't set by activity
        if (this.faceTimer === 0 && updateFace) {
            this.updateFace(highestDrive, highestDriveValue, averageDriveValue)
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
    }

    updateFace(highestDrive, highestDriveValue, averageDriveValue) {
        if (random() < 0.2) {
            this.face = 'blink'
            this.faceTimer = 10
        } else if (highestDriveValue < 10 || (random() < 0.1 && averageDriveValue < 30)) {
            this.face = 'grin'
        } else if (highestDriveValue < 30 || (random() < 0.1 && averageDriveValue < 60)) {
            this.face = 'smile'
        } else if (highestDriveValue > 80 || (random() < 0.1 && averageDriveValue > 60)) {
            if (highestDrive === 'hunger' || highestDrive === 'boredom') {
                this.face = 'angry'
            } else {
                this.face = 'frown'
            }
        } else if (highestDriveValue > 60 || (random() < 0.1 && averageDriveValue > 30)) {
            this.face = 'moue'
        } else {
            this.face = 'blank'
        }
    }

    draw() {
        push()

        // find upper-left corner of sprite
        let jumpOffset = (this.state === 'jumping' && !this.isInInventory) ? this.jumpY : 0
        let x = floor(this.pos.x - (this.width / 2) + this.offsetX)
        let y = floor(this.pos.y - this.height + this.offsetY - jumpOffset)

        // draw base
        if (this.isBaby) {

            let body = this.animationFrame === 0 ? bunbonBabyBodies[0] : bunbonBabyBodies[1]
            if (this.face === 'blink' || this.face.startsWith('sleep') || this.face.startsWith('eat')) body += 2
            image(colorSpritesheets[this.color].get(body, this.isFlipped), x, y)

        } else {

            let ears = bunbonEars[this.ears]
            let tail = bunbonTails[this.tail]
            let back = bunbonBacks[this.back]
            let head = bunbonHeads[this.head]
            let pattern = bunbonPatterns[this.pattern]
            let face = bunbonFaces[this.face]

            let rocketFrame = (this.blastOffTimer % 10) < 5 ? 'rocket2' : 'rocket1'
            let rocket = this.state === 'blasting-off' ? bunbonBlastoffImages[rocketFrame] : null

            let body = this.animationFrame === 0 ? bunbonBodies[0] : bunbonBodies[1]
            if (pattern && this.animationFrame !== 0) pattern += 10
            let decorationY = y + (this.animationFrame === 0 ? 0 : 1)

            // draw white outline
            image(colorSpritesheets[this.color].get(body + 10, this.isFlipped), x, y)
            if (tail) image(colorSpritesheets[this.color].get(tail + 10, this.isFlipped), x - 1, decorationY)
            if (back) image(colorSpritesheets[this.secondaryColor].get(back + 10, this.isFlipped), x, decorationY)
            if (rocket) image(colorSpritesheets[this.color].get(rocket + 10, this.isFlipped), x - 6, decorationY + 2)
            if (ears) image(colorSpritesheets[this.color].get(ears + 10, this.isFlipped), x + 1, decorationY)
            if (head) image(colorSpritesheets[this.secondaryColor].get(head + 10, this.isFlipped), x + 1, decorationY)

            // draw layers
            image(colorSpritesheets[this.color].get(body, this.isFlipped), x, y)
            if (pattern) image(colorSpritesheets[this.secondaryColor].get(pattern, this.isFlipped), x, y)
            if (tail) image(colorSpritesheets[this.color].get(tail, this.isFlipped), x - 1, decorationY)
            if (back) image(colorSpritesheets[this.secondaryColor].get(back, this.isFlipped), x, decorationY)
            if (rocket) image(colorSpritesheets[this.color].get(rocket, this.isFlipped), x - 6, decorationY + 2)
            if (ears) image(colorSpritesheets[this.color].get(ears, this.isFlipped), x + 1, decorationY)
            if (head) image(colorSpritesheets[this.secondaryColor].get(head, this.isFlipped), x + 1, decorationY)
            image(colorSpritesheets[this.color].get(face, this.isFlipped), x, decorationY)

        }

        if (this.state === 'blasting-off') {
            // do nothing
        } else if (this.state === 'sleeping') {
            // draw dream bubble
            let dreamBubbleImage = this.isFlipped ? bunbonDreamBubbleFlipped : bunbonDreamBubble
            let dreamBubbleY = Math.sin(this.sleepTimer * .1)
            image(baseSpritesheet.get(dreamBubbleImage, this.isFlipped), x + 26, y + dreamBubbleY)
        } else if (this.state === 'chatting') {
            // draw speech bubble
            if (this.speechBubbleTimer > 0) {
                let speechBubbleY = Math.sin(this.speechBubbleTimer * 0.33) - 2
                image(baseSpritesheet.get(bunbonSpeechBubble, this.isFlipped), x + 20, y + speechBubbleY)
            }
        } else if (this.isThinking) {
            // draw thought bubble
            let thoughtBubbleImage = bunbonThoughts[this.thoughtType]
            if (this.isFlipped && this.thoughtType === 'sleep') {
                thoughtBubbleImage = bunbonThoughts['sleep-flipped']
            }
            image(baseSpritesheet.get(thoughtBubbleImage, this.isFlipped), x + 20, y - 4)
        }

        if (this.isInInventory && !(selectedObject === this && mouseIsPressed)) return

        // draw selection info
        if (selectedBunbon === this && this.state !== 'blasting-off') {
            push()
            fill('#444')
            stroke('white')
            strokeWeight(1)
            translate(this.pos.x, this.pos.y - this.height - this.jumpY - 3)
            triangle(0, 2, -3, -4, 3, -4)
            strokeWeight(2)
            text(this.name, 0, -5)
            pop()
        }
        
        // draw debug lines
        if (DEBUG) {
            noFill()
            strokeWeight(0.5)
            stroke('lightblue')
            rect(x - this.offsetX, y - this.offsetY, this.width, this.height)
            stroke('lightblue')
            line(this.pos.x, this.pos.y, this.nearGoal.x, this.nearGoal.y)
            stroke('blue')
            line(this.pos.x, this.pos.y, this.farGoal.x, this.farGoal.y)
        }
    }

    drawScore() {
        let percentScore = this.score / this.maxScore
        let normalizedScore = log(percentScore * (Math.E - 1) + 1)
        let scoreSize = (normalizedScore * 29) + 3

        push()
        translate(SCREEN_WIDTH - 36, SCREEN_HEIGHT - 36)

        fill('#ccc')
        circle(16, 16, 32)

        if (this.canBlastOff) {
            fill('magenta')
        } else if (this.scoreIncreased) {
            fill('#444')
        } else {
            fill('#888')
        }
        circle(16, 32 - (scoreSize / 2), scoreSize)

        if (!this.canBlastOff) {
            noFill()
            stroke('#444')
            circle(16, 16, 32)
        }

        pop()
    }

    drawStatOrb() {
        let barLength = (drive) => {
            let normalized = log((drive / 100) * (Math.E - 1) + 1)
            let length = max(2, floor(normalized * 16))
            return length
        }

        let hungerBar = barLength(this.drives.hunger)
        let boredomBar = barLength(this.drives.boredom)
        let lonelinessBar = barLength(this.drives.loneliness)
        let sleepinessBar = barLength(this.drives.sleepiness)

        push()
        translate(18, 18)

        stroke('white')
        noFill()
        ellipse(0, 0, 32, 32)

        noStroke()
        fill('white')
        quad(
            -sleepinessBar, 0,
            0, -hungerBar,
            boredomBar, 0,
            0, lonelinessBar
        )
        
        pop()
    }

    drawIcon(x, y) {
        if (this.isBaby) {
            image(colorSpritesheets[this.color].get(bunbonIcons.baby), x - 16, y - 16)
        } else {
            image(colorSpritesheets[this.color].get(bunbonIcons.adult), x - 16, y - 16)
        }
    }

    drawBlastOff(frame) {
        let frameName = frame ? 'smallRocket2' : 'smallRocket1'
        image(colorSpritesheets[this.color].get(bunbonBlastoffImages[frameName]), -16, -16)
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
            friendOpinions: this.friendOpinions
        }
        return data
    }

    static importBunBon(data) {
        let pos = createVector(data.x, data.y)
        let newBunBon = new BunBon(pos, data.dna)
        newBunBon.name = data.name
        newBunBon.isBaby = data.isBaby
        newBunBon.age = data.age
        newBunBon.score = data.score
        newBunBon.canBlastOff = data.canBlastOff
        newBunBon.drives = data.drives
        newBunBon.foodOpinions = data.foodOpinions
        newBunBon.toyOpinions = data.toyOpinions
        newBunBon.friendOpinions = data.friendOpinions
        return newBunBon
    }
}