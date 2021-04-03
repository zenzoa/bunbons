let bunbonEggs = [
    4,
    5,
    6
]

class Egg extends Toy {

    constructor(pos, bunbonDNA) {

        super(22, 24)

        this.name = 'egg'
        this.pos = createVector(pos.x, pos.y)

        this.offsetX = -4
        this.offsetY = -8

        if (bunbonDNA === 'intro') {
            this.bunbonDNA = Bunbon.randomDNA({
                color: introBunbonColors.pop(),
                secondaryColor: introBunbonSecondaryColors.pop(),
                ears: introBunbonEars.pop(),
                tail: introBunbonTails.pop(),
                back: 'none',
                head: 'none',
                pattern: introBunbonPatterns.pop(),
            })

        } else if (bunbonDNA === 'deer') {
            this.bunbonDNA = Bunbon.randomDNA({
                color: 'dust',
                secondaryColor: 'dust',
                ears: 'none',
                tail: 'deer',
                back: 'none',
                head: 'antlers',
                pattern: 'speckles',
                earsUsePrimaryColor: true,
                tailUsesPrimaryColor: true
            })

        } else if (bunbonDNA === 'alicorn') {
            this.bunbonDNA = Bunbon.randomDNA({
                color: 'purple',
                secondaryColor: 'cream',
                ears: 'none',
                tail: 'pony',
                back: 'featherwings',
                head: 'unicorn',
                pattern: 'none',
                earsUsePrimaryColor: true,
                tailUsesPrimaryColor: false
            })

        } else if (bunbonDNA === 'alien') {
            this.bunbonDNA = Bunbon.randomDNA({
                color: 'pink',
                secondaryColor: 'aqua',
                ears: 'none',
                tail: 'none',
                back: 'frills',
                head: 'dongle',
                pattern: 'blobs',
                earsUsePrimaryColor: true,
                tailUsesPrimaryColor: true
            })

        } else if (bunbonDNA === 'bee') {
            this.bunbonDNA = Bunbon.randomDNA({
                color: 'yellow',
                secondaryColor: 'black',
                ears: 'none',
                tail: 'stinger',
                back: 'bugwings',
                head: 'antennae',
                pattern: 'band',
                earsUsePrimaryColor: true,
                tailUsesPrimaryColor: false
            })

        } else if (bunbonDNA === 'leafcat') {
            this.bunbonDNA = Bunbon.randomDNA({
                color: 'gold',
                secondaryColor: 'green',
                ears: 'pointy',
                tail: 'long',
                back: 'leaf',
                head: 'none',
                pattern: 'lateralstripe',
                earsUsePrimaryColor: true,
                tailUsesPrimaryColor: true
            })

        } else if (bunbonDNA === 'snail') {
            this.bunbonDNA = Bunbon.randomDNA({
                color: 'blush',
                secondaryColor: 'purple',
                ears: 'nubs',
                tail: 'slug',
                back: 'shell',
                head: 'none',
                pattern: 'none',
                earsUsePrimaryColor: true,
                tailUsesPrimaryColor: true,
                maxSpeed: 0.2,
                jumpChance: 0.01
            })

        } else if (bunbonDNA === 'sheep') {
            this.bunbonDNA = Bunbon.randomDNA({
                color: 'cream',
                secondaryColor: 'gold',
                ears: 'none',
                tail: 'nub',
                back: 'none',
                head: 'horns',
                pattern: 'fluff',
                earsUsePrimaryColor: true,
                tailUsesPrimaryColor: false
            })

        } else if (bunbonDNA === 'fish') {
            this.bunbonDNA = Bunbon.randomDNA({
                color: 'aqua',
                secondaryColor: 'blue',
                ears: 'fin',
                tail: 'fin',
                back: 'fin',
                head: 'gem',
                pattern: 'none',
                earsUsePrimaryColor: true,
                tailUsesPrimaryColor: false
            })

        } else if (bunbonDNA === 'lizard') {
            this.bunbonDNA = Bunbon.randomDNA({
                color: 'green',
                secondaryColor: 'pink',
                ears: 'none',
                tail: 'curly',
                back: 'spikes',
                head: 'spikes',
                pattern: 'stripes',
                earsUsePrimaryColor: true,
                tailUsesPrimaryColor: false
            })

        } else {
            this.bunbonDNA = bunbonDNA || Bunbon.randomDNA()
        }

        this.timeToHatch = Math.floor(FRAME_RATE * 60 * random(0.8, 1.2))
        this.color = this.bunbonDNA.color

        this.isShaking = false
        this.shakingTimer = 0

        this.driveReduction = 10

        this.spriteImgs = [
            colorSpritesheets[this.color].getSprite(bunbonEggs[0]),
            colorSpritesheets[this.color].getSprite(bunbonEggs[1]),
            colorSpritesheets[this.color].getSprite(bunbonEggs[2])
        ]

    }

    onPush() {

        if (DEBUG) console.log('shake the egg')
        this.timeToHatch -= 10
        this.isShaking = true

    }

    hatch() {

        let bunbon = new Bunbon(this.pos, this.bunbonDNA)
        currentScreen.objects.push(bunbon)
        if (LOG_STORIES) console.log(bunbon.name, 'has hatched')
        this.removeMe = true
        
        // save game
        saveState()

    }

    update() {

        if (this.isBeingDragged) return

        // update hatching progress
        this.timeToHatch--
        if (this.timeToHatch <= 0) {
            this.hatch()
        }

    }

    draw() {

        // find upper-left corner of sprite
        let x = floor(this.pos.x - (this.width / 2) + this.offsetX)
        let y = floor(this.pos.y - this.height + this.offsetY)

        let frame = 0
        if (this.isShaking || this.timeToHatch < 32) {
            this.shakingTimer++
            if (this.shakingTimer >= 8) {
                this.isShaking = false
                this.shakingTimer = 0
            } else if (this.shakingTimer >= 4) {
                frame = 2
            } else {
                frame = 1
            }
        }
        
        if (!this.isInInventory && !this.isBeingDragged) image(shadowImgs.small, x, y + 1)
        image(this.spriteImgs[frame], x, y)

        // draw debug lines
        if (DEBUG) {
            noFill()
            stroke('lightblue')
            rect(x - this.offsetX, y - this.offsetY, this.width, this.height)
        }

    }

    export() {

        let data = {
            type: 'egg',
            x: this.pos.x,
            y: this.pos.y,
            bunbonDNA: this.bunbonDNA,
            timeToHatch: this.timeToHatch,
            isInInventory: this.isInInventory
        }
        return data

    }

    static importEgg(data) {

        let newEgg = new Egg({ x: data.x, y: data.y }, data.bunbonDNA)
        newEgg.timeToHatch = data.timeToHatch
        newEgg.isInInventory = data.isInInventory
        return newEgg

    }

}