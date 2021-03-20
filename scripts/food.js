let foodSprites = {
    'mushrooms': 180,
    'dumplings': 181,
    'juiceorb': 182,
    'flowers': 183,
    'dragonfruit': 184,
    'rockcandy': 185,
    'icecream': 186,
    'sandwich': 187,
    'seaweed': 188,
    'succulent': 189
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

        this.isRefilling = false
        this.refillLength = floor(random(600, 2100))
        this.refillTimer = 0

        this.driveReduction = 60

        this.spriteImgs = [
            baseSpritesheet.getSprite(foodSpriteIndex),
            baseSpritesheet.getSprite(foodSpriteIndex + 20)
        ]

    }

    onPush(agent) {

        if (!agent) {
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
                image(shadowImgs.big, x, y + 1)
            } else if (this.name === 'dumplings') {
                image(shadowImgs.big, x, y + 1)
            } else if (this.name === 'juiceorb') {
                image(shadowImgs.small, x, y + 1)
            } else if (this.name === 'flowers') {
                image(shadowImgs.small, x, y - 2)
            } else if (this.name === 'dragonfruit') {
                image(shadowImgs.small, x, y + 1)
            } else if (this.name === 'rockcandy') {
                image(shadowImgs.small, x + 1, y + 1)
            } else if (this.name === 'icecream') {
                image(shadowImgs.small, x, y + 1)
            } else if (this.name === 'sandwich') {
                image(shadowImgs.big, x, y)
            } else if (this.name === 'seaweed') {
                image(shadowImgs.big, x, y + 1)
            }
        }
        
        if (this.isRefilling) {
            image(this.spriteImgs[1], x, y)
        } else {
            image(this.spriteImgs[0], x, y)
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