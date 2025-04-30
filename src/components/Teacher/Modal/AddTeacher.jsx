import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const AddTeacher = ({ show, handleClose, refreshList }) => {
  const [formData, setFormData] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle Form Submission
  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const token = Cookies.get("SuperAdminToken");
    if (!token) {
      setError("Unauthorized: No token found");
      setLoading(false);
      return;
    }

    // **Ensure password is not empty**
    if (!formData.password || formData.password.trim() === "") {
      setError("Password is required");
      setLoading(false);
      return;
    }

    //  **Check All Required Fields**
    if (
      !formData.name ||
      !formData.email ||
      !formData.contact ||
      !formData.idProof
    ) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    //  **FormData for API**
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("idProof", formData.idProof);
    formDataToSend.append("occupation", formData.occupation);
    formDataToSend.append("password", formData.password);

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      console.log("🔹 Sending Form Data:", formData); // Debugging

      const response = await axios.post(
        `${api}/create-instructor`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(" API Success:", response.data);
      alert("Teacher added successfully!");

      await refreshList(); //  Refresh Table
      handleClose(); //  Close Modal
      setFormData({
        name: "",
        email: "",
        contact: "",
        idProof: "",
        password: "",
        image: null,
      });
    } catch (err) {
      console.error(" API Error:", err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Teacher</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contact</Form.Label>
            <Form.Control
              type="text"
              name="contact"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Aadhar Number</Form.Label>
            <Form.Control
              type="text"
              name="idProof"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Occupation</Form.Label>
            <Form.Control
              type="text"
              name="occupation"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleFileChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Save Teacher"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTeacher;
