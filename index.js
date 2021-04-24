const express = require('express')
const app = express()
const port = 3000

const connect = require('./schemas'); //schemas에있는 걸 들고오겠다
connect();

// const goodsRouter = require('./routes/goods');
// const userRouter = require('./routes/user');


app.use(express.urlencoded({extend: false}))
app.use(express.json())
app.use(express.static('public'))

const goodsRouter = require("./routers/goods");
app.use("/api", [goodsRouter]);
// app.use('/goods', goodsRouter);
// app.use('/user', userRouter);

// app.use((req, res, next) => {
//     console.log(req);
//     next();
//   });

  app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/test', (req, res) => {
  let name = req.query.name;
  res.render('test', {name});
})
  
app.get('/home', (req, res) => {
  res.render('index');
}) 

app.get('/detail', (req, res) => {
  // 서버명
  res.render('detail');
  // 파일명

  // let goods = req.query.name;
  // res.render('detail', {goods});
  // 이전에 내가 적은 정답인데 오류가 있었다
  // -> 이런식으로 하는경우 ejs파일에 있는 부분까지 수정을 해주면 정상 작동되니 틀린 것은 아니다

  // 선생님의 답변
//   http://localhost:3000/detail?goods=5
// 이렇게 보낸 url 의 ? 뒷부분을
// querystring 이라고합니다. 올려주신대로라면 good=5 이라고 보내면 express 에서도 동일하게 req.query.good 라고 받아야 합니다
// (두개를 같은 이름으로 지정한다면 어떤이름으로 지정해도 상관 없습니다)
// ejs로 넘어갈때는 render 함수 안에 인자로 값을 어떻게 주느냐로 보시면 됩니다.
// 현재 코드대로라면 {goods} 로 보내는데 그렇다면 ejs 파일 내부에서도 해당 이름으로 받도록 변경을 해줘야 합니다.
// 음.. 그런데 숙제용 ejs 파일을 보면
// goodsId를
// const goodsId = urlParams.get("goodsId"); 요런식으로 가져오는데요
// 이건 위에서 제가 말한 render 로 넘긴 값을 받아서 쓰는게 아니라 querystring 값을 바로 가져다가 쓰는 방식입니다.
// 그래서 다시 정리해서 http://localhost:3000/detail?goods=5 이런식으로 호출하는 경우에는 ejs 파일의 저 부분을 찾으셔서 goodsId 라고 되어있는걸 goods 로 동일 하게 수정해주시면 잘 작동할 것입니다

})

app.get('/cart', (req, res) => {
  res.render('cart')
})

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

app.get('/order', (req, res) => {
  res.render('order');
})
// 템플릿 엔진 로그인 후 마이페이지 등 거의 비슷한데 조금씩만 바뀌는 경우
// 템플릿 엔진을 쓰면 용이하다

const mongoose = require('mongoose'); //설치한 패키지 monogoose를 가져온다

// 위에서 패키지로 대신했기 때문에 밑에 코드가 필요없음
// 내생각에 코드를 분할하는 css에서 screen component나누는거 그런거 같음
// app.get('/mongodb', async (req, res) => {  
//     await mongoose.connect('mongodb://localhost/voyage', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: true,
//         useCreateIndex: true
//     });

//     const { Schema } = mongoose;
//     const goodsSchema = new Schema({
//       goodsID: {
//         type: Number,
//         required: true,
//         unique: true,

//       },
//       name: { 
//         type: String,
//         required: true,
//         unique: true
//       },
//       thumbnailUrl: {
//         type: String
//       },
//       category: {
//         type: String
//       },
//       price: {
//         type: Number
//       }
//     })

//     let Goods = mongoose.model("Goods", goodsSchema);

//     await Goods.create({
//       goodsId: 1,
//       name: "아이유랑 1분 통화",
//       thumbnailUrl: "https://www.google.com/imgres?imgurl=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F9978AC465B029E3032&imgrefurl=https%3A%2F%2Fcashflow99.tistory.com%2F196&tbnid=ofaMffJG1fILPM&vet=10CGkQMyjiAmoXChMI0Ifq8Nj97wIVAAAAAB0AAAAAEAQ..i&docid=hU_j7ywUr0rk_M&w=589&h=585&q=%EC%95%84%EC%9D%B4%EC%9C%A0&ved=0CGkQMyjiAmoXChMI0Ifq8Nj97wIVAAAAAB0AAAAAEAQ",
//       category: "call",
//       price: 10000000
//     })

// 		res.send('ok');
// })

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

// npm init -y
// npm install express 
// npm install ejs