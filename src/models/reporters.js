const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


const reportersSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:30,
            validate(value){
                if(value<0){
             throw new  Error ('age is positive number');
                }
            }
        },

        email:{
            type:String,
            trim:true,
            required:true,
            lowercase:true,
            unique:true,
            validate(value){
                if(!validator.isEmail(value)){
             throw new  Error ('it is not email');
                }
            }
        },
        password:{
            type:String,
            trim:true,
            required:true,
            minLength:6
            
        },
        tokens:[
            {   token:{
                type:String,
            required:true

            }}
        ],
        phonenumber:{
            type:Number,
            trim:true,
            required:true,
            minLength:11,
            validate(value){
                if(value<0)
                throw new Error('phonenumber must be positie nimber');
            }

        }, avatar:{
            type:Buffer
        }
})


reportersSchema.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'owner'
})

///////encryption the pass///////
reportersSchema.pre('save',async function(next){
    const reporters=this
    console.log(reporters)
    if(reporters.isModified('password')){
        reporters.password=await bcrypt.hash(reporters.password,8)
    }
    next()
})
////////////login////////
reportersSchema.statics.findByCredentials=async(email,password)=>{
    const reporters=await Reporters.findOne({email})
    console.log(reporters)
    if(!reporters){
        throw new Error('unable to login .check email or passworddd')
    }
    const isMatch=await bcrypt.compare(password,reporters.password)
    if(!isMatch){
        throw new Error('unable to login .check email or password')
    }
    return reporters
}
/////////////token///////////////////
reportersSchema.methods.generateToken=async function(){
    const reporters=this
    const token=jwt.sign({_id:reporters._id.toString()},'node-course')
    //
    reporters.tokens=reporters.tokens.concat({token:token})
    await reporters.save()
    return token
}

 
const Reporters=mongoose.model('Reporters',reportersSchema)
module.exports=Reporters