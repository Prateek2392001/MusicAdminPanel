import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const UpdateCategory = ({
  show,
  handleClose,
  category,
  updateCategoryState,
}) => {
  const [formData, setFormData] = useState({ categoryName: "", image: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = Cookies.get("SuperAdminToken");

  useEffect(() => {
    if (category) {
      setFormData({
        categoryName: category.categoryName || "",
        image: null,
      });
    }
  }, [category]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    if (!token) {
      setError("Unauthorized: No token found");
      setLoading(false);
      return;
    }

    try {
      const updatedData = new FormData();
      updatedData.append("categoryName", formData.categoryName);
      if (formData.image) updatedData.append("image", formData.image);

      const response = await axios.put(
        `${api}/updateCategory/${category?._id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response:", response.data); // Debugging

      if (response.data?.msg === "Category updated successfully") {
        alert("Category updated successfully!");

        // ✅ **Check if updateCategoryState exists before calling**
        if (typeof updateCategoryState === "function") {
          updateCategoryState(category._id, {
            categoryName: response.data.category.categoryName,
            image: response.data.category.image,
          });
        } else {
          console.warn("updateCategoryState is not provided.");
        }

        handleClose();
      } else {
        throw new Error(response.data?.msg || "Failed to update category.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Upload Category Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>
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

export default UpdateCategory;
