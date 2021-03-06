/*

TODO:
- confetti on credits screen
- bunbon breeding mutations
- planet images/locations
- create loading screen
- sound effects
- bg music for each planet + space + credits
- bg for space view

BUGS:
- fix save & load: better saving strategy

*/

let DEBUG = false
let LOG_STORIES = true

let FRAME_RATE = 30

let MAX_ATTEMPTS = 100

let MUTATION_RATE = 0.1

let CANVAS_SCALE = 2

let SPACE_WIDTH = 640
let SPACE_HEIGHT = 480

let WORLD_WIDTH = 320
let WORLD_HEIGHT = 200
let WORLD_DIST = Math.sqrt(WORLD_WIDTH * WORLD_WIDTH + WORLD_HEIGHT * WORLD_HEIGHT)

let SCREEN_WIDTH = 320
let SCREEN_HEIGHT = 240

let inventory = {
    x: 40,
    y: WORLD_HEIGHT + 5,
    slotCount: 6,
    slotWidth: 40,
    width: 40 * 6,
    height: 32,
    objects: Array(6),
    slotXs: [ 60, 100, 140, 180, 220, 260 ],
    slotY: WORLD_HEIGHT + 21
} 

let spaceButton = {
    x: 4,
    y: WORLD_HEIGHT + 5,
    width: 32,
    height: 32
}

let blastOffButton = {
    x: WORLD_WIDTH - 36,
    y: WORLD_HEIGHT + 5,
    width: 32,
    height: 32
}

let lastX = 0
let lastY = 0
let startX = 0
let startY = 0
let mouseVelocity = 0
let isClicking = false
let isDragging = false
let preventClicking = false

let Vector = p5.Vector

let spritesheet, spritesheetImg, baseSpritesheet
let colorSpritesheets = {}

let userinterfaceImg, spaceButtonImg, spaceButtonForCreditsImg, heartImg
let scoreButtonImgs = []
let shadowImgs = {}
let bubbleImgs = {}

let blastedOffBunbons = []
let confirmingBlastOff = false

let spaceScreen = new Space()
let planets = []
let unlockedPlanetCount = 0

let planetBGs = {}
let planetMasks = {}

let creditsScreen = new Credits()

let currentScreen = spaceScreen
let lastPlanet = null

let bunbonCount = 0

let myFont

function openScreen(type, index, arg) {

    currentScreen.close()
    if (type === 'space') {
        currentScreen = spaceScreen
    } else if (type === 'planet') {
        currentScreen = planets[index]
    } else if (type === 'credits') {
        currentScreen = creditsScreen
    }
    currentScreen.open(index, arg)

}

function preload() {

    myFont = loadFont('fonts/UbuntuMono-Bold.woff')

    spritesheetImg = loadImage('images/spritesheet.png')
    userinterfaceImg = loadImage('images/userinterface.png')

    planetBGs = {
        mossyforest: loadImage('images/planets/mossyforest.png'),
        park: loadImage('images/planets/park.png'),
        volcano: loadImage('images/planets/volcano.png')
    }

    planetMasks = {
        mossyforest: loadImage('images/planets/mossyforest-mask.png'),
        park: loadImage('images/planets/park-mask.png'),
        volcano: loadImage('images/planets/volcano-mask.png')
    }

}

function setup() {

    frameRate(FRAME_RATE)

    createCanvas(SCREEN_WIDTH * 2, SCREEN_HEIGHT * 2)
    noSmooth()
    strokeCap(ROUND)
    strokeJoin(ROUND)
    strokeWeight(1)
    
    textFont(myFont)
    textSize(7)
    textAlign(CENTER, BASELINE)

    baseSpritesheet = new Spritesheet(spritesheetImg, 32, 32)
    Object.keys(bunbonColors).forEach(colorName => {
        colorSpritesheets[colorName] = new Spritesheet(spritesheetImg, 32, 32, colorName)
    })

    shadowImgs = {
        'small': baseSpritesheet.getSprite(42),
        'big': baseSpritesheet.getSprite(43),
        'small-jump': baseSpritesheet.getSprite(44),
        'big-jump': baseSpritesheet.getSprite(45)
    }

    bubbleImgs = {
        'dreambubble': baseSpritesheet.getSprite(15),
        'dreambubble-flipped': baseSpritesheet.getSprite(16, /* isFlipped */ true),
        'speechbubble': baseSpritesheet.getSprite(9),
        'speechbubble-flipped': baseSpritesheet.getSprite(9, /* isFlipped */ true),
        'thoughtbubble-food': baseSpritesheet.getSprite(10),
        'thoughtbubble-food-flipped': baseSpritesheet.getSprite(10, /* isFlipped */ true),
        'thoughtbubble-toy': baseSpritesheet.getSprite(11),
        'thoughtbubble-toy-flipped': baseSpritesheet.getSprite(11, /* isFlipped */ true),
        'thoughtbubble-friend': baseSpritesheet.getSprite(12),
        'thoughtbubble-friend-flipped': baseSpritesheet.getSprite(12, /* isFlipped */ true),
        'thoughtbubble-sleep': baseSpritesheet.getSprite(13),
        'thoughtbubble-sleep-flipped': baseSpritesheet.getSprite(14, /* isFlipped */ true)
    }

    heartImg = spritesheetImg.get(608, 0, 12, 10)
 
    spaceButtonImg = spritesheetImg.get(0, 606, 34, 34)
    spaceButtonForCreditsImg = spritesheetImg.get(34, 606, 34, 34)

    scoreButtonImgs = [
        baseSpritesheet.getSprite(260),
        baseSpritesheet.getSprite(261),
        baseSpritesheet.getSprite(262),
        baseSpritesheet.getSprite(263),
        baseSpritesheet.getSprite(264),
        baseSpritesheet.getSprite(265),
        baseSpritesheet.getSprite(266),
        baseSpritesheet.getSprite(267),
        baseSpritesheet.getSprite(268),
        baseSpritesheet.getSprite(269),
        baseSpritesheet.getSprite(270),
        baseSpritesheet.getSprite(271)
    ]

    spaceScreen.setup()
    let isLoadSuccessful = loadState()
    if (!isLoadSuccessful) {
        Object.keys(planetTypes).forEach(planetType => {
            planets.push(new Planet(planetType))
        })
        planets.forEach(planet => planet.setup())
        planets[0].isUnlocked = true
    }

    let unlockedPlanets = planets.filter(p => p.isUnlocked)
    unlockedPlanetCount = unlockedPlanets.length
    if (unlockedPlanetCount === 1) {
        openScreen('planet', unlockedPlanets[0].index)
    } else {
        openScreen('space', 0)
    }

}

