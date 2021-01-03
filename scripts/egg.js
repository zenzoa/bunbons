let bunbonEggs = [
    4,
    5,
    6
]

class Egg extends Toy {
    constructor(bunbonDNA, pos) {
        super(22, 24)

        this.name = 'egg'
        this.pos = pos || randomPoint()

        this.offsetX = -4
        this.offsetY = -7

        this.bunbonDNA = bunbonDNA || BunBon.randomDNA()
        this.timeToHatch = FRAME_RATE * 60 // 1 minute
        this.color = this.bunbonDNA.color

        this.isShaking = false
        this.shakingTimer = 0

        this.driveReduction = 10
    }

    onPush() {
        if (DEBUG) console.log('shake the egg')
        this.timeToHatch -= 10
        this.isShaking = true
    }

    update() {
        if (this.isBeingDragged) return

        // update hatching progress
        this.timeToHatch--
        if (this.timeToHatch <= 0) {
            let bunbon = new BunBon(this.pos, this.bunbonDNA)
            gameObjects.push(bunbon)
            if (DEBUG) console.log(bunbon.name, 'has hatched')
            this.removeMe = true
        }
    }

    draw() {
        // find upper-left corner of sprite
        let x = floor(this.pos.x - (this.width / 2) + this.offsetX)
        let y = floor(this.pos.y - this.height + this.offsetY)

        let frame = bunbonEggs[0]
        if (this.isShaking || this.timeToHatch < 32) {
            this.shakingTimer++
            if (this.shakingTimer >= 8) {
                this.isShaking = false
                this.shakingTimer = 0
            } else if (this.shakingTimer >= 4) {
                frame += 2
            } else {
                frame += 1
            }
        }

        if (!this.isInInventory && !this.isBeingDragged) image(shadowImgs.small, x, y + 1)
        image(colorSpritesheets[this.color].get(frame), x, y)

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
        let newEgg = new Egg(data.bunbonDNA, pos)
        newEgg.name = data.name
        newEgg.pos = createVector(data.x, data.y)
        newEgg.timeToHatch = data.timeToHatch
        newEgg.isShaking = data.isShaking
        newEgg.shakingTimer = data.shakingTimer
        newEgg.isInInventory = data.isInInventory
        return newEgg
    }
}