import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaTrash, FaSearch, FaEdit, FaRegFrown } from "react-icons/fa";
import AddTeacher from "./Modal/AddTeacher";
import UpdateTeacher from "./Modal/UpdateTeacher";
import DeleteTeacher from "./Modal/DeleteTeacher";
import { api } from "../../api";

const TeacherTable = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(`${api}/instructors`);
      if (Array.isArray(response.data.data)) {
        setInstructors(response.data.data);
      } else {
        setInstructors([]);
      }
    } catch (err) {
      setError("Failed to load instructors data.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (instructor) => {
    setSelectedInstructor(instructor);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (instructor) => {
    setSelectedInstructor(instructor);
    setShowDeleteModal(true);
  };

  const filteredInstructors = instructors.filter((instructor) =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInstructors.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <InputGroup className="w-25">
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ height: "38px" }}
          />
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
        </InputGroup>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add Teacher
        </Button>
      </div>
      <div className="card p-4 shadow-lg border-0 rounded-3 bg-light">
        <h2 className="text-center text-primary mb-4">Instructor List</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          {loading ? (
            <p className="text-center text-muted">Loading instructors...</p>
          ) : (
            <table className="table table-hover shadow-sm rounded">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>🖼️ Image</th>
                  <th>🏫 Name</th>
                  <th>🧑‍🏫 Designation</th>
                  <th>📧 Email</th>
                  <th>📞 Contact</th>
                  <th>👨‍🎓 Students Count</th>
                  {/* <th>🎥 Video</th> */}
                  <th>🎥 Course Count</th>
                  <th>⚙️ Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  // <tr>
                  //   <td colSpan="10" className="text-center text-muted py-3">
                  //     No instructors available
                  //   </td>
                  // </tr>
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div>
                        <div style={{ fontSize: "3rem", color: "#999" }}>
                          <FaRegFrown />
                        </div>
                        <div className="mt-2 text-muted">
                          {" "}
                          No Facilitators available
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((instructor, index) => (
                    <tr key={index} className="align-middle">
                      <td className="fw-bold">{index + 1}</td>

                      <td>
                        <img
                          src={
                            instructor.image || "https://via.placeholder.com/50"
                          }
                          alt="Profile"
                          className="rounded-circle"
                          width="50"
                          height="50"
                        />
                      </td>

                      <td>{instructor.name}</td>
                      <td>{instructor.occupation || "N/A"}</td>
                      <td>{instructor.email}</td>
                      <td>{instructor.contact}</td>

                      {/*  Students Count */}
                      <td className="text-center">
                        {instructor.studentcount ?? 0}
                      </td>

                      {/*  Video Uploaded Status */}
                      {/* <td>
                        {instructor.hasVideo ? (
                          <span className="badge bg-success">Uploaded</span>
                        ) : (
                          <span className="badge bg-danger">Not Uploaded</span>
                        )}
                      </td> */}
                      {/* teacher ne kon si video upload ki hai */}

                      <td className="text-center">{instructor.courseCount}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleUpdateClick(instructor)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(instructor)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-end mt-3">
          {[...Array(Math.ceil(filteredInstructors.length / itemsPerPage))].map(
            (_, index) => (
              <Button
                key={index}
                variant={
                  currentPage === index + 1 ? "primary" : "outline-primary"
                }
                className="mx-1"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Modals */}
      <AddTeacher
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        refreshList={fetchInstructors}
      />
      <UpdateTeacher
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        selectedTeacher={selectedInstructor}
        refreshList={fetchInstructors}
      />
      <DeleteTeacher
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        instructor={selectedInstructor}
        refreshList={fetchInstructors}
      />
    </div>
  );
};

export default TeacherTable;
