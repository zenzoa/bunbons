class BunbonBuilder extends ScreenState {

	constructor() {

		super()
		this.type = 'builder'
		
		this.colorList = Object.keys(bunbonColors)
		this.colorIndex = 0
		this.secondaryColorIndex = 0
		
		this.earList = Object.keys(bunbonEars)
		this.earIndex = 0
		this.earsUsePrimaryColor = false

		this.tailList = Object.keys(bunbonTails)
		this.tailIndex = 0
		this.tailUsesPrimaryColor = false
		
		this.backList = Object.keys(bunbonBacks)
		this.backIndex = 0
		
		this.headList = Object.keys(bunbonHeads)
		this.headIndex = 0
		
		this.patternList = Object.keys(bunbonPatterns)
		this.patternIndex = 0
		
		this.faceList = Object.keys(bunbonFaces)
		this.faceIndex = 0

		this.frameIndex = 0

		this.sprite = null
		this.outlineSprite = null

	}

	setup() {

		this.randomizeBunbon()
		this.updateBunbonSprite()

	}

	open(planetIndex) {

		this.index = planetIndex
		textAlign(LEFT, BASELINE)

	}

	close() {

		textAlign(CENTER, BASELINE)

	}

	randomizeBunbon() {

		this.colorIndex = floor(random(0, this.colorList.length))
		this.secondaryColorIndex = floor(random(0, this.colorList.length))
		this.earindex = floor(random(0, this.earList.length))
		this.earsUsePrimaryColor = random([true, false])
		this.tailIndex = floor(random(0, this.tailList.length))
		this.tailUsesPrimaryColor = random([true, false])
		this.backIndex = floor(random(0, this.backList.length))
		this.headIndex = floor(random(0, this.headList.length))
		this.patternIndex = floor(random(0, this.patternList.length))
		this.faceIndex = floor(random(0, this.faceList.length))

	}

	createBunbonSprite(animationFrame, isOutline) {

		this.color = this.colorList[this.colorIndex]
		this.secondaryColor = this.colorList[this.secondaryColorIndex]
		this.ears = this.earList[this.earIndex]
		this.tail = this.tailList[this.tailIndex]
		this.back = this.backList[this.backIndex]
		this.head = this.headList[this.headIndex]
		this.pattern = this.patternList[this.patternIndex]
		this.face = this.faceList[this.faceIndex]

		let bodySprite = (animationFrame === 0 ? bunbonBodies[0] : bunbonBodies[1]) + (isOutline ? 10 : 0)
		let patternSprite = bunbonPatterns[this.pattern] + (animationFrame === 0 ? 0 : 20) + (isOutline ? 10 : 0)
		let earsSprite = bunbonEars[this.ears] + (isOutline ? 10 : 0)
		let tailSprite = bunbonTails[this.tail] + (isOutline ? 10 : 0)
		let backSprite = bunbonBacks[this.back] + (isOutline ? 10 : 0)
		let headSprite = bunbonHeads[this.head] + (isOutline ? 10 : 0)
		let faceSprite = bunbonFaces[this.face]

		let primaryColorSpritesheet = colorSpritesheets[this.color]
		let secondaryColorSpritesheet = colorSpritesheets[this.secondaryColor]
		let patternSpritesheet = this.pattern === 'fluff' ? primaryColorSpritesheet : secondaryColorSpritesheet
		let earsSpritesheet = this.earsUsePrimaryColor ? primaryColorSpritesheet : secondaryColorSpritesheet
		let tailSpritesheet = (this.tailUsesPrimaryColor || this.tail === 'slug') ? primaryColorSpritesheet : secondaryColorSpritesheet

		let x = 8
		let y = 8
		let tailX = x - 1
		let decorationY = animationFrame === 0 ? y : y + 2

		let spriteImg = createImage(48, 48)
		primaryColorSpritesheet.copySprite(spriteImg, bodySprite, x, y)
		if (this.pattern !== 'none') patternSpritesheet.copySprite(spriteImg, patternSprite, x, y)
		if (this.tail !== 'none') tailSpritesheet.copySprite(spriteImg, tailSprite, tailX, decorationY)
		if (this.back !== 'none') secondaryColorSpritesheet.copySprite(spriteImg, backSprite, x, decorationY)
		if (this.ears !== 'none') earsSpritesheet.copySprite(spriteImg, earsSprite, x, decorationY)
		if (this.head !== 'none') secondaryColorSpritesheet.copySprite(spriteImg, headSprite, x, decorationY)
		primaryColorSpritesheet.copySprite(spriteImg, faceSprite, x, decorationY)
		
		return spriteImg

	}

	updateBunbonSprite() {

		this.sprite = this.createBunbonSprite(this.frameIndex, false)
		this.outlineSprite = this.createBunbonSprite(this.frameIndex, true)

	}

	draw() {

		noStroke()
		fill('#000')
		rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

		fill('#ddd')
		text(`[1] color 1: ${this.color}`, 10, 10)
		text(`[2] color 2: ${this.secondaryColor}`, 10, 20)
		text(`[3] ears: ${this.ears}`, 10, 30)
		text(`[9] ears use ${this.earsUsePrimaryColor ? 'color 1' : 'color 2'}`, 80, 30)
		text(`[4] tail: ${this.tail}`, 10, 40)
		text(`[0] tail uses ${this.tailUsesPrimaryColor ? 'color 1' : 'color 2'}`, 80, 40)
		text(`[5] back: ${this.back}`, 10, 50)
		text(`[6] head: ${this.head}`, 10, 60)
		text(`[7] pattern: ${this.pattern}`, 10, 70)
		text(`[8] face: ${this.face}`, 10, 80)
		text(`[f] frame: ${this.frameIndex}`, 10, 90)
		text(`[r] randomize`, 10, 100)

		let x = floor(SCREEN_WIDTH / 2) - 16
		let y = floor(SCREEN_HEIGHT / 2) - 16
		image(this.outlineSprite, x, y)
		image(this.sprite, x, y)

	}

	keyPressed() {

		if (keyCode === ESCAPE) {
			openScreen('planet', this.index)
		} else if (key === '1') {
			this.colorIndex++
			if (this.colorIndex >= this.colorList.length) this.colorIndex = 0
		} else if (key === '2') {
			this.secondaryColorIndex++
			if (this.secondaryColorIndex >= this.colorList.length) this.secondaryColorIndex = 0
		} else if (key === '3') {
			this.earIndex++
			if (this.earIndex >= this.earList.length) this.earIndex = 0
		} else if (key === '4') {
			this.tailIndex++
			if (this.tailIndex >= this.tailList.length) this.tailIndex = 0
		} else if (key === '5') {
			this.backIndex++
			if (this.backIndex >= this.backList.length) this.backIndex = 0
		} else if (key === '6') {
			this.headIndex++
			if (this.headIndex >= this.headList.length) this.headIndex = 0
		} else if (key === '7') {
			this.patternIndex++
			if (this.patternIndex >= this.patternList.length) this.patternIndex = 0
		} else if (key === '8') {
			this.faceIndex++
			if (this.faceIndex >= this.faceList.length) this.faceIndex = 0
		} else if (key === '9') {
			this.earsUsePrimaryColor = !this.earsUsePrimaryColor
		} else if (key === '0') {
			this.tailUsesPrimaryColor = !this.tailUsesPrimaryColor
		} else if (key === 'f') {
			this.frameIndex = (this.frameIndex === 0 ? 1 : 0)
		} else if (key === 'r') {
			this.randomizeBunbon()
		}

		this.updateBunbonSprite()
			
	}

}
