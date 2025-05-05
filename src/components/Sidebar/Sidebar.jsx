import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../api";

const Sidebar = ({ open }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const token = Cookies.get("SuperAdminToken");

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${api}/enrollment/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingCount(response.data.data.length || 0);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  return (
    <nav
      className={`sidebar sidebar-offcanvas ${open && "active"}`}
      id="sidebar"
    >
      <ul className="nav">
        <li className="nav-item">
          <Link to={"/"} className="nav-link">
            <i className="bi bi-speedometer2 mx-2 fw-bold"></i>
            <span className="menu-title">Dashboard</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/teachers"} className="nav-link">
            <i className="bi bi-person-badge mx-2 fw-bold"></i>
            <span className="menu-title">Facilitators</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/categories"} className="nav-link">
            <i className="bi bi-layers mx-2 fw-bold"></i>
            <span className="menu-title">Services</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/courses"} className="nav-link">
            <i className="bi bi-book mx-2 fw-bold"></i>
            <span className="menu-title">Courses</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/students"} className="nav-link">
            <i className="bi bi-people mx-2 fw-bold"></i>
            <span className="menu-title">Students</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/studentprofile"} className="nav-link">
            <i className="bi bi-person mx-2 fw-bold"></i>
            <span className="menu-title">Students Profile</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/progress-tracking"} className="nav-link">
            <i className="bi bi-bar-chart mx-2 fw-bold"></i>
            <span className="menu-title">Progress Tracking</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/pendingrequest"} className="nav-link">
            <i className="bi bi-hourglass mx-2 fw-bold"></i>
            <span className="menu-title">Pending Request</span>
            {pendingCount > 0 && (
              <span className="badge bg-danger ms-2 px-2 py-1">
                {pendingCount}
              </span>
            )}
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/ratings"} className="nav-link">
            <i className="bi bi-person-plus mx-2 fw-bold"></i>
            <span className="menu-title">Ratings</span>
          </Link>
        </li>
        {/* <li className="nav-item">
          <Link to={"#"} className="nav-link">
            <i className="bi bi-clipboard-check mx-2 fw-bold"></i>
            <span className="menu-title">Enrollments</span>
          </Link>
        </li> */}
        <li className="nav-item">
          <Link to={"/banner"} className="nav-link">
            <i className="bi bi-image mx-2 fw-bold"></i>
            <span className="menu-title">Banners</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/feemanagement"} className="nav-link">
            <i className="bi bi-cash mx-2 fw-bold"></i>
            <span className="menu-title">Fee Management</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/attendance"} className="nav-link">
            <i className="bi bi-calendar-check mx-2 fw-bold"></i>
            <span className="menu-title">Attendance System</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
