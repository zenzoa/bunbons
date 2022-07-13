let foodSprites = {
	'mushrooms': 180,
	'dumplings': 181,
	'juiceorb': 182,
	'flowers': 183,
	'dragonfruit': 184,
	'rockcandy': 185,
	'icecream': 186,
	'sandwich': 187,
	'seaweed': 188,
	'succulent': 189
}

let foodList = ['mushrooms', 'dumplings', 'juiceorb', 'flowers', 'dragonfruit', 'rockcandy', 'icecream', 'sandwich', 'seaweed', 'succulent']

class Food extends GameObject {

	constructor(pos, name) {

		super(24, 24)

		// temp
		let foodType = name || random(Object.keys(foodSprites))
		let foodSpriteIndex = foodSprites[foodType]

		this.name = foodType
		this.pos = createVector(pos.x, pos.y)

		this.offsetX = -4
		this.offsetY = -8

		this.isRefilling = false
		this.refillLength = 1200
		this.refillTimer = 0

		this.driveReduction = 60

		this.spriteImgs = [
			baseSpritesheet.getSprite(foodSpriteIndex),
			baseSpritesheet.getSprite(foodSpriteIndex + 20)
		]

	}

	onPush(agent) {

		if (agent) {
			this.refillTimer = 0
			this.isRefilling = true
		} else if (this.isRefilling) {
			this.refillTimer += floor(this.refillLength / 3)
		}

		if (!agent) {
			playSound('click-food')
		}

	}

	update() {

		if (this.isBeingDragged) return

		if (this.isRefilling) {
			this.refillTimer++
			if (this.refillTimer >= this.refillLength) {
				this.isRefilling = false
			}
		}

	}

	draw() {

		push()
		translate(floor(this.pos.x), floor(this.pos.y))
		if (this.isFlipped) scale(-1.0, 1.0)

		let x = floor(-(this.width / 2) + this.offsetX)
		let y = floor(-this.height + this.offsetY)

		if (!this.isInInventory && !this.isBeingDragged) {
			if (this.name === 'mushrooms') {
				image(shadowImgs.big, x, y + 1)
			} else if (this.name === 'dumplings') {
				image(shadowImgs.big, x, y + 1)
			} else if (this.name === 'juiceorb') {
				image(shadowImgs.small, x, y + 1)
			} else if (this.name === 'flowers') {
				image(shadowImgs.small, x, y - 2)
			} else if (this.name === 'dragonfruit') {
				image(shadowImgs.small, x, y + 1)
			} else if (this.name === 'rockcandy') {
				image(shadowImgs.small, x + 1, y + 1)
			} else if (this.name === 'icecream') {
				image(shadowImgs.small, x, y + 1)
			} else if (this.name === 'sandwich') {
				image(shadowImgs.big, x, y)
			} else if (this.name === 'seaweed') {
				image(shadowImgs.big, x, y + 1)
			} else if (this.name === 'succulent') {
				image(shadowImgs.big, x, y + 1)
			}
		}

		if (this.isRefilling) {
			image(this.spriteImgs[1], x, y)
		} else {
			image(this.spriteImgs[0], x, y)
		}

		pop()

		// draw debug lines
		if (DEBUG) {
			noFill()
			stroke('lightblue')
			rect(this.pos.x + x - this.offsetX, this.pos.y + y - this.offsetY, this.width, this.height)
		}

	}

	export() {

		let data = {
			type: 'food',
			name: this.name,
			x: this.pos.x,
			y: this.pos.y,
			isRefilling: this.isRefilling,
			refillTimer: this.refillTimer,
			isInInventory: this.isInInventory
		}
		return data

	}

	static importFood(data) {

		let newFood = new Food({ x: data.x, y: data.y }, data.name)
		newFood.isRefilling = data.isRefilling
		newFood.refillTimer = data.refillTimer
		newFood.isInInventory = data.isInInventory
		return newFood

	}

}