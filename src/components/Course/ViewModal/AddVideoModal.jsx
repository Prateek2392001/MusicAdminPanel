import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const AddVideoModal = ({ show, handleClose, course_id, refreshMediaList }) => {
  const [formData, setFormData] = useState({
    title: "",
    mediaType: "video",
    media: null,
    duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    console.log("Received course_id in modal:", course_id);
  }, [course_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setFormData({ ...formData, media: file });
  };

  const handleFileChangeDocument = (e) => {
    const file = e.target.files[0];
    setError(null);
    setFormData({ ...formData, document: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = Cookies.get("SuperAdminToken");
    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    if (!course_id) {
      setError("Course ID is missing.");
      setLoading(false);
      return;
    }

    if (!formData.media) {
      setError("Please upload a valid media file.");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("courseID", course_id);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("mediaType", formData.mediaType);
      formDataToSend.append("media", formData.media);
      formDataToSend.append("document", formData.document);
      if (formData.mediaType === "video") {
        formDataToSend.append("duration", formData.duration);
      }

      console.log("Payload being sent:", [...formDataToSend.entries()]);

      {
        formData.mediaType === "document" && (
          <small className="text-muted">Only PDF files are allowed.</small>
        );
      }

      const response = await axios.post(
        `${api}/courses/videos/add`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === 1) {
        setSuccess(`${formData.mediaType} added successfully!`);
        setError(null); // ✅ Ensure error is cleared

        setFormData({
          title: "",
          mediaType: "video",
          media: null,
          duration: "",
        });

        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError(response.data?.message || "Failed to add media.");
        setSuccess(null); // Prevent success message on failure
      }
    } catch (err) {
      setError("Error adding media.");
      setSuccess(null); // Ensure success message does not appear
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Media</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
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
            <Form.Label>Upload File</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Document</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChangeDocument}
              accept={formData.mediaType === "document" ? ".pdf" : ""}
            />
          </Form.Group>

          {formData.mediaType === "video" && (
            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100"
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Add Media"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddVideoModal;
