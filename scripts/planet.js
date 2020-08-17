class Planet {
    constructor(index, connectedPlanets = [], startUnlocked = false) {
        this.index = index
        this.isUnlocked = startUnlocked
        this.connectedPlanets = connectedPlanets
    }

    setup() {
        this.radius = floor(random(8, 16))
        this.color = random(['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'magenta', 'pink'])
        this.x = floor(random(this.radius, SPACE_WIDTH - this.radius))
        this.y = floor(random(this.radius, SPACE_HEIGHT - this.radius))

        this.objects = []
        this.objects.push(new BunBon())
        this.objects.push(new BunBon())
        this.objects.push(new BunBon())
        this.objects.push(new Food())
        this.objects.push(new Food())
        this.objects.push(new Food())
        this.objects.push(new Toy())
        this.objects.push(new Toy())
        this.objects.push(new Toy())
        this.objects.push(new Egg())

        let maxConnections = 3
        let numConnections = floor(random(1, maxConnections + 1)) - this.connectedPlanets.length
        for (let i = 0; i < numConnections; i++) {
            let connectionFound = false
            let planetsTried = 0
            while(!connectionFound) {
                let connection = floor(random(planets.length))
                let connectedPlanet = planets[connection]
                if (connection === this.index) {
                    // do nothing
                }
                else if (connectedPlanet.connectedPlanets.includes[this.index]) {
                    connectionFound = true
                }
                else if (connectedPlanet.connectedPlanets.length < maxConnections) {
                    connectionFound = true
                    connectedPlanet.connectedPlanets.push(this.index)
                    this.connectedPlanets.push(connection)
                }
                else if (planetsTried > 100) {
                    connectionFound = true
                }
                else {
                    planetsTried++
                }
            }
        }
    }

    open() {
        if (DEBUG) console.log('open planet', this.index)
        selectedBunbon = null
        selectedObject = null
        gameObjects = this.objects
        planetBG = planetBGs[this.index]
        planetMask = planetMasks[this.index]
    }

    close() {
        if (DEBUG) console.log('close planet', this.index)
        this.objects = gameObjects.slice()
        gameObjects = null
    }

    unlockConnections() {
        this.goToSpace = true
        this.connectedPlanets.forEach(i => {
            let connectedPlanet = planets[i]
            connectedPlanet.isUnlocked = true
        })
    }

    drawConnections() {
        if (!this.isUnlocked) return

        stroke('#999')
        this.connectedPlanets.forEach(i => {
            let connectedPlanet = planets[i]
            line(this.x, this.y, connectedPlanet.x, connectedPlanet.y)
            if (!connectedPlanet.isUnlocked) {
                ellipse(connectedPlanet.x, connectedPlanet.y, connectedPlanet.radius * 2, connectedPlanet.radius * 2)
            }
        })
    }

    drawPlanet() {
        if (!this.isUnlocked) return

        let bunbons = this.objects.filter(o => o instanceof BunBon)

        push()

        translate(this.x, this.y)
        noStroke()
        fill(this.color)
        ellipse(0, 0, this.radius * 2, this.radius * 2)

        let bunbonSpacing = 11
        translate(-(bunbonSpacing / 2) * (bunbons.length - 1), -this.radius - 6)
        bunbons.forEach((bunbon, i) => {
            bunbon.drawIcon(i * bunbonSpacing, 0)
        })

        pop()
    }

    draw() {
        // sort game objects by y coordinate, so 'closer' ones are drawn on top of 'farther' ones
        gameObjects.sort((a, b) => {
            if (a.pos.y < b.pos.y) return -1
            if (a.pos.y > b.pos.y) return 1
            return 0
        })

        // draw background
        image(planetBG, 0, 0)

        // draw inventory
        noStroke()
        fill('#eee')
        rect(0, WORLD_HEIGHT, SCREEN_WIDTH, SCREEN_WIDTH - WORLD_HEIGHT)
        fill('white')
        rect(inventory.x, inventory.y, inventory.width, inventory.height)
        inventoryObjects.forEach(obj => {
            obj.draw()
        })

        // draw bunbon stats
        if (selectedBunbon) {
            selectedBunbon.drawScore()
            if (DEBUG) selectedBunbon.drawStatOrb()
        }

        // draw button
        noStroke()
        fill('black')
        rect(spaceButton.x, spaceButton.y, spaceButton.width, spaceButton.height)

        // update and draw game objects
        gameObjects.forEach(obj => {
            obj.update()
            obj.draw()
        })

        // clean up objects
        gameObjects = gameObjects.filter(obj => !obj.removeMe)

        // go to space
        if (this.goToSpace) {
            this.goToSpace = false
            openScreen('space', this.index, true)
        }
    }

    mousePressed(x, y) {
        selectedObject = null

        if (y < WORLD_HEIGHT) {
            // click in world
            gameObjects.forEach(obj => {
                if (obj.isOnPointer(x, y)) {
                    selectedObject = obj
                    if (selectedObject instanceof BunBon) selectedBunbon = obj
                }
            })
        }
        else if (isInInventory(x, y)) {
            let slot = getInventorySlot(x, y)
            if (inventoryObjects[slot]) {
                // click in inventory
                selectedObject = inventoryObjects[slot]
                if (selectedObject instanceof BunBon) selectedBunbon = selectedObject

                delete inventoryObjects[slot]
                gameObjects.push(selectedObject)
                selectedObject.isInInventory = false
            }
        }
    }

    mouseDragged(x, y, dx, dy) {
        if (selectedObject && selectedObject.isDraggable) {
            let distSquared = dx * dx + dy * dy
            let dragDist = min(selectedObject.width, selectedObject.height)
            if (distSquared >= dragDist * dragDist) {

                isDragging = true
        
                if (y >= WORLD_HEIGHT) {
                    let slot = getInventorySlot(x, y)
                    if (!inventoryObjects[slot]) {
                        selectedObject.pos.x = inventorySlotX(slot)
                        selectedObject.pos.y = inventorySlotY(slot) + (selectedObject.height / 2)
                    }
                } else {
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

    mouseReleased(x, y, dx, dy) {
        isDragging = false

        if (selectedObject && selectedObject.isDraggable) {
            if (y >= WORLD_HEIGHT) {
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
        }
        else {
            if (
                x >= spaceButton.x && x < spaceButton.x + spaceButton.width &&
                y >= spaceButton.y && y < spaceButton.y + spaceButton.height
            ) {
                openScreen('space')
            }
            else if (
                selectedBunbon && selectedBunbon.canBlastOff &&
                x >= blastOffButton.x && x < blastOffButton.x + blastOffButton.width &&
                y >= blastOffButton.y && y < blastOffButton.y + blastOffButton.height
            ) {
                selectedBunbon.startBlastOff()
            }
        }
    }

    keyPressed() {
        if (key === '~') {
            DEBUG = !DEBUG
            if (DEBUG) console.log('~ DEBUG MODE ON ~')
            else console.log('~ DEBUG MODE OFF ~')
        }
        
        else if (DEBUG && key === ' ') {
            this.isPaused = !this.isPaused
            if (this.isPaused) noLoop()
            else loop()
        }

        else if (DEBUG && key === 'p') {
            this.unlockConnections()
        }

        else if (DEBUG && selectedBunbon) {
            if (key === '1') {
                selectedBunbon.pickFarGoal('food')
            }
            else if (key === '2') {
                selectedBunbon.pickFarGoal('toy')
            }
            else if (key === '3') {
                selectedBunbon.pickFarGoal('friend')
            }
            else if (key === '4') {
                selectedBunbon.pickFarGoal('sleep')
            }
            else if (key === 'a') {
                selectedBunbon.isBaby = !selectedBunbon.isBaby
            }
            else if (key === 's') {
                selectedBunbon.score += 60
                selectedBunbon.score = min(selectedBunbon.score, selectedBunbon.maxScore)
            }
            else if (key === 'b') {
                selectedBunbon.startBlastOff()
            }
            else if (key === 'e') {
                selectedBunbon.layEgg()
            }
        }
    }
}