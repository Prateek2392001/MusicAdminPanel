import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const UpdateCourse = ({ show, handleClose, selectedCourse, refreshList }) => {
  const [formData, setFormData] = useState({
    name: "",
    thumbnail: null,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = Cookies.get("SuperAdminToken");

  // Populate form with selected course details
  useEffect(() => {
    if (selectedCourse) {
      setFormData({
        name: selectedCourse.name || "",
        thumbnail: null, // Reset file input
        description: selectedCourse.description || "",
      });
    }
  }, [selectedCourse]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, thumbnail: file });
  };

  // Handle update request
  const handleUpdate = async () => {
    if (!token) {
      setError("Unauthorized: No token found. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      if (formData.thumbnail instanceof File) {
        formDataToSend.append("thumbnail", formData.thumbnail);
      }

      const response = await axios.put(
        `${api}/courses/update/${selectedCourse._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.status === 1) {
        refreshList(); // Refresh courses list
        handleClose(); // Close modal
      } else {
        throw new Error(response.data?.message || "Failed to update course.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error updating course. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
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
            <Form.Label>Thumbnail</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept="image/*"
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
              style={{ height: "150px" }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpdate} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Update Course"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateCourse;
