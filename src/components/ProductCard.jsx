import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { imageUrl } from "../services/api";

export default function ProductCard({ p }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    add(p, 1);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 900);
  };

  return (
    <div className="product-card h-100">
      <div className="product-img-wrap">
        <img src={imageUrl(p.image)} alt={p.name} />
        {p.popular && <span className="badge-pop">Popular</span>}
      </div>

      <div className="p-3">
        <div className="d-flex justify-content-between gap-2">
          <h5>{p.name}</h5>
          <b className="gold">£{Number(p.price || 0).toFixed(2)}</b>
        </div>

        <p className="small text-muted clamp2">{p.description}</p>

        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn btn-gold flex-grow-1"
          >
            <i className={`bi ${added ? "bi-check-lg" : "bi-plus-lg"} me-1`}></i>
            {added ? "Added" : "Add to cart"}
          </button>

          <Link
            className="btn btn-outline-secondary"
            to={`/product/${p.slug || p._id}`}
            aria-label={`View ${p.name}`}
          >
            <i className="bi bi-eye"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
