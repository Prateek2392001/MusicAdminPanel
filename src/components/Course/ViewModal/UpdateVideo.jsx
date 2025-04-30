import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const UpdateVideo = ({ show, handleClose, media, course_ID, refreshList }) => {
  const [formData, setFormData] = useState({
    title: media?.title || "",
    mediaType: media?.mediaType || "video",
    duration: media?.duration || "",
  });

  const [mediaFile, setMediaFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMediaFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
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

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("courseID", course_ID);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("mediaType", formData.mediaType);
      formDataToSend.append("duration", formData.duration);

      if (mediaFile) {
        formDataToSend.append("media", mediaFile);
      }

      const response = await axios.put(
        `${api}/courses/videos/update/${media._id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 1) {
        setSuccess("Media updated successfully!");
        setError(null);
        setLoading(false);

        setTimeout(() => {
          handleClose();
          window.location.reload();
        }, 1000);
      } else {
        setError(response.data?.message || "Failed to update media.");
        setSuccess(null);
      }
    } catch (err) {
      setError("Failed to update media. Please try again.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setError(null);
        setSuccess(null);
        handleClose();
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Media</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleUpdate}>
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
            <Form.Label>Upload New File (optional)</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100"
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Update Media"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateVideo;
