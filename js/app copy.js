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

let categoriaSeleccionada = "MLA1182";
const limiteProductos =50;
async function apiProductosPorCategoria (categoria = categoriaSeleccionada){
    const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?category=${categoria}&limit=${limiteProductos}&offset=0&q=guitarra`);
    const api=await response.json();
    const productosMercadoLibre = api.results;
    console.log(productosMercadoLibre)
    for (const productoMl of productosMercadoLibre){
        productos.push(new Instrumento(
            productoMl.id,
            productoMl.thumbnail_id,
            productoMl.title.slice(0, 25) + "...",
            productoMl.attributes[0].value_name,
            productoMl.price));
    }
    return productos; 
}

apiProductosPorCategoria().then((productos) => cargarCatalogo(productos));

// Clase para cargar los instrumentos al catálogo
// class BaseDeDatos{
//     constructor(){
//         this.instrumentos= [];
//         this.agregarRegistros(1,"guitarraGibson.jpg", "Guitarra", "electrico", "gibson", 50000);
//         this.agregarRegistros(2,"guitarraFender.jpg", "Guitarra", "electrico", "fender", 60000);
//         this.agregarRegistros(3,"bajofender.jpg", "Bajo", "acustico", "fender", 35000);
//         this.agregarRegistros(4,"guitarraYamaha.jpg", "Guitarra", "electrico", "yamaha", 30000);
//         this.agregarRegistros(5,"charangoUniversal.jpg", "Charango", "clasico", "universal", 15000);
//         this.agregarRegistros(6,"guitarraPeavey.jpeg", "Guitarra", "electrico", "peavey", 37000);
//         this.agregarRegistros(7,"bajoephifone.jpg", "Bajo", "electrico", "ephifone", 50000);
//         this.agregarRegistros(8,"guitarraAcustica.jpg", "Guitarra", "acustico", "rosewood", 27000);
//         this.agregarRegistros(9,"ukeleleTagima.jpg", "Ukelele", "acustico", "tagima", 18000);
//         this.agregarRegistros(10,"guitarraAcusticae.jpg", "Guitarra", "acustico", "ephifone", 55000);
//         this.agregarRegistros(11,"guitarraClasica.jpg", "Guitarra", "clasico", "fishman", 45000);
//         this.agregarRegistros(12,"bajoSquier.jpg", "Bajo", "electrico", "squier", 40000);
//     }
//     // Método para agregar productos al catalogo
//     agregarRegistros(id, imagen,nombre,tipo, marca, precio){
//         const instrumento = new Instrumento (id, imagen,nombre,tipo, marca, precio);
//         this.instrumentos.push(instrumento);
//     }
//     // Método para traer los registros
//     traerRegistros(){
//         return this.instrumentos;
//     }
   // Método para buscar por nombre, categoría (tipo de instrumento)o marca
//     registrosBuscarCatalogo(palabra){
//         return this.instrumentos.filter((instrumento) => instrumento.nombre.toLowerCase().includes(palabra) || instrumento.marca.toLowerCase().includes(palabra) || instrumento.tipo.toLowerCase().includes(palabra));
//     }
//     mostrarProductosPorPrecioAscendente() {
//         const productosOrdenados = this.instrumentos.slice().sort((a, b) => a.precio - b.precio);
//         cargarCatalogo(productosOrdenados, { nombres: [], categorias: [], marcas: [] });
//     }
//     mostrarProductosPorPrecioDescendente() {
//         const productosOrdenados = this.instrumentos.slice().sort((a, b) => b.precio - a.precio);
//         cargarCatalogo(productosOrdenados, { nombres: [], categorias: [], marcas: [] });
//     }
// }

function registroPorId(id){
    return productos.find((instrumento) => instrumento.id === id);
}

// Método para traer los registros
function traerRegistros(){
    return this.instrumentos;
}
//Método para buscar por nombre, categoría (tipo de instrumento)o marca
function registrosBuscarCatalogo(palabra){
    return this.instrumentos.filter((instrumento) => instrumento.nombre.toLowerCase().includes(palabra) || instrumento.marca.toLowerCase().includes(palabra));
}
function mostrarProductosPorPrecioAscendente() {
    const productosOrdenados = this.instrumentos.slice().sort((a, b) => a.precio - b.precio);
    cargarCatalogo(productosOrdenados, { nombres: [], categorias: [], marcas: [] });
}
function mostrarProductosPorPrecioDescendente() {
    const productosOrdenados = this.instrumentos.slice().sort((a, b) => b.precio - a.precio);
    cargarCatalogo(productosOrdenados, { nombres: [], categorias: [], marcas: [] });
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

function cargarCatalogo(instrumentos) {
    divCatalogo.innerHTML = '';
    divCatalogo.className = 'row';
    for (const producto of instrumentos) {
        
        divCatalogo.innerHTML += `
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
        });
        }
        }
    }

