let DEBUG = false
let LOG_STORIES = true

let MUTE = false

let FRAME_RATE = 30

let MAX_ATTEMPTS = 100

let MUTATION_RATE = 0.02

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

let muteButton = {
    x: 4,
    y: 4,
    width: 16,
    height: 16
}

let blastOffButton = {
    x: WORLD_WIDTH - 36,
    y: WORLD_HEIGHT + 5,
    width: 32,
    height: 32
}

let soundEffects = {}
let soundEffectNames = {
    'go-to-planet': 'cancel4',
    'go-to-space': 'button4',
    'drop-in-world': 'standup',
    'drop-in-inventory': 'enter15',
    'click-launch-1': 'kokextu',
    'click-launch-2': 'cutin',
    'bunbon-blastoff': 'hissatu',
    'click-bunbon': 'kagu',
    'click-toy': 'kagu',
    'click-food': 'kagu',
    'push-egg': 'kagu',
    'egg-hatch': 'youchu',
    'bunbon-jump': 'katakumu',
    'bunbon-rest': 'sigh2',
    'bunbon-sleep': 'sleep',
    'bunbon-eat': 'peropero',
    'bunbon-play': 'jump',
    'bunbon-chat-1': 'chat1',
    'bunbon-chat-2': 'chat2',
    'bunbon-chat-3': 'chat3',
    'bunbon-chat-4': 'chat4',
    'bunbon-chat-5': 'chat5',
    'bunbon-pet': 'purr',
    'bunbon-breed': 'riftup2',
    'bunbon-think-sleep': 'sigh',
    'bunbon-think-food': 'guuuu',
    'bunbon-think-toy': 'ubau',
    'bunbon-think-friend': 'hatena'
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

let userinterfaceImg, spaceButtonImg, muteButtonImg, unmuteButtonImg, spaceButtonForCreditsImg, heartImg
let scoreButtonImgs = []
let shadowImgs = {}
let bubbleImgs = {}

let blastedOffBunbons = []
let confirmingBlastOff = false

let spaceScreen = new Space()
let planets = []
let unlockedPlanetCount = 0

let spaceBG = null
let starsBGs = []
let starsBGOpacity = [0, 64]
let planetBGs = {}
let planetMasks = {}

let planetSoundtracks = {}

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

    // save game
    saveState()

}

