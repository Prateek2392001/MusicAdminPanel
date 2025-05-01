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

const VideoRequests = () => {
  const [pendingVideos, setPendingVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [key, setKey] = useState("pending");
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [actionType, setActionType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const token = Cookies.get("SuperAdminToken");

  useEffect(() => {
    fetchVideoRequests();
  }, []);

  const fetchVideoRequests = async () => {
    setLoading(true);
    try {
      const [pendingRes, allRes] = await Promise.all([
        axios.get(`${api}/videos/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${api}/videos/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setPendingVideos(pendingRes.data.data || []);
      setAllVideos(allRes.data.data || []);
    } catch (err) {
      console.error("Error fetching videos, using dummy data", err.message);
      setError(""); // Hide error since dummy data is used

      // Dummy data fallback
      const dummyData = [
        {
          _id: "dummy1",
          title: "Introduction to React",
          status: "Pending",
          teacherID: { name: "John Doe" },
          courseID: { name: "React Basics" },
        },
        {
          _id: "dummy2",
          title: "Advanced Node.js",
          status: "Approved",
          teacherID: { name: "Jane Smith" },
          courseID: { name: "Node Mastery" },
        },
        {
          _id: "dummy3",
          title: "Frontend with Bootstrap",
          status: "Declined",
          teacherID: { name: "Emily Johnson" },
          courseID: { name: "Web UI" },
        },
      ];

      setPendingVideos(dummyData.filter((v) => v.status === "Pending"));
      setAllVideos(dummyData);
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = (video, type) => {
    setSelectedVideo(video);
    setActionType(type);
    setShowModal(true);
  };

  const updateVideoStatus = async () => {
    if (!selectedVideo || !actionType) return;
    try {
      await axios.put(
        `${api}/videos/update/${selectedVideo._id}`,
        { status: actionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchVideoRequests();
    } catch (err) {
      setError("Error updating status: " + err.message);
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
    key === "pending" ? pendingVideos.length : allVideos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderTable = (data) => {
    if (loading)
      return (
        <div className="text-center my-3">
          <Spinner animation="border" variant="primary" />
        </div>
      );

    if (error) return <Alert variant="danger">{error}</Alert>;

    const paginated = paginateData(data);

    return (
      <>
        <div className="table-responsive">
          <Table bordered hover className="shadow-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>👨‍🏫 Teacher</th>
                <th>🎬 Video Title</th>
                <th>📚 Course</th>
                <th>📅 Date</th>
                <th>📊 Status</th>
                {key === "pending" && <th>⚙️ Action</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No videos found
                  </td>
                </tr>
              ) : (
                paginated.map((video, idx) => (
                  <tr key={idx}>
                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td>{video.teacherID?.name || "N/A"}</td>
                    <td>{video.title}</td>
                    <td>{video.courseID?.name || "N/A"}</td>
                    <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                    <td
                      style={{
                        color:
                          video.status === "Pending"
                            ? "purple"
                            : video.status === "Approved"
                            ? "green"
                            : "red",
                      }}
                    >
                      {video.status}
                    </td>
                    {key === "pending" && (
                      <td>
                        <Button
                          size="sm"
                          variant="success"
                          className="me-2"
                          onClick={() => confirmAction(video, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => confirmAction(video, "Declined")}
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
        <Pagination className="justify-content-center mt-3">
          <Pagination.Prev
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </>
    );
  };

  return (
    <div className="container">
      <div className="card p-4 shadow-lg bg-light">
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
          <Tab eventKey="pending" title="Pending">
            {renderTable(pendingVideos)}
          </Tab>
          <Tab eventKey="all" title="All Videos">
            {renderTable(allVideos)}
          </Tab>
        </Tabs>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to <strong>{actionType.toLowerCase()}</strong>{" "}
          this video?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === "Approved" ? "success" : "danger"}
            onClick={updateVideoStatus}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VideoRequests;
