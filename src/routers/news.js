const express=require('express')
const router=new express.Router()
const News=require('../models/news')
const auth=require('../middleware/auth')
const multer=require('multer')
router.post('/news',auth,async(req,res)=>{
    const newsin=new News({...req.body,owner:req.news._id})
    try{
   await newsin.save()
        res.status(200).send(newsin)
    }catch(e){
        res.status(400).send(e)
    }
})
//////////////get all////////////////////////


router.get('/news',auth,async(req,res)=>{
    try{
    await req.news.populate('news').execPopulate()  ////  news is name of file in robot
        res.send(req.reporters.news)
    }
catch(e){
        res.status(400).send(e)
    }
})
////////////////////get by id////////////////

router.get('/news/:id',auth,async(req,res)=>{
    

    const _id=req.params.id
    try{const news= News.findOne({_id,owner:req.news._id})
        if(!news){
            return res.status(404).send('unable to find news')
        }
        res.status(200).send(news)
    }catch(e){
        res.status(500).send('unable to connect to data'+e)
    }
})

/////////////delete/////////////////

router.delete('/news/:id',auth,async(req,res)=>{
    const _id=req.params.id
      try{
          const news=await News.findOneAndDelete({_id,owner:req.news._id})
          if(!news){
              return res.send('unable to find news')
          }
          res.send(news)
      }
      catch(e){
          res.send(e)
      }
          
      
  })
///////////////patch=update/////////////////////

router.patch('/news/:id',async(req,res)=>{
    const updates=Object.keys(req.body)  
    console.log(updates)
    const _id=req.params.id;
      try{
          
          const news=await News.findOne({_id,owner:req.news._id})

          if(!news){
            return res.status(400).send('unable to find news')
        }
        
        
          updates.forEach((update)=>news[update]=req.body[update])
              await news.save()
              res.send(news)
          
         
      }
      catch(e){
          res.status(400).send('unable to connecttttt to data   '+e)
      }
           
  })
///////////////////
const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
      if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/))
        {
            return cb(new Error('please upload an image'))
        }
        cb(null,true)
    }
})
router.post('newsAvatar/:id',auth,upload.single('image'),async(req,res)=>{
    try{
        const news=await News.findOne({_id,owner:req.reporters._id})
        if(!news){
            return res.states(400).send('not found news')
        }
        news.image=req.file.buffer
        news.save()
        res.send('Image uploaded')
    }
    catch(e){
        res.send(e)
    }
})







module.exports=router