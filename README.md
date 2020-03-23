# cnd-node-ssh

上传资源文件到Linux服务器

## Installation
```
npm install @minjs/cdn-node-ssh
```

## Useage
```
const AutoUpload = require('@minjs/cdn-node-ssh')

const upload = new AutoUpload({
  host: '0.0.0.0',
  username: 'root',
  privateKey: '/.ssh/id_rsa',
  local: 'dist',
  remote: '/srv/www'
})

upload.start()
```
