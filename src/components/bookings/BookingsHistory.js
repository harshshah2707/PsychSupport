import React from "react";
import { useBookings } from "../../hooks/useBookings";
import "./BookingsHistory.css";

const BookingsHistory = () => {
  const { bookings } = useBookings();

  if (!bookings || bookings.length === 0) {
    return (
      <p className="empty-msg" style={{ marginTop: "80px", textAlign: "center" }}>
        No past bookings yet.
      </p>
    );
  }

  return (
    <div className="bookings-history">
      <h2>📅 Your Booking History</h2>

      <table className="bookings-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Purpose</th>
            <th>Notes</th>
            <th>Booked On</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, index) => (
            <tr key={index}>
              <td>{b.date}</td>
              <td>{b.slot}</td>
              <td>{b.purpose}</td>
              <td>{b.notes || "-"}</td>
              <td>{new Date(b.createdAt).toLocaleString()}</td>
              <td>
                <span className={`status ${b.status || "confirmed"}`}>
                  {b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : "Confirmed"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsHistory;
