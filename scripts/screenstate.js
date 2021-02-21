class ScreenState {
    constructor() {
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

    clickInWorld(x, y) {
        gameObjects.forEach(obj => {
            if (obj.isOnPointer(x, y)) {
                selectedObject = obj
                if (selectedObject instanceof BunBon) selectedBunbon = obj
            }
        })
    }

    clickInInventory(x, y) {
        let slot = getInventorySlot(x, y)
        if (inventoryObjects[slot]) {
            // click in inventory
            selectedObject = inventoryObjects[slot]
            if (selectedObject instanceof BunBon) selectedBunbon = selectedObject
            inventoryObjects[slot] = null
            gameObjects.push(selectedObject)
        }
    }

    dragObject(x, y, dx, dy, includeInventory) {
        if (selectedObject && selectedObject.isDraggable) {
            let distSquared = dx * dx + dy * dy
            if (!(selectedObject instanceof BunBon) || distSquared >= 1024) {

                isDragging = true
                selectedObject.isBeingDragged = true

                if (includeInventory && y >= WORLD_HEIGHT) {
                    let slot = getInventorySlot(x, y)
                    if (!inventoryObjects[slot]) {
                        selectedObject.pos.x = inventorySlotX(slot)
                        selectedObject.pos.y = inventorySlotY(slot) + (selectedObject.height / 2)
                    }
                }
                
                else {
                    // move object in world
                    let posX = mouseX / CANVAS_SCALE
                    let posY = mouseY / CANVAS_SCALE + selectedObject.height / 2
                    if (isPointPassable(posX, posY)) {
                        selectedObject.pos.x = posX
                        selectedObject.pos.y = posY
                        boundPosition(selectedObject)
                    }
                }
            }
        }
    }

    dropObject(x, y, dx, dy, includeInventory) {
        isDragging = false

        if (selectedObject && selectedObject.isBeingDragged) {
            selectedObject.isBeingDragged = false

            if (includeInventory && y >= WORLD_HEIGHT) {
                let slot = getInventorySlot(x, y)
                if (!inventoryObjects[slot]) {
                    // add object to inventory
                    inventoryObjects[slot] = selectedObject
                    gameObjects = gameObjects.filter(obj => obj !== selectedObject)
                    selectedObject.isInInventory = true
                    selectedObject.inventorySlot = slot
                    selectedObject.pos.x = inventorySlotX(slot)
                    selectedObject.pos.y = inventorySlotY(slot) + (selectedObject.height / 2)
                    if (selectedObject === selectedBunbon) selectedBunbon = null
                    selectedObject = null
                }
            }
            
            else {
                selectedObject.isInInventory = false
                boundPosition(selectedObject)
                let distSquared = dx * dx + dy * dy
                let dragDist = min(selectedObject.width, selectedObject.height)
                if (distSquared < dragDist * dragDist) {
                    // clicked object
                    if (selectedObject instanceof Toy) {
                        selectedObject.onPush()
                    }
                } else {
                    // dragged and dropped object
                    selectedObject.onDrop()
                }

            }

            return true

        } else {
            return false
        }
    }

    sortGameObjects() {
        gameObjects.sort((a, b) => {
            if (a.pos.y < b.pos.y) return -1
            if (a.pos.y > b.pos.y) return 1
            return 0
        })
    }
}