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
		let badWords = ['anal', 'anus', 'arse', 'ass', 'bastard', 'bitch', 'bollock', 'bomb', 'boner', 'brothel', 'bugger', 'bung', 'chink', 'choad', 'chode', 'clit', 'cock', 'coitus', 'condom', 'coolie', 'cooly', 'coon', 'crotch', 'cum', 'cunt', 'damn', 'dick', 'dildo', 'dong', 'dyke', 'ejaculat', 'fag', 'felatio ', 'felch', 'foreskin', 'forni', 'fuck', 'gip', 'gook', 'goy', 'gyp', 'harem', 'hell', 'herpes', 'hitler', 'jap', 'jism', 'jiz', 'kaf', 'kanake', 'kigger', 'kike', 'koon', 'kunt', 'kyke', 'lynch', 'molest', 'moron', 'mulatto', 'munt', 'nazi', 'negro', 'nig', 'nuke', 'orgasm', 'orgy', 'paki', 'penis', 'perv', 'pimp', 'pistol', 'pohm', 'polack', 'poon', 'porn', 'prick', 'prostitute', 'pube', 'pubic', 'queef', 'quim', 'rape', 'rectum', 'sadist', 'satan', 'scag', 'schlong', 'scrotum', 'semen', 'sex', 'shag', 'shat', 'shit', 'shoot', 'skank', 'slave', 'sleez', 'slut', 'smut', 'sodom', 'sperm', 'spic', 'spig', 'spik', 'spoog', 'squaw', 'suicide', 'swastika', 'tarbaby', 'tard', 'teste', 'testicle', 'titt', 'torture', 'towelhead', 'trannie', 'tranny', 'twat', 'vagina', 'vulva', 'wank', 'wetback', 'whore']
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

	static deduplicate(name) {

		while (generatedNames.includes(name)) {
			let numbersAtEnd = name.match(/\d+$/)
			if (numbersAtEnd) {
				let coreName = name.substring(0, name.length - numbersAtEnd[0].length)
				let newNumber = int(numbersAtEnd[0]) + 1
				name = coreName + newNumber
			} else {
				name += "2"
			}
		}
		return name

	}

}
