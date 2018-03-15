const fs = require('fs');
const path = require('path');
const https = require('https');

const axios = require('axios');
const cheerio = require('cheerio');


const getHtmlCode = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    console.error('抓取htmlCode发生错误');
    throw new Error(e);
  }
}

const getPictureUrlFromHtml = (htmlCode) => {
  const pictureUrls = [];
  const $ = cheerio.load(htmlCode);
  $('ul>li>figure>img').each(function () {
    const url = $(this).attr('data-src');
    pictureUrls.push(url);
  });
  return pictureUrls;
}

const getPictureFromUrl = async (url) => {
  const res = await axios.get(url, {
    responseEncoding: 'binary'
  });
  return res.data;
}

const savePicture = (url, name) => {
  const client = https.request(url, (res) => {
    let body = ''
    res.setEncoding('binary');
    res.on('data', (data) => {
      body += data;
    })
    res.on('end', () => {
      fs.writeFile(path.resolve(`./pictures/${name}`), body, {
        encoding: 'binary',
      }, (err) => {
        if (!err) {
          console.log(`${name} load success`);
          return;
        }
        console.error(err);
      });
    })
  });

  client.on('error', (err) => { console.error(err) });

  client.end();
}

const main = async () => {
  const targetUrl = "https://alpha.wallhaven.cc/random";

  const htmlCode = await getHtmlCode(targetUrl);

  // console.log(htmlCode);

  const pictureUrls = getPictureUrlFromHtml(htmlCode);

  // console.log(pictureUrls);

  pictureUrls.map((url, index) => {
    savePicture(url, `${index}.jpg`);
  })

}

main();