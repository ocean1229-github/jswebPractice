const express = require('express')
const app = express()
const port = 3000

const goodsRouter = require('./routes/goods');
const userRouter = require('./routes/user');

app.use(express.urlencoded({extend: false}))
app.use(express.json())
app.use(express.static('public'))

app.use('/goods', goodsRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    console.log(req);
    next();
  });
  
  app.get('/', (req, res) => {
    res.send('<!DOCTYPE html>\
    <html lang="en">\
    <head>\
        <meta charset="UTF-8">\
        <meta http-equiv="X-UA-Compatible" content="IE=edge">\
        <meta name="viewport" content="width=device-width, initial-scale=1.0">\
        <title>Document</title>\
    </head>\
    <body>\
        Hi. I am with html<br>\
        <a href="/hi">Say Hi!</a>\
    </body>\
    </html>')
  })

// 템플릿 엔진 로그인 후 마이페이지 등 거의 비슷한데 조금씩만 바뀌는 경우
// 템플릿 엔진을 쓰면 용이하다

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

// npm init -y
// npm install express 
