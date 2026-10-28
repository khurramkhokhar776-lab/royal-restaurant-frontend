import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    address: "",
    notes: "",
    fulfilment: "delivery",
    paymentMethod: "cash",
    couponCode: "",
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const delivery = useMemo(() => {
    if (form.fulfilment === "collection") {
      return 0;
    }

    return subtotal >= 25 ? 0 : 2.5;
  }, [form.fulfilment, subtotal]);

  const total = subtotal + delivery;

  const change = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!items.length) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      const response = await api.post("/orders", {
        customer: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          notes: form.notes,
        },
        items: items.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        fulfilment: form.fulfilment,
        paymentMethod: form.paymentMethod,
        couponCode: form.couponCode,
      });

      clear();

      navigate("/order-success", {
        state: { order: response.data.order },
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!items.length) {
    return (
      <div className="container py-5">
        <div className="empty-box">
          <i className="bi bi-bag fs-1"></i>
          <h2>No items to checkout</h2>
          <p className="text-muted">Please add at least one dish first.</p>
          <Link to="/menu" className="btn btn-gold">
            Go to menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="page-title">Checkout</h1>

      <form onSubmit={submit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="form-panel">
              <h5>Fulfilment</h5>

              <div className="choice-row">
                <label className={form.fulfilment === "delivery" ? "active" : ""}>
                  <input
                    type="radio"
                    name="fulfilment"
                    value="delivery"
                    checked={form.fulfilment === "delivery"}
                    onChange={change}
                  />
                  Delivery
                </label>

                <label
                  className={form.fulfilment === "collection" ? "active" : ""}
                >
                  <input
                    type="radio"
                    name="fulfilment"
                    value="collection"
                    checked={form.fulfilment === "collection"}
                    onChange={change}
                  />
                  Click & collect
                </label>
              </div>

              <h5 className="mt-4">Your details</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    required
                    className="form-control rb-input"
                    name="name"
                    placeholder="Full name"
                    value={form.name}
                    onChange={change}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    required
                    className="form-control rb-input"
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={change}
                  />
                </div>

                <div className="col-12">
                  <input
                    type="email"
                    className="form-control rb-input"
                    name="email"
                    placeholder="Email (optional)"
                    value={form.email}
                    onChange={change}
                  />
                </div>

                {form.fulfilment === "delivery" && (
                  <div className="col-12">
                    <textarea
                      required
                      className="form-control rb-input"
                      name="address"
                      placeholder="Delivery address"
                      value={form.address}
                      onChange={change}
                    ></textarea>
                  </div>
                )}

                <div className="col-12">
                  <textarea
                    className="form-control rb-input"
                    name="notes"
                    placeholder="Notes / allergies / instructions"
                    value={form.notes}
                    onChange={change}
                  ></textarea>
                </div>

                <div className="col-md-6">
                  <select
                    className="form-select rb-input"
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={change}
                  >
                    <option value="cash">Cash</option>
                    <option value="card_on_collection">Card on collection</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control rb-input"
                    name="couponCode"
                    placeholder="Coupon code"
                    value={form.couponCode}
                    onChange={change}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="summary-card">
              <h4>Your order</h4>

              {items.map((item) => (
                <div key={item._id}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <b>
                    £{(Number(item.price || 0) * item.quantity).toFixed(2)}
                  </b>
                </div>
              ))}

              <hr />

              <div>
                <span>Subtotal</span>
                <b>£{subtotal.toFixed(2)}</b>
              </div>

              <div>
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : `£${delivery.toFixed(2)}`}</span>
              </div>

              <hr />

              <div className="total">
                <span>Total</span>
                <b>£{total.toFixed(2)}</b>
              </div>

              {error && <div className="alert alert-danger mt-3">{error}</div>}

              <button
                type="submit"
                disabled={busy || !items.length}
                className="btn btn-gold w-100 mt-3"
              >
                {busy ? "Placing order..." : "Place order"}
              </button>

              <Link to="/cart" className="btn btn-outline-gold w-100 mt-2">
                Back to cart
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
