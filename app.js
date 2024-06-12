import "./wc/mi-item.js";
import "./wc/btn-add.js";
import "./wc/btn-carrito.js";
import "./wc/card-product.js";
import "./wc/card-carrito.js";

const url = "./db_products.json";
const bd_local = "storage";

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

/*mostrar todos los productos*/
callProduct().then(productos => {
   list.innerHTML = productos.map(producto =>{
      return `<mi-item
      precio="${producto.precio}"
       imagen="${producto.imagen}"
       storageName="${bd_local}"
       name="${producto.nombre}"
       di=${producto.id}
       cantidad=0
	></mi-item>`
   }).join("");
});

/* <btn-add>*/
document.body.addEventListener("productoEnviado", e => {
   const item = {
      "id":e.detail.id,
      "cantidad":e.detail.cantidad
   }

   let dbstorage = JSON.parse(localStorage.getItem(bd_local)) || []

   if(dbstorage.length === 0) dbstorage.push(item);

   let itemFound = false;

   for (let i = 0; i < dbstorage.length; i++) {
      if (dbstorage[i].id === item.id) {
	 dbstorage[i].cantidad = item.cantidad;
	 itemFound = true;
	 break; 
      }
   }
   if (!itemFound) dbstorage.push(item);

   let cantidadStoragefinal = dbstorage.reduce((total, i) => total + i.cantidad, 0);
   query("btn-carrito").setAttribute("cantidad",cantidadStoragefinal);

   localStorage.setItem(bd_local,JSON.stringify(dbstorage));
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
   let total = dbstorage.reduce((subtotal, i) => subtotal + i.cantidad,0);
   query("btn-carrito").setAttribute("cantidad",total);
   /*mostrar todos los productos*/
   callProduct().then(productos => {
      list.innerHTML = productos.map(producto =>{
	 return `<mi-item precio="${producto.precio}" imagen="${producto.imagen}" storageName="${bd_local}"name="${producto.nombre}" di=${producto.id} cantidad=0></mi-item>`
      }).join("");
   })
})

/* actualizar carrito al cargar la pagina*/
document.addEventListener("DOMContentLoaded", e => {
   let dbstorage = JSON.parse(localStorage.getItem(bd_local)) || []
   let total = dbstorage.reduce((subtotal, i) => subtotal + i.cantidad,0);
   let btnCarrito = query("btn-carrito");
   btnCarrito.setAttribute("cantidad",total);
   let cantidadItems = btnCarrito.getAttribute("cantidad")

   if(total === '0'){
      query("btn-carrito").display = "none"
   }

})

async function formarProducto_pagar(){
   let dbstorage = JSON.parse(localStorage.getItem(bd_local)) || []
   let productosA_pagar = [];
   try {
      let productos = await callProduct();
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
	       productosA_pagar.push(product);
	       break;
	    }
	 }
      }
   } catch(e){

   }
   return productosA_pagar;
}
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
precio="${product.precio}"></card-carrito>`).join(" ");

      /* insertando los items guardados en el carrito */
      query("#canvaSaveItems").innerHTML = cardsCarrito; 

      /*total a pagar de elementos en el carrito*/
      let tagTotal = totalCardsCarrito(result)

      let btnWhatsapp = document.createElement("a");
      btnWhatsapp.classList.add("btnWhatsapp")
      btnWhatsapp.id = "btnWhatsapp";
      btnWhatsapp.textContent = "pedir por whatsapp";

      (async function(){
	 await crearUrlPago(btnWhatsapp)
      })()

      document.querySelector("#canvaSaveItems").appendChild(tagTotal)
   });
}
async function creandoTemplate(){
   const productos = await formarProducto_pagar()
   stringTotal_whatsapp = productos.map(product => {
      let precio = product.precio;
      let cantidad = product.cantidad;
      let nombre = product.nombre;
      total+= precio*cantidad;
      return `%0A*${nombre}%28${precio*cantidad}%29`
   }).join("")
   return productos;
}
async function crearUrlPago(btn){
      let btnWhatsapp = document.createElement("a");
      btnWhatsapp.classList.add("btnWhatsapp")
      btnWhatsapp.id = "btnWhatsapp";
      btnWhatsapp.textContent = "pedir por whatsapp";
      let numeroTelefonico = "923909419";
   let total = 0;
   let stringTotal_whatsapp;
   const productos = await formarProducto_pagar()
   stringTotal_whatsapp = productos.map(product => {
      let precio = product.precio;
      let cantidad = product.cantidad;
      let nombre = product.nombre;
      total+= precio*cantidad;
      return `%0A*${nombre}%28${precio*cantidad}%29`
   }).join("")

   btn.setAttribute("href",`whatsapp://send?phone=+51${numeroTelefonico}&text=${stringTotal_whatsapp}%0ATotal=${total.toFixed(2)}`);
      document.querySelector("#canvaSaveItems").appendChild(btn)
   
}
function totalCardsCarrito(result){
   const tagTotal = document.createElement("p");
   tagTotal.textContent = "Total = s/. ";
   tagTotal.classList.add("carritoTotal");

   let arrayTotal = result.reduce((subtotal, i) => subtotal + i.cantidad,0);
   let miTotal = 0;
   for(let i=0; i<result.length; i++){
      let precio = result[i].precio;
      let cantidad = result[i].cantidad;
      miTotal+= precio * cantidad;
   }

   tagTotal.innerText += miTotal.toFixed(2);
   return tagTotal;
}

