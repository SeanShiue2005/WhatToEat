const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();

mongoose.connect('mongodb+srv://Admin:34145556@cluster0.myn8n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
const db=mongoose.connection;

db.on('error', console.error.bind(console, 'Connection fails!'));

// 與資料庫連線成功連線時
db.once('open', function () {
    console.log('Connected to database...');
});

const ListSchema = new mongoose.Schema({
  name: { //事項名稱
      type: String, //設定該欄位的格式
      required: true //設定該欄位是否必填
  },
  location: { //是否已完成
      type: String,
      required: true, //設定預設值
  },
  rating: { //新增的時間
      type: Number,
      required: true
  },
  priceLevel:{
    type:String,
    required:true
  },
  OpeningHours:{
    type:Array,
    required:true
  },
  id:{
    type:String,
    required:true
  }
})
const restList = mongoose.model('restList', ListSchema);
router.get('/data', async function(req, res){
  try{
    const data = await restList.find()
    res.json(data);
  }
  catch(err)
  {
    res.status(500).json({message:err.message})
  }
  console.log("getData");
});

router.post("/data",async(req,res)=>{
  try{
      const restdata= new restList({
          name:req.body.name,
          location:req.body.location,
          rating:req.body.rating,
          priceLevel:req.body.priceLevel,
          OpeningHours:req.body.OpeningHours,
          id:req.body.id
      });
      console.log(typeof(req.body.OpeningHours))
      console.log(req.body.OpeningHours)
      console.log(typeof(req.body.priceLevel))
      const newrest = await restdata.save();
      res.status(201).json(newrest);
  }   
  catch(err){
      res.status(400).json({message:err.message});
  }
})
module.exports = router;
