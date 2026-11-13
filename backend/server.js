
require("dotenv").config();
const express=require("express");
const cors=require("cors");
const pool=require("./config/db");
const hotelRoutes=require("./routes/hotelRoutes");
const bookingRoutes=require("./routes/bookingRoutes");
const path=require("path");
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/hotels",hotelRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.get("/",(req,res)=>{
  res.send("Hotel API is running");
});
app.get("/api/test-db",async(req,res)=>{
  try{
    const result=await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  }
  catch(err){
    console.error(err.message);
    res.status(500).json({error:"Database connection failed"});
  }
});
app.use((err,req,res,next)=>{
  console.error(err.message);
  res.status(400).json({error:err.message});
});
const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
  console.log("Server running on port "+PORT);
});
