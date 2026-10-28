import React, { useMemo, useState } from "react";
import { api } from "../services/api";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  guests: "2",
  specialRequests: "",
};

export default function Reserve() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const minDate = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status.message) setStatus({ type: "", message: "" });
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setSubmitting(true);

    try {
      await api.post("/reservations", {
        ...form,
        guests: Number(form.guests),
      });
      setStatus({
        type: "success",
        message: "Thank you. Your reservation request has been received. We’ll call or email you to confirm.",
      });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "We couldn't submit your reservation. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="reserve-page">
      <section className="reserve-hero">
        <div className="container reserve-hero-content text-center">
          <span className="eyebrow">RESERVATIONS</span>
          <h1>Book your table</h1>
          <p>A reservation is confirmed once we&apos;ve called or emailed<br className="d-none d-md-block" /> you back.</p>
        </div>
      </section>

      <section className="container reserve-form-wrap">
        <form className="reserve-form-panel" onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="reserve-name">Full name</label>
              <input
                id="reserve-name"
                className="form-control rb-input reserve-control"
                name="name"
                value={form.name}
                onChange={update}
                autoComplete="name"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="reserve-phone">Phone</label>
              <input
                id="reserve-phone"
                className="form-control rb-input reserve-control"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={update}
                autoComplete="tel"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="reserve-email">Email</label>
              <input
                id="reserve-email"
                className="form-control rb-input reserve-control"
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                autoComplete="email"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="reserve-date">Date</label>
              <input
                id="reserve-date"
                className="form-control rb-input reserve-control"
                type="date"
                name="date"
                min={minDate}
                value={form.date}
                onChange={update}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="reserve-time">Time</label>
              <input
                id="reserve-time"
                className="form-control rb-input reserve-control"
                type="time"
                name="time"
                value={form.time}
                onChange={update}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="reserve-guests">Guests</label>
              <select
                id="reserve-guests"
                className="form-select rb-input reserve-control"
                name="guests"
                value={form.guests}
                onChange={update}
                required
              >
                {Array.from({ length: 12 }, (_, index) => index + 1).map((guestCount) => (
                  <option key={guestCount} value={guestCount}>{guestCount}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="reserve-requests">Special requests</label>
              <textarea
                id="reserve-requests"
                className="form-control rb-input reserve-control reserve-textarea"
                name="specialRequests"
                value={form.specialRequests}
                onChange={update}
                placeholder="Birthdays, allergies, seating preferences..."
                maxLength={800}
              />
            </div>

            {status.message && (
              <div className="col-12">
                <div className={`reserve-alert ${status.type === "success" ? "success" : "error"}`} role="alert">
                  {status.message}
                </div>
              </div>
            )}

            <div className="col-12">
              <button className="btn btn-gold reserve-submit w-100" type="submit" disabled={submitting}>
                <i className="bi bi-calendar2-check me-2" />
                {submitting ? "Sending request..." : "Request reservation"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
