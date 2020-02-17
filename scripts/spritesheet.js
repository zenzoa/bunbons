class Spritesheet {
    constructor(img, spriteWidth, spriteHeight) {
        this.img = img
        this.spriteWidth = spriteWidth
        this.spriteHeight = spriteHeight
        this.spriteCols = floor(img.width / spriteWidth)
        this.spriteRows = floor(img.height / spriteHeight)
    }

    get(spriteIndex) {
        let x = this.spriteWidth * floor(spriteIndex % this.spriteRows)
        let y = this.spriteHeight * floor(spriteIndex / this.spriteRows)
        return this.img.get(x, y, this.spriteWidth, this.spriteHeight)
    }
}