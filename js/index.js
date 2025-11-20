document.addEventListener("DOMContentLoaded", () => {

  const cartIcon = document.getElementById('cart-icon');
  const cartCount = document.getElementById('cart-count');
  const carritoPanel = document.getElementById('carrito-panel');
  const carritoItems = document.getElementById('carrito-items');
  const totalSpan = document.getElementById('total');
  const btnVaciar = document.getElementById('vaciar-carrito');
  const btnCerrar = document.getElementById('cerrar-carrito');

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Mostrar u ocultar carrito
  cartIcon.addEventListener('click', () => {
    carritoPanel.classList.toggle('visible');
    renderCarrito();
  });

  btnCerrar.addEventListener('click', () => {
    carritoPanel.classList.remove('visible');
  });

  // Agregar productos al carrito
  document.querySelectorAll('.agregar-carrito').forEach(boton => {
    boton.addEventListener('click', e => {

      const nombre = boton.dataset.nombre;
      const precio = parseFloat(boton.dataset.precio);
      const cantidad = parseInt(boton.parentElement.querySelector('.cantidad').value);
      const img = boton.dataset.img; // imagen del producto

      const item = carrito.find(p => p.nombre === nombre);

      if (item) {
        item.cantidad += cantidad;
      } else {
        carrito.push({
          nombre: nombre,
          precio: precio,
          cantidad: cantidad,
          img: img
        });
      }

      guardarCarrito();
      actualizarContador();
    });
  });

  // Renderizar carrito con imagen
  function renderCarrito() {

    carritoItems.innerHTML = '';
    let total = 0;

    carrito.forEach((prod, index) => {

      const item = document.createElement('div');
      item.classList.add('carrito-item');
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.gap = "15px";
      item.style.marginBottom = "15px";

      item.innerHTML = `
        <img src="${prod.img || ''}" 
             alt="${prod.nombre}" 
             style="width:70px; height:auto; border:1px solid #ccc; border-radius:6px;">
        
        <div style="flex-grow: 1;">
          <p><strong>${prod.nombre}</strong></p>
          <p>$${prod.precio} x ${prod.cantidad}</p>
          <p>Subtotal: $${prod.precio * prod.cantidad}</p>
        </div>

        <button class="eliminar" 
                data-index="${index}"
                style="background:#ff4d4d; color:white; padding:5px 10px; border:none; border-radius:6px; cursor:pointer;">
          ❌
        </button>
      `;

      carritoItems.appendChild(item);
      total += prod.precio * prod.cantidad;
    });

    totalSpan.textContent = total;

    // Botones de eliminar
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

  // Vaciar carrito
  btnVaciar.addEventListener('click', () => {
    carrito = [];
    guardarCarrito();
    renderCarrito();
    actualizarContador();
  });

  // Guardar carrito en localStorage
  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  // Actualizar contador del carrito
  function actualizarContador() {
    const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    cartCount.textContent = totalItems;
  }

  actualizarContador();

}); // ← ESTA LLAVE CERRABA TODO EL DOMContentLoaded



// ABRIR DETALLE AL CLICKEAR UNA IMAGEN
document.querySelectorAll('.producto img').forEach(img => {
  img.addEventListener('click', () => {

    const contenedor = img.closest('.producto');

    const nombre = contenedor.dataset.nombre;
    const precio = contenedor.dataset.precio;
    const imagen = contenedor.dataset.img;
    const descripcion = contenedor.dataset.descripcion;

    document.getElementById('detalle-img').src = imagen;
    document.getElementById('detalle-nombre').textContent = nombre;
    document.getElementById('detalle-precio').textContent = `$${precio}`;
    document.getElementById('detalle-descripcion').textContent = descripcion;

    document.getElementById('detalle-producto').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// CERRAR DETALLE
document.getElementById('cerrar-detalle').addEventListener('click', () => {
  document.getElementById('detalle-producto').style.display = 'none';
});
