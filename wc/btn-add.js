window.customElements.define('btn-add',
   class WebComponent extends HTMLElement {

   static get observedAttributes(){ return ["storageName","cantidad","di"] }

   constructor(){super(); this.attachShadow({mode:'open'});
      const di = this.getAttribute("di");

      this.shadowRoot.innerHTML =  `
<style>
button{
   padding:7px;
   display:inline-block;
   width:80px;
}
</style>

<button id="${di}">add</button>
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

	    this.setAttribute("cantidad",cantidad)

	    this.dispatchEvent(new CustomEvent("productoEnviado", {
	       detail: {
		  "id": this.getAttribute("di"),
		  "cantidad": cantidad
	       },
	       bubbles: true,
	       composed: true
	    }))
	 });
   }

})

