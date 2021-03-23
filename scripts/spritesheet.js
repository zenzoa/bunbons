class Spritesheet {

    constructor(img, spriteWidth, spriteHeight, colorName) {

        this.img = img.get()

        this.spriteWidth = spriteWidth
        this.spriteHeight = spriteHeight
        this.spriteCols = floor(img.width / spriteWidth)
        this.spriteRows = floor(img.height / spriteHeight)

        if (colorName) this.changeColor(colorName)

    }

    getSprite(spriteIndex) {

        let img = this.img

        let x = this.spriteWidth * floor(spriteIndex % this.spriteRows)
        let y = this.spriteHeight * floor(spriteIndex / this.spriteRows)

        return img.get(x, y, this.spriteWidth, this.spriteHeight)

    }

    copySprite(imageTarget, spriteIndex, x, y) {
        let sprite = this.getSprite(spriteIndex)
        imageTarget.copy(sprite, 0, 0, this.spriteWidth, this.spriteHeight, x, y, this.spriteWidth, this.spriteHeight)
    }

    changeColor(colorName) {

        this.img.loadPixels()

        let newColors = bunbonColors[colorName]
        if (!newColors) return

        let pixelCount = 4 * this.img.width * this.img.height
        for (let i = 0; i < pixelCount; i += 4) {
            replacementColors.forEach((oldColor, j) => {
                let rDiff = abs(oldColor[0] - this.img.pixels[i])
                let gDiff = abs(oldColor[1] - this.img.pixels[i + 1])
                let bDiff = abs(oldColor[2] - this.img.pixels[i + 2])
                if (rDiff < 10 && gDiff < 10 && bDiff < 10) {
                    let newColor = newColors[j]
                    this.img.pixels[i] = newColor[0]
                    this.img.pixels[i + 1] = newColor[1]
                    this.img.pixels[i + 2] = newColor[2]
                }
            })
        }

        this.img.updatePixels()

    }

}