// XXX: Don't use ESM here, to preserve the ability to do:
// import { functions } from 'app/config'
const config = require('./index.json')
module.exports = config[process.env.APP_ENV]
