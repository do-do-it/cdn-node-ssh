const fs = require('fs')

const fileArr = []

function readDir(filepath) {
  const dirs = fs.readdirSync(filepath)
  dirs.forEach(ele => {
    const stats = fs.statSync(`${filepath}/${ele}`)
    if (stats.isDirectory()) {
      readDir(`${filepath}/${ele}`)
    } else {
      if (!`${filepath}/${ele}`.startsWith('.')) {
        fileArr.push(`${filepath}/${ele}`)
      }
    }
  })
}

module.exports = filepath => {
  readDir(filepath)
  return fileArr
}
