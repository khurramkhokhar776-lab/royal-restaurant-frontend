import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Self-contained static menu: no backend, axios or MongoDB needed.
const dishes = [
  { _id: "rb-01", slug: "burrata-caprese", name: "Burrata Caprese", category: "Starters", price: 12.95, description: "Creamy burrata, ripe tomatoes, basil and olive oil.", image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=900&q=85", fallback: "/images/dishes/burrata-caprese.svg", popular: true, featured: true },
  { _id: "rb-02", slug: "tandoori-lamb-chops", name: "Tandoori Lamb Chops", category: "Mains", price: 18.95, description: "Tender spiced lamb chops with mint yoghurt.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85", fallback: "/images/dishes/tandoori-lamb-chops.svg", popular: true, featured: true },
  { _id: "rb-03", slug: "wagyu-sirloin", name: "Wagyu Sirloin", category: "Mains", price: 48.5, description: "Juicy grilled steak with chef's seasonal garnish.", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85", fallback: "/images/dishes/wagyu-sirloin.svg", featured: true },
  { _id: "rb-04", slug: "chocolate-fondant", name: "Chocolate Fondant", category: "Desserts", price: 9.5, description: "Warm chocolate cake with a soft molten centre.", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85", fallback: "/images/dishes/chocolate-fondant.svg", popular: true, featured: true },
  { _id: "rb-05", slug: "crispy-calamari", name: "Crispy Calamari", category: "Starters", price: 10.95, description: "Golden calamari with fresh lemon and aioli.", image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=85", fallback: "/images/dishes/burrata-caprese.svg" },
  { _id: "rb-06", slug: "royal-burger", name: "Royal Beef Burger", category: "Mains", price: 15.95, description: "Grilled beef, cheese, crisp salad and house sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85", fallback: "/images/dishes/wagyu-sirloin.svg", popular: true },
  { _id: "rb-07", slug: "margherita-pizza", name: "Margherita Pizza", category: "Mains", price: 13.95, description: "Stone-baked pizza with mozzarella and fresh basil.", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85", fallback: "/images/dishes/wagyu-sirloin.svg" },
  { _id: "rb-08", slug: "truffle-fries", name: "Truffle Parmesan Fries", category: "Sides", price: 5.95, description: "Crisp fries with parmesan and truffle seasoning.", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85", fallback: "/images/dishes/tandoori-lamb-chops.svg" },
  { _id: "rb-09", slug: "garden-salad", name: "Garden Salad", category: "Sides", price: 6.5, description: "Seasonal greens with a light house dressing.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85", fallback: "/images/dishes/burrata-caprese.svg" },
  { _id: "rb-10", slug: "strawberry-cheesecake", name: "Strawberry Cheesecake", category: "Desserts", price: 8.95, description: "Creamy cheesecake finished with fresh strawberries.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85", fallback: "/images/dishes/chocolate-fondant.svg" },
  { _id: "rb-11", slug: "iced-coffee", name: "Iced Coffee", category: "Drinks", price: 4.95, description: "Chilled coffee served over ice.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85", fallback: "/images/dishes/chocolate-fondant.svg" },
  { _id: "rb-12", slug: "fresh-lemonade", name: "Fresh Lemonade", category: "Drinks", price: 4.5, description: "Refreshing citrus lemonade served chilled.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85", fallback: "/images/dishes/burrata-caprese.svg" }
];

const categories = [
  { name: "Starters", icon: "bi-stars" },
  { name: "Mains", icon: "bi-fire" },
  { name: "Sides", icon: "bi-basket2" },
  { name: "Desserts", icon: "bi-cake2" },
  { name: "Drinks", icon: "bi-cup-straw" }
];

const placeholder = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#201710"/><circle cx="300" cy="185" r="95" fill="none" stroke="#e8b64b" stroke-width="12"/><text x="300" y="205" fill="#e8b64b" text-anchor="middle" font-family="Georgia" font-size="35">Royal Bites</text></svg>')}`;

function FoodPhoto({ product }) {
  const [source, setSource] = useState(product.image);
  return (
    <img
      src={source}
      alt={product.name}
      loading="lazy"
      onError={() => setSource((old) => old === product.image ? product.fallback : placeholder)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

function DishCard({ product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <article className="product-card h-100">
      <div className="product-img-wrap">
        <FoodPhoto product={product} />
        {product.popular && <span className="badge-pop">Popular</span>}
      </div>
      <div className="p-3">
        <div className="d-flex justify-content-between gap-2 mb-2">
          <h5>{product.name}</h5>
          <b className="gold text-nowrap">£{product.price.toFixed(2)}</b>
        </div>
        <p className="small text-muted clamp2">{product.description}</p>
        <button
          type="button"
          className="btn btn-gold w-100"
          onClick={() => { add(product, 1); setAdded(true); }}
        >
          <i className={`bi ${added ? "bi-check-lg" : "bi-plus-lg"} me-2`} />
          {added ? "Add another" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { count, subtotal } = useCart();
  const featuredProducts = useMemo(() => dishes.filter((p) => p.featured).slice(0, 4), []);
  const visibleProducts = useMemo(() => activeCategory === "All" ? dishes : dishes.filter((p) => p.category === activeCategory), [activeCategory]);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="col-lg-7">
            <div className="eyebrow">MANCHESTER · FINE DINING</div>
            <h1>A taste of royalty,<br />in every bite.</h1>
            <p>Modern British cuisine with global flavours, premium ingredients and a warm, elegant dining experience—at your table or delivered to your door.</p>
            <div className="d-flex flex-wrap gap-2">
              <a href="#home-menu" className="btn btn-gold btn-lg">Order now</a>
              <Link to="/reserve" className="btn btn-outline-light btn-lg">Reserve table</Link>
            </div>
            <div className="hero-meta">
              <span><i className="bi bi-star-fill" /> Chef's selection</span>
              <span><i className="bi bi-clock" /> Freshly prepared</span>
              <span><i className="bi bi-truck" /> Free delivery over £25</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="section-head">
          <div><span className="eyebrow">CHEF'S SELECTION</span><h2>Featured favourites</h2></div>
          <a href="#home-menu">Explore menu →</a>
        </div>
        <div className="row g-4">
          {featuredProducts.map((product) => <div className="col-md-6 col-xl-3" key={product._id}><DishCard product={product} /></div>)}
        </div>
      </section>

      <section id="home-menu" className="soft-section">
        <div className="container py-5">
          <div className="text-center mb-4">
            <span className="eyebrow">ORDER ONLINE</span>
            <h2>Choose from our menu</h2>
            <p className="text-muted mb-0">Freshly prepared favourites, ready for your cart.</p>
          </div>
          <div className="filter-row justify-content-center mb-4">
            {["All", ...categories.map((c) => c.name)].map((category) => (
              <button type="button" key={category} onClick={() => setActiveCategory(category)} className={`btn btn-sm ${activeCategory === category ? "btn-gold" : "btn-dark-soft"}`} aria-pressed={activeCategory === category}>{category}</button>
            ))}
          </div>
          <div className="row g-4">
            {visibleProducts.map((product) => <div className="col-md-6 col-xl-4" key={product._id}><DishCard product={product} /></div>)}
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4 p-3 home-cart-bar">
            <div><small className="text-muted d-block">Current order</small><strong>{count} item{count === 1 ? "" : "s"} · £{subtotal.toFixed(2)}</strong></div>
            <Link to="/cart" className="btn btn-gold"><i className="bi bi-bag me-2" />View cart ({count})</Link>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="text-center mb-4"><span className="eyebrow">DISCOVER</span><h2 className="page-title fs-1">Popular categories</h2></div>
        <div className="row g-3 text-center">
          {categories.map((category) => (
            <div className="col-6 col-md" key={category.name}>
              <a className="category-tile" href="#home-menu" onClick={() => setActiveCategory(category.name)}>
                <i className={`bi ${category.icon}`} /><b>{category.name}</b><small>Explore</small>
              </a>
            </div>
          ))}
        </div>
        <div className="row g-4 mt-3">
          <div className="col-md-6"><div className="info-card h-100"><i className="bi bi-truck" /><h4>Delivery to your door</h4><p>Enjoy Royal Bites favourites at home. Free delivery on orders over £25.</p><a href="#home-menu" className="btn btn-sm btn-gold">Order delivery</a></div></div>
          <div className="col-md-6"><div className="info-card h-100"><i className="bi bi-bag-check" /><h4>Click & collect</h4><p>Choose your favourites and prepare your takeaway order.</p><a href="#home-menu" className="btn btn-sm btn-outline-gold">Order takeaway</a></div></div>
        </div>
      </section>
    </>
  );
}
