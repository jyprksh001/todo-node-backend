import mongoose from "mongoose";

let taskSchema = mongoose.Schema({
    title: {
        type: String,
    },
    image:{
        type: String,
    },
    category:{  
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},{timestamps:true});

export default mongoose.model('Task', taskSchema);


