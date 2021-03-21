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

        this.bunbonDNA = bunbonDNA || Bunbon.randomDNA()
        this.timeToHatch = Math.floor(FRAME_RATE * 60 * random(0.8, 1.2))
        this.color = this.bunbonDNA.color

        this.isShaking = false
        this.shakingTimer = 0

        this.driveReduction = 10

        this.spritesheet = new Spritesheet(spritesheetImg, 32, 32, this.color, this.color)
        this.spriteImgs = [
            this.spritesheet.getSprite(bunbonEggs[0]),
            this.spritesheet.getSprite(bunbonEggs[1]),
            this.spritesheet.getSprite(bunbonEggs[2])
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
            name: this.name,
            x: this.pos.x,
            y: this.pos.y,
            bunbonDNA: this.bunbonDNA,
            timeToHatch: this.timeToHatch,
            isShaking: this.isShaking,
            shakingTimer: this.shakingTimer,
            isInInventory: this.isInInventory
        }
        return data

    }

    static importEgg(data) {

        let pos = createVector(data.x, data.y)
        let newEgg = new Egg(pos, data.bunbonDNA)
        newEgg.name = data.name
        newEgg.pos = createVector(data.x, data.y)
        newEgg.timeToHatch = data.timeToHatch
        newEgg.isShaking = data.isShaking
        newEgg.shakingTimer = data.shakingTimer
        newEgg.isInInventory = data.isInInventory
        return newEgg

    }

}