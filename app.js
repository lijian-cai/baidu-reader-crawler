var express = require('express');
var app = express();
// call api
const axios = require('axios');
// get dom elements
const cheerio = require('cheerio')
// manage environment variables
const dotenv = require('dotenv').config();
const mongoose = require('mongoose')
const uri = process.env.ATLAS_URI
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
const connection = mongoose.connection
connection.once('open', ()=>{
  console.log(`MongoDB database connection established successfully`)
})
let Page = require('./models/page.model')

app.get('/', async (req, res) => {
  let baiduCookie = process.env.baiduCookie;
  let ebookID = process.env.ebookID;
  let ebookToken = process.env.ebookToken;
  let headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36",
    "Cookie": baiduCookie
  }
  let tokenURL = `https://yuedu.baidu.com/ebook/${ebookID}?pn=1`
  let token = await getToken(tokenURL, headers)
  let url = `https://wenku.baidu.com/content/${ebookID}`;
  // img url: https://wenku.baidu.com/content/${ebookID}?m=${ebookToken}&type=pic&src=f4469b1e411f44ba988af5fc0a59dc11.jpg&token=0af3d87adab3aa420a15099c0b62f335

  // 1-26 pages for book《c#本质论7.0》
  for(let page=1;page<=26;page++){
    setTimeout(async () => {
      let params = {
        "m": ebookToken,
        "type": "json",
        "cn": 10,
        "token": token
      }
      try{
        const data = await getData(url, headers, params)
        await saveData(data)
      }catch(e){
        console.log(e)
        console.log(`Error adding page ${page}`)
      }
    }, page*500)
  }
});

const getToken = (tokenURL, headers) => {
  return axios.get(tokenURL, {
    headers: headers,
    params: {
      "pn": "1"
    }
  })
  .then((response) => {
    const html = response.data;
    // load html content
    const $ = cheerio.load(html);
    return $('#focustoken').text()
  })
  .catch((error) => {
    console.log(error)
  })
}

const saveData = (data) => {
  const newPage = new Page(data)
  newPage.blockContent = data.contents
  newPage.markModified('blockContent');
  return newPage.save()
  .then(() => console.log(`Block ${data.blockNum} added!`))
  .catch(err => console.log(err))
}

const getData = (url, headers, params) => {
  return axios.get(url, {
    headers: headers,
    params: params
  })
  .then((response) => {
    // console.log(response.data)
    if(response.data && response.data.c){
      let blockNum = response.data.blockNum
      let contents = response.data.c
      return {blockNum, contents}
    }
  })
  .catch((error) => {
    console.log(error);
  })
}

app.listen(3000);