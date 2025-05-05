import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Tabs,
  Tab,
  Modal,
  Spinner,
  Alert,
  Pagination,
} from "react-bootstrap";
import Cookies from "js-cookie";
import { api } from "../../api";
import { FaRegFrown } from "react-icons/fa";

const Request = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [key, setKey] = useState("pending");
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const token = Cookies.get("SuperAdminToken");

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [key]);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");

    if (!token) {
      setError("Unauthorized: No token found");
      setLoading(false);
      return;
    }

    try {
      const [pendingResponse, allResponse] = await Promise.all([
        axios.get(`${api}/enrollment/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${api}/enrollment/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPendingRequests(pendingResponse.data.data || []);
      setAllRequests(allResponse.data.data || []);
    } catch (err) {
      setError("Error fetching requests: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setShowModal(true);
  };

  const updateRequestStatus = async () => {
    if (!selectedRequest || !actionType) return;
    try {
      await axios.put(
        `${api}/enrollment/update/${selectedRequest._id}`,
        { status: actionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingRequests((prev) =>
        prev.filter((req) => req._id !== selectedRequest._id)
      );

      fetchRequests();
    } catch (error) {
      setError("Error updating request status: " + error.message);
    } finally {
      setShowModal(false);
    }
  };

  const paginateData = (data) => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  };

  const totalItems =
    key === "pending" ? pendingRequests.length : allRequests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={currentPage === idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  const renderTable = (requests) => {
    if (loading) {
      return (
        <div className="text-center my-3">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Loading requests...</p>
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    const paginated = paginateData(requests);

    return (
      <>
        <div className="table-responsive">
          <Table striped bordered hover className="shadow-sm rounded">
            <thead>
              <tr>
                <th>📌 ID</th>
                <th>👤 Student Name</th>
                <th>📚 Course Name</th>
                <th>📅 Date</th>
                <th>📊 Status</th>
                {key === "pending" && <th>⚙️ Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                // <tr>
                //   <td colSpan="5" className="text-center text-muted py-3">
                //     No requests available
                //   </td>
                // </tr>
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div>
                      <div style={{ fontSize: "3rem", color: "#999" }}>
                        <FaRegFrown />
                      </div>
                      <div className="mt-2 text-muted">No Request found</div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((request, index) => (
                  <tr key={index} className="align-middle">
                    <td className="fw-bold">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td>{request.userID?.name || "N/A"}</td>
                    <td>{request.courseID?.name || "N/A"}</td>
                    <td>
                      {new Date(request.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>

                    <td
                      style={{
                        color:
                          request.status.toLowerCase() === "pending"
                            ? "purple"
                            : request.status.toLowerCase() === "approved"
                            ? "green"
                            : "red",
                      }}
                    >
                      {request.status}
                    </td>
                    {key === "pending" && (
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => confirmAction(request, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => confirmAction(request, "Declined")}
                        >
                          Decline
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
        {renderPagination()}
      </>
    );
  };

  const pendingCount = pendingRequests.length;

  return (
    <div className="container">
      <div className="card p-4 shadow-lg border-0 rounded-3 bg-light">
        {/* <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3"> */}
        <Tabs defaultActiveKey="all" id="student-tab" className="mb-3">
          <Tab eventKey="all" title="All Requests">
            {renderTable(allRequests)}
          </Tab>

          <Tab
            eventKey="pending"
            title={
              <>
                Pending Requests{" "}
                {pendingCount > 0 && (
                  <span className="badge bg-danger">{pendingCount}</span>
                )}
              </>
            }
          >
            {renderTable(pendingRequests)}
          </Tab>
        </Tabs>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {actionType.toLowerCase()} this request?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === "Approved" ? "success" : "danger"}
            onClick={updateRequestStatus}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Request;
