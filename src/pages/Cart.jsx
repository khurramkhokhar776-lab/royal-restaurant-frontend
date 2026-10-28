import React from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { imageUrl } from "../services/api";

export default function Cart() {
  const { items, setQty, remove, subtotal } = useCart();

  const delivery = subtotal >= 25 ? 0 : 2.5;
  const total = subtotal + delivery;

  if (!items.length) {
    return (
      <div className="container py-5">
        <div className="empty-box">
          <i className="bi bi-bag fs-1"></i>
          <h2>Your cart is empty</h2>
          <p className="text-muted">
            Add your favourite dishes from the menu to start an order.
          </p>
          <Link to="/menu" className="btn btn-gold">
            Browse menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
        <h1 className="page-title mb-0">Your Cart</h1>
        <Link to="/menu" className="btn btn-outline-gold">
          + Add more items
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {items.map((item) => (
            <div className="cart-row" key={item._id}>
              <img src={imageUrl(item.image)} alt={item.name} />

              <div className="flex-grow-1">
                <h5>{item.name}</h5>
                <span className="gold">
                  £{Number(item.price || 0).toFixed(2)} each
                </span>
              </div>

              <div className="qty">
                <button
                  type="button"
                  onClick={() => setQty(item._id, item.quantity - 1)}
                  aria-label={`Decrease ${item.name} quantity`}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => setQty(item._id, item.quantity + 1)}
                  aria-label={`Increase ${item.name} quantity`}
                >
                  +
                </button>
              </div>

              <b>
                £{(Number(item.price || 0) * item.quantity).toFixed(2)}
              </b>

              <button
                type="button"
                className="icon-trash"
                onClick={() => remove(item._id)}
                aria-label={`Remove ${item.name}`}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="summary-card">
            <h4>Order summary</h4>

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

            <Link to="/checkout" className="btn btn-gold w-100 mt-3">
              Proceed to checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
