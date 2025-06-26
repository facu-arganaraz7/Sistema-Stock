// Funciones para el sidenav
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

// Exponer funciones al ámbito global para que funcionen con onclick en HTML
window.openNav = openNav;
window.closeNav = closeNav;

// Clase para manejar los productos
class ProductoManager {
    constructor() {
        this.productos = JSON.parse(localStorage.getItem('productos')) || this.obtenerProductosEjemplo();
        this.initEventListeners();
        this.actualizarTablas();
        this.ventaManager = new VentaManager(this);
    }

    obtenerProductosEjemplo() {
        return [
            {
                id: 1,
                categoria: 'Bebidas',
                nombre: 'Coca-Cola',
                detalle: 'Gaseosa 500ml - Botella de plástico',
                precio: 850.00,
                stock: 24
            },
            {
                id: 2,
                categoria: 'Bebidas',
                nombre: 'Agua Mineral',
                detalle: 'Agua sin gas 1L - Botella de plástico',
                precio: 500.00,
                stock: 3
            },
            {
                id: 3,
                categoria: 'Golosinas',
                nombre: 'Alfajor Milka',
                detalle: 'Alfajor triple de chocolate con mousse',
                precio: 750.00,
                stock: 15
            },
            {
                id: 4,
                categoria: 'Golosinas',
                nombre: 'Caramelos Sugus',
                detalle: 'Bolsa de caramelos masticables surtidos 150g',
                precio: 600.00,
                stock: 4
            },
            {
                id: 5,
                categoria: 'Snacks',
                nombre: 'Papas Lays',
                detalle: 'Papas fritas clásicas 95g',
                precio: 950.00,
                stock: 8
            },
            {
                id: 6,
                categoria: 'Snacks',
                nombre: 'Maní con chocolate',
                detalle: 'Maní japonés cubierto con chocolate 100g',
                precio: 700.00,
                stock: 2
            },
            {
                id: 7,
                categoria: 'Cigarrillos',
                nombre: 'Marlboro Box 20',
                detalle: 'Cigarrillos Marlboro Box 20 unidades',
                precio: 1200.00,
                stock: 12
            },
            {
                id: 8,
                categoria: 'Cigarrillos',
                nombre: 'Lucky Strike',
                detalle: 'Cigarrillos Lucky Strike mentolados 20 unidades',
                precio: 1100.00,
                stock: 4
            }
        ];
    }

    initEventListeners() {
        // Navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.mostrarSeccion(btn.dataset.view);
                closeNav();
            });
        });

        // Formulario para agregar productos
        document.getElementById('productoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.agregarProducto();
        });

        // Formulario para editar productos
        document.getElementById('editarForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarEdicion();
        });

        // Cerrar modal
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('modalEditar').style.display = 'none';
        });
    }

    mostrarSeccion(view) {
        document.getElementById('agregarSection').style.display = view === 'agregar' ? 'block' : 'none';
        document.getElementById('stockSection').style.display = view === 'stock' ? 'block' : 'none';
        document.getElementById('ventasSection').style.display = view === 'ventas' ? 'block' : 'none';
    }

    agregarProducto() {
        const producto = {
            id: Date.now(),
            categoria: document.getElementById('categoria').value,
            nombre: document.getElementById('nombre').value,
            detalle: document.getElementById('detalle').value,
            precio: parseFloat(document.getElementById('precio').value),
            stock: parseInt(document.getElementById('stock').value)
        };

        this.productos.push(producto);
        this.guardarEnStorage();
        this.actualizarTablas();
        document.getElementById('productoForm').reset();
    }

    eliminarProducto(id) {
        if (confirm('¿Está seguro de que desea eliminar este producto?')) {
            this.productos = this.productos.filter(p => p.id !== id);
            this.guardarEnStorage();
            this.actualizarTablas();
        }
    }

    abrirEditar(id) {
        const producto = this.productos.find(p => p.id === id);
        if (producto) {
            document.getElementById('editId').value = producto.id;
            document.getElementById('editCategoria').value = producto.categoria;
            document.getElementById('editNombre').value = producto.nombre;
            document.getElementById('editDetalle').value = producto.detalle;
            document.getElementById('editPrecio').value = producto.precio;
            document.getElementById('editStock').value = producto.stock;
            document.getElementById('modalEditar').style.display = 'block';
        }
    }

    guardarEdicion() {
        const id = parseInt(document.getElementById('editId').value);
        const index = this.productos.findIndex(p => p.id === id);

        if (index !== -1) {
            this.productos[index] = {
                id: id,
                categoria: document.getElementById('editCategoria').value,
                nombre: document.getElementById('editNombre').value,
                detalle: document.getElementById('editDetalle').value,
                precio: parseFloat(document.getElementById('editPrecio').value),
                stock: parseInt(document.getElementById('editStock').value)
            };

            this.guardarEnStorage();
            this.actualizarTablas();
            document.getElementById('modalEditar').style.display = 'none';
        }
    }

    actualizarTablas() {
        const categorias = ['Bebidas', 'Golosinas', 'Snacks', 'Cigarrillos'];
        
        categorias.forEach(categoria => {
            const productosFiltrados = this.productos.filter(p => p.categoria === categoria);
            const tabla = `
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Detalle</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productosFiltrados.map(p => `
                            <tr>
                                <td>${p.nombre}</td>
                                <td>${p.detalle}</td>
                                <td>$${p.precio.toFixed(2)}</td>
                                <td class="${p.stock < 5 ? 'stock-bajo' : ''}">${p.stock}</td>
                                <td>
                                    <button class="btn-editar" onclick="productoManager.abrirEditar(${p.id})">Editar</button>
                                    <button class="btn-eliminar" onclick="productoManager.eliminarProducto(${p.id})">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            document.getElementById(`tabla${categoria}`).innerHTML = 
                productosFiltrados.length ? tabla : '<p>No hay productos en esta categoría</p>';
        });
    }

    guardarEnStorage() {
        localStorage.setItem('productos', JSON.stringify(this.productos));
    }
}

