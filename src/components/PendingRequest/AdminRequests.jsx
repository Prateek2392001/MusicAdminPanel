import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import VideoRequests from "./VideoRequests";
import Request from "./Request";

const AdminRequests = () => {
  const [key, setKey] = useState("student");

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">
        Students And Teachers Requests
      </h2>

      <div className="card p-4 shadow-sm">
        <Tabs
          id="admin-requests-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="student" title="Student Requests">
            <Request />
          </Tab>
          <Tab eventKey="teacher" title="Teacher Video Requests">
            <VideoRequests />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminRequests;
