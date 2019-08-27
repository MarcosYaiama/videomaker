const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetector = require('sbd')

const watsonApiKey = require('../credentials/watson-nlu.json')

var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey: watsonApiKey.apikey,
    version: '2018-04-05',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

async function robot(content) {

    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)
    limitMaximumSentences(content)
    await fetchKeywordsOffAllSentences(content)


    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo("web/WikipediaParser/0.1.2")
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponse.get()

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

    function limitMaximumSentences(content) {
        content.sentences = content.sentences.slice(0, content.maximumSentences)
    }

    async function fetchKeywordsOffAllSentences(content){
        for(const sentence of content.sentences){
            sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
        }
    }
    async function fetchWatsonAndReturnKeywords(sentence) {
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text: sentence,
                features: {
                    keywords: {}
                },
            }, (error, response) => {
                if (error) {
                    throw error
                }
                resolve(response.keywords.map(keyword => keyword.text))
            })
        })
    }
}



module.exports = robot