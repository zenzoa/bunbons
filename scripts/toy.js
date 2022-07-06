let toySprites = {
    'mossball': 220,
    'glider': 221,
    'robot': 222,
    'dancingflower': 223,
    'butterfly': 224,
    'magicwand': 225,
    'sled': 226,
    'bundoll': 227,
    'beachball': 228,
    'pullturtle': 229
}

let toyList = ['mossball', 'glider', 'robot', 'dancingflower', 'butterfly', 'magicwand', 'sled', 'bundoll', 'beachball', 'pullturtle', 'egg']

class Toy extends GameObject {

    constructor(pos, name) {

        super(24, 24)

        let toyType = name || random(Object.keys(toySprites))
        let toySpriteIndex = toySprites[toyType]

        this.name = toyType
        this.pos = createVector(pos.x, pos.y)

        this.animationTimer = 0
        this.animationFrame = 0

        this.shadowType = 'small'
        this.shadowOffsetX = 0
        this.shadowOffsetY = 1

        this.bounceTimer = 0
        this.bounceHeight = 0
        this.bounceY = 0

        if (this.name === 'mossball') {
            this.width = 18
            this.height = 24
            this.offsetX = -8
            this.offsetY = -8
        } else if (this.name === 'glider') {
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
        } else if (this.name === 'dancingflower') {
            this.width = 18
            this.height = 24
            this.offsetX = -8
            this.offsetY = -8
        } else if (this.name === 'butterfly') {
            this.width = 24
            this.height = 20
            this.offsetX = -4
            this.offsetY = -12
            this.shadowOffsetX = -1
        } else if (this.name === 'magicwand') {
            this.width = 18
            this.height = 18
            this.offsetX = -6
            this.offsetY = -14
            this.shadowOffsetX = -4
        } else if (this.name === 'sled') {
            this.width = 32
            this.height = 16
            this.offsetX = 0
            this.offsetY = -16
            this.shadowOffsetX = 0
            this.shadowOffsetY = 2
            this.shadowType = 'big'
        } else if (this.name === 'bundoll') { // TODO: update
            this.width = 18
            this.height = 20
            this.offsetX = -8
            this.offsetY = -12
        } else if (this.name === 'beachball') {
            this.width = 24
            this.height = 24
            this.offsetX = -4
            this.offsetY = -8
            this.shadowType = 'big'
        } else if (this.name === 'pullturtle') {
            this.width = 28
            this.height = 18
            this.offsetX = -2
            this.offsetY = -14
            this.shadowType = 'big'
            this.shadowOffsetX = 2
        }

        this.isActive = false
        this.carriedBunbon = null

        this.driveReduction = 30

        this.spriteImgs = [
            baseSpritesheet.getSprite(toySpriteIndex),
            baseSpritesheet.getSprite(toySpriteIndex + 20)
        ]

    }

    onPush(agent) {

        if (DEBUG) console.log('push the toy')

        if (this.carriedBunbon) {
            this.carriedBunbon.isInInventory = false
            this.carriedBunbon = null
        }

        if (this.isActive) {
            this.isActive = false
            this.animationTimer = 0
            this.animationFrame = 0
        } else {
            this.isActive = true

            if (this.name === 'mossball') {
                // do nothing

            } else if (this.name === 'glider') {
                this.isFlipped = (this.pos.x >= WORLD_WIDTH / 2)
                this.bounceTimer = 0
                this.bounceHeight = random(50, 100)
                this.bounceY = 0

            } else if (this.name === 'robot') {
                this.isFlipped = (this.pos.x >= WORLD_WIDTH / 2)

            } else if (this.name === 'dancingflower') {
                // do nothing

            } else if (this.name === 'butterfly') {
                this.isFlipped = (this.pos.x >= WORLD_WIDTH / 2)
                this.bounceY = 4

            } else if (this.name === 'magicwand') {
                // do nothing

            } else if (this.name === 'sled') {
                this.isFlipped = (this.pos.x >= WORLD_WIDTH / 2)
                if (agent instanceof Bunbon) {
                    this.carriedBunbon = agent
                    this.carriedBunbon.isFlipped = this.isFlipped
                }

            } else if (this.name === 'bundoll') {
                // do nothing

            } else if (this.name === 'beachball') {
                this.bounceTimer = 0
                this.bounceHeight = random(10, 100)
                this.bounceY = 0

            } else if (this.name === 'pullturtle') {
                this.isFlipped = (this.pos.x >= WORLD_WIDTH / 2)

            }
        }
        
        if (!agent) {
            playSound('click-toy')
        }

    }

