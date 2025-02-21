"use client"; // Required for App Router in Next.js

import { useState } from "react";

const EventPage = () => {
  const [event, setEvent] = useState({
    name: "Hackathon 2025",
    date: "2025-05-15",
    venue: "Tech Park Auditorium",
    passesSold: 150,
  });

  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Event Details</h2>

      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={event.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="date"
            value={event.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="venue"
            value={event.venue}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="passesSold"
            value={event.passesSold}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={toggleEdit}
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {event.name}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Passes Sold:</strong> {event.passesSold}</p>

          <button
            onClick={toggleEdit}
            className="w-full bg-blue-500 text-white p-2 rounded mt-3"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default EventPage;
