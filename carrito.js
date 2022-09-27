let stockProductos = [
    {id: 1, nombre: "Cinammon Rolls", cantidad: 1, precio: 340,},
    {id: 2, nombre: "Croissant", cantidad: 1, precio: 350,},
    {id: 3, nombre: "Pan au chocolat", cantidad: 1, precio: 380,},
    {id: 4, nombre: "Banana Bread", cantidad: 1, precio: 250,},
    {id: 5, nombre: "Budín de Limón", cantidad: 1, precio: 245,},
    {id: 6, nombre: "Budín Carrot", cantidad: 1, precio: 245,},
]
const contenedorProductos = document.getElementById ('contenedor-productos')

stockProductos.forEach((producto) => {
    const div = document.createElement('div')
    div.classList.add ('producto')
    div.innerHTML = `
    <img src=${producto.img} alt="">
    <h3> ${producto.nombre}</h3>
    <p class="precioProducto"> Precio: $ ${producto.precio}</p>
    <button id="agregar ${producto.id}" class="btn-agregar"> Agregar al carrito <i class="fas fa-shopping-cart"></i></button>
    `

    contenedorProductos.appendChild(div)
});