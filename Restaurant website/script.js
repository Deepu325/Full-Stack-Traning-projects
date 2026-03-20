const menuData = [
  { id: 1, name: "Margherita Pizza", description: "Tomato, mozzarella, basil.", price: 320, image: "https://lifemadesweeter.com/wp-content/uploads/Margherita-Pizza-Recipe-Photo-Picture-10-e1493695919928.jpg" },
  { id: 2, name: "Veggie Burger", description: "Grilled veggie patty with sauce", price: 250, image: "https://cookieandkate.com/images/2013/05/best-veggie-burger-recipe-3.jpg" },
  { id: 3, name: "Thai Noodles", description: "Spicy, tangy noodle bowl with tofu and peanuts.", price: 480, image: "https://eatwithclarity.com/wp-content/uploads/2023/09/thai-red-curry-noodles-5.jpg" },
  { id: 4, name: "Pasta Alfredo", description: "Creamy white sauce pasta.", price: 310, image: "https://images.aws.nestle.recipes/resized/cc72869fabfc2bdfa036fd1fe0e2bad8_creamy_alfredo_pasta_long_left_1080_850.jpg" },
  { id: 5, name: "Rainbow Salad", description: "Fresh greens, feta, seasonal fruits, honey balsamic.", price: 210, image: "https://www.shelikesfood.com/wp-content/uploads/2022/06/nRainbow-Veggie-Salad-9921.jpg" },
  { id: 6, name: "Tandoori Chicken", description: "Spiced grilled chicken.", price: 470, image: "https://www.kitchensanctuary.com/wp-content/uploads/2025/07/Tandoori-Chicken-Square-FS.jpg" },
  { id: 7, name: "Paneer Tikka", description: "Spicy cottage cheese skewers.", price: 300, image: "https://sharethespice.com/wp-content/uploads/2024/02/Paneer-Tikka-Featured-720x720.jpg" },
  { id: 8, name: "Baby corn Manchurian", description: "Spicy baby corn in a tangy sauce.", price: 280, image: "https://blendofspicesbysara.com/wp-content/uploads/2023/03/IMG_20230226_123419_050-01-e1678517127874.jpeg" },
  { id: 9, name: "Chocolate Brownie", description: "Rich chocolate brownie with ice cream.", price: 180, image: "https://www.recipetocook.co.uk/wp-content/uploads/2024/02/chocolate-brownie-recipe.jpg" },
];

const getById = id => document.getElementById(id);
let cart = JSON.parse(localStorage.getItem("spicegarden_cart")) || [];

function saveCart() {
  localStorage.setItem("spicegarden_cart", JSON.stringify(cart));
}

function createMenuCard(item) {
  const card = document.createElement("article");
  card.className = "menu-card";
  card.innerHTML = `
    <img src="${item.image}" alt="${item.name}" />
    <div class="body">
      <h3>${item.name}</h3>
      <p class="price">₹${item.price.toFixed(2)}</p>
      <p>${item.description}</p>
      <button data-id="${item.id}">Add to Cart</button>
    </div>`;
  card.querySelector("button").addEventListener("click", () => addToCart(item.id));
  return card;
}

function renderMenu() {
  const menuGrid = getById("menu-grid");
  if (!menuGrid) return;
  menuGrid.innerHTML = "";
  menuData.forEach(item => menuGrid.appendChild(createMenuCard(item)));
}

function renderOrderMenu() {
  const assignment = getById("order-menu");
  if (!assignment) return;
  assignment.innerHTML = "";
  menuData.forEach(item => {
    const entry = document.createElement("div");
    entry.className = "item";
    entry.innerHTML = `
      <div>
        <strong>${item.name}</strong> ₹${item.price}
      </div>
      <button data-id="${item.id}">Add</button>`;
    entry.querySelector("button").addEventListener("click", () => addToCart(item.id));
    assignment.appendChild(entry);
  });
}

