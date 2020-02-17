class Toy extends GameObject {
    constructor(width = 16, height = 16) {
        super(width, height)

        this.name = 'toy'
        this.pos = randomPoint()

        this.bounce = random(0, 30)
        this.speed = random(0.5, 4)

        this.driveReduction = floor(random(10, 50))
    }

    onPush() {
        let d = Vector.mult(Vector.random2D(), this.bounce)
        this.goal = Vector.add(this.pos, d)
    }

    update() {
        if (this.goal) {
            let d = Vector.sub(this.goal, this.pos)
            d.setMag(this.speed)
            let newPos = Vector.add(this.pos, d)

            if (Vector.dist(this.pos, this.goal) <= this.width / 4) {
                this.goal = null
            }
            else if (isPointPassable(newPos.x, newPos.y)) {
                this.pos = newPos
            }
            else {
                this.goal = null
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
            stroke('lightblue')
            rect(0, 0, this.width, this.height)
        }

        pop()
    }
}