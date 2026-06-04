const CLAVE_CARRITO = 'frontendStoreCarrito';
const PRODUCTOS = {
    vuejs: {
        nombre: 'VueJS',
        precio: 24,
        imagen: 'img/1.jpg'
    },
    angularjs: {
        nombre: 'AngularJS',
        precio: 28,
        imagen: 'img/2.jpg'
    },
    reactjs: {
        nombre: 'ReactJS',
        precio: 30,
        imagen: 'img/3.jpg'
    },
    redux: {
        nombre: 'Redux',
        precio: 26,
        imagen: 'img/4.jpg'
    },
    nodejs: {
        nombre: 'Node.js',
        precio: 32,
        imagen: 'img/5.jpg'
    },
    sass: {
        nombre: 'SASS',
        precio: 23,
        imagen: 'img/6.jpg'
    },
    html5: {
        nombre: 'HTML5',
        precio: 22,
        imagen: 'img/7.jpg'
    },
    github: {
        nombre: 'GitHub',
        precio: 27,
        imagen: 'img/8.jpg'
    },
    bulmacss: {
        nombre: 'BulmaCSS',
        precio: 24,
        imagen: 'img/9.jpg'
    },
    typescript: {
        nombre: 'TypeScript',
        precio: 31,
        imagen: 'img/10.jpg'
    },
    drupal: {
        nombre: 'Drupal',
        precio: 29,
        imagen: 'img/11.jpg'
    },
    javascript: {
        nombre: 'JavaScript',
        precio: 30,
        imagen: 'img/12.jpg'
    },
    graphql: {
        nombre: 'GraphQL',
        precio: 34,
        imagen: 'img/13.jpg'
    },
    wordpress: {
        nombre: 'WordPress',
        precio: 28,
        imagen: 'img/14.jpg'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    cargarDetalleProducto();
    inicializarFormularioProducto();
    mostrarCarrito();
});

function cargarDetalleProducto() {
    const formulario = document.querySelector('#formulario-carrito');

    /** Si no estamos en la página de producto, no hace falta buscar parámetros. */
    if (!formulario) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const idProducto = parametros.get('id') || 'reactjs';
    const producto = PRODUCTOS[idProducto] || PRODUCTOS.reactjs;

    document.querySelector('#producto-nombre').textContent = producto.nombre;
    document.querySelector('#producto-imagen').src = producto.imagen;
    document.querySelector('#producto-imagen').alt = `Camiseta de ${producto.nombre}`;
    document.querySelector('#producto-descripcion').textContent = crearDescripcion(producto.nombre);
    document.querySelector('#producto-precio').textContent = formatearPrecio(producto.precio);
    document.title = `${producto.nombre} - FrontEnd Store`;

    formulario.dataset.nombre = producto.nombre;
    formulario.dataset.precio = producto.precio;
    formulario.dataset.imagen = producto.imagen;
}

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

function crearDescripcion(nombre) {
    return `Camiseta de ${nombre} con diseño moderno, tela cómoda y estampado resistente. Ideal para quienes disfrutan crear interfaces, aprender nuevas tecnologías y vestir su stack favorito.`;
}
