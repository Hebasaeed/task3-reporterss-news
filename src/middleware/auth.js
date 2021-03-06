const jwt=require('jsonwebtoken')
const Reporters=require('../models/reporters')
const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        console.log(token)
        const decode=jwt.verify(token,'node-course')
        console.log(decode)
        const reporters=await Reporters.findOne({_id:decode._id,'tokens.token':token})
        console.log(reporters)
        if(!reporters){
            console.log('no reporters is found')
            throw new Error()
        }
        req.reporters=reporters
        req.token=token
        next()

    }
    catch(e){
        res.status(401).send({error:'please authenticateee'})
    }
}
module.exports=auth