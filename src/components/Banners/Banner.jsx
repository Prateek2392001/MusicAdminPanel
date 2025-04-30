import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Row, Col, Spinner, Container } from "react-bootstrap";
import { api } from "../../api";
import AddBanner from "./Modals/AddBanner";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateBanner from "./Modals/UpdateBanner";
import DeleteBanner from "./Modals/DeleteBanner";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null);

  const getBanners = async () => {
    try {
      const res = await axios.get(`${api}/banners/get`);
      if (res.data.status === 1) {
        setBanners(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <>
      <Container className="banner-container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0 text-primary">Banners</h3>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            {" "}
            Add New Banner
          </Button>
        </div>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {banners.map((banner, index) => (
              <Col key={index}>
                <Card className="h-100 banner-card shadow-sm">
                  <Card.Img
                    variant="top"
                    src={banner.image}
                    className="banner-img"
                    style={{ objectFit: "cover", height: "200px" }}
                  />

                  <div className="mt-auto">
                    <Card.Body className="d-flex justify-content-center gap-4">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => {
                          setSelectedBannerId(banner._id);
                          setShowUpdateModal(true);
                        }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedBannerId(banner._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </Card.Body>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        <AddBanner
          show={showModal}
          handleClose={() => setShowModal(false)}
          fetchBanners={getBanners}
        />

        <UpdateBanner
          show={showUpdateModal}
          handleClose={() => setShowUpdateModal(false)}
          bannerId={selectedBannerId}
          fetchBanners={getBanners}
        />

        <DeleteBanner
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          bannerId={selectedBannerId}
          fetchBanners={getBanners}
        />
      </Container>
    </>
  );
};

export default Banner;
