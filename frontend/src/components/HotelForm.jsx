import { useState } from "react";
function HotelForm({ initialData={}, onSubmit, buttonText="Save" }) {
  const [form, setForm]=useState({
    title: initialData.title || "",
    description: initialData.description || "",
    latitude: initialData.latitude || "",
    longitude: initialData.longitude || "",
    price: initialData.price || "",
  });
  const [image, setImage]=useState(null);
  const [error, setError]=useState("");
  const [submitting, setSubmitting]=useState(false);
  const handleChange = (e) =>{
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit=async (e)=> {
    e.preventDefault();

    setError("");
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required");
      return;
    }
    if (!initialData.image && !image) {
      setError("Image is required");
      return;
    }
    const formData=new FormData();
    formData.append("title",form.title);
    formData.append("description",form.description);
    formData.append("latitude",form.latitude);
    formData.append("longitude",form.longitude);
    formData.append("price",form.price);
    if (image) {
      formData.append("image", image);
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } 
    catch (err) 
    {
  setError(
    typeof err==="string"
      ? err
      : err.response?.data?.error|| "Something went wrong"
  );
  setSubmitting(false);
}

  };

  return (
    <form className="hotel-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}
      <label>Title</label>
      <input name="title" value={form.title} onChange={handleChange} />

      <label>Description</label>
      <textarea
        name="description"

        rows="4"
        value={form.description}
        onChange={handleChange}
      />

      <label>Latitude</label>
      <input
        type="number"
        
        step="any"
        name="latitude"
        value={form.latitude}
        onChange={handleChange}
      />

      <label>Longitude</label>
      <input
        type="number"
        step="any"
        
        name="longitude"
        value={form.longitude}
        onChange={handleChange}
      />

      <label>Price</label>
      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
      />

      <label>Image</label>
      {initialData.image && (
        <img
          className="form-preview"
        
          src={`http://localhost:5000${initialData.image}`}
          alt={initialData.title}
        />
      )}
      <input
        type="file"
        
        
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button type="submit" disabled={submitting}>
        
        {submitting ? "Saving..." : buttonText}
      </button>
    </form>
  );
}

export default HotelForm;