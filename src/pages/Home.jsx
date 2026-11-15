import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";
import "../home-enhancements.css";

const foodPhotos = {
  Starters: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=900&q=85",
  Mains: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
  Sides: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
  Desserts: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85",
  Drinks: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
};
const fallbackFood = foodPhotos.Mains;
const categories = [
  { name: "Starters", icon: "bi-stars" },
  { name: "Mains", icon: "bi-fire" },
  { name: "Sides", icon: "bi-basket2" },
  { name: "Desserts", icon: "bi-cake2" },
  { name: "Drinks", icon: "bi-cup-straw" },
];

// Handles broken backend image URLs without changing your existing ProductCard component.
function DishCard({ product }) {
  const fallback = foodPhotos[product.category] || fallbackFood;
  const handleImageError = (event) => {
    const img = event.target;
    if (img instanceof HTMLImageElement && img.src !== fallback) {
      img.onerror = null;
      img.src = fallback;
    }
  };
  return (
    <div className="rb-dish-card" onErrorCapture={handleImageError}>
      <ProductCard p={product} />
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { count, subtotal } = useCart();

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        const response = await api.get("/products");
        if (active) setProducts(Array.isArray(response.data?.products) ? response.data.products : []);
      } catch (err) {
        console.error("Unable to load menu products:", err);
        if (active) setError("Menu could not be loaded. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProducts();
    return () => { active = false; };
  }, []);

  const featuredProducts = useMemo(() => {
    const featured = products.filter((p) => p.featured || p.popular);
    return (featured.length ? featured : products).slice(0, 4);
  }, [products]);
  const menuProducts = useMemo(() => activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory), [products, activeCategory]);

  return (
    <>
      <section className="hero rb-home-hero">
        <div className="container hero-inner">
          <div className="col-lg-7 rb-hero-content">
            <span className="eyebrow">MANCHESTER · EST. 2016</span>
            <h1>A taste of royalty,<br />in every bite.</h1>
            <p>Modern British cuisine with global accents, crafted with care. Reserve your table or order online — your concierge is just a tap away.</p>
            <div className="d-flex flex-wrap gap-2 mt-4">
              <a href="#home-menu" className="btn btn-gold btn-lg">Order Now <i className="bi bi-arrow-right ms-2" /></a>
              <Link to="/reserve" className="btn btn-outline-gold btn-lg">Reserve Table</Link>
              <Link to="/menu" className="btn btn-outline-light btn-lg">View Menu</Link>
            </div>
            <div className="hero-meta"><span><i className="bi bi-star-fill" /> 4.9 rating</span><span><i className="bi bi-award" /> Chef's tasting menu</span><span><i className="bi bi-truck" /> Free delivery over £25</span></div>
          </div>
        </div>
      </section>

      <section className="container py-5 rb-featured-section">
        <div className="section-head"><div><span className="eyebrow">CHEF'S SELECTION</span><h2>Featured this season</h2></div><Link to="/menu">Explore full menu →</Link></div>
        {loading ? <p className="text-muted">Loading dishes...</p> : error ? <div className="alert alert-secondary" role="alert">{error}</div> : featuredProducts.length ? <div className="row g-4">{featuredProducts.map((p) => <div className="col-sm-6 col-xl-3" key={p._id}><DishCard product={p} /></div>)}</div> : <div className="empty-box">No dishes available yet.</div>}
      </section>

      <section className="container py-5 rb-categories-section">
        <div className="text-center mb-4"><span className="eyebrow">DISCOVER BY</span><h2 className="rb-serif">Popular categories</h2></div>
        <div className="row g-3 text-center">{categories.map((category) => <div className="col-6 col-md" key={category.name}><a className="category-tile" href="#home-menu" onClick={() => setActiveCategory(category.name)}><i className={`bi ${category.icon}`} /><b>{category.name}</b><small>Explore dishes</small></a></div>)}</div>
        <div className="row g-4 mt-4"><div className="col-md-6"><div className="info-card h-100"><i className="bi bi-truck" /><h4>Delivery to your door</h4><p>Enjoy your favourites at home. Free delivery on orders over £25.</p><a href="#home-menu" className="btn btn-sm btn-gold">Order delivery</a></div></div><div className="col-md-6"><div className="info-card h-100"><i className="bi bi-bag-check" /><h4>Click & collect</h4><p>Skip the queue. Order ahead and collect at your preferred time.</p><a href="#home-menu" className="btn btn-sm btn-outline-gold">Order takeaway</a></div></div></div>
      </section>

      <section id="home-menu" className="soft-section"><div className="container py-5"><div className="text-center mb-4"><span className="eyebrow">ORDER ONLINE</span><h2>Choose from our menu</h2><p className="text-muted">Choose your favourite dishes and add them to your cart.</p></div><div className="filter-row justify-content-center mb-4">{["All", ...categories.map((c) => c.name)].map((category) => <button type="button" key={category} onClick={() => setActiveCategory(category)} className={`btn btn-sm ${activeCategory === category ? "btn-gold" : "btn-dark-soft"}`} aria-pressed={activeCategory === category}>{category}</button>)}</div>{loading ? <p className="text-center text-muted">Loading menu...</p> : error ? <div className="alert alert-secondary" role="alert">{error}</div> : menuProducts.length ? <div className="row g-4">{menuProducts.map((p) => <div className="col-md-6 col-xl-4" key={p._id}><DishCard product={p} /></div>)}</div> : <div className="empty-box">No dishes found in this category.</div>}<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4 p-3 home-cart-bar"><div><small className="text-muted d-block">Current order</small><strong>{count} item{count === 1 ? "" : "s"} · £{Number(subtotal || 0).toFixed(2)}</strong></div><div className="d-flex gap-2"><Link to="/menu" className="btn btn-outline-gold">Full menu</Link><Link to="/cart" className={`btn btn-gold ${count === 0 ? "disabled" : ""}`} aria-disabled={count === 0}><i className="bi bi-bag me-2" />View cart ({count})</Link></div></div></div></section>

      <section className="container py-5 rb-reviews"><div className="text-center mb-4"><span className="eyebrow">LOVED BY GUESTS</span><h2 className="rb-serif">What people are saying</h2></div><div className="row g-3">{[{quote:"A beautiful dining experience, from the first bite to the last.",by:"Guest review"},{quote:"Delicious food and a wonderfully welcoming atmosphere.",by:"Guest review"},{quote:"Perfect for a special evening with friends and family.",by:"Guest review"}].map((r,i) => <div className="col-md-4" key={i}><div className="rb-review-card"><div className="gold" aria-label="5 stars">★★★★★</div><p>“{r.quote}”</p><small>— {r.by}</small></div></div>)}</div><p className="text-center text-muted small mt-3">Illustrative review text — replace with verified customer reviews before publishing.</p></section>

      <section className="container py-5"><div className="row g-4 align-items-center rb-visit"><div className="col-lg-6"><img className="rb-visit-photo" src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1100&q=85" alt="Elegant restaurant dining room" loading="lazy" onError={(e) => {e.currentTarget.style.display = "none";}} /></div><div className="col-lg-6"><div className="rb-visit-copy"><span className="eyebrow">COME DINE WITH US</span><h2 className="rb-serif">Visit us</h2><p>Experience warm hospitality and carefully crafted food in Manchester.</p><p className="text-muted">For our current address, opening hours and availability, please contact the restaurant.</p><div className="d-flex flex-wrap gap-2"><Link to="/reserve" className="btn btn-gold">Reserve a table</Link><Link to="/contact" className="btn btn-outline-gold">Contact us</Link></div></div></div></div></section>
    </>
  );
}
