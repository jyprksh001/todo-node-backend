import mongoose from 'mongoose';
const dbConnect= async() =>{
  if (mongoose.connection.readyState >= 1) return
  return mongoose
    .connect(process.env.MONGO_DB)
    .then(()=>console.log("DB connection established"))
    .catch((err)=>{
      console.log ("Error establishing mongodb connection")
      console.log(err)
    });
}

let connectionPromise = dbConnect();
export default connectionPromise;