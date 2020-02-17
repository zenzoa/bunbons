class Food extends GameObject {
    constructor() {
        super(10, 10)

        this.name = 'food'
        this.pos = randomPoint()

        this.isRefilling = false
        this.refillLength = floor(random(600, 2100))
        this.refillTimer = 0

        this.driveReduction = floor(random(30, 100))
    }

    onPush() {
        this.refillTimer = 0
        this.isRefilling = true
    }

    update() {
        if (this.isRefilling) {
            this.refillTimer++
            if (this.refillTimer >= this.refillLength) {
                this.isRefilling = false
                // console.log(this.name, 'refilled')
            }
        }
    }

    draw() {
        push()

        // find upper-left corner of sprite
        let x = floor(this.pos.x - (this.width / 2) + this.offsetX)
        let y = floor(this.pos.y - this.height + this.offsetY - this.jumpY)
        translate(x, y)

        // draw debug lines
        if (DEBUG) {
            noFill()
            if (this.isRefilling) stroke('pink')
            else stroke('lightblue')
            rect(0, 0, this.width, this.height)
        }

        pop()
    }
}