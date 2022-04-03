function nameToHex(name) {

    let chars = split(name, '')
    let charInts = unchar(chars)
    let charHexes = charInts.map(charInt => hex(charInt, 2))
    return join(charHexes, '')

}

function unhexName(hexName) {

    let charHexes = Array.from(hexName.matchAll(/../g), m => m[0])
    let charInts = unhex(charHexes)
    let chars = char(charInts)
    return join(chars, '')

}

function chromosomeToString(chromosome) {

    let chromosomeString = ''

    let color =  hex(Object.keys(bunbonColors).findIndex(x => x === chromosome.color), 2)
    let secondaryColor = hex(Object.keys(bunbonColors).findIndex(x => x === chromosome.secondaryColor), 2)
    chromosomeString += color + secondaryColor

    let ears = hex(Object.keys(bunbonEars).findIndex(x => x === chromosome.ears), 2)
    let tail = hex(Object.keys(bunbonTails).findIndex(x => x === chromosome.tail), 2)
    let back = hex(Object.keys(bunbonBacks).findIndex(x => x === chromosome.back), 2)
    let head = hex(Object.keys(bunbonHeads).findIndex(x => x === chromosome.head), 2)
    let pattern = hex(Object.keys(bunbonPatterns).findIndex(x => x === chromosome.pattern), 2)
    chromosomeString += ears + tail + back + head + pattern

    let earsUsePrimaryColor = chromosome.earsUsePrimaryColor ? '1' : '0'
    let tailUsesPrimaryColor = chromosome.tailUsesPrimaryColor ? '1' : '0'
    chromosomeString += earsUsePrimaryColor + tailUsesPrimaryColor

    let ageToAdulthood = hex(floor(chromosome.ageToAdulthood), 3)
    let maxSpeed = hex(floor(chromosome.maxSpeed * 10000), 3)
    let restChance = hex(floor(chromosome.restChance * 100000), 3)
    let jumpChance = hex(floor(chromosome.jumpChance * 10000), 3)
    chromosomeString += ageToAdulthood + maxSpeed + restChance + jumpChance

    let hungerRate = hex(floor(chromosome.hungerRate), 2)
    let boredomRate = hex(floor(chromosome.boredomRate), 2)
    let lonelinessRate = hex(floor(chromosome.lonelinessRate), 2)
    let sleepinessRate = hex(floor(chromosome.sleepinessRate), 2)
    chromosomeString += hungerRate + boredomRate + lonelinessRate + sleepinessRate

    return chromosomeString

}

function parseChromosomeString(chromosomeString) {

    let chromosome = {
        color: Object.keys(bunbonColors)[unhex(chromosomeString.substring(0, 2))],
        secondaryColor: Object.keys(bunbonColors)[unhex(chromosomeString.substring(2, 4))],
        ears: Object.keys(bunbonEars)[unhex(chromosomeString.substring(4, 6))],
        tail: Object.keys(bunbonTails)[unhex(chromosomeString.substring(6, 8))],
        back: Object.keys(bunbonBacks)[unhex(chromosomeString.substring(8, 10))],
        head: Object.keys(bunbonHeads)[unhex(chromosomeString.substring(10, 12))],
        pattern: Object.keys(bunbonPatterns)[unhex(chromosomeString.substring(12, 14))],
        earsUsePrimaryColor: chromosomeString[14] === '1',
        tailUsesPrimaryColor: chromosomeString[15] === '1',
        ageToAdulthood: unhex(chromosomeString.substring(16, 19)),
        maxSpeed: unhex(chromosomeString.substring(19, 22)) / 10000,
        restChance: unhex(chromosomeString.substring(22, 25)) / 100000,
        jumpChance: unhex(chromosomeString.substring(25, 28)) / 10000,
        hungerRate: unhex(chromosomeString.substring(28, 30)),
        boredomRate: unhex(chromosomeString.substring(30, 32)),
        lonelinessRate: unhex(chromosomeString.substring(32, 34)),
        sleepinessRate: unhex(chromosomeString.substring(34, 36))
    }

    return chromosome
    
}

function dnaToString(dna) {

    let dnaString = ''

    dna.parents.forEach(parent => {
        dnaString += nameToHex(parent) + 'O'
    })

    dnaString += 'X'

    dna.chromosomes.forEach(chromosome => {
        dnaString += chromosomeToString(chromosome) + 'X'
    })

    dnaString += chromosomeToString(dna)
    
    return dnaString

}

function parseDnaString(dnaString) {

    let dnaParts = dnaString.split('X')
    let parents = dnaParts[0].split('O').filter(x => x !== '').map(s => unhexName(s))
    let chromosome1 = parseChromosomeString(dnaParts[1])
    let chromosome2 = parseChromosomeString(dnaParts[2])
    let dna = parseChromosomeString(dnaParts[3])
    dna.parents = parents
    dna.chromosomes = [chromosome1, chromosome2]
    return dna

}

