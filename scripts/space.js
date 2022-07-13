class Space extends ScreenState {

	constructor() {

		super()
		this.type = 'space'
		this.index = 0

	}

	setup() {

		this.offsetX = 0
		this.offsetY = 0

		this.isBlastingOff = false
		this.blastOffX = 0
		this.blastOffY = 0

		this.drawTransition = false
		this.transitionRadius = 0

	}

	open(planetIndex, showBlastOff) {

		this.drawTransition = false

		let planet = planets[planetIndex]
		if (planet) {
			this.offsetX = planet.x - SCREEN_WIDTH / 2
			this.offsetY = planet.y - SCREEN_HEIGHT / 2
			this.adjustOffset()
			if (showBlastOff) {
				this.startBlastOff(planet.x - this.offsetX, planet.y - this.offsetY)
			}
		}

		playMusic('space')

	}

	close() {

		stopMusic('space')

	}

	startBlastOff(x, y) {

		this.isBlastingOff = true
		this.blastOffTimer = 0
		this.blastOffX = x
		this.blastOffY = y
		this.blastOffAngle = 0

		// unlock connections from last planet
		if (lastPlanet) lastPlanet.unlockConnections()

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
			preventClicking = false
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

			this.transitionRadius += 30

			if (this.transitionRadius > SCREEN_WIDTH * 1.42) {
				if (lastPlanet && blastedOffBunbon) {
					// get next planet
					let nextPlanetIndex = min(lastPlanet.index + 1, 10)
					if (lastPlanet.index === 3) nextPlanetIndex = random([4, 5])
					let nextPlanet = planets[nextPlanetIndex]

					// add bunbon to next planet
					blastedOffBunbon.removeMe = false
					blastedOffBunbon.state = null
					blastedOffBunbon.pos = nextPlanet.randomPoint()
					blastedOffBunbon.hasBlastedOffBefore = true
					planets[10].objects.push(blastedOffBunbon)
					blastedOffBunbon = null

					// open next planet
					nextPlanet.drawTransition = true
					nextPlanet.transitionRadius = this.transitionRadius
					openScreen('planet', nextPlanetIndex)

					lastPlanet = null
				}
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
			if (MUTE) stopMusic('space')
			else playMusic('space')
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
					relY < planet.y + planet.radius &&
					planet.isUnlocked
				) {
					playSound('go-to-planet')
					openScreen('planet', i)
				}
			})

		}

	}

	keyPressed() {
		if (key === 'm') {
			toggleMute()
		}
	}

}