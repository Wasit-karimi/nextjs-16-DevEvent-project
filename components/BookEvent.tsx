"use client";
import { useState } from "react";

const BookEvent = () => {
  const [emai, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setTimeout(() => {
        setSubmitted(true)
    }, 1000)
  }

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">
          Thank you for signing up! Look forward to see you there!
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter yor email address"
              id="email"
            />
          </div>
          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