function bunbonToString(bunbon) {

    let name = nameToHex(bunbon.name.match(/\D+/)[0]) + 'O'

    let isBaby = bunbon.isBaby ? '0' : '1'
    let age = hex(floor(bunbon.age), 4)
    let reachedBestScore = bunbon.reachedBestScore ? '1' : '0'
    let score = hex(floor(bunbon.score), 3)
    let hasBlastedOffBefore = bunbon.hasBlastedOffBefore ? '1' : '0'
    let baseInfo = isBaby + age + reachedBestScore + score + hasBlastedOffBefore

    let hunger = hex(floor(bunbon.drives.hunger), 2)
    let boredom = hex(floor(bunbon.drives.boredom), 2)
    let loneliness = hex(floor(bunbon.drives.loneliness), 2)
    let sleepiness = hex(floor(bunbon.drives.sleepiness), 2)
    let drives = hunger + boredom + loneliness + sleepiness

    let dna = 'Z' + dnaToString(bunbon.dna)

    let foodOpinions = 'Z'
    Object.keys(bunbon.foodOpinions).forEach(key => {
        let value = bunbon.foodOpinions[key]
        foodOpinions += hex(foodList.indexOf(key), 1) + hex(floor(value), 2)
    })

    let toyOpinions = 'Z'
    Object.keys(bunbon.toyOpinions).forEach(key => {
        let value = bunbon.toyOpinions[key]
        toyOpinions += hex(toyList.indexOf(key), 1) + hex(floor(value), 2)
    })

    let friendOpinions = 'Z'
    Object.keys(bunbon.friendOpinions).forEach(key => {
        let value = bunbon.friendOpinions[key]
        friendOpinions += nameToHex(key) + hex(floor(value), 2) + 'O'
    })

    let opinions = foodOpinions + toyOpinions + friendOpinions

    let bunbonString = `${name}${baseInfo}${drives}${dna}${opinions}`

    return bunbonString

}

function parseBunbonString(bunbonString) {

    let bunbonData = {
        type: 'bunbon',
        x: 0,
        y: 0,
        isInInventory: false
    }

    let bunbonParts = bunbonString.split('Z')

    let baseInfoParts = bunbonParts[0].split('O')
    bunbonData.name = unhexName(baseInfoParts[0])

    bunbonData.isBaby = baseInfoParts[1].substring(0, 1) === '0'
    bunbonData.age = unhex(baseInfoParts[1].substring(1, 5))
    bunbonData.reachedBestScore = baseInfoParts[1].substring(5, 6) === '1'
    bunbonData.score = unhex(baseInfoParts[1].substring(6, 9))
    bunbonData.hasBlastedOffBefore = baseInfoParts[1].substring(9, 10) === '1'

    bunbonData.drives = {
        hunger: unhex(baseInfoParts[1].substring(10, 12)),
        boredom: unhex(baseInfoParts[1].substring(12, 14)),
        loneliness: unhex(baseInfoParts[1].substring(14, 16)),
        sleepiness: unhex(baseInfoParts[1].substring(16, 18))
    }

    bunbonData.dna = parseDnaString(bunbonParts[1])

    bunbonData.foodOpinions = {}
    let foodOpinionChunks = Array.from(bunbonParts[2].matchAll(/.../g), m => m[0])
    foodOpinionChunks.forEach(opinion => {
        let key = foodList[unhex(opinion[0])]
        let value = unhex(opinion.substring(1))
        bunbonData.foodOpinions[key] = value
    })

    bunbonData.toyOpinions = {}
    let toyOpinionChunks = Array.from(bunbonParts[3].matchAll(/.../g), m => m[0])
    toyOpinionChunks.forEach(opinion => {
        let key = toyList[unhex(opinion[0])]
        let value = unhex(opinion.substring(1))
        bunbonData.toyOpinions[key] = value
    })

    bunbonData.friendOpinions = {}
    let friendOpinionChunks = bunbonParts[4].split('O').filter(x => x !== '')
    friendOpinionChunks.forEach(opinion => {
        let key = unhexName(opinion.substring(0, opinion.length - 2))
        let value = unhex(opinion.substring(opinion.length - 2))
        bunbonData.friendOpinions[key] = value
    })

    return bunbonData

}

