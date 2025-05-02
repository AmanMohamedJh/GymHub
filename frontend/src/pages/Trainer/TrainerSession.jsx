import React, { useState } from "react";
import useTrainerSession from "../../hooks/Trainer/useTrainerSession";

const TrainerSession = () => {
  const { sessions, addNewSession, removeSession } = useTrainerSession();
  const [formData, setFormData] = useState({ trainerName: "", day: "Monday", time: "", payment: "", description: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewSession(formData);
    setFormData({ trainerName: "", day: "Monday", time: "", payment: "", description: "" });
  };

  return (
    <div>
      <h1>Trainer Sessions</h1>
      <form onSubmit={handleSubmit}>
        <input name="trainerName" value={formData.trainerName} onChange={handleInputChange} placeholder="Trainer Name" required />
        <input name="time" type="time" value={formData.time} onChange={handleInputChange} required />
        <input name="payment" type="number" value={formData.payment} onChange={handleInputChange} placeholder="Payment ($)" required />
        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required />
        <button type="submit">Add Session</button>
      </form>

      <ul>
        {sessions.map((session) => (
          <li key={session._id}>
            {session.trainerName} - {session.day} - {session.time}
            <button onClick={() => removeSession(session._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainerSession;
