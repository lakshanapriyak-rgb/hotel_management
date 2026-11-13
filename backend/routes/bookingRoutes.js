
const express=require("express");
const router=express.Router();
const pool=require("../config/db");

router.post("/",async(req,res)=>{
  try{
    const {hotel_id,customer_name,email,phone,check_in,check_out,guests}=req.body;
    if(!hotel_id||!customer_name||!email||!phone||!check_in||!check_out||!guests){
      return res.status(400).json({error:"All fields are required"});
    }
    const start=new Date(check_in);
    const end=new Date(check_out);
    if(isNaN(start)||isNaN(end)||end<=start){
      return res.status(400).json({error:"Invalid check-in or check-out date"});
    }
    if(!Number.isInteger(Number(guests))||Number(guests)<1){
      return res.status(400).json({error:"Invalid guest count"});
    }
    const hotel=await pool.query("SELECT price FROM hotels WHERE id=$1",[hotel_id]);
    if(hotel.rows.length===0){
      return res.status(404).json({error:"Hotel not found"});
    }
    const nights=Math.round((end-start)/(1000*60*60*24));
    const total_price=Number(hotel.rows[0].price)*nights;
    const result=await pool.query(
      "INSERT INTO bookings (hotel_id,customer_name,email,phone,check_in,check_out,guests,total_price) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [hotel_id,customer_name,email,phone,check_in,check_out,guests,total_price]
    );
    res.status(201).json({message:"Booking successful",booking:result.rows[0]});
  }
  catch(err){
    console.error(err.message);
    res.status(500).json({error:"Booking failed"});
  }
});

router.get("/",async(req,res)=>{
  try{
    const result=await pool.query(
      "SELECT b.*,h.title AS hotel_name FROM bookings b JOIN hotels h ON b.hotel_id=h.id ORDER BY b.created_at DESC"
    );
    res.json(result.rows);
  }
  catch(err){
    res.status(500).json({error:"Could not fetch bookings"});
  }
});

router.get("/:id",async(req,res)=>{
  try{
    const result=await pool.query("SELECT * FROM bookings WHERE id=$1",[req.params.id]);
    if(result.rows.length===0){
      return res.status(404).json({error:"Booking not found"});
    }
    res.json(result.rows[0]);
  }
  catch(err){
    res.status(500).json({error:"Could not fetch booking"});
  }
});

router.delete("/:id",async(req,res)=>{
  try{
    const result=await pool.query(
      "UPDATE bookings SET status='Cancelled' WHERE id=$1 AND status='Confirmed' RETURNING *",
      [req.params.id]
    );
    if(result.rows.length===0){
      return res.status(404).json({error:"Booking not found or already cancelled"});
    }
    res.json({message:"Booking cancelled successfully",booking:result.rows[0]});
  }
  catch(err){
    res.status(500).json({error:"Could not cancel booking"});
  }
});

module.exports=router;
