const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');

const url = 'https://alpha.wallhaven.cc/wallpapers/thumb/small/th-346048.jpg';

// 有问题，错在了哪里

// fs.writeFile(path.resolve('./test.jpg'), data, {
//   encoding: 'binary'
// }, (err) => {
//   if (err) {
//     console.error('保存图片发生错误:', err);
//   }
// });

const opt = {
  hostname: 'alpha.wallhaven.cc',
  path: '/wallpapers/thumb/small/th-346048.jpg',
  headers: {
    "Content-type": "image/jpeg"
  }
}

const stream = fs.createWriteStream(path.resolve('./test2.jpeg'), { encoding: 'binary' });
const server = https.request(opt, (res) => {
  let body = '';
  res.setEncoding('binary');
  res.on('data', (data) => {
    body += data;
  })
  res.on('end', () => {
    stream.write(body);
    console.log('end');
  })
});

server.on('error', (err) => {
  console.log(err);
})

server.end();