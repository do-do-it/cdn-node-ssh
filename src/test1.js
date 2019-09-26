const { join } = require('path')
const readFiles = require('./getFile')

console.log(readFiles(join(process.cwd(), 'dist')))