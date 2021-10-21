class Space extends ScreenState {

    constructor() {

        super()
        this.type = 'space'

    }

    setup() {

        this.offsetX = 0
        this.offsetY = 0

        this.isBlastingOff = false
        this.blastOffX = 0
        this.blastOffY = 0

        this.drawTransition = false
        this.transitionRadius = 0
        this.transitionReversed = false

    }

    open(planetIndex, showBlastOff) {

        let planet = planets[planetIndex]
        if (planet) {
            this.offsetX = planet.x - SCREEN_WIDTH / 2
            this.offsetY = planet.y - SCREEN_HEIGHT / 2
            this.adjustOffset()
            if (showBlastOff) {
                this.startBlastOff(planet.x - this.offsetX, planet.y - this.offsetY)
            }
        }

        if (!MUTE) planetSoundtracks['space'].play()

    }

    close() {

        planetSoundtracks['space'].stop()
        
    }

    startBlastOff(x, y) {

        this.isBlastingOff = true
        this.blastOffTimer = 0
        this.blastOffX = x
        this.blastOffY = y
        this.blastOffAngle = 0

    }

    blastOff() {

        this.blastOffTimer++
        this.blastOffFrame = (this.blastOffTimer % 10) < 5 ? 0 : 1
        this.blastOffAngle += TAU / 100
        this.blastOffX += this.blastOffAngle * cos(this.blastOffAngle) * 1
        this.blastOffY += this.blastOffAngle * sin(this.blastOffAngle) * 1

        if ((this.blastOffX < -64 || this.blastOffX > SCREEN_WIDTH + 64) || (this.blastOffY < -64 || this.blastOffY > SCREEN_HEIGHT + 64)) {
            this.isBlastingOff = false
            this.drawTransition = true
            this.transitionRadius = 1
            this.transitionReversed = false
            preventClicking = false

            // add bunbon to credits screen
            blastedOffBunbon.pos = createVector(floor(random(0, WORLD_WIDTH)), floor(random(0, WORLD_HEIGHT)))
            planets[10].objects.push(blastedOffBunbon)
            blastedOffBunbon = null
        }

    }

    adjustOffset() {

        if (this.offsetX < 0) this.offsetX = 0
        if (this.offsetX >= SPACE_WIDTH - SCREEN_WIDTH) this.offsetX = SPACE_WIDTH - SCREEN_WIDTH
        if (this.offsetY < 0) this.offsetY = 0
        if (this.offsetY >= SPACE_HEIGHT - SCREEN_HEIGHT) this.offsetY = SPACE_HEIGHT - SCREEN_HEIGHT

    }

    draw() {

        push()
        translate(-this.offsetX, -this.offsetY)

        image(spaceBG, 0, 0)
        blendMode(LIGHTEST)
        starsBGs.forEach((_, i) => {
            starsBGOpacity[i] += random(0, 2 + i)
            if (starsBGOpacity[i] > 255) starsBGOpacity[i] = 0
            tint(255, (64 * i) + Math.abs(starsBGOpacity[i] - 128))
            image(starsBGs[i], 0, 0)
        })
        blendMode(BLEND)

        noTint()

        planets.forEach(planet => planet.drawConnections())
        planets.forEach(planet => planet.drawPlanet())
        
        pop()

        if (this.isBlastingOff) {
            this.blastOff()
            push()
            translate(this.blastOffX, this.blastOffY)
            rotate(this.blastOffAngle + TAU / 4)
            if (blastedOffBunbon) blastedOffBunbon.drawBlastOff(this.blastOffFrame)
            pop()
        }

        if (this.drawTransition) {
            noStroke()
            fill('#000')
            ellipse(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, this.transitionRadius, this.transitionRadius)

            this.transitionRadius += this.transitionReversed ? -30 : 30

            if (this.transitionRadius > SCREEN_WIDTH * 1.42) {
                this.transitionReversed = true
                if (lastPlanet) {
                    lastPlanet.unlockConnections()
                    lastPlanet = null
                }
            }

            if (this.transitionRadius < 1) {
                this.drawTransition = false
            }
        }

    }

    mousePressed(x, y) {

        this.oldOffsetX = this.offsetX
        this.oldOffsetY = this.offsetY

    }

    mouseDragged(x, y, dx, dy) {

        let distSquared = dx * dx + dy * dy
        if (distSquared >= 64) {
            this.offsetX = this.oldOffsetX + dx
            this.offsetY = this.oldOffsetY + dy
            this.adjustOffset()
        }

    }

    mouseReleased(x, y, dx, dy) {

        if (
            x >= muteButton.x && x < muteButton.x + muteButton.width &&
            y >= muteButton.y && y < muteButton.y + muteButton.height
        ) {
            MUTE = !MUTE
            if (MUTE) planetSoundtracks['space'].pause()
            else planetSoundtracks['space'].play()
            return
        }

        let distSquared = dx * dx + dy * dy
        if (distSquared < 64) {

            let relX = x + this.offsetX
            let relY = y + this.offsetY

            planets.forEach((planet, i) => {
                if (
                    relX >= planet.x - planet.radius &&
                    relX < planet.x + planet.radius &&
                    relY >= planet.y - planet.radius &&
                    relY < planet.y + planet.radius
                ) {
                    if (!MUTE) soundEffects['go-to-planet'].play()
                    openScreen('planet', i)
                }
            })

        }

    }

    keyPressed() {
    }
    
}