function preload() {

    myFont = loadFont('fonts/UbuntuMono-Bold.woff')

    soundFormats('mp3')

    let makeSoundtrack = (fileName) => {
        let newSoundtrack = loadSound(fileName)
        newSoundtrack.setLoop(true)
        newSoundtrack.setVolume(0.02)
        return newSoundtrack
    }

    planetSoundtracks = {
        mossyforest: makeSoundtrack('music/the_great_tree'),
        cloudland: makeSoundtrack('music/hidden_grotto'),
        asteroid: makeSoundtrack('music/village_of_the_peeping_frogs'),
        flowertown: makeSoundtrack('music/roots'),
        volcano: makeSoundtrack('music/in_the_branches'),
        crystalcave: makeSoundtrack('music/home_departure'),
        snowymountain: makeSoundtrack('music/sunset_over_the_treetops'),
        park: makeSoundtrack('music/streamside_hotel'),
        bubbledome: makeSoundtrack('music/bug_band'),
        desert: makeSoundtrack('music/rainy_ascent'),
        space: makeSoundtrack('music/shoots'),
        credits: makeSoundtrack('music/overgrown_labyrinth')
    }

    Object.keys(soundEffectNames).forEach(soundEffectName => {
        let newSoundEffect = loadSound('sounds/' + soundEffectNames[soundEffectName])
        newSoundEffect.setVolume(0.2)
        soundEffects[soundEffectName] = newSoundEffect
    })

    spritesheetImg = loadImage('images/spritesheet.png')
    userinterfaceImg = loadImage('images/userinterface.png')

    spaceBG = loadImage('images/space.png')
    starsBGs = [
        loadImage('images/stars1.png'),
        loadImage('images/stars2.png')
    ]

    planetBGs = {
        mossyforest: loadImage('images/planets/mossyforest.png'),
        cloudland: loadImage('images/planets/cloudland.png'),
        asteroid: loadImage('images/planets/asteroid.png'),
        flowertown: loadImage('images/planets/flowertown.png'),
        volcano: loadImage('images/planets/volcano.png'),
        crystalcave: loadImage('images/planets/crystalcave.png'),
        snowymountain: loadImage('images/planets/snowymountain.png'),
        park: loadImage('images/planets/park.png'),
        bubbledome: loadImage('images/planets/bubbledome.png'),
        desert: loadImage('images/planets/desert.png'),
        space: null,
        credits: null
    }

    planetMasks = {
        mossyforest: loadImage('images/planets/mossyforest-mask.png'),
        cloudland: loadImage('images/planets/cloudland-mask.png'),
        asteroid: loadImage('images/planets/asteroid-mask.png'),
        flowertown: loadImage('images/planets/flowertown-mask.png'),
        volcano: loadImage('images/planets/volcano-mask.png'),
        crystalcave: loadImage('images/planets/crystalcave-mask.png'),
        snowymountain: loadImage('images/planets/snowymountain-mask.png'),
        park: loadImage('images/planets/park-mask.png'),
        bubbledome: loadImage('images/planets/bubbledome-mask.png'),
        desert: loadImage('images/planets/desert-mask.png')
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
        'dreambubble-flipped': baseSpritesheet.getSprite(16),
        'speechbubble': baseSpritesheet.getSprite(9),
        'thoughtbubble-food': baseSpritesheet.getSprite(10),
        'thoughtbubble-toy': baseSpritesheet.getSprite(11),
        'thoughtbubble-friend': baseSpritesheet.getSprite(12),
        'thoughtbubble-sleep': baseSpritesheet.getSprite(13)
    }

    heartImg = spritesheetImg.get(608, 0, 12, 10)
 
    spaceButtonImg = spritesheetImg.get(0, 606, 34, 34)
    muteButtonImg = spritesheetImg.get(0, 448, 16, 16)
    unmuteButtonImg = spritesheetImg.get(32, 448, 16, 16)
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
        baseSpritesheet.getSprite(271),
        baseSpritesheet.getSprite(272)
    ]

    introBunbonColors = shuffle(introBunbonColors.concat(introBunbonColors))
    introBunbonSecondaryColors = shuffle(introBunbonSecondaryColors.concat(introBunbonSecondaryColors))
    introBunbonEars = shuffle(introBunbonEars.concat(introBunbonEars))
    introBunbonTails = shuffle(introBunbonTails.concat(introBunbonTails))
    introBunbonPatterns = shuffle(introBunbonPatterns.concat(introBunbonPatterns))

    spaceScreen.setup()

    Object.keys(planetTypes).forEach(planetType => {
        planets.push(new Planet(planetType))
    })
    planets[0].isUnlocked = true

    let isLoadSuccessful = loadState()
    if (!isLoadSuccessful) {
        planets.forEach(planet => planet.setup())
        openScreen('planet', 0)
    }

}

function printDebugCommands() {
    console.log('DEBUG COMMANDS')
    console.log('p - pause')
    console.log('u - unlock planet\'s connections')
    console.log('c - open credits screen')
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

    let data = {
        planets: planets.map(p => p.export()),
        inventoryObjects: inventory.objects.map(o => o ? o.export() : null),
        blastedOffBunbons: blastedOffBunbons.map(b => b.export()),
        isMuted: MUTE,
        currentScreenType: currentScreen.type,
        currentPlanetIndex: currentScreen.type === 'planet' ? currentScreen.index : 0,
        lastPlanetIndex: lastPlanet ? lastPlanet.index : 0,

    }
    try {
        dataString = JSON.stringify(data)
        window.localStorage.setItem('bunbons', dataString)
    } catch(e) {
        if (DEBUG) console.error('unable to save', e)
    }

}

function loadState() {

    try {

        let dataString = window.localStorage.getItem('bunbons')
        if (!dataString) return false

        let data = dataString ? JSON.parse(dataString) : null
        if (data) {
            
            if (data.planets) {
                planets = data.planets.map(p => Planet.import(p))
                planets.forEach(p => { p.setup(p.objects) })
            }

            if (data.inventoryObjects) {
                inventory.objects = data.inventoryObjects.map(o => o ? GameObject.import(o) : null)
            }

            if (data.blastedOffBunbons) {
                blastedOffBunbons = data.blastedOffBunbons.map(b => GameObject.import(b))
            }

            MUTE = data.isMuted

            if (data.currentScreenType !== 'planet' || planets[data.currentPlanetIndex]) {
                openScreen(data.currentScreenType, data.currentPlanetIndex)
            }

            return true

        } else {
            throw 'bad data'
        }

    } catch(e) {
        if (DEBUG) console.error('unable to load:', e)
    }

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