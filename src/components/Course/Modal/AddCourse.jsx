import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const AddCourse = ({ show, handleClose, refreshList }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnail: null,
    categoryID: "",
    instructorID: "",
    title: "",
    mediaType: "video",
    media: null,
  });

  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = Cookies.get("SuperAdminToken");

  // Fetch categories and instructors on mount
  useEffect(() => {
    fetchCategories();
    fetchInstructors();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api}/getCategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.status === 1) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(`${api}/instructors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.status === 1) {
        setInstructors(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching instructors:", err);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, thumbnail: file });
  };

  const handlemediaChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, media: file });
  };

  // Handle form submission
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("CategoryID", formData.categoryID); // ✅ FIXED (small case)
      formDataToSend.append("instructorID", formData.instructorID); // ✅ FIXED (small case)
      formDataToSend.append("title", formData.title);
      formDataToSend.append("mediaType", formData.mediaType);
      formDataToSend.append("media", formData.media);

      if (formData.thumbnail instanceof File) {
        formDataToSend.append("thumbnail", formData.thumbnail);
      }

      const response = await axios.post(
        `${api}/courses/create`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data?.status === 1) {
        setSuccess("Course added successfully!");
        setFormData({
          name: "",
          description: "",
          thumbnail: null,
          categoryID: "",
          instructorID: "",
          title: "",
          mediaType: "video",
          media: null,
        });
        refreshList();
        setTimeout(() => handleClose(), 1500);
      } else {
        throw new Error(response.data.message || "Failed to add course.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Course Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Thumbnail</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="categoryID"
              value={formData.categoryID}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Instructor</Form.Label>
            <Form.Select
              name="instructorID"
              value={formData.instructorID}
              onChange={handleChange}
              required
            >
              <option value="">Select Instructor</option>
              {instructors.map((instructor, index) => (
                <option key={index} value={instructor._id}>
                  {instructor.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Media Type</Form.Label>
            <Form.Select
              name="mediaType"
              value={formData.mediaType}
              onChange={handleChange}
            >
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="pdf">PDF</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Media</Form.Label>
            <Form.Control
              name="media"
              type="file"
              onChange={handlemediaChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCourse;
