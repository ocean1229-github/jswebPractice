// ROUTERS는 새로운 페이지를 할떄 그 페이지를 연결시켜주는 중요한 역할
const express = require("express");
const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart");

const cheerio = require("cheerio");
const axios = require("axios");
const iconv = require("iconv-lite");
const url =
  "http://www.yes24.com/24/Category/BestSeller";

const router = express.Router();

router.get("/goods/add/crawling", async (req, res) => {
  try {
    //크롤링 대상 웹사이트 HTML 가져오기
    // api 따오기
    await axios({
      url: url,
      method: "GET",
      responseType: "arraybuffer",
    }).then(async (html) => {
        //크롤링 코드
      const content = iconv.decode(html.data, "EUC-KR").toString();
      const $ = cheerio.load(content);
      const list = $("ol li");

      await list.each( async (i, tag) => {
        let desc = $(tag).find("p.copy a").text() 
        // p.copy a -> 여기서 띄워쓰기는 자식클래스를의미
        let image = $(tag).find("p.image a img").attr("src")
        let title = $(tag).find("p.image a img").attr("alt")
        let price = $(tag).find("p.price strong").text()
      
        if(desc && image && title && price){
          price = price.slice(0,-1).replace(/(,)/g, "")
          // ↑ 뒤에서 -1번째 자리 삭제 (1000원 (원))
          // replace는 ~을 치환한다 ↑ , 를 공백으로 처리(없앤다)  
          let date = new Date()
          let goodsId = date.getTime()
          await Goods.create({
            goodsId:goodsId,
            name:title,
            thumbnailUrl:image,
            category:"도서",
            price:price
          })
        }
  
      });
    })
    res.send({ result: "success", message: "크롤링이 완료 되었습니다." });

  } catch (error) {
    //실패 할 경우 코드
    res.send({ result: "fail", message: "크롤링에 문제가 발생했습니다", error:error });
  }
});


router.get("/goods", async (req, res, next) => {
  try {
    const { category } = req.query;
    const goods = await Goods.find({ category }).sort("-goodsId");
    res.json({ goods: goods });
  } catch (err) {
    console.error(err);
    next(err);
  }
});


router.get("/goods/:goodsId", async (req, res) => {
  const { goodsId } = req.params;
  goods = await Goods.findOne({ goodsId: goodsId });
  res.json({ detail: goods });
});

router.post('/goods', async (req, res) => {
  // post 받아오는 것들 ( 상품, 이름, url, 카테고리, 가격)
  const { goodsId, name, thumbnailUrl, category, price } = req.body;
  console.log('req.body', req.body)
  isExist = await Goods.find({ goodsId });
  if (isExist.length == 0) {
    await Goods.create({ goodsId, name, thumbnailUrl, category, price });
  }
  res.send({ result: "success" });
});

// const Cart = require("../schemas/cart");
router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  isCart = await Cart.find({ goodsId });
  console.log(isCart, quantity);
  if (isCart.length) {
    await Cart.updateOne({ goodsId }, { $set: { quantity } });
  } else {
    await Cart.create({ goodsId: goodsId, quantity: quantity });
  }
  res.send({ result: "success" });
});

router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;

  const isGoodsInCart = await Cart.find({ goodsId });
  if (isGoodsInCart.length > 0) {
    await Cart.deleteOne({ goodsId });
  }

  res.send({ result: "success" });
});

router.patch("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  isCart = await Cart.find({ goodsId });
  console.log(isCart, quantity);
  if (isCart.length) {
    await Cart.updateOne({ goodsId }, { $set: { quantity } });
  }

  res.send({ result: "success" });
})

//여기는 const 뭐시기가 왜없지?
router.get("/cart", async (req, res) => {
  const cart = await Cart.find({});
  const goodsId = cart.map(cart => cart.goodsId);

  goodsInCart = await Goods.find()
    .where("goodsId")
    .in(goodsId);

  concatCart = cart.map(c => {
    for (let i = 0; i < goodsInCart.length; i++) {
      if (goodsInCart[i].goodsId == c.goodsId) {
        return { quantity: c.quantity, goods: goodsInCart[i] };
      }
    }
  });

  res.json({
    cart: concatCart
  });
});

module.exports = router;