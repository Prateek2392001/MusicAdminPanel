import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const UpdateModal = ({ show, onHide, record, onSuccess }) => {
  const [status, setStatus] = useState("Present");
  const [schedule, setSchedule] = useState([]);
  const [days, setDays] = useState([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      setStatus(record.status || "Present");
      setSchedule(record.schedule || []);
    }
  }, [record]);

  const handleCheckboxChange = (day) => {
    setSchedule((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (schedule.length === 0) {
      alert("Please select at least one schedule day.");
      return;
    }

    setLoading(true);
    const token = Cookies.get("SuperAdminToken");

    try {
      const res = await axios.put(
        `${api}/attendance/${record._id}`,
        {
          status,
          schedule,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === 1) {
        alert("Attendance updated successfully!");
        onSuccess();
        onHide();
      } else {
        alert(res.data.message || "Update failed.");
      }
    } catch (err) {
      console.error("Error updating attendance:", err);
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Attendance</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {record && (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Schedule</Form.Label>
              <div className="d-flex flex-wrap">
                {days.map((day) => (
                  <Form.Check
                    key={day}
                    type="checkbox"
                    id={`day-${day}`}
                    label={day}
                    checked={schedule.includes(day)}
                    onChange={() => handleCheckboxChange(day)}
                    className="me-3"
                  />
                ))}
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={onHide} className="me-2">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UpdateModal;
