// Funciones para el sidenav
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

// Clase para manejar los productos
class ProductoManager {
    constructor() {
        this.productos = JSON.parse(localStorage.getItem('productos')) || this.obtenerProductosEjemplo();
        this.initEventListeners();
        this.actualizarTablas();
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
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                this.mostrarSeccion(link.dataset.view);
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

// Inicializar el manager de productos
const productoManager = new ProductoManager();