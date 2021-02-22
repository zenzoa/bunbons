class Spritesheet {

    constructor(img, spriteWidth, spriteHeight, colorName) {

        this.img = img.get()

        this.spriteWidth = spriteWidth
        this.spriteHeight = spriteHeight
        this.spriteCols = floor(img.width / spriteWidth)
        this.spriteRows = floor(img.height / spriteHeight)

        if (colorName) this.changeColor(colorName)

        this.flippedImg = null
        this.makeFlippedVersion()

    }

    drawSprite(pos, spriteIndex, isFlipped) {

        let img = isFlipped ? this.flippedImg : this.img

        let x = this.spriteWidth * floor(spriteIndex % this.spriteRows)
        let y = this.spriteHeight * floor(spriteIndex / this.spriteRows)

        image(img.get(x, y, this.spriteWidth, this.spriteHeight), pos.x, pos.y)

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
                if (rDiff < 25 && gDiff < 25 && bDiff < 25) {
                    let newColor = newColors[j]
                    this.img.pixels[i] = newColor[0]
                    this.img.pixels[i + 1] = newColor[1]
                    this.img.pixels[i + 2] = newColor[2]
                }
            })
        }

        this.img.updatePixels()

    }

    makeFlippedVersion() {

        this.flippedImg = createImage(this.img.width, this.img.height)
        this.flippedImg.copy(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.img.width, this.img.height)
        this.flippedImg.loadPixels()

        let pixels = []
        let pixelCount = 4 * this.img.width * this.img.height
        for (let i = 0; i < pixelCount; i += 4) {
            pixels.push([
                this.flippedImg.pixels[i],
                this.flippedImg.pixels[i + 1],
                this.flippedImg.pixels[i + 2],
                this.flippedImg.pixels[i + 3]
            ])
        }

        let newPixelRows = []
        for (let i = 0; i < pixels.length; i += this.spriteWidth) {
            let pixelRow = pixels.slice(i, i + this.spriteWidth)
            pixelRow.reverse()
            newPixelRows.push(pixelRow)
        }

        let newPixels = newPixelRows.flat()

        newPixels.forEach((p, i) => {
            let j = i * 4
            this.flippedImg.pixels[j] = p[0]
            this.flippedImg.pixels[j + 1] = p[1]
            this.flippedImg.pixels[j + 2] = p[2]
            this.flippedImg.pixels[j + 3] = p[3]
        })

        this.flippedImg.updatePixels()
        
    }

}