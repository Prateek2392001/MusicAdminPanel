import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Pagination } from "react-bootstrap";
import { api } from "../../api";
import DeleteRating from "./Modal/DeleteRating";
import { FaRegFrown, FaTrash } from "react-icons/fa";
import RateCourseModal from "./Modal/RateCourseModal";

const Ratings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showRateModal, setShowRateModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/ratings`);
      if (response.data.status === 1) {
        setRatings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching ratings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (rating) => {
    setSelectedRating(rating);
    setShowDeleteModal(true);
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRatings = ratings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(ratings.length / itemsPerPage);

  const handlePageChange = (number) => setCurrentPage(number);

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-5 fw-bold text-primary">
        Ratings & Reviews
      </h3>
      <div className="d-flex justify-content-end align-items-center mb-3">
        <Button variant="primary" onClick={() => setShowRateModal(true)}>
          Rate Course
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Created Date</th>
                <th>Updated Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRatings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div>
                      <div style={{ fontSize: "3rem", color: "#999" }}>
                        <FaRegFrown />
                      </div>
                      <div className="mt-2 text-muted">No ratings found</div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentRatings.map((item, index) => (
                  <tr key={index}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{item.studentID?.name}</td>
                    <td>{item.courseID?.name}</td>
                    <td>{item.rating}</td>
                    <td>{item.review}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {ratings.length > itemsPerPage && (
            <div className="d-flex justify-content-end">
              {renderPagination()}
            </div>
          )}
        </>
      )}

      <DeleteRating
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        rating={selectedRating}
        fetchRatings={fetchRatings}
      />
      <RateCourseModal
        show={showRateModal}
        handleClose={() => setShowRateModal(false)}
        fetchRatings={fetchRatings}
      />
    </div>
  );
};

export default Ratings;