function addToCart(id) {
  const item = menuData.find(f => f.id === id);
  if (!item) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...item, quantity: 1 });
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  const listEl = getById("cart-items");
  const totalEl = getById("cart-total");
  if (!listEl || !totalEl) return;
  listEl.innerHTML = "";
  let total = 0;
  if (cart.length === 0) {
    listEl.innerHTML = "<li>Your cart is empty.</li>";
  } else {
    cart.forEach(item => {
      total += item.price * item.quantity;
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <span>${item.name} x ${item.quantity}</span>
        <span>₹${(item.price * item.quantity).toFixed(2)}
          <button data-remove="${item.id}" style="margin-left:0.5rem; background:#ff6767; border:none; border-radius:6px; color:#fff; padding:2px 6px;">x</button>
        </span>`;
      li.querySelector("button").addEventListener("click", () => removeFromCart(item.id));
      listEl.appendChild(li);
    });
  }
  totalEl.textContent = total.toFixed(2);
}

function showMessage(id, text, isSuccess = true) {
  const el = getById(id);
  if (!el) return;
  el.textContent = text;
  el.classList.add("show");
  el.style.color = isSuccess ? "#0d6e1c" : "#b2102f";
  el.style.background = isSuccess ? "#e2f8e9" : "#fde2e5";
  setTimeout(() => {
    el.classList.remove("show");
  }, 5000);
}

function submitOrder(evt) {
  evt.preventDefault();
  const name = getById("customer-name").value.trim();
  const email = getById("customer-email").value.trim();
  const phone = getById("customer-phone").value.trim();
  if (!name || !email || !phone) return showMessage("order-message", "Please fill all fields.", false);
  if (cart.length === 0) return showMessage("order-message", "Add items before ordering.", false);

  const order = {
    id: Date.now(),
    customer: { name, email, phone },
    items: cart,
    total: cart.reduce((acc, i) => acc + i.price * i.quantity, 0),
    created_at: new Date().toISOString()
  };
  console.log("Order for DB:", order);
  localStorage.setItem("spicegarden_last_order", JSON.stringify(order));
  cart = [];
  saveCart();
  renderCart();
  getById("order-form").reset();
  showMessage("order-message", "Order placed successfully ✅");
}

function submitReservation(evt) {
  evt.preventDefault();
  const data = {
    name: getById("res-name").value.trim(),
    email: getById("res-email").value.trim(),
    phone: getById("res-phone").value.trim(),
    date: getById("res-date").value,
    time: getById("res-time").value,
    guests: parseInt(getById("res-guests").value, 10)
  };
  if (!data.name || !data.email || !data.phone || !data.date || !data.time || !data.guests) {
    return showMessage("reservation-message", "Please complete all reservation fields.", false);
  }
  console.log("Reservation for DB:", data);
  showMessage("reservation-message", "Reservation confirmed. We will contact you soon.");
  evt.target.reset();
}

function submitContact(evt) {
  evt.preventDefault();
  const data = {
    name: getById("contact-name").value.trim(),
    email: getById("contact-email").value.trim(),
    phone: getById("contact-phone").value.trim(),
    message: getById("contact-message").value.trim(),
    submitted_at: new Date().toISOString()
  };
  if (!data.name || !data.email || !data.phone || !data.message) {
    return showMessage("contact-feedback", "Please fill all fields in contact form", false);
  }
  console.log("Contact message for DB:", data);
  showMessage("contact-feedback", "Message sent successfully. Thanks!");
  evt.target.reset();
}

window.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderOrderMenu();
  renderCart();

  const orderForm = getById("order-form");
  if (orderForm) orderForm.addEventListener("submit", submitOrder);

  const reservationForm = getById("reservation-form");
  if (reservationForm) reservationForm.addEventListener("submit", submitReservation);

  const contactForm = getById("contact-form");
  if (contactForm) contactForm.addEventListener("submit", submitContact);
});