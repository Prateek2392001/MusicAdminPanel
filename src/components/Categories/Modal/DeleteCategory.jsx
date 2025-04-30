import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const DeleteCategory = ({ show, handleClose, category, fetchCategories }) => {
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("SuperAdminToken");

  const handleDelete = async () => {
    if (!token) {
      alert("Unauthorized: No token found");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(
        `${api}/deleteCategory/${category._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.status === 1) {
        alert("Category deleted successfully!");
        fetchCategories(); // Refresh category list
        handleClose();
      } else {
        alert(response.data?.msg || "Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the category{" "}
        <strong>{category.categoryName}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCategory;
