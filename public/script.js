// Array de productos de ejemplo (puedes reemplazarlo por una llamada a tu API)
const productos = [
    { nombre: "Adorno Navidad", categoria: "navidad", descripcion: "Adorno navideño de alta calidad", precio: "$10", imagen: "https://via.placeholder.com/200" },
    { nombre: "Adorno Día del Cariño", categoria: "dia_cariño", descripcion: "Adorno para el Día del Cariño", precio: "$12", imagen: "https://via.placeholder.com/200" },
    { nombre: "Adorno para Baños", categoria: "baños", descripcion: "Adorno decorativo para baños", precio: "$8", imagen: "https://via.placeholder.com/200" },
    { nombre: "Adorno para Casas", categoria: "casas", descripcion: "Adorno decorativo para el hogar", precio: "$15", imagen: "https://via.placeholder.com/200" },
    { nombre: "Equipo Médico", categoria: "equipo_medico", descripcion: "Equipo para asistencia médica", precio: "$150", imagen: "https://via.placeholder.com/200" },
    { nombre: "Producto de Limpieza", categoria: "productos_limpieza", descripcion: "Producto de limpieza efectivo", precio: "$5", imagen: "https://via.placeholder.com/200" }
];

// Función para obtener productos filtrados
function obtenerProductos() {
    const nombreInput = document.getElementById("nombreInput").value.toLowerCase();
    const categoriaSelect = document.getElementById("categoriaSelect").value;
    const productList = document.getElementById("product-list");

    // Filtramos los productos
    const productosFiltrados = productos.filter(producto => {
        const nombreCoincide = producto.nombre.toLowerCase().includes(nombreInput);
        const categoriaCoincide = categoriaSelect === "todos" || producto.categoria === categoriaSelect;
        return nombreCoincide && categoriaCoincide;
    });

    // Limpiamos la lista de productos
    productList.innerHTML = "";

    // Si hay productos, los mostramos en la tabla
    if (productosFiltrados.length > 0) {
        productosFiltrados.forEach(producto => {
            const divProducto = document.createElement("div");
            divProducto.classList.add("col-md-4");
            divProducto.classList.add("mb-4");
            divProducto.innerHTML = `
                <div class="product">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p><strong>Precio:</strong> ${producto.precio}</p>
                </div>
            `;
            productList.appendChild(divProducto);
        });
    } else {
        productList.innerHTML = "<p>No se encontraron productos.</p>";
    }
}

// Función para manejar el envío del formulario de contacto
document.getElementById("contacto-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const nombreCliente = document.getElementById("nombreCliente").value;
    const apellidoCliente = document.getElementById("apellidoCliente").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;
    const ubicacion = document.getElementById("ubicacion").value;

    // Aquí podrías hacer un POST a tu servidor o simplemente mostrar los datos en consola
    console.log("Formulario enviado con los siguientes datos:");
    console.log(`Nombre: ${nombreCliente} ${apellidoCliente}`);
    console.log(`Teléfono: ${telefono}`);
    console.log(`Dirección: ${direccion}`);
    console.log(`Ubicación: ${ubicacion}`);

    // Limpiar el formulario
    document.getElementById("contacto-form").reset();
    alert("¡Formulario enviado exitosamente!");
});

// Función para agregar productos nuevos
function agregarProducto(nombre, categoria, descripcion, precio, imagen) {
    const nuevoProducto = {
        nombre: nombre,
        categoria: categoria,
        descripcion: descripcion,
        precio: precio,
        imagen: imagen
    };

    // Añadir el nuevo producto al array
    productos.push(nuevoProducto);
    console.log("Producto agregado:", nuevoProducto);
    obtenerProductos(); // Refrescar la lista de productos
}

// Función para eliminar un producto (por nombre)
function eliminarProducto(nombre) {
    const index = productos.findIndex(producto => producto.nombre === nombre);
    if (index !== -1) {
        productos.splice(index, 1);
        console.log("Producto eliminado:", nombre);
        obtenerProductos(); // Refrescar la lista de productos
    } else {
        console.log("Producto no encontrado:", nombre);
    }
}

// Función para editar un producto (por nombre)
function editarProducto(nombre, nuevoNombre, nuevaCategoria, nuevaDescripcion, nuevoPrecio, nuevaImagen) {
    const producto = productos.find(producto => producto.nombre === nombre);
    if (producto) {
        producto.nombre = nuevoNombre;
        producto.categoria = nuevaCategoria;
        producto.descripcion = nuevaDescripcion;
        producto.precio = nuevoPrecio;
        producto.imagen = nuevaImagen;
        console.log("Producto editado:", producto);
        obtenerProductos(); // Refrescar la lista de productos
    } else {
        console.log("Producto no encontrado:", nombre);
    }
}

// Evento para mostrar los productos cuando se cargue la página
window.addEventListener("DOMContentLoaded", obtenerProductos);


