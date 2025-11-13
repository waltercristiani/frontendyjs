document.addEventListener("DOMContentLoaded", () => {
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const carritoPanel = document.getElementById('carrito-panel');
const carritoItems = document.getElementById('carrito-items');
const totalSpan = document.getElementById('total');
const btnVaciar = document.getElementById('vaciar-carrito');
const btnCerrar = document.getElementById('cerrar-carrito');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Mostrar carrito
cartIcon.addEventListener('click', () => {
  carritoPanel.classList.toggle('visible');
  renderCarrito();
});

btnCerrar.addEventListener('click', () => {
  carritoPanel.classList.remove('visible');
});

// Agregar productos
document.querySelectorAll('.agregar-carrito').forEach(boton => {
  boton.addEventListener('click', e => {
    const nombre = boton.dataset.nombre;
    const precio = parseFloat(boton.dataset.precio);
    const cantidad = parseInt(boton.parentElement.querySelector('.cantidad').value);

    const item = carrito.find(p => p.nombre === nombre);
    if (item) {
      item.cantidad += cantidad;
    } else {
      carrito.push({ nombre, precio, cantidad });
    }
    guardarCarrito();
    actualizarContador();
  });
});

// Renderizar carrito
function renderCarrito() {
  carritoItems.innerHTML = '';
  let total = 0;

  carrito.forEach((prod, index) => {
    const item = document.createElement('div');
    item.classList.add('carrito-item');
    item.innerHTML = `
      <p>${prod.nombre}</p>
      <p>$${prod.precio} x ${prod.cantidad}</p>
      <p>Subtotal: $${prod.precio * prod.cantidad}</p>
      <button class="eliminar" data-index="${index}">❌</button>
    `;
    carritoItems.appendChild(item);
    total += prod.precio * prod.cantidad;
  });

  totalSpan.textContent = total.toLocaleString();

  document.querySelectorAll('.eliminar').forEach(btn => {
    btn.addEventListener('click', e => {
      const i = e.target.dataset.index;
      carrito.splice(i, 1);
      guardarCarrito();
      renderCarrito();
      actualizarContador();
    });
  });
}

btnVaciar.addEventListener('click', () => {
  carrito = [];
  guardarCarrito();
  renderCarrito();
  actualizarContador();
});

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarContador() {
  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  cartCount.textContent = totalItems;
}

actualizarContador();
});