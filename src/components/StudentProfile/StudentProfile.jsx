import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tab, Tabs, Table, Container, Button } from "react-bootstrap";
import ApproveModal from "./Modal/ApproveModal";
import { api } from "../../api";

const StudentProfile = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchAllStudents();
    fetchPendingStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const res = await axios.get(`${api}/student-profile`);
      setAllStudents(res.data.data);
    } catch (err) {
      console.error("Error fetching all students", err);
    }
  };

  const fetchPendingStudents = async () => {
    try {
      const res = await axios.get(`${api}/student-profile/unapproved`);
      setPendingStudents(res.data.data);
    } catch (err) {
      console.error("Error fetching pending students", err);
    }
  };

  const handleApproveClick = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const refreshPendingStudents = () => {
    fetchPendingStudents(); // Re-fetch pending students list after approval
  };

  const refreshAllStudents = async () => {
    try {
      const res = await axios.get(`${api}/student-profile`);
      setAllStudents(res.data.data); // Update all students list
    } catch (err) {
      console.error("Error fetching all students after approval", err);
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4 text-primary">Student Profiles</h3>
      <Tabs defaultActiveKey="all" id="student-tab" className="mb-3">
        <Tab eventKey="all" title="All Students">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Father</th>
                <th>Mother</th>
                <th>Country</th>
                <th>Course</th>
                <th>Approved</th>
              </tr>
            </thead>
            <tbody>
              {allStudents.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.student?.name}</td>
                  <td>{item.student?.contact}</td>
                  <td>{item.student?.email}</td>
                  <td>{item.fatherName}</td>
                  <td>{item.motherName}</td>
                  <td>{item.country}</td>
                  <td>{item.courses.map((c) => c.name).join(", ")}</td>
                  <td>{item.student?.isApproved ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="pending" title="Pending Students">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Profile</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Approved</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingStudents.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.student?.name}</td>
                  <td>{item.student?.profile}</td>
                  <td>{item.student?.contact}</td>
                  <td>{item.student?.email}</td>
                  <td>{item.student?.isApproved ? "Yes" : "No"}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleApproveClick(item)}
                    >
                      Approve
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* Approve Modal */}
      <ApproveModal
        show={showModal}
        onClose={handleModalClose}
        student={selectedStudent}
        refreshPendingStudents={refreshPendingStudents}
        refreshAllStudents={refreshAllStudents}
      />
    </Container>
  );
};

export default StudentProfile;
