const express = require("express");
const Goods = require("../schemas/Goods");

const router = express.Router();

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

router.post('/goods', async (req, res) => {
  // post 받아오는 것들 ( 상품, 이름, url, 카테고리, 가격)
    const { goodsId, name, thumbnailUrl, category, price } = req.body;
  
    isExist = await Goods.find({ goodsId });
    if (isExist.length == 0) {
      await Goods.create({ goodsId, name, thumbnailUrl, category, price });
    }
    res.send({ result: "success" });
  });

router.get("/goods/:goodsId", async (req, res) => {
  const { goodsId } = req.params;
  goods = await Goods.findOne({ goodsId: goodsId });
  res.json({ detail: goods });
});

module.exports = router;