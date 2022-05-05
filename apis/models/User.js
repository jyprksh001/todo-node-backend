import Joi from "Joi";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

let userSchema = mongoose.Schema({
    phone: {
       type: String,
       unique: true,
    },
    password: String,
},{timestamps:true});
   
userSchema.methods.joiValidate =  function (obj){
    let {phone,password}=this;
    let schema =Joi.object({
        phone: Joi.string().min(10).max(10).required(),
        password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/).required()
    })
    return  schema.validate({phone,password}, { abortEarly: false });
}

userSchema.methods.encryptPassword = (password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}

userSchema.methods.comparePassword = (password,hash)=>{
    return bcrypt.compareSync(password,hash);
}

userSchema.pre('save', function(next){
    let user = this;
    if(user.isModified('password')){
        user.password = user.encryptPassword(user.password);
    }
    next();
});

export default mongoose.model('User', userSchema);
