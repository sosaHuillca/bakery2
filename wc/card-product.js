import "./multi-precios.js";
import "./btn-add.js";
window.customElements.define('card-product',
   class WebComponent extends HTMLElement {

      static get observedAttributes(){ return ["di","nombre","precio","imagen","descripcion","cantidad","categoria","storage"] }

      constructor(){super(); this.attachShadow({mode:'open'});
	 let nombre = this.getAttribute("nombre");
	 let cantidad = this.getAttribute("cantidad");
	 let di = this.getAttribute("di");
	 let precio = this.getAttribute("precio");
	 let imagen = this.getAttribute("imagen");
	 let listImagen = imagen.split(",")
	 let descripcion = this.getAttribute("descripcion");
	 let categoria = this.getAttribute("categoria");
	 this.shadowRoot.innerHTML =  `
<style>
img { width: 100%; height:100%; }

.head-product{
   height:35vh;
   position:relative;
}

.fa-arrow-left{
   position: absolute;
   top:.5rem;
   left:.5rem;
   width:40px;
   height:40px;
   background: blueviolet;
   display: flex;
   justify-content: center;
   align-items:center;
   border-radius:6px;
   color:white;
}

.content-galery{
  display: flex;
  width: 19%;
  height: 100%;
  position: absolute;
  bottom: 0px;
  border-radius: 0px 0 0 0px;
  overflow: hidden;
  flex-direction: column;
  right: 0px;
}

.body-product{
   display: grid;
   grid-template-columns:1fr 1fr;
   padding:10px;
   background: white;
   height:40vh;
     border-radius: 0px 0 10px 10px;
}

.title-producto{
   grid-column:1/2;
   grid-row:1/2;
   font-family:sans-serif;
   font-weight: 500;

   font-size: 1.1rem;
  margin: 0;
}

.title-categoria{
  grid-column:2/3; 
  grid-row:1/2;
  margin:0;
  font-family:sans-serif;
  font-weight:500;
  font-size: .8rem;
}

.title-descripcion{
   grid-column:1/2; 
  grid-row:2/3;
  font-family: sans-serif;
  font-weight:400;

  margin: 5px 0 5px 0px;
  font-size: 1rem;
}

.content-descripcion{
   grid-column:1/-1;
  grid-row:3/4;
    font-size: .8rem;

}

.title-precio{
   grid-row:1/2;
  grid-row:4/5;
}
.cambiar_cantidad{
   grid-row:2/3;
   grid-row:4/5;
}

.btn-agregar{
   grid-column:2/3;
   padding:10px;
   height:40px;
  grid-row:4/5;
}
#borrar{
  position: absolute;
  width: 50px;
  font-size: 1.3rem;
  border-radius: 50%;
  border: none;
  height: 50px;
  top: -25px;
  left: -15px;
  background:brown; 
  color:white;
  border:none;
}

.number-precio{
   font-weight:bold;
   font-size: 1.5rem;
}

h3,h2 { margin-top:0; }
p{margin-top:0;}

.content-product{
  width: 90%;
  margin: auto;
}
.imgMain{
   width: 81%;
}
</style>
      <article class="content-product">
	 <header class="head-product">
	    <button id="borrar">
	       <slot name="btn-cerrar"></slot>
	    </button>
	    <img id="imgMain" src="imagenes/${listImagen[0]}"/>
	    <nav class="content-galery">
	       <img src="imagenes/${listImagen[1]}"/>
	       <img src="imagenes/${listImagen[2]}"/>
	       <img src="imagenes/${listImagen[3]}"/>
	       <img src="imagenes/${listImagen[4]}"/>
	    </nav>
	 </header>
	 <section class="body-product">
	    <h2 class="title-producto">${nombre}</h2>
	    <h3 class="title-categoria">Categoria: ${categoria}</h3>
	    <h3 class="title-descripcion">Descripcion:</h3>
	    <p class="content-descripcion">${descripcion}</p>
      <p class="title-precio"><strong>Precio:</strong>
	 <span class="number-precio">s/. ${precio}</span>
   <section class="cambiar_cantidad">
      <multi-precios cantidad="${cantidad}" precio="${precio}" di="${di}" db_name="${this.getAttribute("storage")}"></multi-precios>
   </section>
      </p>
      <button id="cerrar">seguir comprando</button>
      <button id="verCarrito">ver carrito</button>
	 </section>
      </article>
   `;
      }

      connectedCallback(){
	 const mainImg = this.shadowRoot.querySelector("#imgMain");
	 const imgs = this.shadowRoot.querySelector(".content-galery").childNodes
	 imgs.forEach(img => {
	    img.addEventListener("click",(e)=>{
	       let srcNew = e.target.getAttribute("src");
	       mainImg.setAttribute("src",srcNew)
	    })
	  })
	 this.shadowRoot.querySelector("#cerrar").
	    addEventListener("click", e => {

	    this.dispatchEvent(new CustomEvent("btnCerrarCardProduct", {
	       detail: {
		  "clase": "ocultar",
	       },
	       bubbles: true,
	       composed: true
	    }))
	    })
      this.shadowRoot.querySelector("#verCarrito").
	 addEventListener("click", e => {
	       this.dispatchEvent(new CustomEvent("updateCantidadStorage", { bubbles: true, composed: true }))
	    this.dispatchEvent(new CustomEvent("btnCerrarCardProduct", {
	       detail: {
		  "clase": "ocultar",
	       },
	       bubbles: true,
	       composed: true
	    }))
	    this.dispatchEvent(new CustomEvent("btnMostrarSaveItem", {
	       detail: "btn",
	       bubbles: true,
	       composed: true
	    }))
	 })
      }


   })
