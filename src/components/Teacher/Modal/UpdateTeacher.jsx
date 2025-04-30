import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const UpdateTeacher = ({ show, handleClose, selectedTeacher, refreshList }) => {
  const [formData, setFormData] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(""); // Show Existing Image

  // Populate form when modal opens
  useEffect(() => {
    if (selectedTeacher) {
      setFormData({
        _id: selectedTeacher?._id || "",
        name: selectedTeacher?.name || "",
        email: selectedTeacher?.email || "",
        contact: selectedTeacher?.contact || "",
        idProof: selectedTeacher?.idProof || "",
        password: "",
        image: null,
      });

      setPreviewImage(selectedTeacher?.image || "");
    }
  }, [selectedTeacher]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file)); // Show Selected Image
    }
  };

  // Handle Form Submission
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    const token = Cookies.get("SuperAdminToken");

    if (!token) {
      setError("Unauthorized: No token found");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("idProof", formData.idProof);

      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }
      if (formData.image) {
        formDataToSend.append("image", formData.image); // ✅ Append Image If Updated
      }

      const response = await axios.put(
        `${api}/instructors/update/${selectedTeacher?._id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 1) {
        alert("Teacher updated successfully!");
        handleClose();
        refreshList(); // ✅ Refresh the teacher table
        setPreviewImage(""); // ✅ Clear Preview Image
      } else {
        throw new Error(response.data.message || "Failed to update teacher.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Teacher</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Aadhar Number</Form.Label>
            <Form.Control
              type="number"
              name="idProof"
              value={formData.idProof}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password (Optional)</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>

          {/* ✅ Image Upload Section */}
          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          {/* ✅ Show Existing Image (If Available) */}
          {previewImage && (
            <div className="mb-3 text-center">
              <p>Current Image:</p>
              <img
                src={previewImage}
                alt="Teacher"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpdate} disabled={loading}>
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            "Update"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateTeacher;
