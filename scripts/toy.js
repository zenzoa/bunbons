let toySprites = {
    'moss-ball': 220,
    'paper-airplane': 221,
    'unknown': 222,
    'dancing-flower': 223,
    'pull-turtle': 224,
    'magic-wand': 225,
    'snow-bun': 226,
    'bun-doll': 227,
    'beach-ball': 228
}

class Toy extends GameObject {

    constructor(pos, name) {

        super(24, 24)

        // temp
        let toyType = name || random(Object.keys(toySprites))
        let toySpriteIndex = toySprites[toyType]

        this.name = toyType
        this.pos = pos

        this.offsetX = -4
        this.offsetY = -8

        this.inactiveSpriteIndex = toySpriteIndex
        this.activeSpriteIndex = toySpriteIndex + 20

        this.isActive = false
        this.bounce = random(0, 30)
        this.speed = random(0.5, 4)

        this.driveReduction = floor(random(10, 50))

    }

    onPush() {

        if (DEBUG) console.log('push the toy')

        let d = Vector.mult(Vector.random2D(), this.bounce)
        this.goal = Vector.add(this.pos, d)
        this.isActive = true

    }

    update() {

        if (this.isBeingDragged) return

        if (this.goal) {
            let d = Vector.sub(this.goal, this.pos)
            d.setMag(this.speed)
            let newPos = Vector.add(this.pos, d)

            if (Vector.dist(this.pos, this.goal) <= this.width / 4) {
                this.goal = null
            } else if (currentScreen.isPositionClear(newPos.x, newPos.y)) {
                this.pos = newPos
            } else {
                this.goal = null
            }
        } else {
            this.isActive = false
        }

    }

    draw() {

        // TODO: add animation when active

        // find upper-left corner of sprite
        let x = floor(this.pos.x - (this.width / 2) + this.offsetX)
        let y = floor(this.pos.y - this.height + this.offsetY)

        if (!this.isInInventory && !this.isBeingDragged) baseSpritesheet.drawSprite({ x, y: y + 1 }, shadowImgs.small)

        let spriteIndex = this.isActive ? this.activeSpriteIndex : this.inactiveSpriteIndex
        baseSpritesheet.drawSprite({ x, y }, spriteIndex)
        
        // draw debug lines
        if (DEBUG) {
            noFill()
            stroke('lightblue')
            rect(x - this.offsetX, y - this.offsetY, this.width, this.height)
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

        let pos = createVector(data.x, data.y)
        let newToy = new Toy(pos, data.name)
        newToy.isInInventory = data.isInInventory
        // todo: look up toy image/stats based on name
        return newToy

    }

}