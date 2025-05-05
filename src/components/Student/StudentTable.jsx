import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaEdit, FaTrash, FaRegFrown } from "react-icons/fa";
import AddStudent from "./Modal/AddStudent";
import UpdateStudent from "./Modal/UpdateStudent";
import DeleteStudent from "./Modal/DeleteStudent";
import { api } from "../../api";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchStudents();
  }, []);

  // **Fetch Students**
  const fetchStudents = async () => {
    setLoading(true);
    setError("");

    const token = Cookies.get("SuperAdminToken");
    if (!token) {
      setError("Unauthorized: No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${api}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 1 && Array.isArray(response.data.data)) {
        setStudents(response.data.data);
      } else {
        setError("Failed to fetch students.");
        setStudents([]);
      }
    } catch (err) {
      setError("Error fetching students: " + err.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // **Update Student in UI after Update Modal**
  const updateStudentState = (studentId, updatedData) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s._id === studentId ? { ...s, ...updatedData } : s
      )
    );
  };

  // **Handle Update Click**
  const handleUpdateClick = (student) => {
    setSelectedStudent(student);
    setShowUpdateModal(true);
  };

  // **Handle Delete Click**
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  // **Filter Students based on Search**
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // **Pagination Logic**
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(
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
          Add Student
        </Button>
      </div>

      <div className="card p-4 shadow-lg border-0 rounded-3 bg-light">
        <h2 className="text-center text-primary mb-4">Student List</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          {loading ? (
            <p className="text-center text-muted">Loading students...</p>
          ) : (
            <table className="table table-hover shadow-sm rounded">
              <thead>
                <tr>
                  <th>🎓 ID</th>
                  <th>👤 Name</th>
                  {/* <th>👨 Father Name</th>
                  <th>👩 Mother Name</th>
                  <th>🌍 Country</th> */}
                  <th>📧 Email</th>
                  <th>📞 Contact</th>
                  <th>⚙️ Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  // <tr>
                  //   <td colSpan="5" className="text-center text-muted py-3">
                  //     No students available
                  //   </td>
                  // </tr>
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div>
                        <div style={{ fontSize: "3rem", color: "#999" }}>
                          <FaRegFrown />
                        </div>
                        <div className="mt-2 text-muted">
                          No students available
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((student, index) => (
                    <tr key={student._id} className="align-middle">
                      <td className="fw-bold">{index + 1}</td>
                      <td>{student.name}</td>
                      {/* <td>{student.fatherName || "N/A"}</td>
                      <td>{student.motherName || "N/A"}</td>
                      <td>{student.country || "N/A"}</td> */}
                      <td>{student.email}</td>
                      <td>{student.contact}</td>

                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleUpdateClick(student)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(student)}
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
          {[...Array(Math.ceil(filteredStudents.length / itemsPerPage))].map(
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
      <AddStudent
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        refreshStudents={fetchStudents}
      />
      <UpdateStudent
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        student={selectedStudent}
        updateStudentState={updateStudentState} // ✅ Fixed passing the function
      />
      <DeleteStudent
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        student={selectedStudent}
        refreshStudents={fetchStudents}
      />
    </div>
  );
};

export default StudentTable;
