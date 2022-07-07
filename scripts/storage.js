class Storage extends ScreenState {

	constructor() {

		super()
		this.type = 'storage'
		this.index = 0

		this.slotCount = 24
		this.objects = (new Array(this.slotCount)).fill(null)
		this.selectedObjectIndex = -1

		this.x = 40
		this.y = 40
		this.width = 6
		this.height = 4
		this.slotWidth = 40
		this.slotHeight = 40

	}

	setup() {
	}

	open(planetIndex) {

		this.index = planetIndex

	}

	close() {
	}

	draw() {

		let x = mouseX / CANVAS_SCALE
		let y = mouseY / CANVAS_SCALE

		image(spaceButtonForStorageImg, 3, WORLD_HEIGHT + 3)

		if (
			x >= spaceButton.x && x < spaceButton.x + spaceButton.width &&
			y >= spaceButton.y && y < spaceButton.y + spaceButton.height
		) {
			image(planets[this.index].sprite, 4, SCREEN_HEIGHT - 30)
		} else {
			image(planets[this.index].sprite, 4, SCREEN_HEIGHT - 28)
		}

		image(storageBG, 0, 0)

		// draw each object
		this.objects.forEach((obj, i) => {
			let { slotX, slotY } = this.getSlotPos(i)
			if (obj) {
				if (obj.isBeingDragged) {
					obj.pos.x = x
					obj.pos.y = y + obj.height / 2
				} else {
					obj.pos.x = slotX + this.slotWidth / 2
					obj.pos.y = slotY + this.slotHeight / 2 + obj.height / 2
				}
				if (i === this.selectedObjectIndex && !obj.isBeingDragged) {
					image(selectedStorageSlotImg, slotX, slotY)
				}
				obj.draw()
			}
		})

		// draw selected object's name
		let selectedObject = this.objects[this.selectedObjectIndex]
		if (selectedObject && !selectedObject.isBeingDragged) {
			fill('#444')
			stroke('white')
			strokeWeight(1)
			let selectionX = floor(selectedObject.pos.x)
			let selectionY = floor(selectedObject.pos.y - selectedObject.height - 3)
			triangle(selectionX, selectionY + 2, selectionX - 3, selectionY - 4, selectionX + 3, selectionY - 4)
			strokeWeight(2)
			text(selectedObject.name, selectionX, selectionY - 5)
		}

		// draw upload button
		if (!this.isFull()) {
			image(uploadButtonImg, uploadButton.x, uploadButton.y)
		} else {
			image(disabledUploadButtonImg, uploadButton.x, uploadButton.y)
		}

		// draw download button
		if (selectedObject && selectedObject instanceof Bunbon) {
			image(downloadButtonImg, downloadButton.x, downloadButton.y)
		} else {
			image(disabledDownloadButtonImg, downloadButton.x, downloadButton.y)
		}

		// draw delete button
		if (selectedObject && !(selectedObject instanceof Bunbon)) {
			image(deleteButtonImg, deleteButton.x, deleteButton.y)
		} else {
			image(disabledDeleteButtonImg, deleteButton.x, deleteButton.y)
		}

	}

	mousePressed(x, y) {

		if (MODAL_OPEN) return

		this.objects.forEach((obj, i) => {
			let { slotX, slotY } = this.getSlotPos(i)
			if (
				x >= slotX && x < slotX + this.slotWidth &&
				y >= slotY && y < slotY + this.slotHeight
			) {
				if (obj) {
					this.selectedObjectIndex = i
				} else {
					this.selectedObjectIndex = -1
				}
			}
		})
		
	}

	mouseDragged(x, y, dx, dy) {

		if (MODAL_OPEN) return

		let selectedObject = this.objects[this.selectedObjectIndex]
		if (selectedObject) {
			let distSquared = dx * dx + dy * dy
			if (distSquared >= 64) {
				selectedObject.isBeingDragged = true
			}
		}

	}

	mouseReleased(x, y) {

		if (MODAL_OPEN) return

		let selectedObject = this.objects[this.selectedObjectIndex]
		if (selectedObject && selectedObject.isBeingDragged) {

			selectedObject.isBeingDragged = false

			if (
				x >= spaceButton.x && x < spaceButton.x + spaceButton.width &&
				y >= spaceButton.y && y < spaceButton.y + spaceButton.height
			) {

				this.putObjectInWorld(selectedObject)

			} else {

				this.objects.forEach((obj, i) => {
					if (!obj) {
						let { slotX, slotY } = this.getSlotPos(i)
						if (
							x >= slotX && x < slotX + this.slotWidth &&
							y >= slotY && y < slotY + this.slotHeight
						) {
							this.moveObject(selectedObject, this.selectedObjectIndex, i)
							this.selectedObjectIndex = i
						}
					}
				})

			}
				
		} else if (
			x >= uploadButton.x && x < uploadButton.x + uploadButton.width &&
			y >= uploadButton.y && y < uploadButton.y + uploadButton.height
		) {
			this.importMenu()

		} else if (
			x >= downloadButton.x && x < downloadButton.x + downloadButton.width &&
			y >= downloadButton.y && y < downloadButton.y + downloadButton.height
		) {
			let selectedObject = this.objects[this.selectedObjectIndex]
			if (selectedObject && selectedObject instanceof Bunbon) {
				downloadBunbon(selectedObject)
			}

		} else if (
			x >= deleteButton.x && x < deleteButton.x + deleteButton.width &&
			y >= deleteButton.y && y < deleteButton.y + deleteButton.height
		) {
			this.deleteObject()

		} else if (
			x >= spaceButton.x && x < spaceButton.x + spaceButton.width &&
			y >= spaceButton.y && y < spaceButton.y + spaceButton.height
		) {
			openScreen('planet', this.index)

		}

	}

	keyPressed() {

		if (key === 'm') {
			muteSounds()
		}

	}

	firstOpenSlotIndex() {

		let freeStorageSlotIndex = -1
    this.objects.forEach((obj, index) => {
        if (!obj && freeStorageSlotIndex === -1) freeStorageSlotIndex = index
    })
    return freeStorageSlotIndex

	}

	isFull() {

		return this.firstOpenSlotIndex() === -1

	}

	addObject(obj) {

		let slotIndex = this.firstOpenSlotIndex()
		if (slotIndex >= 0) {
			obj.isInInventory = true
			this.objects[slotIndex] = obj
			this.selectedObjectIndex = slotIndex
		}

	}

	moveObject(obj, oldSlotIndex, newSlotIndex) {

		if (!this.objects[newSlotIndex]) {
			this.objects[newSlotIndex] = obj
			this.objects[oldSlotIndex] = null
		}

	}

	deleteObject() {

		let obj = this.objects[this.selectedObjectIndex]
		if (obj && !(obj instanceof Bunbon)) {
			openModal('delete-modal')
			let modal = document.getElementById('delete-modal-contents')
			modal.innerHTML = `
				are you sure you want to delete this ${obj.name}?
				<br><br><br><br>
				<button id='confirm-delete'>yes</button>
				<br><br>
				<button onclick='closeModal();'>cancel</button>
			`

			document.getElementById('confirm-delete').onclick = () => {
				this.objects[this.selectedObjectIndex] = null
				saveState()
				closeModal()
			}

			document.getElementById('confirm-delete').focus()
		}

	}
	
	importMenu() {

		openModal('import-modal')
		let modal = document.getElementById('import-modal-contents')
		modal.innerHTML = `
			<button id='open-import-item'>import item</button>
			<br><br>
			<button id='open-import-bunbon'>import bunbon</button>
			<br><br><br><br>
			<button onclick='closeModal();'>cancel</button>
		`

		document.getElementById('open-import-item').onclick = () => {
			this.importItem()
		}

		document.getElementById('open-import-bunbon').onclick = () => {
			uploadBunbon()
		}

		document.getElementById('open-import-item').focus()

	}

	importItem() {

		openModal('import-item-modal')
		let modal = document.getElementById('import-item-modal-contents')
		modal.innerHTML = ''

		let addItem = itemName => {
			let imageEl = document.createElement('img')
			imageEl.width = 64
			imageEl.height = 64
			imageEl.alt = itemName
			let spriteIndex = foodList.includes(itemName) ? foodSprites[itemName] : toySprites[itemName]
			let itemSprite = baseSpritesheet.getSprite(spriteIndex)
			imageEl.src = itemSprite.canvas.toDataURL()
			let buttonEl = document.createElement('button')
			buttonEl.className = 'image-button'
			buttonEl.onclick = () => {
				let item = foodList.includes(itemName) ? new Food(this.randomPoint(), itemName) : new Toy(this.randomPoint(), itemName)
				this.addObject(item)
				saveState()
				closeModal()
			}
			buttonEl.appendChild(imageEl)
			modal.appendChild(buttonEl)
		}
		
		if (planets[0].isUnlocked) { // park
			addItem('bundoll')
			addItem('sandwich')
		}
		if (planets[1].isUnlocked) { // mossyforest
			addItem('mossball')
			addItem('mushrooms')
		}
		if (planets[2].isUnlocked) { // flowertown
			addItem('dancingflower')
			addItem('flowers')
		}
		if (planets[3].isUnlocked) { // volcano
			addItem('butterfly')
			addItem('dragonfruit')
		}
		if (planets[4].isUnlocked) { // bubbledome
			addItem('beachball')
			addItem('seaweed')
		}
		if (planets[5].isUnlocked) { // desert
			addItem('pullturtle')
			addItem('succulent')
		}
		if (planets[6].isUnlocked) { // snowymountain
			addItem('sled')
			addItem('icecream')
		}
		if (planets[7].isUnlocked) { // cloudland
			addItem('glider')
			addItem('dumplings')
		}
		if (planets[8].isUnlocked) { // crystalcave
			addItem('magicwand')
			addItem('rockcandy')
		}
		if (planets[9].isUnlocked) { // asteroid
			addItem('robot')
			addItem('juiceorb')
		}

		modal.appendChild(document.createElement('br'))
		modal.appendChild(document.createElement('br'))
		modal.appendChild(document.createElement('br'))
		modal.appendChild(document.createElement('br'))

		let cancelButtonEl = document.createElement('button')
		cancelButtonEl.innerText = 'cancel'
		cancelButtonEl.onclick = () => {
			document.getElementById('import-item-modal').className = 'modal'
		}
		modal.appendChild(cancelButtonEl)	

	}

	putObjectInWorld(obj) {

		if (obj) {
			this.objects[this.selectedObjectIndex] = null
			let planet = planets[this.index]
			planet.objects.push(obj)
			obj.isBeingDragged = false
			obj.isInInventory = false
			obj.pos = planet.randomPoint()
			obj.onDrop(planet.objects)
			openScreen('planet', this.index)
		}

	}

	getSlotPos(slotIndex) {

		let col = Math.floor(slotIndex % this.width)
		let row = Math.floor(slotIndex / this.width)
		let slotX = col * this.slotWidth + this.x
		let slotY = row * this.slotHeight + this.y
		return { slotX, slotY }

	}
	
}
