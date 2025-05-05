import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Spinner,
  Alert,
  Form,
  InputGroup,
} from "react-bootstrap";
import { FaTrash, FaSearch, FaEdit, FaRegFrown } from "react-icons/fa";
import axios from "axios";
import AddCategory from "./Modal/AddCategory";
import UpdateCategory from "./Modal/UpdateCategory";
import DeleteCategory from "./Modal/DeleteCategory";
import { api } from "../../api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api}/getCategories`);
      if (response.data.status === 1) {
        setCategories(response.data.data);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ **Fix: Update category instantly without reloading**
  const handleUpdateCategory = (categoryId, updatedData) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat._id === categoryId ? { ...cat, ...updatedData } : cat
      )
    );
  };

  // Search filter
  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        {/* Search Bar */}
        <InputGroup className="w-25">
          <Form.Control
            type="text"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ height: "38px" }}
          />
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
        </InputGroup>

        {/* Add Category Button */}
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add Category
        </Button>
      </div>

      {loading ? (
        <div className="text-center mt-3">
          <Spinner animation="border" />
          <p>Loading categories...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      ) : (
        <div className="card p-4 shadow-lg border-0 rounded-3 bg-light">
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                // <tr>
                //   <td colSpan="4" className="text-center text-muted py-3">
                //     No categories available
                //   </td>
                // </tr>
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div>
                      <div style={{ fontSize: "3rem", color: "#999" }}>
                        <FaRegFrown />
                      </div>
                      <div className="mt-2 text-muted">
                        No services available
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((category, index) => (
                  <tr key={index}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{category.categoryName}</td>
                    <td>
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.categoryName}
                          style={{ width: "50px", height: "50px" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowUpdateModal(true);
                        }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setCategoryToDelete(category);
                          setShowDeleteModal(true);
                        }}
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
          <div className="d-flex justify-content-end mt-3">
            {[
              ...Array(Math.ceil(filteredCategories.length / itemsPerPage)),
            ].map((_, index) => (
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
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddCategory
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        fetchCategories={fetchCategories}
      />

      {selectedCategory && (
        <UpdateCategory
          show={showUpdateModal}
          handleClose={() => setShowUpdateModal(false)}
          category={selectedCategory}
          updateCategoryState={handleUpdateCategory} // ✅ Fix: Now function is passed correctly
        />
      )}

      {categoryToDelete && (
        <DeleteCategory
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          category={categoryToDelete}
          fetchCategories={fetchCategories}
        />
      )}
    </div>
  );
};

export default Categories;
