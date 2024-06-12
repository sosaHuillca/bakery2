window.customElements.define('btn-show',
   class WebComponent extends HTMLElement {

   static get observedAttributes(){ return ["di","storageName","cantidad"] }

   constructor(){super(); this.attachShadow({mode:'open'});
      this.shadowRoot.innerHTML =  `
<style>
button{
   padding:7px;
}
</style>

   <button id="${this.getAttribute("di")}">ver</button>
   `;
   }

   connectedCallback(){
      this.shadowRoot.querySelector("button").
	 addEventListener("click", e => {

	    let dbstorage = JSON.parse(localStorage.getItem(this.getAttribute("storageName"))) || []
	    const di = this.getAttribute("di");
	    let stringCantidad = this.getAttribute("cantidad");
	    let cantidad = 0;
	    if(stringCantidad){
	       +stringCantidad
	       ++stringCantidad
	       cantidad = stringCantidad
	    } else {
	       cantidad++
	    }

	    this.dispatchEvent(new CustomEvent("verProducto", {
	       detail: {
		  "id": this.getAttribute("di"),
		  "cantidad": cantidad
	       },
	       bubbles: true,
	       composed: true
	    }))
	 });
      /*
   let dbstorage = JSON.parse(localStorage.getItem(this.getAttribute("storageName"))) || []


   if(dbstorage.length === 0) dbstorage.push(item);

   let itemFound = false;

   for (let i = 0; i < dbstorage.length; i++) {
      if (dbstorage[i].id === item.id) {
	 dbstorage[i].cantidad = item.cantidad;
	 itemFound = true;
	 break; // Romper el bucle si ya se encontró y actualizó el objeto
      }
   }
   if (!itemFound) dbstorage.push(item);

   localStorage.setItem(storage,JSON.stringify(dbstorage));
      */
   }

})

