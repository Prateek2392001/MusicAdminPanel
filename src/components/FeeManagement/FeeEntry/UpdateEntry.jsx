import React, { useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import Cookies from "js-cookie";
import { api } from "../../../api";

const UpdateEntry = ({ entryId, show, onHide }) => {
  const [newStatus, setNewStatus] = useState("");
  const token = Cookies.get("SuperAdminToken");

  const handleUpdateStatus = async () => {
    if (!token) {
      setError("Unauthorized: No token found. Please log in again.");
      return;
    }
    try {
      const response = await axios.put(
        `${api}/entry/status/${entryId}`,
        { status: "Paid" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.statusCode === 200) {
        alert("Status updated successfully!");
        onHide(); // Close the modal
        setTimeout(() => {
          onEntryUpdated(); // Thoda delay ke baad refresh
        }, 300);
      } else {
      }
    } catch (error) {
      console.error("Error updating entry status:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column gap-2">
          <Button
            variant="success"
            onClick={() => {
              setNewStatus("Paid");
              handleUpdateStatus();
            }}
          >
            Mark as Paid
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateEntry;
