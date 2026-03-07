import { useState } from "react";
import API from "../api/axios";

export default function CreateInternshipForm({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    stipend: "",
    industry: "",
    required_experience: 0,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/company/create-internship", form);
      onCreated();
      setForm({
        title: "",
        description: "",
        location: "",
        stipend: "",
        industry: "",
        required_experience: 0,
      });
    } catch (err) {
      alert("Failed to create internship");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <h2 className="text-lg font-bold">Create Internship</h2>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input-field" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input-field" required />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="input-field" required />
      <input name="stipend" value={form.stipend} onChange={handleChange} placeholder="Stipend" className="input-field" />
      <input name="industry" value={form.industry} onChange={handleChange} placeholder="Industry" className="input-field" />
      <input type="number" name="required_experience" value={form.required_experience} onChange={handleChange} placeholder="Experience (years)" className="input-field" />
      <button className="btn-primary w-full">Create</button>
    </form>
  );
}
