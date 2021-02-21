class Credits extends ScreenState {
    constructor() {
        super()
    }

    setup() {
    }

    open() {
        gameObjects = blastedOffBunbons.slice()
        gameObjects.forEach(bunbon => {
            bunbon.pos = randomPoint()
            bunbon.state = ''
        })
    }

    close() {
        gameObjects = null
    }

    draw() {
        noStroke()
        fill('#222')
        rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

        image(spaceButtonForCreditsImg, 3, WORLD_HEIGHT + 3)

        this.sortGameObjects()

        gameObjects.forEach(bunbon => {
            bunbon.update(true)
            bunbon.draw()
            bunbon.drives.hunger = 0
            bunbon.drives.boredom = 0
        })
    }

    mousePressed(x, y) {
        selectedObject = null
        this.clickInWorld(x, y)
    }

    mouseDragged(x, y, dx, dy) {
        this.dragObject(x, y, dx, dy, false)
    }

    mouseReleased(x, y, dx, dy) {
        let objectWasDropped = this.dropObject(x, y, dx, dy, false)
        if (
            !objectWasDropped &&
            x >= spaceButton.x && x < spaceButton.x + spaceButton.width &&
            y >= spaceButton.y && y < spaceButton.y + spaceButton.height
        ) {
            openScreen('space')
        }
    }

    keyPressed() {
    }
}