import "./wc/mi-item.js";
import "./wc/btn-add.js";
import "./wc/btn-whatsapp.js";
import "./wc/calc-total.js";
import "./wc/btn-add-storage.js";
import "./wc/btn-carrito.js";
//import "./wc/btn-carrito-store.js";
import "./wc/card-product.js";
import "./wc/card-carrito.js";
import "./wc/multi-precios.js";

const url = "./db_products.json";
const bd_local = "storage";
const telf = "923909419";

const query = e => document.querySelector(e);

async function callProduct(){
   try {
      const response = await fetch(url);
      const data = await response.json();
      return data.productos;
   } catch(error){
      console.log("error: ",error.message)
   }
}

const list = query("#list");
const view = query("#view");
const listSaveItem = query("#save");
const carrito = query("btn-carrito");

view.classList.toggle("ocultar")
listSaveItem.classList.toggle("ocultar")

function render(){
   let dbstorage = JSON.parse(localStorage.getItem(bd_local)) || []
   let cantidadStoragefinal = dbstorage.reduce((total, i) => total + i.cantidad, 0);
   query("btn-carrito").setAttribute("cantidad",cantidadStoragefinal);
   /* actualiza el total a pagar */
   document.querySelector("calc-total").setAttribute("db_name","storage")
   /* actualiza el boton con la cantidad a pagar */
   document.querySelector("btn-whatsapp").setAttribute("db_name","storage")
}

/* actualizar las cantidades del storage */
document.body.addEventListener("updateCantidadStorage", e => {
   render();
})

document.body.addEventListener("verProducto", e => {
   view.classList.toggle("ocultar")
   document.body.style.overflow = "hidden"

   callProduct().then(productos => {
      const product = productos.filter(product => product.id == e.detail.id)
      view.innerHTML = product.map(card => {
	 return `<card-product
		 nombre="${card.nombre}"
		 storage="${bd_local}"
		  precio="${card.precio}"
		  categoria="${card.categoria}"
		  descripcion="${card.descripcion}"
		  imagen="${card.imagen}"
		  cantidad=0
		  di="${card.id}"
		  >
		  <i slot="btn-cerrar" class="fa-solid fa-xmark"></i>
	    </card-product>`
      });
   });
});

document.body.addEventListener("btnCerrarCardProduct", e => {
   view.classList.toggle(e.detail.clase)
   document.body.style.overflow = "visible"
});

document.body.addEventListener("btnMostrarSaveItem", e => {
   listSaveItem.classList.toggle("ocultar")
   list.classList.toggle("ocultar")
   renderSaveItemsTEMPORAL()
});

query("#cerarVentana").addEventListener("click", e => {
   document.querySelector("#canvaSaveItems").innerHTML="<p>No hay productos</p>"
   let dbstorage = JSON.parse(localStorage.getItem(bd_local)) || []
   dbstorage = []
   localStorage.setItem(bd_local,JSON.stringify(dbstorage));
   render();
})


/* actualizar carrito al cargar la pagina*/
document.addEventListener("DOMContentLoaded", async e => {
   try {
      const response = await fetch(url);
      const data = await response.json();
      list.innerHTML = data.productos.map(producto =>{
	 return `<mi-item
      precio="${producto.precio}"
       imagen="${producto.imagen}"
       storage="${bd_local}"
       name="${producto.nombre}"
       di=${producto.id}
       cantidad=0
	></mi-item>`
      }).join("");

   } catch(error){
      console.log("error: ",error.message)
   }
   let dbstorage = JSON.parse(localStorage.getItem(bd_local)) || []
   let cantidadStoragefinal = dbstorage.reduce((total, i) => total + i.cantidad, 0);
   query("btn-carrito").setAttribute("cantidad",cantidadStoragefinal);
})

function renderSaveItemsTEMPORAL(){
   let dbstorage = JSON.parse(localStorage.getItem(bd_local)) || []
   let result = [];
   callProduct().then(productos => {
      for(let i = 0; i < productos.length; i++){
	 for(let j = 0; j < dbstorage.length; j++){
	    let productId = +productos[i].id;
	    let dbstorageId = +dbstorage[j].id;

	    if(productId === dbstorageId){
	       let precio = productos[i].precio;
	       let cantidad = dbstorage[j].cantidad;
	       let total = precio * cantidad;
	       let product = {
		  "id":productos[i].id,
		  "precio":productos[i].precio,
		  "nombre":productos[i].nombre,
		  "cantidad":dbstorage[j].cantidad,
		  "total":total
	       };
	       result.push(product);
	       break;
	    }
	 }
      }
      const cardsCarrito = result.map(product => `<card-carrito
di="${product.id}"
nombre="${product.nombre}"
total="${product.total}"
cantidad="${product.cantidad}"
db_name="${bd_local}"
precio="${product.precio}"></card-carrito>`).join(" ");

      /* insertando los items guardados en el carrito */
      query("#canvaSaveItems").innerHTML = cardsCarrito;

      const calcTotal = document.createElement("calc-total");
      calcTotal.setAttribute("db_name",bd_local)
      const btnWhatsapp = document.createElement("btn-whatsapp");
   });
}

document.querySelector("#seguirComprando").
   addEventListener("click",()=>{
      listSaveItem.classList.toggle("ocultar")
      list.classList.toggle("ocultar")
      renderSaveItemsTEMPORAL()
   })
