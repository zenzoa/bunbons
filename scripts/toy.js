let toySprites = {
    'moss-ball': 220,
    'paper-airplane': 221,
    'robot': 222,
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

        let toyType = name || random(Object.keys(toySprites))
        let toySpriteIndex = toySprites[toyType]

        this.name = toyType
        this.pos = pos

        this.animationTimer = 0
        this.animationFrame = 0

        this.shadowType = 'small'
        this.shadowOffsetX = 0
        this.shadowOffsetY = 1

        this.bounceTimer = 0
        this.bounceHeight = 0
        this.bounceY = 0

        if (this.name === 'moss-ball') {
            this.width = 18
            this.height = 24
            this.offsetX = -8
            this.offsetY = -8
        } else if (this.name === 'paper-airplane') {
            this.width = 24
            this.height = 18
            this.offsetX = -4
            this.offsetY = -14
            this.shadowType = 'big'
            this.shadowOffsetX = 2
        } else if (this.name === 'robot') {
            this.width = 24
            this.height = 18
            this.offsetX = -4
            this.offsetY = -14
            this.shadowType = 'big'
            this.shadowOffsetY = 2
        } else if (this.name === 'dancing-flower') {
            this.width = 18
            this.height = 24
            this.offsetX = -8
            this.offsetY = -8
        } else if (this.name === 'pull-turtle') {
            this.width = 28
            this.height = 18
            this.offsetX = -2
            this.offsetY = -14
            this.shadowType = 'big'
            this.shadowOffsetX = 2
        } else if (this.name === 'magic-wand') {
            this.width = 18
            this.height = 18
            this.offsetX = -6
            this.offsetY = -14
            this.shadowOffsetX = -4
        } else if (this.name === 'snow-bun') {
            this.width = 18
            this.height = 18
            this.offsetX = -8
            this.offsetY = -14
            this.shadowOffsetX = 1
            this.shadowOffsetY = 2
        } else if (this.name === 'bun-doll') {
            this.width = 18
            this.height = 20
            this.offsetX = -8
            this.offsetY = -12
        } else if (this.name === 'beach-ball') {
            this.width = 24
            this.height = 24
            this.offsetX = -4
            this.offsetY = -8
            this.shadowType = 'big'
        }

        this.isFlipped = false
        this.isActive = false

        this.driveReduction = 30

        this.spriteImgs = [
            baseSpritesheet.getSprite(toySpriteIndex),
            baseSpritesheet.getSprite(toySpriteIndex + 20)
        ]

        this.spriteImgsFlipped = [
            baseSpritesheet.getSprite(toySpriteIndex, /* isFlipped */ true),
            baseSpritesheet.getSprite(toySpriteIndex + 20, /* isFlipped */ true)
        ]

    }

    onPush() {

        if (DEBUG) console.log('push the toy')

        if (this.isActive) {
            this.isActive = false
            this.animationTimer = 0
            this.animationFrame = 0
        } else {
            this.isActive = true

            if (this.name === 'moss-ball') {
                // do nothing

            } else if (this.name === 'paper-airplane') {
                this.isFlipped = random([true, false])
                this.bounceTimer = 0
                this.bounceHeight = random(50, 100)
                this.bounceY = 0

            } else if (this.name === 'robot') {
                this.isFlipped = random([true, false])

            } else if (this.name === 'dancing-flower') {
                // do nothing

            } else if (this.name === 'pull-turtle') {
                this.isFlipped = random([true, false])

            } else if (this.name === 'magic-wand') {
                // do nothing

            } else if (this.name === 'snow-bun') {
                // do nothing

            } else if (this.name === 'bun-doll') {
                // do nothing

            } else if (this.name === 'beach-ball') {
                this.bounceTimer = 0
                this.bounceHeight = random(10, 100)
                this.bounceY = 0
            }
        }

    }

    update() {

        if (this.isBeingDragged) this.isActive = false

        if (!this.isActive) {
            this.animationTimer = 0
            this.animationFrame = 0
            return
        }

        let newX = this.pos.x
        let newY = this.pos.y

        this.animationTimer++

        if (this.name === 'moss-ball') {
            this.animationFrame = 1
            if (this.animationTimer > 10) {
                this.animationFrame = 0
                this.isActive = false
            }

        } else if (this.name === 'paper-airplane') {
            newX = this.isFlipped ? newX + 1 : newX - 1

            if (!currentScreen.isPositionClear(newX, newY)) {
                newX = this.pos.x
                this.bounceY -= 2
                this.animationFrame = 0
            } else {
                this.bounceTimer += 0.1
                this.bounceY = this.bounceHeight * sin(this.bounceTimer * 0.15)
                this.animationFrame = (this.bounceTimer >= 9) ? 0 : 1
                if (this.bounceY <= 0) {
                    this.bounceTimer = 0
                    this.bounceHeight = 0
                    this.bounceY = 0
                    this.isActive = false
                }
            }

            if (this.bounceY <= 0) {
                this.isActive = false
            }

        } else if (this.name === 'robot') {
            if (this.animationTimer % 10 == 0) {
                this.animationFrame = this.animationFrame === 0 ? 1 : 0
            }
            if (this.animationTimer % 5 == 0) {
                newX = this.isFlipped ? newX + 2 : newX - 2
            }
            if (this.animationTimer > 600) {
                this.isActive = false
            }

        } else if (this.name === 'dancing-flower') {
            if (this.animationTimer % 10 == 0) {
                this.animationFrame = this.animationFrame === 0 ? 1 : 0
            }
            if (this.animationTimer > 600) {
                this.isActive = false
            }
            
        } else if (this.name === 'pull-turtle') {
            if (this.animationTimer % 5 == 0) {
                this.animationFrame = this.animationFrame === 0 ? 1 : 0
            }
            newX = this.isFlipped ? newX + 1 : newX - 1

        } else if (this.name === 'magic-wand') {
            if (this.animationTimer % 3 == 0 && this.animationTimer < 18) {
                this.animationFrame = this.animationFrame === 0 ? 1 : 0
            }
            if (this.animationTimer === 59) {
                this.isActive = false
            }

        } else if (this.name === 'snow-bun') {
            //

        } else if (this.name === 'bun-doll') {
            this.animationFrame = 1
            if (this.animationTimer > 300) {
                this.animationFrame = 0
                this.isActive = false
            }

        } else if (this.name === 'beach-ball') {
            this.bounceTimer++
            this.bounceY = this.bounceHeight * sin(this.bounceTimer * 0.15)
            this.animationFrame = (this.bounceY <= 10 && this.bounceTimer < 10) ? 1 : 0
            if (this.bounceY <= 0) {
                this.bounceTimer = 0
                this.bounceHeight = floor(this.bounceHeight / 2)
                this.bounceY = 0
            }
            if (this.bounceHeight <= 5) {
                this.isActive = false
            }
        }

        if (currentScreen.isPositionClear(newX, newY)) {
            this.pos = new Vector(newX, newY)
        } else {
            if (this.name === 'robot') {
                this.isFlipped = !this.isFlipped
            } else {
                this.isActive = false
            }
        }

    }

    draw() {

        // find upper-left corner of sprite
        let x = floor(this.pos.x - (this.width / 2) + this.offsetX)
        let y = floor(this.pos.y - this.height + this.offsetY)
        let bounceOffset = this.isActive ? floor(this.bounceY) : 0

        // draw shadow
        if (!this.isInInventory && !this.isBeingDragged) {
            let shadowX = this.isFlipped ? x - this.shadowOffsetX : x + this.shadowOffsetX
            let shadowY = y + this.shadowOffsetY
            let shadowImg = this.bounceY > 0 ? shadowImgs[this.shadowType + '-jump'] : shadowImgs[this.shadowType]
            image(shadowImg, shadowX, shadowY)
        }

        // draw toy
        if (this.isFlipped) {
            image(this.spriteImgsFlipped[this.animationFrame], x, y - bounceOffset)
        } else {
            image(this.spriteImgs[this.animationFrame], x, y - bounceOffset)
        }
        
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