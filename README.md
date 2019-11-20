# baidu-reader-crawler

这是一个百度阅读的爬虫，百度太垃圾了，在百度阅读购买了书后点了“开始阅读”的按钮，却弹到了一个页面告知书籍已删除。。虽然之后客服解答了是要进到其他页面
才能看，但是连基本的跳转也没跳对，用户体验极差，所以决定把自己买的书给爬下来。

## Built With
- Node
- Express
- Mongoose

## How to Use
爬虫的原理有参考这篇文章： http://www.shanetalk.com/2017/05/25/baidu-yuedu-spider/
有一点不同的是请求的网址参数还多了一个token， 这个token可以在阅读书籍的任意页面(eg: https://yuedu.baidu.com/ebook/${ebookID}?pn=1)中找到，
它被存储在一个隐藏的#focustoken中，请求一个之后就能拿到。

爬虫只是将爬到的json数据存在MongoDB Altas中，具体解析要另外实现。

