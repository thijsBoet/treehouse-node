const profile = require('./profile')
const users = process.argv.slice(2)
users.forEach(user => profile.get(user))