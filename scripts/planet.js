let planetTypes = {
    'park': {
        index: 0,
        x: 100,
        y: 240,
        connectedPlanets: [1],
        spriteIndex: 300
    },
    'mossyforest': {
        index: 1,
        x: 150,
        y: 240,
        connectedPlanets: [0, 2],
        spriteIndex: 301,
    },
    'flowertown': {
        index: 2,
        x: 200,
        y: 240,
        connectedPlanets: [1, 3],
        spriteIndex: 302
    },
    'volcano': {
        index: 3,
        x: 250,
        y: 240,
        connectedPlanets: [2, 4, 5],
        spriteIndex: 303
    },
    'bubbledome': {
        index: 4,
        x: 300,
        y: 140,
        connectedPlanets: [3, 6],
        spriteIndex: 304
    },
    'desert': {
        index: 5,
        x: 300,
        y: 340,
        connectedPlanets: [3, 6],
        spriteIndex: 305
    },
    'snowymountain': {
        index: 6,
        x: 350,
        y: 240,
        connectedPlanets: [4, 5, 7],
        spriteIndex: 306
    },
    'cloudland': {
        index: 7,
        x: 400,
        y: 240,
        connectedPlanets: [6, 8],
        spriteIndex: 307
    },
    'crystalcave': {
        index: 8,
        x: 450,
        y: 240,
        connectedPlanets: [7, 9],
        spriteIndex: 308
    },
    'asteroid': {
        index: 9,
        x: 500,
        y: 240,
        connectedPlanets: [8, 10],
        spriteIndex: 309
    },
    'credits': {
        index: 10,
        x: 550,
        y: 240,
        connectedPlanets: [9],
        spriteIndex: 310
    }
}

class Planet extends ScreenState {

    constructor(type, startUnlocked = false) {

        super()

        let planetType = planetTypes[type]

        this.name = type
        this.type = 'planet'
        this.index = planetType.index
        this.x = planetType.x
        this.y = planetType.y
        this.radius = 16
        this.connectedPlanets = planetType.connectedPlanets
        this.color = planetType.color // TEMP

        this.isUnlocked = startUnlocked

        this.inventoryIsVisible = true

        this.bunbonCount = 0
        this.bunbonHasBlastedOffHere = false

    }

    setup(objects) {

        // setup icon
        let spriteIndex = planetTypes[this.name].spriteIndex
        this.sprite = baseSpritesheet.getSprite(spriteIndex)

        // skip if this planet opens credits screen
        if (this.name === 'credits') return

        // setup bg + collision mask
        this.mask = planetMasks[this.name]
        this.mask.loadPixels()
        this.background = planetBGs[this.name]

        // place objects
        if (objects) {

            this.objects = objects

        } else {

            this.objects = []

            if (this.name === 'mossyforest') {
                this.objects.push(new Toy(this.randomPoint(), 'mossball'))
                this.objects.push(new Food(this.randomPoint(), 'mushrooms'))
                this.objects.push(new Egg(this.randomPoint(), 'deer'))

            } else if (this.name === 'cloudland') {
                this.objects.push(new Toy(this.randomPoint(), 'glider'))
                this.objects.push(new Food(this.randomPoint(), 'dumplings'))
                this.objects.push(new Egg(this.randomPoint(), 'alicorn'))

            } else if (this.name === 'asteroid') {
                this.objects.push(new Toy(this.randomPoint(), 'robot'))
                this.objects.push(new Food(this.randomPoint(), 'juiceorb'))
                this.objects.push(new Egg(this.randomPoint(), 'alien'))

            } else if (this.name === 'flowertown') {
                this.objects.push(new Toy(this.randomPoint(), 'dancingflower'))
                this.objects.push(new Food(this.randomPoint(), 'flowers'))
                this.objects.push(new Egg(this.randomPoint(), 'bee'))

            } else if (this.name === 'volcano') {
                this.objects.push(new Toy(this.randomPoint(), 'butterfly'))
                this.objects.push(new Food(this.randomPoint(), 'dragonfruit'))
                this.objects.push(new Egg(this.randomPoint(), 'leafcat'))

            } else if (this.name === 'crystalcave') {
                this.objects.push(new Toy(this.randomPoint(), 'magicwand'))
                this.objects.push(new Food(this.randomPoint(), 'rockcandy'))
                this.objects.push(new Egg(this.randomPoint(), 'snail'))

            } else if (this.name === 'snowymountain') {
                this.objects.push(new Toy(this.randomPoint(), 'sled'))
                this.objects.push(new Food(this.randomPoint(), 'icecream'))
                this.objects.push(new Egg(this.randomPoint(), 'sheep'))

            } else if (this.name === 'park') {
                this.objects.push(new Toy(this.randomPoint(), 'bundoll'))
                this.objects.push(new Food(this.randomPoint(), 'sandwich'))
                this.objects.push(new Egg(this.randomPoint(), 'intro'))
                this.objects.push(new Egg(this.randomPoint(), 'intro'))
                this.objects.push(new Egg(this.randomPoint(), 'intro'))

            } else if (this.name === 'bubbledome') {
                this.objects.push(new Toy(this.randomPoint(), 'beachball'))
                this.objects.push(new Food(this.randomPoint(), 'seaweed'))
                this.objects.push(new Egg(this.randomPoint(), 'fish'))

            } else if (this.name === 'desert') {
                this.objects.push(new Toy(this.randomPoint(), 'pullturtle'))
                this.objects.push(new Food(this.randomPoint(), 'succulent'))
                this.objects.push(new Egg(this.randomPoint(), 'lizard'))
            }
        }

    }

