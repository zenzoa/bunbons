let bunbonEggs = [
    4,
    5,
    6
]

class Egg extends Toy {
    constructor(bunbonDNA, x, y) {
        super(22, 24)

        this.name = 'egg'
        this.pos = randomPoint()

        this.offsetX = -5
        this.offsetY = -7

        this.bunbonDNA = bunbonDNA || BunBon.randomDNA()
        this.timeToHatch = FRAME_RATE * 10
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
        if (selectedObject === this && mouseIsPressed) return

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
        push()

        // find upper-left corner of sprite
        let x = floor(this.pos.x - (this.width / 2) + this.offsetX)
        let y = floor(this.pos.y - this.height + this.offsetY)
        translate(x, y)

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

        image(colorSpritesheets[this.color].get(frame), 0, 0)

        // draw debug lines
        if (DEBUG) {
            noFill()
            stroke('lightblue')
            rect(-this.offsetX, -this.offsetY, this.width, this.height)
        }

        pop()
    }
}