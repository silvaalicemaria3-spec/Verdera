const products = [
  { id: 1, name: "Whey Protein Vegano", category: "Suplementos", description: "Baunilha · 450g", price: 89.90, image: "IMG/362+ Natural Healthy Food Packaging Design Ideas.jpeg", badge: "Mais vendido" },
  { id: 2, name: "Chá Calmante Orgânico", category: "Chás", description: "Camomila & erva-doce · 30 sachês", price: 32.90, image: "IMG/transferir (1).jpeg", badge: "Novidade", new: true },
  { id: 3, name: "Mix de Oleaginosas", category: "Oleaginosas", description: "Castanhas, nozes & amêndoas · 200g", price: 28.50, image: "IMG/Compostable Stand-Up Pouches Supplier Eco Packaging Wholesale.jpeg" },
  { id: 4, name: "Granola Crocante", category: "Grãos", description: "Sem açúcar · 300g", price: 24.90, image: "IMG/Dried fruit snacks perfect for healthy and delicious anytime treats_.jpeg", badge: "Mais vendido" },
  { id: 5, name: "Cúrcuma em Pó", category: "Vitaminas", description: "Açafrão da terra · 100g", price: 18.90, image: "IMG/transferir.jpeg" },
  { id: 6, name: "Aveia em Flocos", category: "Grãos", description: "Integral & orgânica · 500g", price: 16.90, image: "IMG/362+ Natural Healthy Food Packaging Design Ideas.jpeg" },
  { id: 7, name: "Colágeno Natural", category: "Vitaminas", description: "Sabor neutro · 300g", price: 119.90, image: "IMG/Compostable Stand-Up Pouches Supplier Eco Packaging Wholesale.jpeg", badge: "Novidade", new: true },
  { id: 8, name: "Chá Verde Matcha", category: "Chás", description: "Matcha premium · 80g", price: 54.90, image: "IMG/Natchro Juice to the world.jpeg" }
];

let cart = JSON.parse(localStorage.getItem("verderaCart") || "[]");

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function productCard(product) {
  const badge = product.badge ? `<span class="product-badge ${product.new ? "new" : ""}">${product.badge}</span>` : "";
  return `<article class="product-card" data-category="${product.category}">
    <div class="product-image">${badge}<img src="${product.image}" alt="${product.name}" loading="lazy"></div>
    <div class="product-info">
      <span class="product-category">${product.category}</span>
      <h3>${product.name}</h3><p>${product.description}</p>
      <div class="product-bottom"><strong class="price">${money(product.price)}</strong><button class="add-cart" data-id="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">+</button></div>
    </div>
  </article>`;
}

function renderProducts(filter = "Todos", query = "") {
  const grid = document.querySelector(".catalog-grid");
  const normalized = query.trim().toLowerCase();
  const filtered = products.filter(p =>
    (filter === "Todos" || p.category === filter) &&
    (!normalized || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(normalized))
  );
  grid.innerHTML = filtered.length ? filtered.map(productCard).join("") : `<p style="grid-column:1/-1;text-align:center;color:#748078;padding:40px">Nenhum produto encontrado.</p>`;
  bindAddButtons();
}

document.getElementById("featuredGrid").innerHTML = products.slice(0,4).map(productCard).join("");
renderProducts();
bindAddButtons();