function downloadBunbon(bunbon) {

    let face = random(['blank', 'smile', 'grin', 'laugh', 'gasp', 'blush', 'moue', 'angry', 'frown'])

    let createImg = (frameIndex) => {
        let img = createImage(36, 36)
        if (bunbon.isBaby) {
            img.copy(bunbon.babyspriteImgs[frameIndex], 0, 0, 32, 32, 2, 2, 32, 32) 
        } else {
            img.copy(bunbon.outlineImgs[frameIndex], 0, 0, 48, 48, -6, -6, 48, 48)
            img.copy(bunbon.spriteImgs[frameIndex], 0, 0, 48, 48, -6, -6, 48, 48)
            img.copy(bunbon.faceImgs[face], 0, 0, 32, 32, 2, 2 + (frameIndex * 2), 32, 32) // why does this cause problems but only for oyi??
        }
        img.loadPixels()
        return img
    }

    let img1 = createImg(0)
    let img2 = createImg(1)

    let colors = []

    let createFrame = (img) => {
        let frame = []
        let pixelCount = 4 * img.width * img.height
        for (let i = 0; i < pixelCount; i += 4) {
            let r = img.pixels[i]
            let g = img.pixels[i + 1]
            let b = img.pixels[i + 2]
            let color = '#' + hex(r, 2) + hex(g, 2) + hex(b, 2)
            if (!colors.includes(color)) colors.push(color)
            let colorIndex = colors.indexOf(color)
            frame.push(colorIndex)
        }
        return frame
    }

    let frame1 = createFrame(img1)
    let frame2 = createFrame(img2)

    GIF.encode({
        width: img1.width,
        height: img1.height,
        frames: [ frame1, frame2 ],
        frameRate: floor(200 / bunbon.maxSpeed),
        colors,
        comment: bunbonToString(bunbon),
        callback: blob => onDownload(bunbon, blob)
    })
    
}

function onDownload(bunbon, blob) {
    openModal('export-modal')
    let modal = document.getElementById('export-modal-contents')
    modal.innerHTML = `
        <img id='export-preview' width=64 height=64>
        <br>
        ${bunbon.name}
        <br>
        This will remove the bunbon from the world and prompt you to download them as a GIF file.
        <br><br><br><br>
        <button id='confirm-export'>export</button>
        <br><br>
        <button onclick='closeModal();'>cancel</button>
    `

    document.getElementById('export-preview').src = URL.createObjectURL(blob)

    document.getElementById('confirm-export').onclick = () => {

        // create image uri
        let imageUri = URL.createObjectURL(blob)

        // create download link and click it
        let link = document.createElement('a')
        link.download = bunbon.name.match(/\D+/)[0] + '.gif'
        link.href = imageUri
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        delete link

        // remove bunbon from game
        bunbon.removeMe = true
        generatedNames = generatedNames.filter(name => name !== bunbon.name)
        if (DEBUG) console.log('EXPORT ' + bunbon.name.toUpperCase() + ':', bunbonString)

        saveState()

        closeModal()

    }
    document.getElementById('confirm-export').focus()
}

function uploadBunbon() {
    let freeInventorySlotIndex = -1
    inventory.objects.forEach((obj, index) => {
        if (!obj && freeInventorySlotIndex === -1) freeInventorySlotIndex = index
    })
    if (freeInventorySlotIndex >= 0) {
        document.getElementById('fileInput').click()
    } else {
        alert('Not enough storage space to import bunbon.')
    }
}

function onUpload(event) {

    const file = event.target.files[0]
    if (!file) {
        alert('Unable to import bunbon.')
        return
    }

    const reader = new FileReader()

    reader.addEventListener('load', () => {

        try {

            // get byte data from uploaded file
            let result = reader.result
            let header = 'data:image/gif;base64,'
            let base64Data = result.slice(header.length)
            let binaryData = window.atob(base64Data)
            let binaryLength = binaryData.length

            let byteArray = new Uint8Array(new ArrayBuffer(binaryLength))
            for (let i = 0; i < binaryLength; i++) {
                byteArray[i] = binaryData.charCodeAt(i);
            }
            
            // extract comment
            let comment = GIF.extractComment(byteArray)
            
            // parse data
            let bunbonData = parseBunbonString(comment)
            bunbonData.name = NameGenerator.deduplicate(bunbonData.name)
            let newBunbon = Bunbon.importBunbon(bunbonData)

            openModal('import-modal')
            let modal = document.getElementById('import-modal-contents')
            modal.innerHTML = `
                <img id='import-preview' width=64 height=64>
                <br>
                ${newBunbon.name}
                <br><br><br><br>
                <button id='confirm-import'>import</button>
                <br><br>
                <button onclick='closeModal();'>cancel</button>
            `

            document.getElementById('import-preview').src = URL.createObjectURL(file)

            document.getElementById('confirm-import').onclick = () => {

                // place imported bunbon in inventory
                let slotIndex = -1
                inventory.objects.forEach((obj, index) => {
                    if (!obj && slotIndex === -1) slotIndex = index
                })
                inventory.objects[slotIndex] = newBunbon
                newBunbon.isInInventory = true
                newBunbon.pos.x = inventory.slotXs[slotIndex]
                newBunbon.pos.y = inventory.slotY + (newBunbon.height / 2)

                saveState()

                closeModal()

            }
            document.getElementById('confirm-import').focus()

        } catch(e) {
            alert('Unable to import bunbon.')
            console.log('Unable to import bunbon.', e)
        }

    }, false)

    reader.readAsDataURL(file)

}