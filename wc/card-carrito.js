window.customElements.define('card-carrito',
   class WebComponent extends HTMLElement {

      static get observedAttributes(){ 
	 return ["nombre","di","cantidad","precio","total","db_name"] 
      }

      constructor(){super(); this.attachShadow({mode:'open'});
	 const get = name => this.getAttribute(name);
	 this.nombre = get("nombre");
	 this.id = get("di");
	 this.cantidad = +get("cantidad");
	 this.precio = +get("precio")
	 this.total = +get("total")

	 this.shadowRoot.innerHTML =  `
<style>
div{
   display: flex;
  align-items: center;
  position:relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  box-sizing: border-box;
  padding:10px;
  width:95%;
  justify-content: space-around;
}
input{
   width:35px;
   height:32px;
   font-size:1.2rem;
}
button{
   font-size:1.5rem;
   min-width: 35px;
   background:darkolivegreen;
   color:white;
}
.nombre_precio{
   display:grid;
   width:120px;
}
.nombre{
   font-family:sans-serif;
   font-size: .8rem;
   text-align: center;
}
.precio{
   font-size:.8rem;
   display: inline-block;
  width: 100px;
  text-align: center;
    color: teal;
}

button{
   border-radius:10px;
   border:none;
}
.cambiar_cantidad{
   width:120px;
   display: flex;
   justify-content: space-between;
}
.cambiar_cantidad input{
   text-align:center;
}
#del{
   border-radius:50%;
  background:brown; 
  position: absolute;
  right: 4px;
  top: -18px;
}
#total{
   font-size:1rem;
}
</style>

<div class="list" id="${this.id}">
   <section class="nombre_precio">
      <span class="nombre">${this.nombre}</span>
      <span class="precio">precio s/. ${this.precio}</span>
   </section>
   <multi-precios di="${this.id}"
   cantidad="${this.cantidad}"
   precio="${this.precio}"
   db_name="${this.getAttribute("db_name")}"
   ></multi-precios>
   <button id="del">x</button>
</div>
   `;

      }

      connectedCallback(){
	 this.shadowRoot.querySelector("#del").
	    addEventListener("click", e => {
	       let dbstorage = JSON.parse(localStorage.getItem(this.getAttribute("db_name"))) || [];
	       const indice = dbstorage.findIndex(objeto => objeto.id === this.id);
	       if (indice !== -1) dbstorage.splice(indice, 1);
	       localStorage.setItem(this.getAttribute("db_name"),JSON.stringify(dbstorage));

	       this.dispatchEvent(new CustomEvent("updateCantidadStorage", { bubbles: true, composed: true }))
	       this.remove();
	    })
      }

   })

