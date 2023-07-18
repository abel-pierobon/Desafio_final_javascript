
// clase molde para instrumentos
class Instrumento {
    constructor(id, imagen = false, nombre, marca, precio) {
        this.id= id;
        this.imagen = imagen;
        this.nombre = nombre;
        this.marca = marca;
        this.precio = parseInt(precio);
    }
}

let productos=[];

const categoriaSeleccionada = "MLA4275";
const limiteProductos =50;
async function apiProductosPorCategoria(categoria = categoriaSeleccionada) {
        const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?category=${categoria}&limit=${limiteProductos}&offset=0&q=guitarra`);
        const api = await response.json();
        const productosMercadoLibre = api.results;
        console.log(productosMercadoLibre);
        productos = [];
        for (const productoMl of productosMercadoLibre) {
            productos.push(new Instrumento(
                productoMl.id,
                productoMl.thumbnail_id,
                productoMl.title,
                productoMl.attributes[0].value_name,
                productoMl.price
            ));
        }
        // Resuelve la promesa con los datos
        return productos;
}
// Llama a apiProductosPorCategoria y luego ejecuta filtrosMarca()
apiProductosPorCategoria().then((productosapi) => {
    cargarCatalogo(productosapi);
    filtrosMarca(productosapi);
});

function registroPorId(id){
    return productos.find((instrumento) => instrumento.id === id);
}

// // Funcion para traer los registros
function traerRegistros(){
    return this.instrumentos;
}

// clase Carrito para agregar productos al carrito
class Carrito{
    constructor(){
        const carritoStorage = JSON.parse(localStorage.getItem('carrito'))
        this.carrito= carritoStorage || [];
        this.total = 0;
        this.totalProductos = 0;
        this.listar();
    }
    // Método para saber si un instrumento está en el carrito
    estaEnCarrito({id}){
        return this.carrito.find((instrumento) => instrumento.id===id)
    }
    //Agregar al carrito, si está en el carrito lo suma sino lo agrega
    agregar(instrumento){
        let productoenCarrito = this.estaEnCarrito(instrumento);
        if(productoenCarrito){
            // sumar la cantidad
            productoenCarrito.cantidad++;
        }else{
            // agregar al carrito
            this.carrito.push({ ...instrumento, cantidad: 1});
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        }
    this.listar();
    }
    //Método para quitar directamente productos del carrito sin importar la cantidad de productos que haya en el mismo
    quitar(id){
        const indice = this.carrito.findIndex((producto) => producto.id===id);
        this.carrito.splice(indice,1);
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        this.listar();
    }
    // restar un producto del carrito, si la cantidad es mayor que 1 resta , si es 1 lo elimina
    restar(id){
        const indice = this.carrito.findIndex((producto) => producto.id===id);
        if (this.carrito[indice].cantidad > 1) {
            this.carrito[indice].cantidad--;
        }else{
        this.carrito.splice(indice,1)
        }
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        this.listar();
    }
    //Método para sumar catidades del producto que está en el carrito
    sumar(id){
        const indice = this.carrito.findIndex((producto) => producto.id===id);
        this.carrito[indice].cantidad++;
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        this.listar();
    }
    vaciarCarrito() {
        this.carrito = []; 
        localStorage.removeItem('carrito'); 
        this.listar(); 
    }
    comprarCarrito() {
        this.carrito = []; 
        localStorage.removeItem('carrito'); 
        this.listar();
    }
    
    //listar los productos del carrito
    listar(){
        divCarrito.innerHTML = '';
        this.total = 0;
        this.totalProductos = 0;
        for (const producto of this.carrito){
            divCarrito.innerHTML += `
            <h4>${producto.nombre} ${producto.marca} </h4>
            <b> Sub total: $ ${producto.precio * producto.cantidad} </b>
            <p> Cantidad: ${producto.cantidad}</p> 
            <div class="botonesCarrito">
                <img src="img/menos2.png" class="botonRestar" data-id="${producto.id}" alt="">
                <img src="img/eliminar.png" class="botonQuitar" data-id="${producto.id}" alt="">
                <img src="img/mas2.png" class="botonSumar" data-id="${producto.id}" alt="">
            </div>
            `
            this.total += producto.precio * producto.cantidad;
            this.totalProductos += producto.cantidad;
        }
         // Oculto el botón Comprar si no hay productos
        if (this.totalProductos > 0) {
            botonComprar.classList.remove("oculto"); // Muestro el botón
        } else {
            botonComprar.classList.add("oculto"); // Oculto el botón
        }
        // botones de quitar
        const botonesQuitar= document.querySelectorAll('.botonQuitar');
        for (const boton of botonesQuitar){
            boton.addEventListener('click',() => {
                const id = (boton.dataset.id);
                this.quitar(id);
            }
        )}
        const restar= document.querySelectorAll('.botonRestar');
        for(const bRestar of restar){
            bRestar.addEventListener('click',() => {
                const id = (bRestar.dataset.id);
                this.restar(id)
            }
        )}
        const sumar= document.querySelectorAll('.botonSumar');
        for(const bSumar of sumar){
            bSumar.addEventListener('click',() => {
            const id = (bSumar.dataset.id);
            this.sumar(id)
            }
            )};
        // actualizar valores span
        spanCantidadProductos.innerHTML= this.totalProductos;
        spanTotalCarrito.innerHTML= this.total;
    }
}

//  

function cargarCatalogo(productos) {
    divCatalogo.innerHTML = '';
    divCatalogo.className = 'row';
    for (const producto of productos) {
        divCatalogo.innerHTML +=  `
            <div class="card mb-3" style="max-width: 700px;">
                <div class="row g-0">
                    <div class="col-md-5">
                    <img class="imagenesCarrito" src="https://http2.mlstatic.com/D_604790-${producto.imagen}-V.webp" />
                    </div>
                    <div class="col-md-7">
                    <div class="card-body">
                    <h4>${producto.nombre} </h4>
                    <p>Marca: ${producto.marca}</p>
                    <p><b>Precio: $ ${producto.precio}</b></p>
                    <a href="#" class="btn btn-success botonAgregar" data-id="${producto.id}">Agregar al Carrito</a>
                    </div>
                    </div>
                </div>
            </div>
        `;
        // botones agregar al carrito
        const botonesagregar = document.querySelectorAll(".botonAgregar");
        for (const botones of botonesagregar) {
            botones.addEventListener('click', (event) => {
                event.preventDefault();
                const id = (botones.dataset.id);
                const instrumento = registroPorId(id);
                carrito.agregar(instrumento);
                Swal.fire({
                    title: "¡Producto agregado al carrito!",
                    timer:1000,     
                    icon: "success",
                });
        });

        }
        }
    }

// elementos 
const divCatalogo = document.querySelector("#divCatalogo"); 
const divCarrito = document.querySelector('#carritoMostrar');
const spanCantidadProductos = document.querySelector('#cantidadProductos');
const spanTotalCarrito = document.querySelector('#totalCarrito');
const formBuscar = document.querySelector('#formBuscar');
const inputBuscar = document.querySelector('#inputBuscar');
const checkbox = document.querySelector('#checkbox');
const divFiltrosNombres = document.querySelector('#filtrosNombres');
const divFiltrosCategoria = document.querySelector('#filtrosCategoria');
const divFiltrosMarca = document.querySelector('#filtrosMarca');
const botonFiltros = document.querySelector("#filtros");
const botonCarrito = document.querySelector("#carrito");
const vaciarCarrito = document.querySelector('#vaciar');
const ordenar = document.querySelector('#seleccionar');
const pagar = document.getElementById('botonComprar');


// objeto carrito
const carrito = new Carrito(); 

// Eliminar todos los productos del carrito
vaciarCarrito.addEventListener('click', () => {
    carrito.vaciarCarrito();
});
// reiniciar carrito al comprar
pagar.addEventListener('click', () => {
    carrito.comprarCarrito();
    Swal.fire({
        title: "¡Su pedido está en camino !",
        text: "Su compra ha sido realizada con éxito",
        icon: "success",
        confirmButtonText: "Seguir Comprando",
    });
});
// eventos del buscador
let resultados=[];

formBuscar.addEventListener('submit',(event)=>{
    event.preventDefault();
    const palabra= inputBuscar.value;
    resultados = apiProductosBusqueda(palabra.toLowerCase())
    cargarCatalogo(resultados);
})

inputBuscar.addEventListener('keyup',(event)=>{
    event.preventDefault();
    const palabra= inputBuscar.value;
    resultados = apiProductosBusqueda(palabra.toLowerCase())
    cargarCatalogo(resultados);
})
cargarCatalogo(resultados);
botonFiltros.addEventListener("click", () => {
    document.querySelector(".seccionFiltros").classList.toggle("desplegarFiltros");
});


function apiProductosBusqueda(palabra) {
    // Filtra los productos por nombre o descripcion, teniendo en cuenta la palabraBusqueda
    return productos.filter((instrumento) =>
        instrumento.nombre && instrumento.nombre.toLowerCase().includes(palabra)
    );
}

function filtrosMarca(productos) {
    // Array para almacenar los nombres de productos agregados
    const marcasAgregadas = [];
    for (const instrumento of productos) {
        if (!marcasAgregadas.includes(instrumento.marca)) {
        divFiltrosMarca.innerHTML +=  
        `<div>
            <input type="checkbox" name="check" id="check">
            <label for="check">${instrumento.marca}</label>
        </div>`;
        // Agregar el nombre del producto al array de nombres agregados
        marcasAgregadas.push(instrumento.marca);
        }
    }
}

divFiltrosMarca.addEventListener('change', filtrarCatalogo);

function filtrarCatalogo() {
    const checkboxes = divFiltrosMarca.querySelectorAll('input[type="checkbox"]');
    const marcasFiltradas = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.nextElementSibling.textContent);

    if (marcasFiltradas.length === 0) {
        cargarCatalogo(productos); // Mostrar todos los productos si no hay filtros seleccionados
    } else {
        const productosFiltrados = productos.filter(
            (producto) => marcasFiltradas.includes(producto.marca)
        );
        cargarCatalogo(productosFiltrados); // Mostrar los productos filtrados por marca
    }
}


