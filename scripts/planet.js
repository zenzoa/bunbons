let planetTypes = {
    'park': {
        index: 0,
        x: 320,
        y: 240,
        connectedPlanets: [1],
        color: 'pink' // TEMP
    },
    'mossyforest': {
        index: 1,
        x: 420,
        y: 200,
        connectedPlanets: [0, 2],
        color: 'green' // TEMP
    },
    'volcano': {
        index: 2,
        x: 520,
        y: 300,
        connectedPlanets: [1,3],
        color: 'red' // TEMP
    },
    'credits': {
        index: 3,
        x: 560,
        y: 100,
        connectedPlanets: [2],
        color: 'yellow' // TEMP
    }
}

class Planet extends ScreenState {

    constructor(type, startUnlocked = false) {

        super()

        let planetType = planetTypes[type]

        this.name = type
        this.index = planetType.index
        this.x = planetType.x
        this.y = planetType.y
        this.connectedPlanets = planetType.connectedPlanets
        this.color = planetType.color // TEMP

        this.isUnlocked = startUnlocked

        this.inventoryIsVisible = true

    }

    setup() {

        // setup icon
        this.radius = floor(random(8, 16)) // TEMP

        // skip if this planet opens credits screen
        if (this.name === 'credits') return

        // setup bg + collision mask
        this.mask = planetMasks[this.name]
        this.mask.loadPixels()
        this.background = planetBGs[this.name]

        // place objects
        this.objects = []
        if (this.name === 'park') {
            this.objects.push(new Toy(this.randomPoint()))
            this.objects.push(new Food(this.randomPoint()))
            this.objects.push(new Egg(this.randomPoint()))
            this.objects.push(new Egg(this.randomPoint()))
            this.objects.push(new Egg(this.randomPoint()))
        } else if (this.name === 'mossyforest') {
            this.objects.push(new Toy(this.randomPoint()))
            this.objects.push(new Food(this.randomPoint()))
            this.objects.push(new Egg(this.randomPoint()))
        } else if (this.name === 'volcano') {
            this.objects.push(new Toy(this.randomPoint()))
            this.objects.push(new Food(this.randomPoint()))
            this.objects.push(new Egg(this.randomPoint()))
        }

    }

    open() {

        this.isBlastingOff = false
        unlockedPlanetCount = planets.filter(p => p.isUnlocked).length

        planetSoundtracks[this.name].play()

    }

    close() {

        saveState()

        planetSoundtracks[this.name].stop()

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

        let bunbonCount = this.objects.filter(o => o instanceof Bunbon).length
        let bunbonSpacing = 11
        translate(-(bunbonSpacing / 2) * (bunbonCount - 1), -this.radius - 6)

        let i = 0
        this.objects.forEach(obj => {
            if (obj instanceof Bunbon) {
                obj.drawIcon(i * bunbonSpacing, 0)
                i++
            }
        })

        pop()

    }

