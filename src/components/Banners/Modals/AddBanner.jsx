import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const AddBanner = ({ show, handleClose, fetchBanners }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = Cookies.get("SuperAdminToken");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!image) {
      setError("Please select an image to upload.");
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
      formData.append("image", image);

      const response = await axios.post(`${api}/banners/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 1) {
        setSuccess("Banner added successfully!");
        setImage(null);
        fetchBanners(); // Refresh banner list
        setTimeout(() => {
          handleClose(); // Close modal
          setSuccess(null);
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to add banner.");
      }
    } catch (error) {
      console.error("Error adding banner:", error);
      setError(error.response?.data?.message || "Failed to add banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Banner</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Upload Banner Image</Form.Label>
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
          disabled={loading || !image}
        >
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            "Upload"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBanner;
