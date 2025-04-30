import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Button,
  Card,
  Col,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import CreateEntry from "./FeeEntry/CreateEntry";
import UpdateEntry from "./FeeEntry/UpdateEntry";
import { api } from "../../api";
import ViewHistoryModal from "./Modal/ViewHistoryModal";
import "./FeeCard.css"; // Import your CSS file for styling

const FeeManagement = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPaymentHistory, setSelectedPaymentHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/entries`);
      if (res.data.statusCode === 200) {
        setEntries(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getFilteredEntries = () => {
    let filtered = entries;

    if (filterType === "Advance") {
      filtered = entries.filter(
        (entry) =>
          entry.status === "Paid" &&
          entry.paymentDate &&
          moment(entry.paymentDate).isBefore(moment(entry.dueDate))
      );
    } else if (filterType === "Overdue") {
      filtered = entries.filter(
        (entry) =>
          entry.status === "Pending" && moment(entry.dueDate).isBefore(moment())
      );
    } else if (filterType === "Paid") {
      filtered = entries.filter((entry) => entry.status === "Paid");
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((entry) => {
        const name = entry.studentId?.name?.toLowerCase() || "";
        const email = entry.studentId?.email?.toLowerCase() || "";
        const course = entry.courseId?.name?.toLowerCase() || "";
        return (
          name.includes(searchTerm.toLowerCase()) ||
          email.includes(searchTerm.toLowerCase()) ||
          course.includes(searchTerm.toLowerCase())
        );
      });
    }

    return filtered;
  };

  const totalStudents = new Set(entries.map((e) => e.studentId._id)).size;
  const advanceCount = entries.filter(
    (entry) =>
      entry.status === "Paid" &&
      entry.paymentDate &&
      moment(entry.paymentDate).isBefore(moment(entry.dueDate))
  ).length;
  const overdueCount = entries.filter(
    (entry) =>
      entry.status === "Pending" && moment(entry.dueDate).isBefore(moment())
  ).length;
  const paidCount = entries.filter((entry) => entry.status === "Paid").length;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">Fees Management</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create Entry
        </Button>
      </div>

      {/* Four Cards */}
      <Row>
        <Col md={3}>
          <Card
            className="mb-4 card-hover-up"
            onClick={() => setFilterType("All")}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>Total Students</Card.Title>
              <Card.Text>{totalStudents}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="mb-4 card-hover-up"
            onClick={() => setFilterType("Advance")}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>Advance Payment</Card.Title>
              <Card.Text>{advanceCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="mb-4 card-hover-up"
            onClick={() => setFilterType("Overdue")}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>Overdue Payment</Card.Title>
              <Card.Text>{overdueCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="mb-4 card-hover-up"
            onClick={() => setFilterType("Paid")}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>Paid</Card.Title>
              <Card.Text>{paidCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search Bar */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by Student Name, Email or Course"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {/* <Button variant="secondary" onClick={() => setFilterType("All")}>
          Reset Filter
        </Button> */}
      </InputGroup>

      {loading ? (
        <p>Loading entries...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Course</th>
                <th>Fee Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredEntries().map((entry) => (
                <tr key={entry._id}>
                  <td>{entry.studentId.name}</td>
                  <td>{entry.studentId.contact}</td>
                  <td>{entry.studentId.email}</td>
                  <td>{entry.courseId.name}</td>
                  <td>₹{entry.feeAmount}</td>
                  <td>{moment(entry.dueDate).format("DD-MM-YYYY")}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        entry.status === "Paid" ? "success" : "warning"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
                          setSelectedPaymentHistory(entry.paymentHistory);
                          setShowHistoryModal(true);
                        }}
                      >
                        View History
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => alert("Reminder Sent!")}
                      >
                        Send Reminder
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedEntryId(entry._id);
                          setShowUpdateModal(true);
                        }}
                      >
                        Update Status
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {getFilteredEntries().length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateEntry
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onEntryCreated={fetchEntries}
          onSuccess={fetchEntries}
        />
      )}
      {showUpdateModal && (
        <UpdateEntry
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          entryId={selectedEntryId}
          onEntryUpdated={fetchEntries}
        />
      )}
      {showHistoryModal && (
        <ViewHistoryModal
          show={showHistoryModal}
          onHide={() => setShowHistoryModal(false)}
          paymentHistory={selectedPaymentHistory}
        />
      )}
    </div>
  );
};

export default FeeManagement;
