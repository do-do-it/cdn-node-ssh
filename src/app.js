const { join } = require('path')
const getFile = require('./getFile')
const node_ssh = require('node-ssh')
const pkg = require('../package.json')
const ssh = new node_ssh()
const chalk = require('chalk')
const ProgressBar = require('progress')
const log = console.log

module.exports = class AutoUpload {
  constructor(dir = 'dist') {
    this.dir = dir
    if (!dir.match(/^\/.+/)) {
      this.dir = join(process.cwd(), dir)
    }
  }
  start() {
    ssh.connect({
      host: '47.110.46.48',
      username: 'root',
      privateKey: '/Users/zhangmin/.ssh/id_rsa'
    }).then(async () => {
      log(chalk.green(`\n  Connect success, Version ${pkg.version}\n`))
      let count = 0
      const files = getFile(this.dir)
      const startTime = new Date() * 1
      const bar = new ProgressBar(chalk.yellow(`  文件上传中 [:bar] :current/${files.length} :percent :elapseds`), {
        complete: '●',
        incomplete: '○',
        width: 20,
        total: files.length,
        callback: () => {
          console.log(chalk.green('\n  All complete.'));
          console.log(chalk.blue(`\n  本次队列文件共${files.length}个，上传文件${count}个，消耗时间：${parseFloat((new Date() * 1 - startTime) / 1000)} s\n`))
        }
      })
      const target = []
      files.forEach(local => {
        const remote = `/srv/cdn-node/public${local.match(new RegExp(`${this.dir}(.+)`))[1]}`
        ssh.putFile(local, remote).then(() => {
          count++
          bar.tick()
          if (count >= files.length) {
            process.exit(0)
          }
        }, err => {
          log(chalk.red(err))
        })
      })
    }).catch(err => {
      log(chalk.red(err))
      process.exit(0)
    })
  }
}
