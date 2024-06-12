window.customElements.define('card-carrito',
   class WebComponent extends HTMLElement {

      static get observedAttributes(){ 
	 return ["nombre","di","cantidad","precio","total"] 
      }

      constructor(){super(); this.attachShadow({mode:'open'});
	 const get = name => this.getAttribute(name);
	 this.nombre = get("nombre");
	 this.id = get("di");
	 this.cantidad = +get("cantidad");
	 this.precio = +get("precio")
	 this.total = +get("total")
	 //this.total = this.cantidad * this.precio; 

	 this.shadowRoot.innerHTML =  `
<style>
div{
   display: flex;
  align-items: center;
  position:relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  box-sizing: border-box;
  width: 98%;
  padding:10px;
  margin-left:auto;
  margin-right:auto;
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
   <section class="cambiar_cantidad">
      <button id="minus">-</button>
      <input id="value" value="${this.cantidad}" type="number" />
      <button id="add">+</button>
   </section>
   <span id="total" class="precio">s./${this.total.toFixed(2)}</span>
   <button id="del">x</button>
</div>
   `;

      }

      connectedCallback(){
	 this.shadowRoot.addEventListener("click",e =>{
	    switch(e.target.id){
	       case "minus":
		  if(this.cantidad <= 0){
		     this.shadowRoot.querySelector("#total").textContent = 0;
		     this.setAttribute("total",this.total);
		     this.setAttribute("cantidad",this.cantidad)
		  }else{
		     this.cantidad--
		     this.total = this.cantidad * this.precio;
		     this.shadowRoot.querySelector("#value").value = this.cantidad;
		     this.shadowRoot.querySelector("#total").textContent = this.total.toFixed(2);
		     this.setAttribute("total",this.total);
		     this.setAttribute("cantidad",this.cantidad)
		     this.dispatchEvent(new CustomEvent("restandoCantidad", {
			detail: {
			   "id": this.getAttribute("di"),
			   "cantidad": this.cantidad,
			   "total":this.total
			},
			bubbles: true,
			composed: true
		     }))
		  }
		  break;
	       case "add":
		  this.cantidad++
		  this.total = this.cantidad * this.precio;
		  this.shadowRoot.querySelector("#value").value = this.cantidad;
		  this.shadowRoot.querySelector("#total").textContent = this.total.toFixed(2);
		  this.setAttribute("total",this.total);
		  this.setAttribute("cantidad",this.cantidad)
		  this.dispatchEvent(new CustomEvent("sumandoCantidad", {
		     detail: {
			"id": this.getAttribute("di"),
			"cantidad": this.cantidad,
			   "total":this.total
		     },
		     bubbles: true,
		     composed: true
		  }))
		  break;
	       default:
		  break;
	    }
	 })

	 this.shadowRoot.querySelector("input").
	    addEventListener("input", e => {
	       this.cantidad = +(this.shadowRoot.querySelector("#value").value);
	       this.total = this.cantidad * this.precio;
	       this.shadowRoot.querySelector("#value").value = this.cantidad;
	       this.setAttribute("total",this.total);
	       this.setAttribute("cantidad",this.cantidad)
	       this.shadowRoot.querySelector("#total").textContent = this.total.toFixed(2);

	       this.dispatchEvent(new CustomEvent("editandoCantidad", {
		  detail: {
		     "id": this.id,
		     "cantidad": this.cantidad,
			   "total":this.total
		  },
		  bubbles: true,
		  composed: true
	       }))
	    })

	 this.shadowRoot.querySelector("#del").
	    addEventListener("click", e => {
	       this.dispatchEvent(new CustomEvent("delCardCarrito", {
		  detail: {
		     "id": this.id,
			   "total":this.total
		  },
		  bubbles: true,
		  composed: true
	       }))
	       this.remove();
	    })
      }

   })