    draw() {

        // draw background
        image(this.background, 0, 0)

        // draw user interface
        image(userinterfaceImg, 0, 0)
        if (unlockedPlanetCount > 1) {
            image(spaceButtonImg, 3, WORLD_HEIGHT + 3)
        }

        // draw inventory
        inventory.objects.forEach(obj => {
            if (obj) obj.draw()
        })

        // draw bunbon stats
        let selectedBunbon = this.objects[this.selectedBunbonIndex]
        if (selectedBunbon && selectedBunbon instanceof Bunbon) {
            let normalizedScore = selectedBunbon.score / selectedBunbon.maxScore
            let scoreImageIndex = floor(normalizedScore * 10)
            if (confirmingBlastOff) {
                scoreImageIndex = 11
            } else if (!selectedBunbon.canBlastOff || bunbonCount < 3) {
                scoreImageIndex = Math.min(scoreImageIndex, 9)
            }
            image(scoreButtonImgs[scoreImageIndex], WORLD_WIDTH - 40, WORLD_HEIGHT + 4)
            if (DEBUG) selectedBunbon.drawStatOrb()
        }

        // update and draw game objects
        let objectsToCleanUp = []
        this.sortGameObjectsByPos()
        this.objectsInDrawOrder.forEach(objectIndex => {
            let obj = this.objects[objectIndex]
            if (!obj.isInInventory) obj.update()
            obj.draw()
            if (obj.removeMe) objectsToCleanUp.push(objectIndex)
        })

        // clean up objects
        if (objectsToCleanUp.length > 0) {
            objectsToCleanUp.forEach(objectIndex => {
                this.objects.splice(objectIndex, 1)
                if (this.selectedObjectIndex === objectIndex) this.selectedObjectIndex = -1
                if (this.selectedBunbonIndex === objectIndex) this.selectedBunbonIndex = -1
                if (this.selectedObjectIndex > objectIndex) this.selectedObjectIndex--
                if (this.selectedBunbonIndex > objectIndex) this.selectedBunbonIndex--
            })
        }

        // go to space
        if (this.goToSpace) {
            this.goToSpace = false
            openScreen('space', this.index, true)
        }

    }

    mousePressed(x, y) {

        if (y < WORLD_HEIGHT) {
            this.clickInWorld(x, y)
        } else if (
            x >= inventory.x && x < inventory.x + inventory.width &&
            y >= inventory.y && y < inventory.y + inventory.height
        ) {
            this.clickInInventory(x, y)
        }

    }

    mouseDragged(x, y, dx, dy) {

        this.dragObject(x, y, dx, dy)

    }

    mouseReleased(x, y, dx, dy) {

        let interactedWithObject = this.dropObject(x, y, dx, dy)

        if (!interactedWithObject) {

            let selectedBunbon = this.objects[this.selectedBunbonIndex]

            if (
                unlockedPlanetCount > 1 &&
                x >= spaceButton.x && x < spaceButton.x + spaceButton.width &&
                y >= spaceButton.y && y < spaceButton.y + spaceButton.height
            ) {
                openScreen('space')
            } else if (
                selectedBunbon && selectedBunbon.canBlastOff && bunbonCount >= 3 &&
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

        if (key === '~') {
            DEBUG = !DEBUG
            if (DEBUG) {
                console.log('~ DEBUG MODE ON ~')
                printDebugCommands()
            } else {
                console.log('~ DEBUG MODE OFF ~')
            }

        } else if (DEBUG) {

            let selectedBunbon = this.objects[this.selectedBunbonIndex]
            let selectedObject = this.objects[this.selectedObjectIndex]

            if (key === 'u') {
                this.unlockConnections()
            } else if (key === 'c') {
                openScreen('credits')
            } else if (key === 'p') {
                this.isPaused = !this.isPaused
                if (this.isPaused) noLoop()
                else loop()
            } else if (key === '1' && selectedBunbon) {
                selectedBunbon.pickFarGoal('food')
            } else if (key === '2' && selectedBunbon) {
                selectedBunbon.pickFarGoal('toy')
            } else if (key === '3' && selectedBunbon) {
                selectedBunbon.pickFarGoal('friend')
            } else if (key === '4' && selectedBunbon) {
                selectedBunbon.pickFarGoal('sleep')
            } else if (key === 'a' && selectedBunbon) {
                selectedBunbon.isBaby = !selectedBunbon.isBaby
            } else if (key === 's' && selectedBunbon) {
                selectedBunbon.score += 60
                selectedBunbon.score = min(selectedBunbon.score, selectedBunbon.maxScore)
            } else if (key === 'b' && selectedBunbon) {
                this.isBlastingOff = true
                selectedBunbon.startBlastOff()
            } else if (key === 'e' && selectedBunbon) {
                selectedBunbon.layEgg()
            } else if (key === 'h') {
                if (selectedObject instanceof Egg) selectedObject.hatch()
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
            objects: this.objects.map(o => o.export()).filter(o => !!o)
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