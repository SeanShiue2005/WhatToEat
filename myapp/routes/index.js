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
  OpeningTimes:{
    type:[{type:Boolean}],
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

async function verify(types,id)
{
  const data = await restList.find()
  for (element of types){
    if(element==="restaurant")
    {
      for(ele of data)
      {
        if(ele.id===id)
        {
          throw new Error( "餐廳已經存在")
        }
      }
      return data;
    }
  }
  throw new Error("這不是間餐廳")
}
router.post("/verify_data",async function(req,res){
  try{
    let types=req.body.types;
    const id=req.body.id;
    let verify_ans=await verify(types,id);
    res.json(verify_ans)
  }
  catch(err){
    res.status(500).json({message:err.message})
  }
})

router.post("/data",async function(req,res){
  try{
    reqbody=req.body
      const restdata= new restList({
          name:reqbody.name,
          location:reqbody.location,
          rating:reqbody.rating,
          priceLevel:reqbody.priceLevel,
          OpeningHours:reqbody.OpeningHours,
          OpeningTimes:reqbody.OpeningTimes,
          id:reqbody.id
      });
      const newrest = await restdata.save();

      console.log(reqbody)
      console.log(newrest)
      res.status(201).json(newrest);
  }   
  catch(err){
    console.log(req.body)
      console.log(typeof(req.body.OpeningHours))
      res.status(400).json({message:err.message});
  }
})

router.delete("/data",async(req,res)=>{
  try{
    let deleterest = await restList.deleteOne({id:req.body.id});
    res.status(201).json({message:deleterest.message});
  }
  catch(err)
  {
    res.status(400).json({message:err.message})
  }
})
module.exports = router;
