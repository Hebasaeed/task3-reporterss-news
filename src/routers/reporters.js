const express=require('express')
const router=new express.Router()
const Reporters=require('../models/reporters')
const auth=require('../middleware/auth')
const multer=require('multer')


//////////sign up///////////
router.post('/reporters',async(req,res)=>{
    const reportersin=new Reporters(req.body)
    try{
        await reportersin.save()
        const token=await reportersin.generateToken()
        res.status(200).send({reportersin,token})
    }catch(e){
        res.status(400).send('error:',e)
    }
})
////////////log in///////////////
router.post('/reporters/login',auth,async(req,res)=>{
    try{
        const reporters=await Reporters.findByCredentials(req.body.email,req.body.password)
        ///
        const token=await reporters.generateToken()
        res.send({reporters,token})
    }
    catch(e){
        res.send('try agin'+e)
    }

})
/////////////////logout////////////know from header,put it one from tokens of target object to do it the operation
router.delete('/reporters/logout',auth,async(req,res)=>{
    try{
        req.reporters.tokens=req.reporters.tokens.filter((el)=>{
            return el.token !==req.token})
            await req.reporters.save()
            res.send('log out success')
    }
    catch(e){
        res.send("error  "+e)

    }
})
////////////logout all////////////
router.delete('/reporters/logoutAll',auth,async(req,res)=>{
    try{
        req.reporters.tokens=[]                     ///make tokens=null
            await req.reporters.save()
            res.send('log out all success')
    }
    catch(e){
        res.send("error  "+e)

    }
})
////////////////////get by id////////////////
router.get('/reporters/:id',auth,(req,res)=>{
    // console.log(req.params.id)  ////////////   /value of id in url of postman
    const _id=req.params.id
    Reporters.findById(_id).then((reporters)=>{
        if(!reporters){
            return res.status(404).send('unable to find reporters')
        }
        res.status(200).send(reporters)
    }).catch((e)=>{
        res.status(500).send('unable to connect to data'+e)
    })
})
//////////////get all////////////////////////
router.get('/reporters',auth,(req,res)=>{////name of file in robot
    Reporters.find({}).then((reporters)=>{    
        res.status(200).send(reporters)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})
/////////////delete/////////////////
router.delete('/reporters/:id',auth,async(req,res)=>{
    const _id=req.params.id
      try{
          const reporters=await Reporters.findByIdAndDelete(_id)
          if(!reporters){
              return res.send('unable to find reporters')//different in one number of id
          }
          res.send(reporters)
      }
      catch(e){
          res.send(e)//different in size of id
      } 
  })
  //////////////////////update////////////////////
router.patch('/reporters/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)  //////O IS CAPITAL
    console.log(updates)
    const _id=req.params.id;
      try{
          const reporters=await Reporters.findById(_id)

          if(!reporters){
            return res.send('unable to find reporters')//same size of id but different in one number
        }
        res.status(200).send(reporters)
        
          updates.forEach((update)=>reporters[update]=req.body[update])
              await reporters.save()
      }
      catch(e){
          res.status(400).send('unable to connect to dataaaaaaa     '+e)//different in size of id
      }
           
  })
  ////////////////////////////////////////
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
router.post('/profile/avatar',auth,upload.single('image'),async(req,res)=>{
    try{
        req.reporters.avatar=req.file.buffer
        await req.reporters.save()
        res.send('Image uploaded')
    }
    catch(e){
        res.send(e)
    }
})




module.exports=router