const uploaderStorage = item => {
   let dbstorage = JSON.parse(localStorage.getItem(bd_local)) || []

   if(dbstorage.length === 0) dbstorage.push(item);

   let itemFound = false;

   for (let i = 0; i < dbstorage.length; i++) {
      if (dbstorage[i].id === item.id) {
	 dbstorage[i].cantidad = item.cantidad;
	 itemFound = true;
	 break; 
      }
   }
   if (!itemFound) dbstorage.push(item);

   let cantidadStoragefinal = dbstorage.reduce((total, i) => total + i.cantidad, 0);
   query("btn-carrito").setAttribute("cantidad",cantidadStoragefinal);

   localStorage.setItem(bd_local,JSON.stringify(dbstorage));
}

function sumarSubtotal(){
   let cards = document.querySelectorAll("card-carrito")
   let total = 0;
   let array = [...cards]
   array.forEach(a => {
      let subtotal = +(a.getAttribute("total"))
      total += subtotal
   })
   const divTotal = document.querySelector(".carritoTotal")
   divTotal.textContent = "Total = "+total.toFixed(2);
}

document.body.addEventListener("sumandoCantidad", e => {
   uploaderStorage({"id":e.detail.id, "cantidad":e.detail.cantidad});
   sumarSubtotal();
      let btn = document.querySelector("#btnWhatsapp")
      crearUrlPago(btn)
});
document.body.addEventListener("restandoCantidad", e => {
   uploaderStorage({"id":e.detail.id, "cantidad":e.detail.cantidad});
   sumarSubtotal();
      let btn = document.querySelector("#btnWhatsapp")
      crearUrlPago(btn)
});
document.body.addEventListener("editandoCantidad", e => {
   uploaderStorage({"id":e.detail.id, "cantidad":e.detail.cantidad});
   sumarSubtotal();
      let btn = document.querySelector("#btnWhatsapp")
      crearUrlPago(btn)
});

document.body.addEventListener("delCardCarrito", e => {
   let id =e.detail.id
   let dbstorage = JSON.parse(localStorage.getItem(bd_local)) || [];
   const indice = dbstorage.findIndex(objeto => objeto.id === id);

   // Si es -1, eliminarlo
   if (indice !== -1) {
      dbstorage.splice(indice, 1);
      let cards = [...document.querySelectorAll("card-carrito")];
      cards.forEach(card => {
	 if(card.id === id) card.remove()
      })
      let cantidadStoragefinal = dbstorage.reduce((total, i) => total + i.cantidad, 0);
      query("btn-carrito").setAttribute("cantidad",cantidadStoragefinal);
      if(dbstorage.length == 0){
	 console.log("encontardo")
      }
      localStorage.setItem(bd_local,JSON.stringify(dbstorage));
      sumarSubtotal();
      let btn = document.querySelector("#btnWhatsapp")
      crearUrlPago(btn)
   }
})
