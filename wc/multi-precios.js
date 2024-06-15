window.customElements.define('multi-precios',
   class WebComponent extends HTMLElement {

      static get observedAttributes(){ 
	 return ["di","cantidad","precio","db_name"] 
      }

      constructor(){super(); this.attachShadow({mode:'open'});
	    let dbstorage = JSON.parse(localStorage.getItem(this.getAttribute("db_name"))) || []
	    const id = this.getAttribute("di");
	    const product = dbstorage.filter(product => product.id == id);
	    if(product.length === 0) this.cantidad = 0;
	    else{
	       this.cantidad = product[0].cantidad;
	    }
	 const get = name => this.getAttribute(name);
	 this.id = get("di");
	 //this.cantidad = +get("cantidad");
	 this.precio = +get("precio");
	 this.total = this.cantidad * this.precio;

	 this.shadowRoot.innerHTML =  `
<style>
.list{
   display: flex;
  align-items: center;
  position:relative;
  box-sizing: border-box;
  padding:10px;
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
   border-radius:10px;
   border:none;
}
.precio{
   font-size:.8rem;
   display: inline-block;
  width: 100px;
  text-align: center;
    color: teal;
}

.cambiar_cantidad{
   width:120px;
   display: flex;
   justify-content: space-between;
}
.cambiar_cantidad input{
   text-align:center;
}
#total{
   font-size:1rem;
}
</style>
<div class="list" id="${this.id}">
   <section class="cambiar_cantidad">
      <button id="minus">-</button>
      <input id="value" value="${this.cantidad}" type="number" />
      <button id="add">+</button>
   </section>
   <span id="total" class="precio">s./${this.total.toFixed(2)}</span>
</div>
   `;
      }

      connectedCallback(){
	 const uploaderStorage = item => {
	    let dbstorage = JSON.parse(localStorage.getItem(this.getAttribute("db_name"))) || []

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

	    localStorage.setItem(this.getAttribute("db_name"),JSON.stringify(dbstorage));
	 }

	 this.shadowRoot.addEventListener("click",e =>{

	    switch(e.target.id){
	       case "minus":
		  if(this.cantidad <= 0){
		     this.shadowRoot.querySelector("#total").textContent = 0;
		     this.setAttribute("total",this.total);
		     this.setAttribute("cantidad",this.cantidad)
		     uploaderStorage({ "id": this.getAttribute("di"), "cantidad": this.cantidad, });
		     this.dispatchEvent(new CustomEvent("updateCantidadStorage", {
			detail: {
			   "id": this.getAttribute("di"),
			   "cantidad": this.cantidad,
			},
			bubbles: true,
			composed: true
		     }))
		  }else{
		     this.cantidad--
		     this.total = this.cantidad * this.precio;
		     this.shadowRoot.querySelector("#value").value = this.cantidad;
		     this.shadowRoot.querySelector("#total").textContent = this.total.toFixed(2);
		     this.setAttribute("total",this.total);
		     this.setAttribute("cantidad",this.cantidad)
		     uploaderStorage({ "id": this.getAttribute("di"), "cantidad": this.cantidad, });
		     this.dispatchEvent(new CustomEvent("updateCantidadStorage", {
			detail: {
			   "id": this.getAttribute("di"),
			   "cantidad": this.cantidad,
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
		  uploaderStorage({ "id": this.getAttribute("di"), "cantidad": this.cantidad, });
		  this.dispatchEvent(new CustomEvent("updateCantidadStorage", { bubbles: true, composed: true }))
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
	       this.dispatchEvent(new CustomEvent("nuevaCantidad", {
		  detail: {
		     "id": this.getAttribute("di"),
		     "cantidad": this.cantidad,
		  },
		  bubbles: true,
		  composed: true
	       }))
	       uploaderStorage({ "id": this.getAttribute("di"), "cantidad": this.cantidad, });

	    })
      }
   })

