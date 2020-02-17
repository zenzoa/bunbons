class Space {
    setup() {
        this.offsetX = 0
        this.offsetY = 0

        this.isBlastingOff = false
        this.blastOffX = 0
        this.blastOffY = 0
    }

    open(planetIndex, showBlastOff) {
        if (!isNaN(planetIndex)) {
            let planet = planets[planetIndex]
            this.offsetX = planet.x - SCREEN_WIDTH / 2
            this.offsetY = planet.y - SCREEN_HEIGHT / 2
            this.adjustOffset()
            if (showBlastOff) {
                this.startBlastOff(planet.x - this.offsetX, planet.y - this.offsetY)
            }
        }
    }

    close() {}

    startBlastOff(x, y) {
        this.isBlastingOff = true
        this.blastOffTimer = 0
        this.blastOffX = x
        this.blastOffY = y
        this.blastOffAngle = 0
    }

    blastOff() {
        this.blastOffTimer++
        this.blastOffAngle += TAU / 24
        this.blastOffX += this.blastOffAngle * cos(this.blastOffAngle) * 5
        this.blastOffY += this.blastOffAngle * sin(this.blastOffAngle) * 5
        if (this.blastOffX > SCREEN_WIDTH && this.blastOffY > SCREEN_HEIGHT) {
            this.isBlastingOff = false
        }
    }

    adjustOffset() {
        if (this.offsetX < 0) this.offsetX = 0
        if (this.offsetX >= SPACE_WIDTH - SCREEN_WIDTH) this.offsetX = SPACE_WIDTH - SCREEN_WIDTH
        if (this.offsetY < 0) this.offsetY = 0
        if (this.offsetY >= SPACE_HEIGHT - SCREEN_HEIGHT) this.offsetY = SPACE_HEIGHT - SCREEN_HEIGHT
    }

    draw() {
        noStroke()
        fill('#222')
        rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

        push()
        translate(-this.offsetX, -this.offsetY)
        planets.forEach(planet => planet.drawConnections())
        planets.forEach(planet => planet.drawPlanet())
        pop()

        if (this.isBlastingOff) {
            this.blastOff()
            push()
            translate(this.blastOffX, this.blastOffY)
            rotate(this.blastOffAngle)
            fill('white')
            rect(0, 0, 10, 10)
            pop()
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
                    openScreen('planet', i)
                }
            })

        }
    }

    keyPressed() {
        if (DEBUG && key === 'b') {
            this.startBlastOff()
        }
    }
}