class Credits extends ScreenState {

    constructor() {
        super()
    }

    setup() {
    }

    open() {
        this.objects = blastedOffBunbons.slice()
        this.objects.forEach(bunbon => {
            bunbon.pos = this.randomPoint()
            bunbon.state = ''
        })
    }

    close() {
    }

    draw() {
        noStroke()
        fill('#222')
        rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

        image(spaceButtonForCreditsImg, 3, WORLD_HEIGHT + 3)

        this.sortGameObjectsByPos()
        this.objectsInDrawOrder.forEach(objectIndex => {
            let obj = this.objects[objectIndex]
            obj.update(/* forCredits */ true)
            obj.draw()
            obj.drives.hunger = 0
            obj.drives.boredom = 0
        })
    }

    mousePressed(x, y) {
        this.selectedObjectIndex = -1
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