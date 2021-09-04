class Credits extends ScreenState {

    constructor() {
        
        super()
        this.type = 'credits'

        this.confettiX = []
        this.confettiY = []
        this.confettiColors = []
        this.confettiTimer = 0

    }

    setup() {
    }

    open() {

        this.objects = blastedOffBunbons.slice()
        this.objects.forEach(bunbon => {
            bunbon.pos = this.randomPoint()
            bunbon.state = ''
        })

        if (!MUTE) planetSoundtracks['credits'].play()

    }

    close() {

        planetSoundtracks['credits'].stop()

    }

    draw() {
        noStroke()
        fill('#222')
        rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

        fill('#ddd')
        text('~ bunbons ~', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 60)

        fill('#bbb')
        text('created by sg', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 40)
        text('background art by tati', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 10)
        text('sound effects by ??', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 20)
        text('music by visager', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 50)

        fill('#999')
        text('zenzoa.itch.io', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 30)
        text('tatianasoutar.com', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)
        text('[sound website]', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 30)
        text('freemusicarchive.org/music/visager', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 60)

        image(spaceButtonForCreditsImg, 3, WORLD_HEIGHT + 3)

        this.sortGameObjectsByPos()
        this.objectsInDrawOrder.forEach(objectIndex => {
            let obj = this.objects[objectIndex]
            obj.update(/* forCredits */ true)
            obj.draw()
            obj.drives.hunger = 0
            obj.drives.boredom = 0
        })

        if (this.confettiTimer <= 0) {
            this.confettiTimer = FRAME_RATE
            this.confettiColors.push(random(['rgb(246, 129, 129)', 'rgb(255, 238, 104)', 'rgb(114, 214, 206)']))
            this.confettiX.push(random(0, SCREEN_WIDTH))
            this.confettiY.push(-4)
            if (this.confettiX.length > 20) {
                this.confettiColors.shift()
                this.confettiX.shift()
                this.confettiY.shift()
            }
        }
        for (let i = 0; i < this.confettiX.length; i++) {
            fill(this.confettiColors[i])
            rect(floor(this.confettiX[i] - 1.5), floor(this.confettiY[i] - 1.5), 3, 3)
            this.confettiX[i] += random([-1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1])
            this.confettiY[i] += 0.5
        }
        this.confettiTimer--
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
        if (objectWasDropped) return
        if (
            x >= spaceButton.x && x < spaceButton.x + spaceButton.width &&
            y >= spaceButton.y && y < spaceButton.y + spaceButton.height
        ) {
            openScreen('space')
        } else if (
            x >= muteButton.x && x < muteButton.x + muteButton.width &&
            y >= muteButton.y && y < muteButton.y + muteButton.height
        ) {
            MUTE = !MUTE
            if (MUTE) planetSoundtracks['credits'].pause()
            else planetSoundtracks['credits'].play()
        }
    }

    keyPressed() {
    }

}