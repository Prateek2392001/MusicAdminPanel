import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const AddCategory = ({ show, handleClose, fetchCategories }) => {
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = Cookies.get("SuperAdminToken");

  // ✅ Handle name change with validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setCategoryName(value);
      setError(null); // Remove error if valid
    } else {
      setError("Category name should contain only alphabets.");
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Store selected image
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!categoryName.trim()) {
      setError("Category name is required!");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Unauthorized: No token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("categoryName", categoryName);
      formData.append("image", image);

      const response = await axios.post(`${api}/createCategory`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 1) {
        setSuccess("Category added successfully!");
        setCategoryName(""); // Reset form
        setImage(null);
        fetchCategories(); // Refresh category list
        setTimeout(() => {
          handleClose(); // Close modal
          setSuccess(null);
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to add category.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setError(error.response?.data?.message || "Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              onChange={handleNameChange}
              placeholder="Enter category name"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Upload Category Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !categoryName.trim()}
        >
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            "Save"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCategory;