    open() {

        this.isBlastingOff = false
        unlockedPlanetCount = planets.filter(p => p.isUnlocked).length

        if (!MUTE) planetSoundtracks[this.name].play()

    }

    close() {

        planetSoundtracks[this.name].stop()

    }

    blastOff() {

        this.goToSpace = true
        lastPlanet = this

        this.bunbonHasBlastedOffHere = true

    }

    unlockConnections() {

        this.connectedPlanets.forEach(i => {
            let connectedPlanet = planets[i]
            connectedPlanet.isUnlocked = true
        })

    }

    drawConnections() {

        if (!this.isUnlocked) return

        fill('#625465')
        stroke('#625465')
        strokeWeight(0.5)
        this.connectedPlanets.forEach(i => {
            let connectedPlanet = planets[i]
            line(this.x, this.y, connectedPlanet.x, connectedPlanet.y)
            if (!connectedPlanet.isUnlocked) {
                ellipse(connectedPlanet.x, connectedPlanet.y, 8, 8)
            }
        })

    }

    drawPlanet() {

        if (!this.isUnlocked) return

        push()

        translate(this.x, this.y)
        image(this.sprite, -16, -16)

        let bunbonList = this.objects.filter(o => o instanceof Bunbon)
        let numBunbons = bunbonList.length
        let numRows = ceil(numBunbons / 4)
        let bunbonSpacing = 11
        translate(-(bunbonSpacing / 2) * 3, -22)

        bunbonList.forEach((b, i) => {
            let row = floor(i / 4) + 1
            let offsetX = (row === numRows ? (row * 4 - numBunbons) * 5.5 : 0)
            b.drawIcon((i % 4) * bunbonSpacing + offsetX, (numRows - row) * -12)
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

        // draw mute button
        if (MUTE) image(unmuteButtonImg, 4, 4)
        else image(muteButtonImg, 4, 4)

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
                scoreImageIndex = 12
            } else if (selectedBunbon.canBlastOff(this)) {
                scoreImageIndex = 11
            } else if (selectedBunbon.reachedBestScore) {
                scoreImageIndex = 10
            }
            image(scoreButtonImgs[scoreImageIndex], WORLD_WIDTH - 36, WORLD_HEIGHT + 4)
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

        this.bunbonCount = this.objects.filter(o => o instanceof Bunbon).length

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
            if (!(selectedBunbon instanceof Bunbon)) {
                selectedBunbon = null
            }

            if (
                unlockedPlanetCount > 1 &&
                x >= spaceButton.x && x < spaceButton.x + spaceButton.width &&
                y >= spaceButton.y && y < spaceButton.y + spaceButton.height
            ) {
                if (!MUTE) soundEffects['go-to-space'].play()
                openScreen('space', this.index)
            } else if (
                x >= muteButton.x && x < muteButton.x + muteButton.width &&
                y >= muteButton.y && y < muteButton.y + muteButton.height
            ) {
                MUTE = !MUTE
                if (MUTE) planetSoundtracks[this.name].pause()
                else planetSoundtracks[this.name].play()
            } else if (
                selectedBunbon && selectedBunbon.canBlastOff(this) && bunbonCount >= 3 &&
                x >= blastOffButton.x && x < blastOffButton.x + blastOffButton.width &&
                y >= blastOffButton.y && y < blastOffButton.y + blastOffButton.height
            ) {
                if (confirmingBlastOff) {
                    if (!MUTE) soundEffects['click-launch-2'].play()
                    this.isBlastingOff = true
                    confirmingBlastOff = false
                    selectedBunbon.startBlastOff()
                } else {
                    if (!MUTE) soundEffects['click-launch-1'].play()
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
                openScreen('space', this.index)
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
            } else if (key === 'h') {
                if (selectedObject instanceof Egg) selectedObject.hatch()
            }

        }

    }

    export() {

        let data = {
            name: this.name,
            isUnlocked: this.isUnlocked,
            bunbonHasBlastedOffHere: this.bunbonHasBlastedOffHere,
            objects: this.objects.map(o => o.export())
        }
        return data

    }

    static import(data) {

        let newPlanet = new Planet(data.name)
        newPlanet.isUnlocked = data.isUnlocked
        newPlanet.bunbonHasBlastedOffHere = data.bunbonHasBlastedOffHere
        newPlanet.objects = data.objects.map(o => GameObject.import(o))
        return newPlanet

    }

}