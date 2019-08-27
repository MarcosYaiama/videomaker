const readline = require("readline-sync")
const state = require("./state.js")

function robot() {
    const content = {
        maximumSentences: 7
    }
    
    content.searchTerm = askAndReturnSearchItem()
    content.prefix = askAndReturnPrefix()
    state.save(content)
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
}

module.exports = robot