function printDebugCommands() {
    console.log('DEBUG COMMANDS')
    console.log('p - pause')
    console.log('u - unlock planet\'s connections')
    console.log('h - hatch carried egg')
    console.log('a - make bunbon an adult')
    console.log('s - increase bunbon\'s score')
    console.log('b - make bunbon blast off')
    console.log('e - make bunbon lay egg')
    console.log('1 - make bunbon look for food')
    console.log('2 - make bunbon look for toy')
    console.log('3 - make bunbon look for friend')
    console.log('4 - make bunbon go to sleep')
}

function draw() {

    let dx = abs(mouseX - lastX)
    let dy = abs(mouseY - lastY)
    lastX = mouseX
    lastY = mouseY
    mouseVelocity = (mouseVelocity + sqrt(dx * dx + dy * dy)) / 2

    clear()
    scale(CANVAS_SCALE)
    currentScreen.draw()

}

// TODO: this might be fixed in new version?
function touchStarted() {

    // duplicating mousePressed here because p5js has a bug in it
    if (preventClicking) return

    let x = mouseX / CANVAS_SCALE
    let y = mouseY / CANVAS_SCALE

    startX = x
    startY = y

    if (x >= 0 && y >= 0 && x < SCREEN_WIDTH && y < SCREEN_HEIGHT) {
        currentScreen.mousePressed(x, y)
        isClicking = true
    }

}

function mousePressed() {

    if (preventClicking) return

    let x = mouseX / CANVAS_SCALE
    let y = mouseY / CANVAS_SCALE

    startX = x
    startY = y
    
    if (x >= 0 && y >= 0 && x < SCREEN_WIDTH && y < SCREEN_HEIGHT) {
        currentScreen.mousePressed(x, y)
        isClicking = true
    }

}

function mouseDragged() {

    if (!isClicking) return

    let x = mouseX / CANVAS_SCALE
    let y = mouseY / CANVAS_SCALE

    if (x < 0) x = 0
    if (x >= SCREEN_WIDTH) x = SCREEN_WIDTH - 1
    if (y < 0) y = 0
    if (y >= SCREEN_HEIGHT) y = SCREEN_HEIGHT - 1

    let dx = startX - x
    let dy = startY - y

    currentScreen.mouseDragged(x, y, dx, dy)

}

function mouseReleased() {

    if (!isClicking) return

    let x = mouseX / CANVAS_SCALE
    let y = mouseY / CANVAS_SCALE

    if (x < 0) x = 0
    if (x >= SCREEN_WIDTH) x = SCREEN_WIDTH - 1
    if (y < 0) y = 0
    if (y >= SCREEN_HEIGHT) y = SCREEN_HEIGHT - 1

    let dx = startX - x
    let dy = startY - y

    currentScreen.mouseReleased(x, y, dx, dy)
    isClicking = false

}

function keyPressed() {

    currentScreen.keyPressed()

}

function saveState() {

    // let data = {
    //     planets: planets.map(p => p.export()),
    //     inventoryObjects: inventoryObjects.map(o => o ? o.export() : null)
    // }
    // try {
    //     dataString = JSON.stringify(data)
    //     window.localStorage.setItem('bunbons', dataString)
    // } catch(e) {
    //     if (DEBUG) console.error('unable to save', e)
    // }

}

function loadState() {

    // try {
    //     let dataString = window.localStorage.getItem('bunbons')
    //     let data = dataString ? JSON.parse(dataString) : null
    //     if (data) {
    //         if (data.planets) planets = data.planets.map(p => Planet.import(p))
    //         if (data.inventoryObjects) inventoryObjects = data.inventoryObjects.map(o => GameObject.import(o))
    //         return true
    //     } else {
    //         throw 'bad data'
    //     }
    // } catch(e) {
    //     if (DEBUG) console.error('unable to load:', e)
    // }

}

// TODO: move this into Planet code
// function exportBunbon() {
//     if (!(currentScreen instanceof Planet)) return

//     if (selectedObject && selectedObject instanceof Bunbon) {
//         console.log('~ exporting ' + selectedObject.name + ' ~')
//         let data = selectedObject.export()
//         try {
//             let dataString = JSON.stringify(data)
//             console.log(dataString)
//         } catch(e) {
//             console.error('unable to export:', e)
//         }
//     }
// }

// function importBunbon(dataString) {
//     if (!(currentScreen instanceof Planet)) return

//     try {
//         let data = dataString ? JSON.parse(dataString) : null
//         if (data) {
//             if (data.type === 'bunbon') {
//                 console.log('~ importing ' + data.name + ' ~')
//                 let newBunbon = Bunbon.import(data)
//                 currentScreen.objects.push(newBunbon)
//                 // todo: load the bunbon in a random valid location
//             }
//         } else {
//             throw 'bad data'
//         }
//     } catch(e) {
//         console.error('unable to import:', e)
//     }
// }