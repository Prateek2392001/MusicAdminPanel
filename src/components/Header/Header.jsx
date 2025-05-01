import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const Header = ({ handleOpen, open }) => {
  return (
    <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
        <div className="me-3"></div>
        <div>
          <a className="navbar-brand" href="/">
            <img
              src="./image.png "
              className="main-logo rounded-circle h-50  w-80"
              alt="logo"
            />
          </a>
        </div>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-top">
        <ul className="navbar-nav">
          <li className="nav-item font-weight-semibold d-none d-lg-block ms-0">
            <h1 className="welcome-text">
              Welcome to <span className="text-black fw-bold">Pathshala</span>
            </h1>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto">
          <li
            className="text-dark border p-2 shadow"
            onClick={() => {
              Cookies.remove("SuperAdminToken");
              navigate("/signin");
            }}
          >
            <Link to={"/signin"}>
              <a>
                {" "}
                <i class="bi bi-door-open me-2 fw-bold"></i> Logout
              </a>
            </Link>
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          data-bs-toggle="offcanvas"
          onClick={() => handleOpen(!open)}
        >
          <i class="bi bi-list"></i>
        </button>
      </div>
    </nav>
  );
};

export default Header;
