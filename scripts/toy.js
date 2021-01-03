class Toy extends GameObject {
    constructor() {
        super(24, 24)

        this.name = 'toy'
        this.pos = randomPoint()

        this.offsetX = -4
        this.offsetY = -8

        this.bounce = random(0, 30)
        this.speed = random(0.5, 4)

        this.driveReduction = floor(random(10, 50))
    }

    onPush() {
        let d = Vector.mult(Vector.random2D(), this.bounce)
        this.goal = Vector.add(this.pos, d)
    }

    update() {
        if (this.isBeingDragged) return

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
        // find upper-left corner of sprite
        let x = floor(this.pos.x - (this.width / 2) + this.offsetX)
        let y = floor(this.pos.y - this.height + this.offsetY)

        if (!this.isInInventory && !this.isBeingDragged) image(shadowImgs.small, x, y + 1)
        
        // draw debug lines
        if (DEBUG) {
            noFill()
            stroke('lightblue')
            rect(x, y, this.width, this.height)
        }
    }

    export() {
        let data = {
            type: 'toy',
            name: this.name,
            x: this.pos.x,
            y: this.pos.y,
            isInInventory: this.isInInventory
        }
        return data
    }

    static importToy(data) {
        let newToy = new Toy()
        newToy.name = data.name
        newToy.pos = createVector(data.x, data.y)
        newToy.isInInventory = data.isInInventory
        // todo: look up toy image/stats based on name
        return newToy
    }
}