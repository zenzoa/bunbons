let foodSprites = {
    'mushrooms': 180,
    'cloud-dumplings': 181,
    'juice-orb': 182,
    'flowers': 183,
    'dragon-fruit': 184,
    'rock-candy': 185,
    'ice-cream': 186,
    'sandwich': 187,
    'seaweed': 188
}

class Food extends GameObject {

    constructor(pos, name) {

        super(24, 24)
        
        // temp
        let foodType = name || random(Object.keys(foodSprites))
        let foodSpriteIndex = foodSprites[foodType]

        this.name = foodType
        this.pos = pos

        this.offsetX = -4
        this.offsetY = -8

        this.uneatenSpriteIndex = foodSpriteIndex
        this.eatenSpriteIndex = foodSpriteIndex + 20

        this.isRefilling = false
        this.refillLength = floor(random(600, 2100))
        this.refillTimer = 0

        this.driveReduction = floor(random(30, 100))

    }

    onPush(byPlayer) {

        if (!byPlayer) {
            this.refillTimer = 0
            this.isRefilling = true
        }

    }

    update() {

        if (this.isBeingDragged) return

        if (this.isRefilling) {
            this.refillTimer++
            if (this.refillTimer >= this.refillLength) {
                this.isRefilling = false
            }
        }

    }

    draw() {

        // find upper-left corner of sprite
        let x = floor(this.pos.x - (this.width / 2) + this.offsetX)
        let y = floor(this.pos.y - this.height + this.offsetY)

        if (!this.isInInventory && !this.isBeingDragged) {
            if (this.name === 'mushrooms') {
                baseSpritesheet.drawSprite({ x, y: y + 1 }, shadowImgs.big)
            } else if (this.name === 'cloud-dumplings') {
                baseSpritesheet.drawSprite({ x, y: y + 1 }, shadowImgs.big)
            } else if (this.name === 'juice-orb') {
                baseSpritesheet.drawSprite({ x, y: y + 1 }, shadowImgs.small)
            } else if (this.name === 'flowers') {
                baseSpritesheet.drawSprite({ x, y: y - 2 }, shadowImgs.small)
            } else if (this.name === 'dragon-fruit') {
                baseSpritesheet.drawSprite({ x, y: y + 1 }, shadowImgs.small)
            } else if (this.name === 'rock-candy') {
                baseSpritesheet.drawSprite({ x: x + 1, y: y + 1 }, shadowImgs.small)
            } else if (this.name === 'ice-cream') {
                baseSpritesheet.drawSprite({ x, y: y + 1 }, shadowImgs.small)
            } else if (this.name === 'sandwich') {
                baseSpritesheet.drawSprite({ x, y }, shadowImgs.big)
            } else if (this.name === 'seaweed') {
                baseSpritesheet.drawSprite({ x, y: y + 1 }, shadowImgs.big)
            }
        }
        
        let spriteIndex = this.isRefilling ? this.eatenSpriteIndex : this.uneatenSpriteIndex
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
            type: 'food',
            name: this.name,
            x: this.pos.x,
            y: this.pos.y,
            isRefilling: this.isRefilling,
            refillLength: this.refillLength,
            refillTimer: this.refillTimer,
            isInInventory: this.isInInventory
        }
        return data

    }

    static importFood(data) {

        let pos = createVector(data.x, data.y)
        let newFood = new Food(pos, data.name)
        newFood.isRefilling = data.isRefilling
        newFood.refillLength = data.refillLength
        newFood.refillTimer = data.refillTimer
        newFood.isInInventory = data.isInInventory
        // todo: look up food image/stats based on name
        return newFood

    }

}