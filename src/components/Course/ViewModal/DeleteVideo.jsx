import React, { useState } from "react";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const DeleteVideo = ({ show, handleClose, course, refreshList }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSuccessMessage = (mediaType) => {
    switch (mediaType) {
      case "video":
        return "Video successfully deleted!";
      case "audio":
        return "Audio successfully deleted!";
      case "pdf":
        return "PDF successfully deleted!";
      default:
        return "Media successfully deleted!";
    }
  };

  const handleDelete = async () => {
    if (!course || !course._id || !course.mediaType) {
      setError("Invalid media data. Cannot delete.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("SuperAdminToken");
      if (!token) {
        setError("Unauthorized: No token found.");
        setLoading(false);
        return;
      }

      console.log(
        "Deleting media with ID:",
        course._id,
        "Type:",
        course.mediaType
      );

      const response = await axios.delete(
        `${api}/courses/videos/delete/${course._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Delete response:", response.data);

      if (response.data?.status === 1) {
        alert(getSuccessMessage(course.mediaType)); // Show media-specific success message

        setLoading(false);
        handleClose(); // Close modal immediately

        setTimeout(() => {
          window.location.reload(); // Auto-reload the page
        }, 500);
      } else {
        setError(response.data?.message || "Failed to delete media.");
      }
    } catch (err) {
      console.error("Error deleting media:", err.response?.data || err.message);
      setError("Failed to delete media. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setError(null); // Reset error when modal closes
        handleClose();
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Media</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>
          Are you sure you want to delete this {course?.mediaType || "media"}?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setError(null);
            handleClose();
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteVideo;
