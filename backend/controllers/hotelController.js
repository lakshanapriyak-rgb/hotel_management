const pool=require("../config/db");
const fs=require("fs");
const path=require("path");
// 1. get all hotels (search, price filter, pagination)
const getHotels=async (req, res) => {
  try {
    const { search="", minPrice, maxPrice, limit = 5, offset = 0 } = req.query;
    const conditions=[];
    const values=[];
    if (search){
      values.push(`%${search}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }
    if (minPrice) {
      values.push(minPrice);
      conditions.push(`price >= $${values.length}`);
    }
    if (maxPrice) {
      values.push(maxPrice);
      conditions.push(`price<= $${values.length}`);
    }
    const where=conditions.length ? "WHERE " + conditions.join(" AND ") : "";
    const countResult=await pool.query(
      `SELECT COUNT(*) FROM hotels ${where}`,
      values
    );
    const total=parseInt(countResult.rows[0].count);
    values.push(Number(limit));
    values.push(Number(offset));
    const result=await pool.query(
      `SELECT * FROM hotels ${where} ORDER BY id DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );
    res.json({ total, hotels: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
};



// 2. create a hotel
const createHotel=async (req, res) => {
  const removeFile=()=>{
    if (req.file) fs.unlink(req.file.path, () => {});
  };
  try {
    const { title, description, latitude, longitude, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }
    if (!title || !title.trim()) {
      removeFile();
      return res.status(400).json({ error: "Title is required" });
    }
    if (!description || !description.trim()) {
      removeFile();
      return res.status(400).json({ error: "Description is required" });
    }
    const lat = Number(latitude);
    const lng = Number(longitude);
    const cost = Number(price);

    if (latitude === undefined || latitude === "" || isNaN(lat) || lat < -90 || lat > 90) {
      removeFile();
      return res.status(400).json({ error: "Latitude must be between -90 and 90" });
    }
    if (longitude === undefined || longitude === "" || isNaN(lng) || lng < -180 || lng > 180) {
      removeFile();
      return res.status(400).json({ error: "Longitude must be between -180 and 180" });
    }
    if (price === undefined || price === "" || isNaN(cost) || cost <= 0) {
      removeFile();
      return res.status(400).json({ error: "Price must be a positive number" });
    }
    const imagePath = "/uploads/" + req.file.filename;
    const result = await pool.query(
      "INSERT INTO hotels (image, title, description, latitude, longitude, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [imagePath, title.trim(), description.trim(), lat, lng, cost]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    removeFile();
    console.error(err.message);
    res.status(500).json({ error: "Failed to create hotel" });
  }
};
// 3. get one hotel by id
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }
    const result = await pool.query("SELECT * FROM hotels WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch hotel" });
  }
};
// 4. update a hotel
const updateHotel = async (req, res) => {
  const removeNewFile = () => {
    if (req.file) fs.unlink(req.file.path, () => {});
  };
  try {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      removeNewFile();
      return res.status(400).json({ error: "Invalid hotel id" });
    }
    const existing = await pool.query("SELECT * FROM hotels WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      removeNewFile();
      return res.status(404).json({ error: "Hotel not found" });
    }
    const oldHotel = existing.rows[0];
    const { title, description, latitude, longitude, price } = req.body;
    if (!title || !title.trim()) {
      removeNewFile();
      return res.status(400).json({ error: "Title is required" });
    }
    if (!description || !description.trim()) {
      removeNewFile();
      return res.status(400).json({ error: "Description is required" });
    }
    const lat = Number(latitude);
    const lng = Number(longitude);
    const cost = Number(price);
    if (latitude === undefined || latitude === "" || isNaN(lat) || lat < -90 || lat > 90) {
      removeNewFile();
      return res.status(400).json({ error: "Latitude must be between -90 and 90" });
    }
    if (longitude === undefined || longitude === "" || isNaN(lng) || lng < -180 || lng > 180) {
      removeNewFile();
      return res.status(400).json({ error: "Longitude must be between -180 and 180" });
    }
    if (price === undefined || price === "" || isNaN(cost) || cost <= 0) {
      removeNewFile();
      return res.status(400).json({ error: "Price must be a positive number" });
    }
    const imagePath = req.file ? "/uploads/" + req.file.filename : oldHotel.image;
    const result = await pool.query(
      "UPDATE hotels SET image = $1, title = $2, description = $3, latitude = $4, longitude = $5, price = $6 WHERE id = $7 RETURNING *",
      [imagePath, title.trim(), description.trim(), lat, lng, cost, id]
    );

    if (req.file && oldHotel.image) {
      fs.unlink(path.join(__dirname, "..", oldHotel.image), () => {});
    }

    res.json(result.rows[0]);
  } catch (err) {
    removeNewFile();
    console.error(err.message);
    res.status(500).json({ error: "Failed to update hotel" });
  }
};

// 5. delete a hotel
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }

    const existing = await pool.query("SELECT * FROM hotels WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    await pool.query("DELETE FROM hotels WHERE id = $1", [id]);

    if (existing.rows[0].image) {
      fs.unlink(path.join(__dirname, "..", existing.rows[0].image), () => {});
    }

    res.json({ message: "Hotel deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete hotel" });
  }
};

module.exports = { getHotels, createHotel, getHotelById, updateHotel, deleteHotel };