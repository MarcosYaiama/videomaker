const readline = require("readline-sync")
const robots = {
    // userInput: require('./robots/user-input.js'),
    text: require('./robots/text.js')
}


async function start() {
    const content = {
        maximumSentences: 7
    }
    
    content.searchTerm = askAndReturnSearchItem()
    content.prefix = askAndReturnPrefix()

    // robots.userInput(content)
    await robots.text(content)

    function askAndReturnSearchItem() {
        return readline.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'The history is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]
        // console.log(selectedPrefixText);

        return selectedPrefixText 
    }
    console.log(JSON.stringify(content,null,4))
}
start()