// mostrar el catalogo de la base de datos
// function cargarCatalogo(instrumentos, filtros) {
//     divCatalogo.innerHTML = '';
//     divCatalogo.className = 'row';
//     for (const producto of instrumentos) {
//         if (
//             (filtros.nombres.length === 0 || filtros.nombres.includes(producto.nombre)) &&
//             (filtros.categorias.length === 0 || filtros.categorias.includes(producto.tipo)) &&
//             (filtros.marcas.length === 0 || filtros.marcas.includes(producto.marca))
//         ) {
        // divCatalogo.innerHTML += `
        //     <div class="card mb-3" style="max-width: 400px;">
        //         <div class="row g-0">
        //             <div class="col-md-5">
        //             <img src="img/${producto.imagen}" class=" rounded-start imagenCatalogo " alt="${producto.nombre}">
        //             </div>
        //             <div class="col-md-7">
        //             <div class="card-body">
        //                 <h5 class="card-title"> <b>${producto.nombre} ${producto.marca} </b></h5>
        //                 <p class="card-text"> <b>Precio: $${producto.precio} </b></p>
        //                 <a href="#" class="btn btn-success botonAgregar" data-id="${producto.id}">Agregar al Carrito</a>
        //             </div>
        //         </div>
        //     </div>
        // `;
//         // botones agregar al carrito
//         const botonesagregar = document.querySelectorAll(".botonAgregar");
//         for (const botones of botonesagregar) {
//             botones.addEventListener('click', (event) => {
//                 event.preventDefault();
//                 const id = Number(botones.dataset.id);
//                 const instrumento = bd.registroPorId(id);
//                 carrito.agregar(instrumento);
//         });
//         }
//         }
//     }
// }

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

// objeto carrito
const carrito = new Carrito(); 

ordenar.addEventListener('change', (event) => {
    event.preventDefault();
    const valorSeleccionado = ordenar.value;
    const filtros = {
        nombres: obtenerFiltrosSeleccionados(divFiltrosNombres),
        categorias: obtenerFiltrosSeleccionados(divFiltrosCategoria),
        marcas: obtenerFiltrosSeleccionados(divFiltrosMarca)
    };
    if (valorSeleccionado === 'precioMenor') {
        mostrarProductosPorPrecioAscendente(filtros);
    } else if (valorSeleccionado === 'precioMayor') {
        mostrarProductosPorPrecioDescendente(filtros);
    } else if (valorSeleccionado === 'defecto') {
        cargarCatalogo(traerRegistros(), filtros);
    }
})

// Eliminar todos los productos del carrito
vaciarCarrito.addEventListener('click', () => {
    carrito.vaciarCarrito();
});
// llamar a la funcion cargar catálogo
cargarCatalogo(traerRegistros(), { nombres: [], categorias: [], marcas: [] });
filtrosNombres(traerRegistros());
filtrosCategoria(traerRegistros());
filtrosMarca(traerRegistros());
// eventos del buscador
formBuscar.addEventListener('submit',(event)=>{
    event.preventDefault();
    const palabra= inputBuscar.value;
    cargarCatalogo(registrosBuscarCatalogo(palabra.toLowerCase()),{ nombres: [], categorias: [], marcas: []})
})
inputBuscar.addEventListener('keyup',(event)=>{
    event.preventDefault();
    const palabra= inputBuscar.value;
    cargarCatalogo(registrosBuscarCatalogo(palabra.toLowerCase()), { nombres: [], categorias: [], marcas: []})
})
function filtrosNombres(instrumentos) {
    // Array para almacenar los nombres de productos agregados
    const nombresAgregados = [];
    for (producto of instrumentos) {
        if (!nombresAgregados.includes(producto.nombre)) {
        divFiltrosNombres.innerHTML +=  
        `<div>
            <input type="checkbox" name="checkN" id="checkN">
            <label for="checkN">${producto.nombre}</label>
        </div>`;
        // Agregar el nombre del producto al array de nombres agregados
        nombresAgregados.push(producto.nombre);
        }
    }
}
function filtrosMarca(instrumentos) {
    // Array para almacenar los nombres de productos agregados
    const marcasAgregadas = [];
    for (producto of instrumentos) {
        if (!marcasAgregadas.includes(producto.marca)) {
        divFiltrosMarca.innerHTML +=  
        `<div>
            <input type="checkbox" name="checkM" id="checkM">
            <label for="checkM">${producto.marca}</label>
        </div>`;
        // Agregar el nombre del producto al array de nombres agregados
        marcasAgregadas.push(producto.marca);
        }
    }
}
//Eventos del boton carrito y del boton filtrar
botonCarrito.addEventListener("click", () => {
    document.querySelector(".carrito-section").classList.toggle("aparecer");
});
botonFiltros.addEventListener("click", () => {
    document.querySelector(".seccionFiltros").classList.toggle("desplegarFiltros");
});
// Llamar a la función filtros con la lista de instrumentos



