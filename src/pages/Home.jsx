import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";
import "./Home.css";

/* Royal Bites homepage. Paste this file into src/pages/Home.jsx.
   Uses your existing API, router and cart context. No new libraries needed. */

const FOOD_IMAGES = {
  burrata: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=900&auto=format&fit=crop&q=85",
  lamb: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900&auto=format&fit=crop&q=85",
  steak: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&auto=format&fit=crop&q=85",
  risotto: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=900&auto=format&fit=crop&q=85",
  dessert: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900&auto=format&fit=crop&q=85",
  drink: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=900&auto=format&fit=crop&q=85",
  sides: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&auto=format&fit=crop&q=85",
  hero: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1800&auto=format&fit=crop&q=90",
  dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c?w=1200&auto=format&fit=crop&q=85",
};

// Always-available illustration: protects against missing/broken external photos.
const IMAGE_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="620" viewBox="0 0 900 620"><defs><radialGradient id="g"><stop stop-color="#4c3826"/><stop offset="1" stop-color="#17110c"/></radialGradient></defs><rect width="900" height="620" fill="url(#g)"/><ellipse cx="450" cy="328" rx="250" ry="170" fill="#b99966"/><ellipse cx="450" cy="318" rx="227" ry="146" fill="#24201a"/><ellipse cx="450" cy="318" rx="165" ry="95" fill="#825039"/><path d="M320 305c80-76 186-66 253 0M340 356c85-53 153-51 224-9" fill="none" stroke="#c68d57" stroke-width="18" stroke-linecap="round"/><circle cx="535" cy="267" r="16" fill="#71804b"/><circle cx="384" cy="369" r="13" fill="#71804b"/><text x="450" y="554" fill="#dfb86f" font-size="28" font-family="Georgia" text-anchor="middle">ROYAL BITES</text></svg>'
)}`;

const DEMO_PRODUCTS = [
  { _id: "sample-burrata", name: "Burrata Caprese", category: "Starters", price: 12.95, description: "Creamy Italian burrata, heirloom tomatoes, basil and balsamic glaze.", popular: true },
  { _id: "sample-lamb", name: "Tandoori Lamb Chops", category: "Mains", price: 18.95, description: "Marinated overnight in yogurt, ginger and spices. Char-grilled.", popular: true },
  { _id: "sample-steak", name: "Wagyu Sirloin", category: "Mains", price: 48.5, description: "British Wagyu sirloin, black truffle butter, rosemary jus and pink gold.", popular: true },
  { _id: "sample-risotto", name: "Wild Mushroom Risotto", category: "Mains", price: 19.95, description: "Carnaroli rice slow-cooked with porcini, chestnut and king oyster mushrooms.", popular: true },
];

const CATEGORIES = [
  { name: "Starters", icon: "bi-stars" },
  { name: "Mains", icon: "bi-fire" },
  { name: "Sides", icon: "bi-basket2" },
  { name: "Desserts", icon: "bi-cake2" },
  { name: "Drinks", icon: "bi-cup-straw" },
];

const money = (value) => `Â£${(Number(value) || 0).toFixed(2)}`;

function fallbackPhoto(product) {
  const text = `${product?.name || product?.title || ""} ${product?.category || ""}`.toLowerCase();
  if (/burrata|caprese|tomato|salad|starter/.test(text)) return FOOD_IMAGES.burrata;
  if (/lamb|chop|tandoori/.test(text)) return FOOD_IMAGES.lamb;
  if (/risotto|mushroom|rice/.test(text)) return FOOD_IMAGES.risotto;
  if (/dessert|cake|sweet|chocolate/.test(text)) return FOOD_IMAGES.dessert;
  if (/drink|juice|mocktail|coffee|tea/.test(text)) return FOOD_IMAGES.drink;
  if (/side|fries|vegetable/.test(text)) return FOOD_IMAGES.sides;
  return FOOD_IMAGES.steak;
}

function resolveImage(product) {
  const raw = product?.imageUrl ?? product?.image ?? product?.thumbnail ??
    product?.photo ?? product?.images?.[0]?.url ?? product?.images?.[0]?.src ??
    (typeof product?.images?.[0] === "string" ? product.images[0] : "");
  if (!raw || typeof raw !== "string") return fallbackPhoto(product);
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  // Relative uploaded images often live on the backend, not the React dev server.
  const base = String(api?.defaults?.baseURL || "").replace(/\/+$/, "");
  if (!base) return raw.startsWith("/") ? raw : `/${raw}`;
  try {
    const origin = new URL(base, window.location.origin).origin;
    return new URL(raw.replace(/^\/+/, ""), `${origin}/`).href;
  } catch {
    return raw.startsWith("/") ? raw : `/${raw}`;
  }
}

function SafeImage({ src, fallback, alt, className = "" }) {
  const [url, setUrl] = useState(src || fallback || IMAGE_PLACEHOLDER);
  useEffect(() => setUrl(src || fallback || IMAGE_PLACEHOLDER), [src, fallback]);
  function handleError() {
    if (url !== fallback && fallback) setUrl(fallback);
    else if (url !== IMAGE_PLACEHOLDER) setUrl(IMAGE_PLACEHOLDER);
  }
  return <img className={className} src={url} alt={alt} loading="lazy" onError={handleError} />;
}

function DishCard({ product, onAdd, isDemo }) {
  const title = product.name || product.title || "Chef's special";
  return (
    <article className="rb-dish-card">
      <div className="rb-dish-image-wrap">
        <SafeImage src={resolveImage(product)} fallback={fallbackPhoto(product)} alt={title} className="rb-dish-image" />
        {(product.popular || product.featured) && <span className="rb-tag">âœ¦ Popular</span>}
      </div>
      <div className="rb-dish-body">
        <div className="rb-dish-title-row">
          <h3>{title}</h3>
          <strong>{money(product.price ?? product.salePrice)}</strong>
        </div>
        <p>{product.description || "Expertly prepared with quality seasonal ingredients."}</p>
        <button type="button" className="rb-add-btn" onClick={() => onAdd(product)} disabled={isDemo || product.available === false}>
          <i className="bi bi-plus-lg" aria-hidden="true" /> {isDemo ? "Preview dish" : product.available === false ? "Unavailable" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartError, setCartError] = useState("");
  const [heroImage, setHeroImage] = useState(FOOD_IMAGES.hero);
  const cart = useCart();
  const count = Number(cart?.count || 0);
  const subtotal = Number(cart?.subtotal || 0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/products", { signal: controller.signal });
        const payload = response.data;
        const incoming = Array.isArray(payload) ? payload : Array.isArray(payload?.products) ? payload.products : [];
        setProducts(incoming);
      } catch (err) {
        if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
        console.error("Unable to load restaurant menu:", err);
        setError("Live menu is unavailable. Sample dishes are displayed below.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadProducts();
    return () => controller.abort();
  }, []);

  const isDemo = products.length === 0;
  const visibleProducts = isDemo ? DEMO_PRODUCTS : products;
  const featuredProducts = useMemo(() => {
    const flagged = visibleProducts.filter((p) => p.featured || p.popular);
    return (flagged.length ? flagged : visibleProducts).slice(0, 4);
  }, [visibleProducts]);
  const homeMenuProducts = useMemo(() => activeCategory === "All" ? visibleProducts :
    visibleProducts.filter((p) => String(p.category || "").toLowerCase() === activeCategory.toLowerCase()),
    [visibleProducts, activeCategory]);

  function addToCart(product) {
    setCartError("");
    const add = cart?.addToCart || cart?.addItem;
    if (typeof add !== "function") {
      setCartError("Cart function not found. Check CartContext: expected addToCart(product) or addItem(product).");
      return;
    }
    try { add(product); } catch (err) {
      console.error("Unable to add to cart", err);
      setCartError("Could not add dish to cart. Please try again.");
    }
  }

  function chooseCategory(category) {
    setActiveCategory(category);
    document.getElementById("home-menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="rb-home">
      <section className="rb-hero">
        <img className="rb-hero-photo" src={heroImage} alt="Premium steak in an elegant restaurant" onError={() => setHeroImage(IMAGE_PLACEHOLDER)} />
        <div className="rb-container rb-hero-inner">
          <div className="rb-hero-content">
            <div className="rb-eyebrow">MANCHESTER Â· EST. 2016</div>
            <h1>A taste of royalty,<br />in every bite.</h1>
            <p>Modern British cuisine with global accents, crafted with care. Reserve your table or order online â€” your concierge is just a tap away.</p>
            <div className="rb-actions">
              <a href="#home-menu" className="rb-btn rb-btn-gold">Order Now <i className="bi bi-arrow-right" /></a>
              <Link to="/reserve" className="rb-btn rb-btn-outline">Reserve Table</Link>
              <Link to="/menu" className="rb-btn rb-btn-text">View Menu</Link>
            </div>
            <div className="rb-hero-meta">
              <span><i className="bi bi-star-fill" /> 4.9 Â· Guest favourites</span>
              <span><i className="bi bi-award" /> Chef's tasting menu</span>
              <span><i className="bi bi-truck" /> Free delivery over Â£25</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rb-section rb-container" aria-label="Featured food">
        <div className="rb-section-head">
          <div><span className="rb-eyebrow">CHEF'S SELECTION</span><h2>Featured this season</h2></div>
          <Link to="/menu" className="rb-gold-link">Explore full menu <i className="bi bi-arrow-right" /></Link>
        </div>
        {error && <p className="rb-notice" role="status">{error}</p>}
        {loading ? <div className="rb-loading" role="status">Loading dishes...</div> :
          <div className="rb-featured-grid">{featuredProducts.map((product, index) =>
            <DishCard key={product._id || product.id || index} product={product} onAdd={addToCart} isDemo={isDemo} />
          )}</div>}
      </section>

      <section className="rb-section rb-container rb-categories-section">
        <div className="rb-centered"><span className="rb-eyebrow">DISCOVER BY</span><h2>Popular categories</h2></div>
        <div className="rb-categories">
          {CATEGORIES.map((category) =>
            <button type="button" className="rb-category" onClick={() => chooseCategory(category.name)} key={category.name}>
              <i className={`bi ${category.icon}`} /><strong>{category.name}</strong><small>Explore dishes</small>
            </button>)}
        </div>
        <div className="rb-service-grid">
          <div className="rb-service"><i className="bi bi-truck" /><h3>Delivery to your door</h3><p>Across central Manchester. Free over Â£25, otherwise delivery charges apply.</p><a className="rb-btn rb-btn-gold" href="#home-menu">Order delivery</a></div>
          <div className="rb-service"><i className="bi bi-bag-check" /><h3>Click & collect</h3><p>Skip the queue. Order ahead and collect your favourites at your preferred time.</p><a className="rb-btn rb-btn-outline" href="#home-menu">Order takeaway</a></div>
        </div>
      </section>

      <section id="home-menu" className="rb-section rb-menu-section">
        <div className="rb-container">
          <div className="rb-centered"><span className="rb-eyebrow">ORDER ONLINE</span><h2>Choose from our menu</h2><p>Fresh flavours, made to order.</p></div>
          <div className="rb-filters" role="group" aria-label="Filter menu by category">
            {["All", ...CATEGORIES.map((c) => c.name)].map((category) =>
              <button type="button" key={category} aria-pressed={activeCategory === category} className={`rb-filter ${activeCategory === category ? "is-active" : ""}`} onClick={() => setActiveCategory(category)}>{category}</button>)}
          </div>
          {loading ? <div className="rb-loading">Loading menu...</div> : homeMenuProducts.length ?
            <div className="rb-menu-grid">{homeMenuProducts.map((product, index) => <DishCard key={product._id || product.id || index} product={product} onAdd={addToCart} isDemo={isDemo} />)}</div> :
            <div className="rb-empty">No dishes found in this category.</div>}
          {cartError && <p className="rb-notice" role="alert">{cartError}</p>}
          <div className="rb-cart-bar"><div><small>Current order</small><strong>{count} item{count === 1 ? "" : "s"} Â· {money(subtotal)}</strong></div><div className="rb-actions"><Link to="/menu" className="rb-btn rb-btn-outline">Full menu</Link><Link to="/cart" className={`rb-btn rb-btn-gold ${count === 0 ? "rb-disabled" : ""}`} aria-disabled={count === 0} onClick={(event) => { if (count === 0) event.preventDefault(); }}><i className="bi bi-bag" /> View cart ({count})</Link></div></div>
          {isDemo && !loading && <p className="rb-demo-note">Preview mode: connect your products API to enable ordering. Example dishes are not live inventory.</p>}
        </div>
      </section>

      <section className="rb-section rb-container">
        <div className="rb-centered"><span className="rb-eyebrow">LOVED BY GUESTS</span><h2>What people are saying</h2></div>
        <div className="rb-review-grid">
          <blockquote><div>â˜…â˜…â˜…â˜…â˜…</div><p>â€œThe Wagyu sirloin was unlike anything I have had in London. Service was impeccable.â€</p><small>â€” Sample review Â· Wagyu Sirloin</small></blockquote>
          <blockquote><div>â˜…â˜…â˜…â˜…â˜…</div><p>â€œTandoori lamb chops were perfect â€” smoky, tender, with just enough heat.â€</p><small>â€” Sample review Â· Lamb Chops</small></blockquote>
          <blockquote><div>â˜…â˜…â˜…â˜…â˜…</div><p>â€œFor our anniversary, the staff made it unforgettable. A wonderful evening.â€</p><small>â€” Sample review Â· Dining experience</small></blockquote>
        </div>
      </section>

      <section className="rb-section rb-container rb-visit">
        <SafeImage src={FOOD_IMAGES.dining} fallback={IMAGE_PLACEHOLDER} className="rb-visit-photo" alt="Elegant restaurant dining room" />
        <div className="rb-visit-copy"><span className="rb-eyebrow">COME DINE WITH US</span><h2>Visit us</h2><p>Discover a welcoming atmosphere, thoughtfully crafted cuisine and warm hospitality in Manchester.</p><p className="rb-visit-note">Add your confirmed restaurant address, phone number and opening hours here.</p><div className="rb-actions"><Link className="rb-btn rb-btn-gold" to="/reserve"><i className="bi bi-calendar-event" /> Reserve a table</Link><Link className="rb-btn rb-btn-outline" to="/contact">Contact us</Link></div></div>
      </section>
    </main>
  );
}
