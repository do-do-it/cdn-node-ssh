const { join } = require('path')
const getFile = require('./getFile')
const node_ssh = require('node-ssh')
const pkg = require('../package.json')
const ssh = new node_ssh()
const chalk = require('chalk')
const ProgressBar = require('progress')
const log = console.log

module.exports = class AutoUpload {
  constructor({ local = 'dist', host, username, privateKey, remote }) {
    this.local = local
    this.remote = remote
    this.host = host
    this.username = username
    this.privateKey = privateKey
    if (!local.match(/^\/.+/)) {
      this.local = join(process.cwd(), local)
    }
  }
  start() {
    ssh.connect({
      host: this.host,
      username: this.username,
      privateKey: this.privateKey
    }).then(async () => {
      log(chalk.green(`\n  Connect success, Version ${pkg.version}\n`))
      let count = 0
      const files = getFile(this.local)
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
      // 异步上传
      async function upload (local, remote) {
        return new Promise(resolve => {
          ssh.putFile(local, remote).then(() => {
            count++
            bar.tick()
            resolve()
          }, err => {
            resolve(err)
          })
        })
        
      }
      // 递归
      while (files.length) {
        const local = files.pop()
        const remote = `${this.remote}${local.match(new RegExp(`${this.local}(.+)`))[1]}`
        await upload(local, remote)
      }
      // 退出
      process.exit(0)
    }).catch(err => {
      log(chalk.red(err))
      process.exit(0)
    })
  }
}
