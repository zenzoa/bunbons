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

    recolor(colorName) {
        let img = this.img.get()
        img.loadPixels()

        let newColors = bunbonColors[colorName]
        if (!newColors) return

        let pixelCount = 4 * img.width * img.height
        for (let i = 0; i < pixelCount; i += 4) {
            replacementColors.forEach((oldColor, j) => {
                let rDiff = abs(oldColor[0] - img.pixels[i])
                let gDiff = abs(oldColor[1] - img.pixels[i + 1])
                let bDiff = abs(oldColor[2] - img.pixels[i + 2])
                if (rDiff < 25 && gDiff < 25 && bDiff < 25) {
                    let newColor = newColors[j]
                    img.pixels[i] = newColor[0]
                    img.pixels[i + 1] = newColor[1]
                    img.pixels[i + 2] = newColor[2]
                }
            })
        }
        img.updatePixels()
        return new Spritesheet(img, this.spriteWidth, this.spriteHeight)
    }
}