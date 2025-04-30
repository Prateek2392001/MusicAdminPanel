import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const UpdateBanner = ({ show, handleClose, bannerId, fetchBanners }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = Cookies.get("SuperAdminToken");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setError(null);
  };

  const handleUpdate = async () => {
    if (!image) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.put(
        `${api}/banners/update/${bannerId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 1) {
        setSuccess("Banner updated successfully!");
        fetchBanners();
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Banner</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Select New Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdate} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateBanner;
