import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Form,
  InputGroup,
  Table,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import {
  FaTrash,
  FaSearch,
  FaEdit,
  FaEye,
  FaBookOpen,
  FaRegFrown,
} from "react-icons/fa";

import AddCourse from "./Modal/AddCourse";
import UpdateCourse from "./Modal/UpdateCourse";
import DeleteCourse from "./Modal/DeleteCourse";
import { api } from "../../api";
import ViewCourseModal from "./ViewModal/ViewModal";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseID, setSelectedCourseID] = useState(null);
  // const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  // const [selectedDescription, setSelectedDescription] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${api}/courses/get`);
      if (response.data?.status === 1 && Array.isArray(response.data.data)) {
        setCourses(response.data.data);
      } else {
        setCourses([]);
        setError("Failed to fetch courses.");
      }
    } catch (err) {
      setError("Error fetching courses.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (courseID) => {
    setSelectedCourseID(courseID);
    setShowViewModal(true);
  };

  const handleUpdateClick = (course) => {
    setSelectedCourse(course);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleReadMore = (description) => {
    setSelectedDescription(description);
    setShowDescriptionModal(true);
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <InputGroup className="w-25">
          <Form.Control
            type="text"
            placeholder="Search Course..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ height: "38px" }}
          />
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
        </InputGroup>

        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add Course
        </Button>
      </div>

      <div className="card p-4 shadow-lg border-0 rounded-3 bg-light">
        <h2 className="text-center text-primary mb-4"> Courses List</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="table-responsive">
          {loading ? (
            <div className="text-center my-3">
              <Spinner animation="border" />
              <p className="text-muted mt-2">Loading courses...</p>
            </div>
          ) : (
            <>
              <Table striped bordered hover className="shadow-sm rounded">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>ID</th>
                    <th>📚 Course Name</th>
                    <th>📝 Description</th>
                    <th>🖼 Thumbnail</th>
                    <th>⏳ Duration (Minutes)</th>
                    <th>⭐ Rating</th>
                    <th>👥 Rating Count</th>
                    <th>📖 Created By</th>
                    <th>🎥 Media</th>
                    {/* <th>👤 Created By</th> */}
                    <th>⚙️ Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length === 0 ? (
                    // <tr>
                    //   <td colSpan="10" className="text-center text-muted py-3">
                    //     No courses available
                    //   </td>
                    // </tr>
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <div>
                          <div style={{ fontSize: "3rem", color: "#999" }}>
                            <FaRegFrown />
                          </div>
                          <div className="mt-2 text-muted">
                            No courses available
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((course, index) => (
                      <tr key={course._id} className="align-middle">
                        <td className="fw-bold">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td>{course.name}</td>
                        <td
                          style={{
                            maxWidth: "250px",
                            whiteSpace: "wrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {course.description}
                        </td>
                        <td>
                          <img
                            src={course.thumbnail}
                            alt="Course Thumbnail"
                            width="100"
                            height="70"
                            className="rounded"
                          />
                        </td>
                        {/* <td>{course.courseDuration} min</td> */}
                        <td>
                          {course.courseDuration
                            ? `${Math.ceil(
                                Number(course.courseDuration) / 60
                              )} min`
                            : "N/A"}
                        </td>
                        <td>{course.rating}</td>
                        <td>{course.ratingCount}</td>
                        <td>{course.createdBy || "N/A"}</td>
                        {/* <td>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleReadMore(course.description)}
                          >
                            <FaBookOpen /> Read More
                          </Button>
                        </td> */}
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleViewClick(course._id)}
                          >
                            <FaEye /> View
                          </Button>
                        </td>
                        {/* <td>{course.createdBy || "N/A"}</td> */}
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleUpdateClick(course)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(course)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {/* Pagination */}
              {filteredCourses.length > itemsPerPage && (
                <div className="d-flex justify-content-center mt-3">
                  <nav>
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddCourse
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        refreshList={fetchCourses}
      />
      <UpdateCourse
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        selectedCourse={selectedCourse}
        refreshList={fetchCourses}
      />
      <DeleteCourse
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        course={selectedCourse}
        refreshList={fetchCourses}
      />
      {showViewModal && (
        <ViewCourseModal
          show={showViewModal}
          handleClose={() => setShowViewModal(false)}
          course_ID={selectedCourseID}
        />
      )}

      {/* Description Modal */}
      {/* <Modal
        show={showDescriptionModal}
        onHide={() => setShowDescriptionModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Course Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedDescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDescriptionModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default Courses;
