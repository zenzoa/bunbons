class GameObject {
    constructor(width, height) {
        this.name = ''

        this.pos = createVector()
        this.width = width
        this.height = height
        this.offsetX = 0
        this.offsetY = 0
        this.jumpY = 0

        this.isDraggable = true
    }

    isOnPointer(mx, my) {
        let x = this.pos.x - (this.width / 2)
        let y = this.pos.y - this.height - this.jumpY
        return (mx >= x && mx < x + this.width && my >= y && my < y + this.height)
    }

    isTouching(obj) {
        let myLeft = this.pos.x - (this.width / 2)
        let myRight = myLeft + this.width
        let myTop = this.pos.y - this.height - this.jumpY
        let myBottom = myTop + this.height

        let objLeft = obj.pos.x - (obj.width / 2)
        let objRight = objLeft + obj.width
        let objTop = obj.pos.y - obj.height - obj.jumpY
        let objBottom = objTop + obj.height

        if (myLeft > objRight || objLeft > myRight) return false
        if (myTop > objBottom || objTop > myBottom) return false
        return true
    }

    onDrop() {
        if (this.nearGoal) {
            this.nearGoal.x  = this.pos.x
            this.nearGoal.y  = this.pos.y
        }

        gameObjects.forEach(obj => {
            if (obj !== this && this.isTouching(obj)) {
                if (this instanceof BunBon) {
                    this.lookAt(obj)
                }
                else if (obj instanceof BunBon) {
                    obj.lookAt(this)
                }
            }
        })
    }

    update() {}

    draw() {}

    export() {}

    static import(data) {
        if (!data) {
            return null
        } else if (data.type === 'bunbon') {
            return BunBon.importBunBon(data)
        } else if (data.type === 'egg') {
            return Egg.importEgg(data)
        } else if (data.type === 'food') {
            return Food.importFood(data)
        } else if (data.type === 'toy') {
            return Toy.importToy(data)
        }
    }
}