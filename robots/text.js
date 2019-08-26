const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetector = require('sbd')


async function robot(content) {

    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    // breakContentIntoSentences(content)
    
    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo("web/WikipediaParser/0.1.2")
        const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponde.get()

        content.sourceContentOriginal = wikipediaContent.content

    }

    function sanitizeContent(content) {
        const withoutBrankLinesAndMarkdown = removeBrankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBrankLinesAndMarkdown)

        content.sourceContentSanetized = withoutDatesInParentheses
        
        function removeBrankLinesAndMarkdown(text) {
            const allLines = text.split('\n')
            const withoutBrankLinesAndMarkdown = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith("=")){
                    return false
                }
                return true
            })
           
            return withoutBrankLinesAndMarkdown.join(' ')
        }

        function removeDatesInParentheses(text){
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
        }

        function breakContentIntoSentences(content){
            content.sentences = []
            const sentences = sentenceBoundaryDetector.sentences(content.sourceContentSanetized)
            
            sentences.forEach((sentence) => {
                content.sentences.push({
                    text: sentence,
                    keywords: [],
                    images: []
                })
            })
        }
        breakContentIntoSentences(content)
    }
    
}

module.exports = robot