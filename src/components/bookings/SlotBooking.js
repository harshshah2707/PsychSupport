import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookings } from "../../hooks/useBookings";
import "./SlotBooking.css";

const SlotBooking = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [purpose, setPurpose] = useState(""); // required
  const [notes, setNotes] = useState(""); // optional
  const [confirmation, setConfirmation] = useState(null);
  const { addBooking } = useBookings();
  const navigate = useNavigate();

  const slots = [
    "09:00 AM - 09:30 AM",
    "10:00 AM - 10:30 AM",
    "11:00 AM - 11:30 AM",
    "02:00 PM - 02:30 PM",
    "03:00 PM - 03:30 PM",
    "04:00 PM - 04:30 PM",
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedSlot || !purpose) {
      alert("Please fill all required fields.");
      return;
    }

    const newBooking = {
      date: selectedDate,
      slot: selectedSlot,
      purpose,
      notes,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };

    addBooking(newBooking);
    setConfirmation(newBooking);
  };

  return (
    <div className="slot-booking">
      <h2>Book a Session with Counsellor</h2>

      {!confirmation ? (
        <div className="booking-form">
          <label>
            Select Date:
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </label>

          <div className="slots">
            <h4>Available Time Slots</h4>
            <div className="slot-options">
              {slots.map((slot, index) => (
                <label key={index} className="slot-option">
                  <input
                    type="radio"
                    name="slot"
                    value={slot}
                    checked={selectedSlot === slot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                  />
                  {slot}
                </label>
              ))}
            </div>
          </div>

          <label>
            Purpose of Session:
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Stress, Anxiety, Exam Pressure"
            />
          </label>

          <label>
            Notes (optional):
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
            />
          </label>

          <button className="btn btn-primary" onClick={handleBooking}>
            Confirm Booking
          </button>
        </div>
      ) : (
        <div className="confirmation">
          <h3>✅ Booking Confirmed!</h3>
          <p><strong>Date:</strong> {confirmation.date}</p>
          <p><strong>Time:</strong> {confirmation.slot}</p>
          <p><strong>Purpose:</strong> {confirmation.purpose}</p>
          {confirmation.notes && <p><strong>Notes:</strong> {confirmation.notes}</p>}

          <div className="action-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSelectedDate("");
                setSelectedSlot("");
                setPurpose("");
                setNotes("");
                setConfirmation(null);
              }}
            >
              Book Another Slot
            </button>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/bookings/history")}
            >
              View Booking History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotBooking;
