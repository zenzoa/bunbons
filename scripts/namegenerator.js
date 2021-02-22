let generatedNames = []

class NameGenerator {

    static generate() {

        let name = ''
        let vowels = ['a', 'e', 'i', 'o', 'u']
        let initials = ['b', 'b', 'ch', 'd', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'm', 'n', 'p', 'p', 'r', 'r', 's', 's', 's', 'sh', 't', 't', 'th', 'v', 'w', 'y', 'z']
        let finals = ['d', 'd', 'f', 'g', 'ng', 'k', 'l', 'l', 'l', 'm', 'm', 'n', 'n', 'n', 'n', 'p', 'r', 'r', 'r', 's', 's', 's', 's', 't', 't', 't', 'x', 'y']
        let numSyllables = random([2, 2, 2, 3])
        let numConsonants = 0
        let vowelsInSequence = 0
    
        for (let i = 0; i < numSyllables; i++) {
            let initial = random(initials)
            let vowel = random(vowels)
            let final = random(finals)
    
            let hasInitial = Math.random() < 0.7
            let hasFinal = Math.random() < 0.3
            let hasVowel = false
    
            if (hasInitial && !name.endsWith(initial)) {
                name += initial
                numConsonants++
                vowelsInSequence = 0
            }
            if (vowelsInSequence < 2 && (vowel === 'e' || vowel === 'o' || !name.endsWith(vowel))) {
                name += vowel
                vowelsInSequence++
                hasVowel = true
            }
            if (hasFinal && hasVowel && !name.endsWith(final)) {
                name += final
                numConsonants++
                vowelsInSequence = 0
            }
        }
    
        // filter out names that include bad words
        let badWords = ['anus', 'clit', 'cock', 'coon', 'cunt', 'dick', 'fag', 'fuck', 'gook', 'jap', 'kike', 'nigg', 'penis', 'shit', 'slut', 'tard']
        badWords.forEach(badWord => {
            if (name.includes(badWord)) {
                name = NameGenerator.generate()
            }
        })

        // filter out names that are just vowels, or names already assigned
        if (!numConsonants || generatedNames.includes(name)) name = NameGenerator.generate()
    
        generatedNames.push(name)
        return name
        
    }

}