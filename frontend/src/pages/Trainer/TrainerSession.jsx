import React, { useState } from "react";
import "./Styles/TrainerSession.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const TrainerSession = () => {
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    day: "Monday",
    time: "",
    payment: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSessions((prev) => [...prev, { ...formData, id: Date.now() }]);
    setFormData({
      day: "Monday",
      time: "",
      payment: "",
      description: "",
    });
  };

  const deleteSession = (id) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  };

  return (
    <div className="SessionContainer">
      <h1 className="SessionHeading">Session Management</h1>
      <hr className="SessionDivider" />

      <div className="SessionContent">
        {/* Add Session Form */}
        <form className="SessionForm" onSubmit={handleSubmit}>
          <h2>Add New Session</h2>
          
          <div className="FormGroup">
            <label>Day:</label>
            <select name="day" value={formData.day} onChange={handleInputChange}>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <div className="FormGroup">
            <label>Time:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="FormGroup">
            <label>Payment ($):</label>
            <input
              type="number"
              name="payment"
              value={formData.payment}
              onChange={handleInputChange}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="FormGroup">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Session details..."
              required
            />
          </div>

          <button type="submit" className="AddButton">
            <FaPlus /> Add Session
          </button>
        </form>

        {/* Sessions List */}
        <div className="SessionsList">
          <h2>Your Sessions</h2>
          {sessions.length === 0 ? (
            <p className="NoSessions">No sessions added yet</p>
          ) : (
            <div className="SessionsGrid">
              {sessions.map((session) => (
                <div key={session.id} className="SessionCard">
                  <div className="SessionCardHeader">
                    <h3>{session.day}</h3>
                    <div className="SessionActions">
                      <button className="EditBtn">
                        <FaEdit />
                      </button>
                      <button
                        className="DeleteBtn"
                        onClick={() => deleteSession(session.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="SessionCardContent">
                    <p><strong>Time:</strong> {session.time}</p>
                    <p><strong>Payment:</strong> ${session.payment}</p>
                    <p><strong>Description:</strong> {session.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerSession;
