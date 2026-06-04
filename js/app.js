const CLAVE_CARRITO = 'frontendStoreCarrito';

document.addEventListener('DOMContentLoaded', () => {
    inicializarFormularioProducto();
    mostrarCarrito();
});

function inicializarFormularioProducto() {
    const formulario = document.querySelector('#formulario-carrito');

    /** Si la página actual no tiene formulario de producto, no se ejecuta esta lógica. */
    if (!formulario) {
        return;
    }

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const talla = formulario.talla.value;
        const cantidad = Number(formulario.cantidad.value);

        if (!talla || cantidad < 1) {
            formulario.reportValidity();
            return;
        }

        const producto = {
            nombre: formulario.dataset.nombre,
            precio: Number(formulario.dataset.precio),
            imagen: formulario.dataset.imagen,
            talla,
            cantidad
        };

        /** Se guarda un solo producto para mantener el flujo simple del proyecto. */
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(producto));
        window.location.href = 'carrito.html';
    });
}

function mostrarCarrito() {
    const carritoProducto = document.querySelector('#carrito-producto');
    const carritoVacio = document.querySelector('#carrito-vacio');

    /** Si la página actual no es el carrito, no se intenta pintar información. */
    if (!carritoProducto || !carritoVacio) {
        return;
    }

    const producto = obtenerProductoGuardado();

    if (!producto) {
        carritoProducto.hidden = true;
        carritoVacio.hidden = false;
        return;
    }

    pintarProducto(producto);
    configurarBotonVaciar();
}

function obtenerProductoGuardado() {
    const productoGuardado = localStorage.getItem(CLAVE_CARRITO);

    if (!productoGuardado) {
        return null;
    }

    try {
        return JSON.parse(productoGuardado);
    } catch {
        localStorage.removeItem(CLAVE_CARRITO);
        return null;
    }
}

function pintarProducto(producto) {
    const total = producto.precio * producto.cantidad;

    document.querySelector('#carrito-vacio').hidden = true;
    document.querySelector('#carrito-producto').hidden = false;
    document.querySelector('#carrito-imagen').src = producto.imagen;
    document.querySelector('#carrito-imagen').alt = `Camiseta de ${producto.nombre}`;
    document.querySelector('#carrito-nombre').textContent = producto.nombre;
    document.querySelector('#carrito-talla').textContent = producto.talla;
    document.querySelector('#carrito-cantidad').textContent = producto.cantidad;
    document.querySelector('#carrito-precio').textContent = formatearPrecio(producto.precio);
    document.querySelector('#carrito-total').textContent = formatearPrecio(total);
}

function configurarBotonVaciar() {
    const botonVaciar = document.querySelector('#vaciar-carrito');

    botonVaciar.addEventListener('click', () => {
        localStorage.removeItem(CLAVE_CARRITO);
        limpiarProductoPintado();
        document.querySelector('#carrito-producto').hidden = true;
        document.querySelector('#carrito-vacio').hidden = false;
    });
}

function limpiarProductoPintado() {
    /** Limpia los textos para que no queden datos antiguos si el usuario vacía el carrito. */
    document.querySelector('#carrito-nombre').textContent = '';
    document.querySelector('#carrito-talla').textContent = '';
    document.querySelector('#carrito-cantidad').textContent = '';
    document.querySelector('#carrito-precio').textContent = '';
    document.querySelector('#carrito-total').textContent = '';
}

function formatearPrecio(valor) {
    return `$${valor}`;
}
