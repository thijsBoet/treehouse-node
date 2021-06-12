const https = require('https')
const http = require('http')

const api = require('./api.json')

printError = (error) => console.error(error.message)

printWeather = (weather) => {
    const message = `Current temperature in ${weather.name} is ${weather.main.temp}F`
    console.log(message)
}

get = (query) => {
    try {
        const request = https.get(`https://api.openweathermap.org/data/2.5/weather?zip=${query},US&appid=${api.key}`, (res) => {
            if (res.statusCode === 200) {
                let body = ""

                res.on('data', data => body += data.toString())

                res.on('end', () => {
                    try {
                        const weather = JSON.parse(body)
                        printWeather(weather)
                    } catch (error) {
                        printError(error)
                    }
                })
            } else {
                const message = `There was an Error getting the weather for ${query} (${http.STATUS_CODES[res.statusCode]})`
                const statusCodeError = new Error(message)
                printError(statusCodeError)
            }
        })
        request.on('error', (error) => printError(`Problem with request: ${error}`))
    } catch (error) {
        printError(error)
    }
}

module.exports.get = get