    update() {

        if (this.isBeingDragged) this.isActive = false

        if (!this.isActive) {
            this.animationTimer = 0
            this.animationFrame = 0
            this.bounceY = 0
            return
        }

        let newX = this.pos.x
        let newY = this.pos.y

        this.animationTimer++

        if (this.name === 'mossball') {
            this.animationFrame = 1
            if (this.animationTimer > 10) {
                this.animationFrame = 0
                this.isActive = false
            }

        } else if (this.name === 'glider') {
            newX = this.isFlipped ? newX - 1 : newX + 1

            if (!currentScreen.isPositionClear(newX, newY, this.width, this.height)) {
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
                newX = this.isFlipped ? newX - 2 : newX + 2
            }
            if (this.animationTimer > 600) {
                this.isActive = false
            }

        } else if (this.name === 'dancingflower') {
            if (this.animationTimer % 10 == 0) {
                this.animationFrame = this.animationFrame === 0 ? 1 : 0
            }
            if (this.animationTimer > 600) {
                this.isActive = false
            }
            
        } else if (this.name === 'butterfly') {
            if (this.animationTimer % 5 == 0) {
                this.animationFrame = this.animationFrame === 0 ? 1 : 0
                newX = this.isFlipped ? newX - 1 : newX + 1
            }
            if (currentScreen.isPositionClear(newX, newY, this.width, this.height)) {
                if (this.animationTimer < 300) {
                    this.bounceY += random([1, 1, 0, -1])
                } else if (this.animationTimer < 600) {
                    this.bounceY += random([1, 0, -1])
                } else {
                    this.bounceY += random([1, 0, -1, -1])
                }
                if (this.bounceY < 0) this.isActive = false
                if (this.bounceY > this.pos.y - this.height) this.bounceY = this.pos.y - this.height
            } else {
                newX = this.pos.x
                this.isFlipped = !this.isFlipped
            }

        } else if (this.name === 'magicwand') {
            if (this.animationTimer % 3 == 0 && this.animationTimer < 18) {
                this.animationFrame = this.animationFrame === 0 ? 1 : 0
            }
            if (this.animationTimer === 59) {
                this.isActive = false
            }

        } else if (this.name === 'sled') {
            newX = this.isFlipped ? newX - 2 : newX + 2

        } else if (this.name === 'bundoll') { // TODO: update
            this.animationFrame = 1
            if (this.animationTimer > 300) {
                this.animationFrame = 0
                this.isActive = false
            }

        } else if (this.name === 'beachball') {
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
        
        } else if (this.name === 'pullturtle') {
            if (this.animationTimer % 5 == 0) {
                this.animationFrame = this.animationFrame === 0 ? 1 : 0
            }
            newX = this.isFlipped ? newX - 1 : newX + 1

        }

        if (currentScreen.isPositionClear(newX, newY, this.width, this.height)) {

            this.pos = new Vector(newX, newY)

        } else {

            if (this.name === 'robot') {
                this.isFlipped = !this.isFlipped
            } else {
                this.isActive = false
            }

        }

        if (this.carriedBunbon) {
            if (this.isActive) {
                this.carriedBunbon.isInInventory = true
                this.carriedBunbon.pos.x = this.pos.x
                this.carriedBunbon.pos.y = this.pos.y + 1
                this.carriedBunbon.tempOffsetX = this.isFlipped ? 4 : -4
                this.carriedBunbon.tempOffsetY = -4
            } else {
                this.carriedBunbon.isInInventory = false
                this.carriedBunbon = null
            }
        }

    }

    draw() {

        push()
        translate(floor(this.pos.x), floor(this.pos.y))
        if (this.isFlipped) scale(-1.0, 1.0)

        let x = floor(-(this.width / 2) + this.offsetX)
        let y = floor(-this.height + this.offsetY)
        let bounceOffset = this.isActive ? floor(this.bounceY) : 0

        // draw shadow
        if (!this.isInInventory && !this.isBeingDragged) {
            let shadowX = x + this.shadowOffsetX
            let shadowY = y + this.shadowOffsetY
            let shadowImg = this.bounceY > 0 ? shadowImgs[this.shadowType + '-jump'] : shadowImgs[this.shadowType]
            image(shadowImg, shadowX, shadowY)
        }

        // draw toy
        image(this.spriteImgs[this.animationFrame], x, y - bounceOffset)

        pop()

        // draw debug lines
        if (DEBUG) {
            noFill()
            stroke('lightblue')
            rect(this.pos.x + x - this.offsetX, this.pos.y + y - this.offsetY, this.width, this.height)
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

        let newToy = new Toy({ x: data.x, y: data.y }, data.name)
        newToy.isInInventory = data.isInInventory
        return newToy

    }

}