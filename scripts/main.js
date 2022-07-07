let DEBUG = false
let LOG_STORIES = true

let MUTE = false

let TITLESCREEN_OPEN = true
let MODAL_OPEN = false

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
    slotCount: 5,
    slotWidth: 40,
    width: 40 * 5,
    height: 32,
    objects: Array(5),
    slotXs: [ 60, 100, 140, 180, 220 ],
    slotY: WORLD_HEIGHT + 21
}

let storageButton = {
	x: 240,
	y: WORLD_HEIGHT + 5,
	width: 40,
	height: 32
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

let pauseButton = {
    x: 24,
    y: 4,
    width: 16,
    height: 16
}

let uploadButton = {
    x: 192 - 60,
    y: 214,
    width: 16,
    height: 16
}

let downloadButton = {
    x: 192 - 40,
    y: 214,
    width: 16,
    height: 16
}

let deleteButton = {
    x: 192 - 20,
    y: 214,
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

let userinterfaceImg, spaceButtonImg, spaceButtonForStorageImg, heartImg
let storageImg, storageOnHoverImg, selectedStorageSlotImg
let muteButtonImg, unmuteButtonImg
let pauseButtonImg, unpauseButtonImg
let deleteButtonImg, disabledDeleteButtonImg
let uploadButtonImg, disabledUploadButtonImg
let downloadButtonImg, disabledDownloadButtonImg
let scoreButtonImgs = []
let shadowImgs = {}
let bubbleImgs = {}

let blastedOffBunbon = null
let confirmingBlastOff = false

let spaceScreen = new Space()
let planets = []
let unlockedPlanetCount = 0

let storageBG = null
let spaceBG = null
let starsBGs = []
let starsBGOpacity = [0, 64]
let planetBGs = {}
let planetMasks = {}

let planetSoundtracks = {}

let storageScreen = new Storage()

let currentScreen = spaceScreen
let lastPlanet = null

let bunbonCount = 0

let myFont

function openScreen(type, index, arg) {

    currentScreen.close()
    if (type === 'space') {
        currentScreen = spaceScreen
    } else if (type === 'storage') {
        currentScreen = storageScreen
    } else {
        currentScreen = planets[index]
    }
    currentScreen.open(index, arg)

    // save game
    saveState()

}

function preload() {

    noLoop()

    myFont = loadFont('fonts/UbuntuMono-Bold.woff')

    let makeSoundtrack = (fileName) => {
        let newSoundtrack = new Audio('music/' + fileName + '.mp3')
        newSoundtrack.volume = 0.02
        newSoundtrack.loop = true
        return newSoundtrack
    }

    planetSoundtracks = {
        mossyforest: makeSoundtrack('the_great_tree'),
        cloudland: makeSoundtrack('hidden_grotto'),
        asteroid: makeSoundtrack('village_of_the_peeping_frogs'),
        flowertown: makeSoundtrack('roots'),
        volcano: makeSoundtrack('in_the_branches'),
        crystalcave: makeSoundtrack('home_departure'),
        snowymountain: makeSoundtrack('sunset_over_the_treetops'),
        park: makeSoundtrack('streamside_hotel'),
        bubbledome: makeSoundtrack('bug_band'),
        desert: makeSoundtrack('rainy_ascent'),
        space: makeSoundtrack('shoots'),
        credits: makeSoundtrack('overgrown_labyrinth')
    }

    Object.keys(soundEffectNames).forEach(soundEffectName => {
        let newSoundEffect = new Audio('sounds/' + soundEffectNames[soundEffectName] + '.mp3')
        newSoundEffect.volume = 0.2
        soundEffects[soundEffectName] = newSoundEffect
    })

    spritesheetImg = loadImage('images/spritesheet.png')
    userinterfaceImg = loadImage('images/userinterface.png')

    storageBG = loadImage('images/storage.png')
    
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
        'thoughtbubble-sleep': baseSpritesheet.getSprite(13),
        'reactionicon-pet0': baseSpritesheet.getSprite(320),
        'reactionicon-pet1': baseSpritesheet.getSprite(321),
        'reactionicon-pet2': baseSpritesheet.getSprite(322),
        'reactionicon-eat0': baseSpritesheet.getSprite(323),
        'reactionicon-eat1': baseSpritesheet.getSprite(324),
        'reactionicon-eat2': baseSpritesheet.getSprite(325),
        'reactionicon-play0': baseSpritesheet.getSprite(326),
        'reactionicon-play1': baseSpritesheet.getSprite(327),
        'reactionicon-play2': baseSpritesheet.getSprite(328),
        'reactionicon-pet0-flipped': baseSpritesheet.getSprite(340),
        'reactionicon-pet1-flipped': baseSpritesheet.getSprite(341),
        'reactionicon-pet2-flipped': baseSpritesheet.getSprite(342),
        'reactionicon-eat0-flipped': baseSpritesheet.getSprite(343),
        'reactionicon-eat1-flipped': baseSpritesheet.getSprite(344),
        'reactionicon-eat2-flipped': baseSpritesheet.getSprite(345),
        'reactionicon-play0-flipped': baseSpritesheet.getSprite(346),
        'reactionicon-play1-flipped': baseSpritesheet.getSprite(347),
        'reactionicon-play2-flipped': baseSpritesheet.getSprite(348)
    }

    heartImg = spritesheetImg.get(608, 0, 12, 10)

    spaceButtonImg = spritesheetImg.get(0, 606, 34, 34)
    spaceButtonForStorageImg = spritesheetImg.get(34, 606, 34, 34)
    
    storageImg = spritesheetImg.get(128, 608, 38, 34)
    storageOnHoverImg = spritesheetImg.get(176, 608, 38, 32)

    selectedStorageSlotImg = spritesheetImg.get(80, 600, 40, 40)

    muteButtonImg = spritesheetImg.get(0, 448, 16, 16)
    unmuteButtonImg = spritesheetImg.get(32, 448, 16, 16)

    pauseButtonImg = spritesheetImg.get(64, 448, 16, 16)
    unpauseButtonImg = spritesheetImg.get(96, 448, 16, 16)

    uploadButtonImg = spritesheetImg.get(128, 448, 16, 16)
    disabledUploadButtonImg = spritesheetImg.get(160, 448, 16, 16)

    downloadButtonImg = spritesheetImg.get(192, 448, 16, 16)
    disabledDownloadButtonImg = spritesheetImg.get(224, 448, 16, 16)

    deleteButtonImg = spritesheetImg.get(256, 448, 16, 16)
    disabledDeleteButtonImg = spritesheetImg.get(288, 448, 16, 16)

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
    storageScreen.setup()

    Object.keys(planetTypes).forEach(planetType => {
        planets.push(new Planet(planetType))
    })
    planets[0].isUnlocked = true

    let isLoadSuccessful = loadState()
    if (!isLoadSuccessful) {
        planets.forEach(planet => planet.setup())
        openScreen('planet', 0)
    }

    document.getElementById('fileInput').onchange = onUpload
    
    let titlescreen = document.getElementById('titlescreen')
    titlescreen.className = ''
    titlescreen.onclick = () => {
        titlescreen.className = 'hidden'
        TITLESCREEN_OPEN = false
        if (!MUTE) planetSoundtracks[currentScreen.name].play()
        loop()
    }

}

function printDebugCommands() {
    console.log('DEBUG COMMANDS')
    console.log('m - mute')
    console.log('p - pause')
    console.log('u - unlock planet\'s connections')
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

    if (TITLESCREEN_OPEN) return

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

    if (currentScreen.draggedObject) return

    let data = {
        planets: planets.map(p => p.export()),
        inventoryObjects: inventory.objects.map(o => o ? o.export() : null),
        storageObjects: storageScreen.objects.map(o => o ? o.export() : null),
        isMuted: MUTE,
        currentScreenType: currentScreen.type,
        currentPlanetIndex: currentScreen.index,
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

            if (data.storageObjects) {
                storageScreen.objects = data.storageObjects.map(o => o ? GameObject.import(o) : null)
            }

            if (data.inventoryObjects) {
                inventory.objects = data.inventoryObjects.map(o => o ? GameObject.import(o) : null)
                if (inventory.objects[5] != null) {
                    storageScreen.addObject(inventory.objects[5])
                    inventory.objects[5] = null
                }
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

function resetState() {
    planets.forEach(planet => {
        planet.setup()
        planet.isUnlocked = false
        planet.bunbonHasBlastedOffHere = false
    })
    inventory.objects = Array(inventory.slotCount)
    storageScreen.objects = Array(storageScreen.slotCount)
    openScreen('planet', 0)
}

function playSound(soundName, ignoreIfAlreadyPlaying) {
    if (!MUTE && !TITLESCREEN_OPEN && (!ignoreIfAlreadyPlaying || !soundEffects[soundName].currentTime > 0)) {
        soundEffects[soundName].currentTime = 0
        soundEffects[soundName].play()
    }
}

function stopSound(soundName) {
    soundEffects[soundName].pause()
}

function playMusic(musicName) {
    if (!MUTE && !TITLESCREEN_OPEN) {
        planetSoundtracks[musicName].currentTime = 0
        planetSoundtracks[musicName].play()
    }
}

function stopMusic(musicName) {
    planetSoundtracks[musicName].pause()
}

function toggleMute() {
    MUTE = !MUTE
    if (planetSoundtracks[currentScreen.name]) {
        if (MUTE) {
            planetSoundtracks[currentScreen.name].pause()
            Object.keys(soundEffects).forEach(soundName => {
                soundEffects[soundName].pause()
            })
        } else {
            planetSoundtracks[currentScreen.name].play()
        }
    }
}

function togglePause() {
    if (currentScreen.type === 'planet') {
        currentScreen.isPaused = !currentScreen.isPaused
        if (currentScreen.isPaused) {
            currentScreen.wasMutedBeforePause = MUTE
            if (!MUTE) toggleMute()
            noLoop()
        } else {
            if (!currentScreen.wasMutedBeforePause) toggleMute()
            loop()
        }
    }
}

function openModal(id) {
    MODAL_OPEN = true
    document.getElementById(id).className = 'modal open'
    currentScreen.wasPausedBeforeModal = currentScreen.isPaused
    if (!currentScreen.isPaused) {
        togglePause()
    }
}

function closeModal() {
    MODAL_OPEN = false

    document.getElementById('import-modal').className = 'modal'
    document.getElementById('import-modal-contents').innerHTML = ''

    document.getElementById('import-item-modal').className = 'modal'

    document.getElementById('import-bunbon-modal').className = 'modal'
    document.getElementById('import-bunbon-modal-contents').innerHTML = ''

    document.getElementById('export-modal').className = 'modal'
    document.getElementById('export-modal-contents').innerHTML = ''

    document.getElementById('delete-modal').className = 'modal'
    document.getElementById('delete-modal-contents').innerHTML = ''

    if (!currentScreen.wasPausedBeforeModal && currentScreen.isPaused) {
        togglePause()
    }
}

function getCurrentBunbon() {
    if (currentScreen.objects) {
        return currentScreen.objects[currentScreen.selectedBunbonIndex]
    }
}
