// Require https module
const https = require('https');
const http = require('http');

printError = (error) => console.error(error)

printMessage = (username, badgeCount, points) => {
    const message = `${username} has ${badgeCount} badge(s) and ${points} points in JavaScript`
    console.log(message)
}

get = (username) => {
    try {
        //Connect to API URL
        const request = https.get(`https://teamtreehouse.com/${username}.json`, res => {
            if(res.statusCode === 200) {
            // this variable will contain data sent from the API URL.
                let body = '';

                res.on('data', data => {
                    body += data.toString()
                });

                res.on('end', () => {
                    try {
                        // parse the data
                        const profile = JSON.parse(body)
                        // print the data
                        printMessage(username, profile.badges.length, profile.points.JavaScript)
                    } catch(error) {
                        printError(error)
                    }
                    
                })
            } else {
                const message = `There was an Error getting the profile for ${username} (${http.STATUS_CODES[res.statusCode]})`
                const statusCodeError = new Error(message)
                printError(statusCodeError)
            }
    });
    request.on('error', (error) => printError(`Problem with request: ${error}`))

    } catch (error) {
        printError(`Problem with request: ${error}`)
    }
}

module.exports.get = get