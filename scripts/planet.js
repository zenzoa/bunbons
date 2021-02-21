class Planet extends ScreenState {
    constructor(index, name, connectedPlanets = [], startUnlocked = false) {
        super()

        if (DEBUG) console.log('create planet', index, name)
        this.index = index
        this.name = name
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
        if (DEBUG) console.log('open planet', this.index, this.name)
        selectedBunbon = null
        selectedObject = null
        gameObjects = this.objects
        planetBG = planetBGs[this.name]
        planetMask = planetMasks[this.name]
        this.isBlastingOff = false
        unlockedPlanetCount = planets.filter(p => p.isUnlocked).length
    }

    close() {
        if (DEBUG) console.log('close planet', this.index, this.name)
        saveState()
        this.objects = gameObjects.slice()
        gameObjects = null
    }

    blastOff() {
        this.goToSpace = true
        lastPlanet = this
    }

    unlockConnections() {
        this.connectedPlanets.forEach(i => {
            let connectedPlanet = planets[i]
            connectedPlanet.isUnlocked = true
        })
    }

    drawConnections() {
        if (!this.isUnlocked) return

        stroke('#999')
        strokeWeight(1)
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

        push()

        translate(this.x, this.y)
        noStroke()
        fill(this.color)
        ellipse(0, 0, this.radius * 2, this.radius * 2)

        let bunbonCount = this.objects.filter(o => o instanceof BunBon).length
        let bunbonSpacing = 11
        translate(-(bunbonSpacing / 2) * (bunbonCount - 1), -this.radius - 6)

        let i = 0
        this.objects.forEach(obj => {
            if (obj instanceof BunBon) {
                obj.drawIcon(i * bunbonSpacing, 0)
                i++
            }
        })

        pop()
    }

    draw() {
        // sort game objects by y coordinate, so 'closer' ones are drawn on top of 'farther' ones
        this.sortGameObjects()

        // draw background
        image(planetBG, 0, 0)

        // draw user interface
        image(userinterfaceImg, 0, 0)
        if (unlockedPlanetCount > 1) {
            image(spaceButtonImg, 3, WORLD_HEIGHT + 3)
        }

        // draw inventory
        inventoryObjects.forEach(obj => {
            if (obj) obj.draw()
        })

        // draw bunbon stats
        if (selectedBunbon) {
            let normalizedScore = selectedBunbon.score / selectedBunbon.maxScore
            let scoreImageIndex = floor(normalizedScore * 10)
            if (confirmingBlastOff) scoreImageIndex = 11
            image(baseSpritesheet.get(scoreImageIndex + 260), WORLD_WIDTH - 40, WORLD_HEIGHT + 4)
            if (DEBUG) selectedBunbon.drawStatOrb()
        }

        // update and draw game objects
        let cleanUpObjects = false
        gameObjects.forEach(obj => {
            if (!obj.isInInventory) obj.update() // obj should only be in gameObjects with isInInventory = true when dragging from inventory
            obj.draw()
            if (obj.removeMe) cleanUpObjects = true
        })

        // clean up objects
        if (cleanUpObjects) {
            gameObjects = gameObjects.filter(obj => !obj.removeMe)
        }

        // go to space
        if (this.goToSpace) {
            this.goToSpace = false
            openScreen('space', this.index, true)
        }
    }

    mousePressed(x, y) {
        selectedObject = null
        if (y < WORLD_HEIGHT) {
            this.clickInWorld(x, y)
        }
        else if (isInInventory(x, y)) {
            this.clickInInventory(x, y)
        }
    }

    mouseDragged(x, y, dx, dy) {
        this.dragObject(x, y, dx, dy, true)
    }

    mouseReleased(x, y, dx, dy) {
        let objectWasDropped = this.dropObject(x, y, dx, dy, true)
        if (!objectWasDropped) {

            if (
                unlockedPlanetCount > 1 &&
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
                if (confirmingBlastOff) {
                    this.isBlastingOff = true
                    confirmingBlastOff = false
                    selectedBunbon.startBlastOff()
                } else {
                    confirmingBlastOff = true
                }
            }

            else {
                confirmingBlastOff = false
            }
        }
    }

    keyPressed() {
        if (keyIsDown(CONTROL) && key === '~') {
            DEBUG = !DEBUG
            if (DEBUG) console.log('~ DEBUG MODE ON ~')
            else console.log('~ DEBUG MODE OFF ~')
        }

        else if (DEBUG && key === 'u') {
            this.unlockConnections()
        }

        else if (DEBUG && key === 'p') {
            this.isPaused = !this.isPaused
            if (this.isPaused) noLoop()
            else loop()
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
                this.isBlastingOff = true
                selectedBunbon.startBlastOff()
            }
            else if (key === 'e') {
                selectedBunbon.layEgg()
            }
        }
    }

    export() {
        let data = {
            index: this.index,
            name: this.name,
            isUnlocked: this.isUnlocked,
            connectedPlanets: this.connectedPlanets,
            radius: this.radius,
            color: this.color,
            x: this.x,
            y: this.y,
            objects: gameObjects.map(o => o.export()).filter(o => !!o)
        }
        return data
    }

    static import(data) {
        let newPlanet = new Planet(data.index, data.name, data.connectedPlanets, data.isUnlocked)
        newPlanet.radius = data.radius
        newPlanet.color = data.color
        newPlanet.x = data.x
        newPlanet.y = data.y
        newPlanet.objects = data.objects.map(o => GameObject.import(o)).filter(o => !!o)
        return newPlanet
    }
}