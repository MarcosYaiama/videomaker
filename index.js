const readline = require("readline-sync")


function start() {
    const content = {}
    
    content.searchTerm = askAndReturnSearchItem()
    content.prefix = askAndReturnPrefix()

    function askAndReturnSearchItem() {
        return readline.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'The history is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]
        console.log(selectedPrefixText);

        return selectedPrefixText
        
    }

    console.log(content);
    
}

start()