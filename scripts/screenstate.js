class ScreenState {
    
    constructor() {

        this.objects = []
        this.objectsInDrawOrder = []
        this.selectedBunbonIndex = -1

        this.originalX = 0
        this.originalY = 0
        this.draggedObject = null

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
        if (x < w / 2 || x >= WORLD_WIDTH - w / 2) return false
        if (y < h || y >= WORLD_HEIGHT) return false

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
            let x = floor(random(0, WORLD_WIDTH))
            let y = floor(random(0, WORLD_HEIGHT))
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

    fixObjectPosition(obj) {

        if (this.inventoryIsVisible) {
            obj.fixPosition(WORLD_WIDTH, WORLD_HEIGHT)
        } else {
            obj.fixPosition(SCREEN_WIDTH, SCREEN_HEIGHT)
        }

    }

    clickInWorld(x, y) {

        // check objects in world
        this.objects.forEach(obj => {
            if (obj.isOnPointer(x, y)) {
                this.draggedObject = obj
            }
        })

        // check objects in inventory
        if (!this.draggedObject && this.inventoryIsVisible && y >= WORLD_HEIGHT) {
            let slotIndex = this.getInventorySlotIndex(x, y)
            let inventoryObject = inventory.objects[slotIndex]
            if (inventoryObject && inventoryObject.isOnPointer(x, y)) {
                this.draggedObject = inventoryObject
            }
        }

        // remember original position
        if (this.draggedObject) {
            this.originalX = this.draggedObject.pos.x
            this.originalY = this.draggedObject.pos.y

            if (this.draggedObject instanceof Bunbon && !MUTE) {
                soundEffects['click-bunbon'].play()
            }
        }

    }

    dragObject(x, y, dx, dy) {

        if (this.draggedObject) {
            let posX = mouseX / CANVAS_SCALE
            let posY = mouseY / CANVAS_SCALE + this.draggedObject.height / 2
            let distSquared = dx * dx + dy * dy

            // move dragged object to cursor (unless petting bunbon)
            if (this.draggedObject.isBeingDragged || !(this.draggedObject instanceof Bunbon) || distSquared >= 1024) {
                isDragging = true
                this.draggedObject.isBeingDragged = true
                this.draggedObject.pos.x = posX
                this.draggedObject.pos.y = posY
                if (this.draggedObject instanceof Bunbon) {
                    if (soundEffects['click-bunbon'].isPlaying()) soundEffects['click-bunbon'].stop()
                    if (soundEffects['bunbon-pet'].isPlaying()) soundEffects['bunbon-pet'].stop()
                }
            }
        }

    }

    dropObject(x, y) {
        if (this.draggedObject) {

            isDragging = false
            let dropSucceeded = false

            if (this.inventoryIsVisible && y >= WORLD_HEIGHT) {

                // add to inventory
                let slotIndex = this.getInventorySlotIndex(x, y)
                if (!inventory.objects[slotIndex]) {
                    inventory.objects[slotIndex] = this.draggedObject
                    this.draggedObject.pos.x = inventory.slotXs[slotIndex]
                    this.draggedObject.pos.y = inventory.slotY + (this.draggedObject.height / 2)
                    dropSucceeded = true

                    // remove from inventory and world
                    if (this.draggedObject.isInInventory) {
                        let oldSlotIndex = this.getInventorySlotIndex(this.originalX, this.originalY)
                        inventory.objects[oldSlotIndex] = null
                    } else {
                        let objectIndex = this.objects.findIndex(obj => obj === this.draggedObject)
                        if (objectIndex >= 0) this.objects.splice(objectIndex, 1)
                        if (this.draggedObject instanceof Bunbon && objectIndex === this.selectedBunbonIndex) {
                            this.selectedBunbonIndex = -1
                        }
                    }

                    this.draggedObject.isInInventory = true

                }

            } else {
                
                // drop in world
                if (this.draggedObject.isBeingDragged &&
                    this.isPositionClear(this.draggedObject.pos.x, this.draggedObject.pos.y, this.draggedObject.width, this.draggedObject.height)
                ) {
                    this.fixObjectPosition(this.draggedObject)
                    this.draggedObject.onDrop(this.objects)
                    dropSucceeded = true

                    // remove from inventory
                    if (this.draggedObject.isInInventory) {
                        let oldSlotIndex = this.getInventorySlotIndex(this.originalX, this.originalY)
                        inventory.objects[oldSlotIndex] = null
                        this.draggedObject.isInInventory = false
                        let objectIndex = this.objects.findIndex(obj => obj === this.draggedObject)
                        if (objectIndex < 0) {
                            this.objects.push(this.draggedObject)
                        }
                    }

                } else if (!this.draggedObject.isBeingDragged) {
                    this.draggedObject.onPush()
                    if (this.draggedObject instanceof Bunbon) {
                        this.selectedBunbonIndex = this.objects.findIndex(obj => obj.name === this.draggedObject.name)
                        if (soundEffects['bunbon-pet'].isPlaying()) soundEffects['bunbon-pet'].stop()
                    }
                }

            }

            if (dropSucceeded) {
                this.draggedObject.onDrop(this.objects)
                if (!MUTE) soundEffects['drop-in-world'].play()
            } else {
                this.draggedObject.pos.x = this.originalX
                this.draggedObject.pos.y = this.originalY
            }
            
            this.draggedObject.isBeingDragged = false
            this.draggedObject = null
            saveState()
        }
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