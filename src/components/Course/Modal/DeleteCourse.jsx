import React, { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const DeleteCourse = ({ show, handleClose, course, refreshList }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = Cookies.get("SuperAdminToken");

  // Handle Course Deletion
  const handleDelete = async () => {
    if (!token) {
      setError("Unauthorized: No token found. Please log in again.");
      return;
    }

    if (!course || !course._id) {
      setError("Invalid course selected for deletion.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `${api}/courses/delete/${course._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.status === 1) {
        refreshList();
        handleClose();
      } else {
        throw new Error(response.data?.message || "Failed to delete course.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error deleting course. Please try again."
      );
      console.error("Delete Course Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {course ? (
          <p>
            Are you sure you want to delete the course{" "}
            <strong>{course.name}</strong>?
          </p>
        ) : (
          <p className="text-danger">Error: No course selected for deletion.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={!course || loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCourse;
