import jsonwebtoken from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async(req,res)=>{
    console.log("signup",req.body);
    let user= new User(req.body);
    let validate = await user.joiValidate();
    if(validate.error){
        let errors = validate.error.details.map(({path,message})=>{return{[path[0]]:message}})
        return res.status(400).send(errors);
    }else{
        let user = new User(req.body);
        user.save((err,user)=>{
            if(err){
                return res.status(400).send(err);
            }else{
                return res.status(200).send(user);
            }
        });
    }
}

export const signin = (req,res)=>{
    let {phone,password} = req.body;
    
    User.findOne({phone},(err,user)=>{
        if(err){
            return res.status(400).send(err);
        }else if(!user){
            return res.status(400).send("User not found");
        }else{
            if(user.comparePassword(password,user.password)){
                let token=jsonwebtoken.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
                return res.status(200).send({phone:user.phone,token});
            }else{
                return res.status(400).send("Invalid password");
            }
        }
    });
}

