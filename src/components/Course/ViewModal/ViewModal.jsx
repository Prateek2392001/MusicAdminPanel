import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { api } from "../../../api";
import AddVideoModal from "./AddVideoModal";
import UpdateVideo from "./UpdateVideo";
import DeleteVideo from "./DeleteVideo";
import { FaEdit, FaTrash } from "react-icons/fa";

const ViewCourseModal = ({ show, handleClose, course_ID, refreshList }) => {
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState(null);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    if (!course_ID) return;

    const fetchCourseData = async () => {
      try {
        setError(null);
        const response = await axios.get(`${api}/courses/videos/${course_ID}`);
        if (response.data?.status === 1) {
          setCourseData(response.data.data);
        } else {
          setError("Failed to fetch course data.");
        }
      } catch (err) {
        setError("Error fetching course details.");
      }
    };

    fetchCourseData();
  }, [course_ID, refreshList]);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Course Media</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {courseData?.map((media, index) => (
            <div className="d-flex gap-3" key={index}>
              {/* left section */}
              <div className="col d-flex flex-column align-items-center">
                {media.mediaType === "video" && (
                  <video width="70%" height="70%" controls>
                    <source src={media.media} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {media.mediaType === "audio" && (
                  <audio controls className="w-100 mt-2">
                    <source src={media.media} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {media.mediaType === "pdf" && (
                  <a
                    href={media.media}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary w-100 mt-2"
                  >
                    View PDF
                  </a>
                )}
              </div>

              <div className="ms-4 flex-grow-1">
                <h3 className="">{media?.title || "No title available."}</h3>
                <p className="text-primary fw-bold mt-4">
                  📅 Duration: {media?.duration || "N/A"} mins
                </p>
                <div className="mt-2 gap-3 d-flex justify-content-center">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => {
                      setSelectedMedia(media);
                      setModalType("update");
                    }}
                  >
                    <FaEdit />
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedMedia(media);
                      setModalType("delete");
                    }}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={() => setShowAddVideoModal(true)}>
            Add Media
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>

        {/* Conditionally render Add Video Modal */}
        {showAddVideoModal && (
          <AddVideoModal
            show={showAddVideoModal}
            handleClose={() => setShowAddVideoModal(false)}
            course_id={course_ID}
            refreshVideos={refreshList}
          />
        )}

        {/* Update & Delete Modals */}
        {selectedMedia && modalType === "update" && (
          <UpdateVideo
            show={true}
            handleClose={() => setModalType(null)}
            media={selectedMedia}
            course_ID={course_ID}
            refreshList={refreshList}
          />
        )}

        {selectedMedia && modalType === "delete" && (
          <DeleteVideo
            show={true}
            handleClose={() => setModalType(null)}
            course={selectedMedia}
            refreshList={refreshList}
          />
        )}
      </Modal>
    </>
  );
};

export default ViewCourseModal;
