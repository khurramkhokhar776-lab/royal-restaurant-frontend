import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { count, subtotal } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");
        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Unable to load menu products:", err);
        setError("Menu could not be loaded. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = [
    { name: "Starters", icon: "bi-stars" },
    { name: "Mains", icon: "bi-fire" },
    { name: "Sides", icon: "bi-basket2" },
    { name: "Desserts", icon: "bi-cake2" },
    { name: "Drinks", icon: "bi-cup-straw" },
  ];

  const featuredProducts = useMemo(() => {
    const featured = products.filter(
      (product) => product.featured || product.popular
    );

    return (featured.length ? featured : products).slice(0, 4);
  }, [products]);

  const homeMenuProducts = useMemo(() => {
    if (activeCategory === "All") {
      return products;
    }

    return products.filter((product) => product.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="col-lg-6">
            <div className="eyebrow">MANCHESTER · FINE DINING</div>

            <h1>
              A taste of royalty,
              <br />
              in every bite.
            </h1>

            <p>
              Modern British cuisine with global flavours, premium ingredients
              and a warm, elegant dining experience—at your table or delivered
              to your door.
            </p>

            <div className="d-flex flex-wrap gap-2">
              <a href="#home-menu" className="btn btn-gold btn-lg">
                Order now
              </a>

              <Link to="/reserve" className="btn btn-outline-light btn-lg">
                Reserve table
              </Link>
            </div>

            <div className="hero-meta">
              <span>
                <i className="bi bi-star-fill"></i> 4.9 rating
              </span>

              <span>
                <i className="bi bi-clock"></i> Open daily
              </span>

              <span>
                <i className="bi bi-truck"></i> Free delivery over £25
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container py-5">
        <div className="section-head">
          <div>
            <span className="eyebrow">CHEF'S SELECTION</span>
            <h2>Featured favourites</h2>
          </div>

          <Link to="/menu">View full menu →</Link>
        </div>

        {loading ? (
          <div className="text-center py-4 text-muted">Loading dishes...</div>
        ) : error ? (
          <div className="alert alert-secondary">{error}</div>
        ) : (
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div className="col-md-6 col-xl-3" key={product._id}>
                <ProductCard p={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOME MENU / ORDER ONLINE */}
      <section id="home-menu" className="soft-section">
        <div className="container py-5">
          <div className="text-center mb-4">
            <span className="eyebrow">ORDER ONLINE</span>
            <h2>Choose from our menu</h2>
            <p className="text-muted mb-0">
              Select any dish and press Add to cart. Your order will be saved in
              the cart until checkout.
            </p>
          </div>

          <div className="filter-row justify-content-center mb-4">
            {["All", ...categories.map((category) => category.name)].map(
              (category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`btn btn-sm ${
                    activeCategory === category ? "btn-gold" : "btn-dark-soft"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>

          {loading ? (
            <div className="text-center py-4 text-muted">Loading menu...</div>
          ) : error ? (
            <div className="alert alert-secondary">{error}</div>
          ) : homeMenuProducts.length ? (
            <div className="row g-4">
              {homeMenuProducts.map((product) => (
                <div className="col-md-6 col-xl-4" key={product._id}>
                  <ProductCard p={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-box">No dishes found in this category.</div>
          )}

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4 p-3 home-cart-bar">
            <div>
              <small className="text-muted d-block">Current order</small>
              <strong>
                {count} item{count === 1 ? "" : "s"} · £{subtotal.toFixed(2)}
              </strong>
            </div>

            <div className="d-flex gap-2">
              <Link to="/menu" className="btn btn-outline-gold">
                Full menu
              </Link>

              <Link
                to="/cart"
                className={`btn btn-gold ${count === 0 ? "disabled" : ""}`}
                aria-disabled={count === 0}
              >
                <i className="bi bi-bag me-2"></i>
                View cart ({count})
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="container py-5">
        <div className="text-center mb-4">
          <span className="eyebrow">DISCOVER</span>
          <h2 className="page-title fs-1">Popular categories</h2>
        </div>

        <div className="row g-3 text-center">
          {categories.map((category) => (
            <div className="col-6 col-md" key={category.name}>
              <a
                className="category-tile"
                href="#home-menu"
                onClick={() => setActiveCategory(category.name)}
              >
                <i className={`bi ${category.icon}`}></i>
                <b>{category.name}</b>
                <small>Explore</small>
              </a>
            </div>
          ))}
        </div>

        {/* DELIVERY & COLLECTION */}
        <div className="row g-4 mt-3">
          <div className="col-md-6">
            <div className="info-card h-100">
              <i className="bi bi-truck"></i>
              <h4>Delivery to your door</h4>
              <p>
                Across central Manchester within 45 minutes. Free over £25.
              </p>
              <a href="#home-menu" className="btn btn-sm btn-gold">
                Order delivery
              </a>
            </div>
          </div>

          <div className="col-md-6">
            <div className="info-card h-100">
              <i className="bi bi-bag-check"></i>
              <h4>Click & collect</h4>
              <p>
                Skip the queue. Order ahead and collect at your preferred time.
              </p>
              <a href="#home-menu" className="btn btn-sm btn-outline-gold">
                Order takeaway
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
