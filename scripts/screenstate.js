class ScreenState {
    
    constructor() {

        this.objects = []
        this.objectsInDrawOrder = []
        this.selectedObjectIndex = -1
        this.selectedBunbonIndex = -1

        this.inventoryIsVisible = false

        this.mask = null
        this.background = null

    }

    setup() {
    }

    open() {
    }

    close() {
    }

    draw() {
    }

    mousePressed() {
    }

    mouseDragged() {
    }

    mouseReleased() {
    }

    keyPressed() {
    }

    isPositionClear(x, y, w = 0, h = 0) {

        x = floor(x)
        y = floor(y)

        // out of bounds
        if (this.inventoryIsVisible) {
            if (x < w / 2 || x >= WORLD_WIDTH - w / 2) return false
            if (y < h || y >= WORLD_HEIGHT + h / 2) return false
        } else {
            if (x < w / 2 || x >= SCREEN_WIDTH - w / 2) return false
            if (y < h || y >= SCREEN_HEIGHT + h / 2) return false
        }

        // collides with world geometry
        if (this.mask) {
            let pixelIndex = 4 * (y * WORLD_WIDTH + x)
            let pixelValue = this.mask.pixels[pixelIndex]
            if (pixelValue < 128) return false
        }
    
        return true

    }

    randomPoint() {

        let pos = null
        let attempts = 0
        while (!pos && attempts < MAX_ATTEMPTS) {
            let maxX = this.inventoryIsVisible ? WORLD_WIDTH : SCREEN_WIDTH
            let maxY = this.inventoryIsVisible ? WORLD_HEIGHT : SCREEN_HEIGHT
            let x = floor(random(0, maxX))
            let y = floor(random(0, maxY))
            if (this.isPositionClear(x, y)) {
                pos = createVector(x, y)
            }
            attempts++
        }
        return pos
    
    }

    getInventorySlotIndex(x) {

        return min(max(floor((x - inventory.x) / inventory.slotWidth), 0), inventory.slotCount - 1)

    }

    clickInWorld(x, y) {

        this.objects.forEach((obj, objectIndex) => {
            if (obj.isOnPointer(x, y)) {
                this.selectedObjectIndex = objectIndex
                if (this.objects[this.selectedObjectIndex] instanceof Bunbon) {
                    this.selectedBunbonIndex = objectIndex
                    if (!MUTE) soundEffects['click-bunbon'].play()
                }
            }
        })

    }

    clickInInventory(x, y) {

        let slotIndex = this.getInventorySlotIndex(x, y)
        let inventoryObject = inventory.objects[slotIndex]
        if (inventoryObject) {

            this.objects.push(inventoryObject)
            this.selectedObjectIndex = this.objects.length - 1
            inventory.objects[slotIndex] = null

            if (this.objects[this.selectedObjectIndex] instanceof Bunbon) {
                this.selectedBunbonIndex = this.selectedObjectIndex
            }

        }

    }

    addObjectToInventory(slotIndex) {

        if (!inventory.objects[slotIndex]) {

            let selectedObject = this.objects[this.selectedObjectIndex]

            if (selectedObject) {
                // add object to inventory slot
                inventory.objects[slotIndex] = selectedObject

                // remove object from objects
                this.objects.splice(this.selectedObjectIndex, 1)

                // set properties of object to being in inventory
                selectedObject.isInInventory = true
                selectedObject.pos.x = inventory.slotXs[slotIndex]
                selectedObject.pos.y = inventory.slotY + (selectedObject.height / 2)

                // de-select object
                if (this.selectedBunbonIndex === this.selectedObjectIndex) {
                    this.selectedBunbonIndex = -1
                }
                this.selectedObjectIndex = -1

                // save game
                saveState()
            }  

        }

    }

    fixObjectPosition(obj) {

        if (this.inventoryIsVisible) {
            obj.fixPosition(WORLD_WIDTH, WORLD_HEIGHT)
        } else {
            obj.fixPosition(SCREEN_WIDTH, SCREEN_HEIGHT)
        }

    }

    dragObject(x, y, dx, dy) {

        let selectedObject = this.objects[this.selectedObjectIndex]
        if (selectedObject && selectedObject.isDraggable) {

            let distSquared = dx * dx + dy * dy
            if (!(selectedObject instanceof Bunbon) || distSquared >= 1024) {

                isDragging = true
                selectedObject.isBeingDragged = true

                if (this.inventoryIsVisible && y >= WORLD_HEIGHT) {

                    let slotIndex = this.getInventorySlotIndex(x, y)
                    if (!inventory.objects[slotIndex]) {
                        selectedObject.pos.x = inventory.slotXs[slotIndex]
                        selectedObject.pos.y = inventory.slotY + (selectedObject.height / 2)
                    }

                } else {

                    let posX = mouseX / CANVAS_SCALE
                    let posY = mouseY / CANVAS_SCALE + selectedObject.height / 2
                    if (this.isPositionClear(posX, posY, selectedObject.width, selectedObject.height)) {
                        selectedObject.pos.x = posX
                        selectedObject.pos.y = posY
                        this.fixObjectPosition(selectedObject)
                    }

                }

            }

        }

    }

    dropObject(x, y, dx, dy) {

        isDragging = false

        let interactedWithObject = false
        let selectedObject = this.objects[this.selectedObjectIndex]

        if (selectedObject) {

            interactedWithObject = true

            if (selectedObject.isBeingDragged || selectedObject.isInInventory) {

                selectedObject.isBeingDragged = false

                if (this.inventoryIsVisible && y >= WORLD_HEIGHT) {

                    let slotIndex = this.getInventorySlotIndex(x, y)
                    this.addObjectToInventory(slotIndex)
                    if (!MUTE) soundEffects['drop-in-inventory'].play()

                } else {

                    selectedObject.isInInventory = false
                    this.fixObjectPosition(selectedObject)
                    let distSquared = dx * dx + dy * dy
                    let dragDist = min(selectedObject.width, selectedObject.height)
                    if (distSquared >= dragDist * dragDist) {
                        // dragged and dropped object
                        selectedObject.onDrop(this.objects)

                        // save game
                        saveState()

                        if (!MUTE) soundEffects['drop-in-world'].play()
                    }

                }

            } else if (!selectedObject.isInInventory) {
                // clicked object
                selectedObject.onPush()
            }

        }

        this.selectedObjectIndex = -1
        return interactedWithObject

    }

    sortGameObjectsByPos() {

        this.objectsInDrawOrder = this.objects.map((_, i) => i)
        this.objectsInDrawOrder.sort((aIndex, bIndex) => {
            let a = this.objects[aIndex]
            let b = this.objects[bIndex]
            if (a.pos.y < b.pos.y) return -1
            if (a.pos.y > b.pos.y) return 1
            return 0
        })

    }

}