function bindAddButtons() {
  document.querySelectorAll(".add-cart").forEach(button => {
    button.onclick = () => addToCart(Number(button.dataset.id));
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart();
  showToast(`${product.name} foi adicionado ao carrinho`);
}

function saveCart() {
  localStorage.setItem("verderaCart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector(".cart-count").textContent = count;
  const items = document.querySelector(".cart-items");
  if (!cart.length) {
    items.innerHTML = `<div class="empty-cart"><p>Seu carrinho está vazio.</p><small>Adicione produtos naturais à sua rotina.</small></div>`;
  } else {
    items.innerHTML = cart.map(item => `<div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info"><strong>${item.name}</strong><span>${item.quantity} × ${money(item.price)}</span></div>
      <button class="remove-item" data-id="${item.id}" aria-label="Remover item">×</button>
    </div>`).join("");
    items.querySelectorAll(".remove-item").forEach(button => {
      button.onclick = () => {
        cart = cart.filter(item => item.id !== Number(button.dataset.id));
        saveCart();
      };
    });
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelector(".cart-total").textContent = money(total);
}
updateCart();

const cartDrawer = document.querySelector(".cart-drawer");
const overlay = document.querySelector(".overlay");
function closeCart() { cartDrawer.classList.remove("open"); cartDrawer.setAttribute("aria-hidden","true"); if (!document.querySelector(".first-purchase-modal").classList.contains("open")) overlay.classList.remove("open"); document.querySelector(".account-modal").classList.remove("open"); }
document.querySelector(".cart-button").onclick = () => { cartDrawer.classList.add("open"); cartDrawer.setAttribute("aria-hidden","false"); overlay.classList.add("open"); };
document.querySelector(".close-cart").onclick = closeCart;
overlay.onclick = () => {
  if (document.querySelector(".first-purchase-modal").classList.contains("open")) {
    closeFirstPurchase();
  } else {
    closeCart();
  }
};

document.querySelectorAll(".filter").forEach(button => {
  button.onclick = () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    renderProducts(button.dataset.filter);
  };
});
document.querySelectorAll(".category-card").forEach(card => {
  card.onclick = () => {
    const category = card.dataset.category;
    const matching = [...document.querySelectorAll(".filter")].find(b => b.dataset.filter === category);
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    if (matching) matching.classList.add("active");
    else document.querySelector('[data-filter="Todos"]').classList.add("active");
    renderProducts(["Suplementos","Chás","Grãos","Oleaginosas","Vitaminas"].includes(category) ? category : "Todos");
    document.getElementById("catalogo").scrollIntoView();
  };
});

const searchPanel = document.querySelector(".search-panel");
document.querySelector(".search-button").onclick = () => { searchPanel.classList.toggle("open"); if (searchPanel.classList.contains("open")) document.getElementById("searchInput").focus(); };
document.querySelector(".close-search").onclick = () => searchPanel.classList.remove("open");
document.getElementById("searchInput").oninput = event => { renderProducts("Todos", event.target.value); document.getElementById("catalogo").scrollIntoView(); };

const menu = document.querySelector(".main-nav");
document.querySelector(".menu-toggle").onclick = () => menu.classList.toggle("open");
menu.querySelectorAll("a").forEach(link => link.onclick = () => menu.classList.remove("open"));

const accountModal = document.querySelector(".account-modal");
document.querySelector(".account-button").onclick = () => { accountModal.classList.add("open"); overlay.classList.add("open"); };
document.querySelector(".close-modal").onclick = closeCart;
accountModal.querySelector("form").onsubmit = event => { event.preventDefault(); closeCart(); showToast("Login realizado com sucesso"); };

document.querySelector(".checkout-button").onclick = () => {
  if (!cart.length) showToast("Seu carrinho está vazio");
  else showToast("Checkout seguro iniciado");
};
document.getElementById("newsletterForm").onsubmit = event => { event.preventDefault(); event.currentTarget.reset(); showToast("Você entrou para o Clube Verdera!"); };

function showToast(message) {
  const toast = document.querySelector(".toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.querySelectorAll(".lifestyle-card").forEach(card => {
  card.addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput");
    searchInput.value = card.dataset.lifestyle;
    renderProducts("Todos");
    document.querySelectorAll(".filter").forEach(button => button.classList.remove("active"));
    document.querySelector('[data-filter="Todos"]').classList.add("active");
    window.setTimeout(() => {
      document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
    }, 50);
  });
});

const firstPurchaseModal = document.querySelector(".first-purchase-modal");
const firstPurchaseKey = "verderaFirstPurchaseSeen";
if (!localStorage.getItem(firstPurchaseKey)) {
  window.setTimeout(() => {
    firstPurchaseModal.classList.add("open");
    overlay.classList.add("open");
  }, 700);
}

function closeFirstPurchase() {
  firstPurchaseModal.classList.remove("open");
  overlay.classList.remove("open");
  localStorage.setItem(firstPurchaseKey, "true");
}
document.querySelector(".close-first-purchase").onclick = closeFirstPurchase;
document.getElementById("firstPurchaseForm").onsubmit = event => {
  event.preventDefault();
  localStorage.setItem(firstPurchaseKey, "true");
  closeFirstPurchase();
  showToast("Cupom de 10% OFF enviado para seu e-mail");
};

document.querySelector(".first-purchase-trigger").onclick = () => {
  firstPurchaseModal.classList.add("open");
  overlay.classList.add("open");
};