class VentaManager {
    constructor(productoManager) {
        this.productoManager = productoManager;
        this.ventaActual = [];
        this.initEventListeners();
    }

    initEventListeners() {
        const inputCodigo = document.getElementById('codigoProducto');
        inputCodigo.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.procesarCodigo(inputCodigo.value);
                inputCodigo.value = '';
            }
        });

        document.getElementById('confirmarVenta').addEventListener('click', () => {
            this.confirmarVenta();
        });
    }

    procesarCodigo(codigo) {
        const producto = this.productoManager.productos.find(p => p.id.toString() === codigo);
        if (producto) {
            if (producto.stock > 0) {
                this.agregarProductoAVenta(producto);
            } else {
                alert('Producto sin stock disponible');
            }
        } else {
            alert('Producto no encontrado');
        }
    }

    agregarProductoAVenta(producto) {
        const itemExistente = this.ventaActual.find(item => item.id === producto.id);
        if (itemExistente) {
            if (itemExistente.cantidad < producto.stock) {
                itemExistente.cantidad++;
                itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
            } else {
                alert('Stock insuficiente');
                return;
            }
        } else {
            this.ventaActual.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1,
                subtotal: producto.precio
            });
        }
        this.actualizarTablaVenta();
    }

    actualizarCantidad(id, nuevaCantidad) {
        const item = this.ventaActual.find(item => item.id === id);
        const producto = this.productoManager.productos.find(p => p.id === id);
        
        if (nuevaCantidad > producto.stock) {
            alert('Stock insuficiente');
            return;
        }

        if (nuevaCantidad <= 0) {
            this.eliminarProducto(id);
            return;
        }

        item.cantidad = nuevaCantidad;
        item.subtotal = item.cantidad * item.precio;
        this.actualizarTablaVenta();
    }

    eliminarProducto(id) {
        this.ventaActual = this.ventaActual.filter(item => item.id !== id);
        this.actualizarTablaVenta();
    }

    actualizarTablaVenta() {
        const tbody = document.querySelector('#tablaVenta tbody');
        tbody.innerHTML = '';
        let total = 0;

        this.ventaActual.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.nombre}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>
                    <input type="number" class="cantidad-input" value="${item.cantidad}"
                           min="1" onchange="ventaManager.actualizarCantidad(${item.id}, parseInt(this.value))">
                </td>
                <td>$${item.subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn-eliminar-producto" onclick="ventaManager.eliminarProducto(${item.id})">
                        Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
            total += item.subtotal;
        });

        document.getElementById('totalVenta').textContent = total.toFixed(2);
    }

    confirmarVenta() {
        if (this.ventaActual.length === 0) {
            alert('No hay productos en la venta actual');
            return;
        }

        this.ventaActual.forEach(item => {
            const producto = this.productoManager.productos.find(p => p.id === item.id);
            producto.stock -= item.cantidad;
        });

        this.productoManager.guardarEnStorage();
        this.productoManager.actualizarTablas();
        this.ventaActual = [];
        this.actualizarTablaVenta();

        alert('Venta realizada con éxito');
    }
}

// Inicialización
const productoManager = new ProductoManager();
const ventaManager = productoManager.ventaManager;
