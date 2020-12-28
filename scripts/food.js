let foodSprites = {
    'mushrooms': 180,
    'cloud-dumplings': 181,
    'juice-orb': 182
}

class Food extends GameObject {
    constructor() {
        super(24, 24)

        // temp
        let foodType = random(Object.keys(foodSprites))
        let foodSpriteIndex = foodSprites[foodType]

        this.name = foodType
        this.pos = randomPoint()

        this.offsetX = -4
        this.offsetY = -8

        this.uneatenSpriteIndex = foodSpriteIndex
        this.eatenSpriteIndex = foodSpriteIndex + 20

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
        let y = floor(this.pos.y - this.height + this.offsetY)

        let spriteIndex = this.isRefilling ? this.eatenSpriteIndex : this.uneatenSpriteIndex
        image(baseSpritesheet.get(spriteIndex), x, y)

        // draw debug lines
        if (DEBUG) {
            noFill()
            stroke('lightblue')
            rect(x - this.offsetX, y - this.offsetY, this.width, this.height)
        }
    }
}