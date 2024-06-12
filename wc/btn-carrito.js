window.customElements.define('btn-carrito',
   class WebComponent extends HTMLElement {

   static get observedAttributes(){ return ["cantidad"] }

   constructor(){super(); this.attachShadow({mode:'open'});
      this.shadowRoot.innerHTML =  `
<style>
div{
   border: 1px solid greenyellow;
   display: block;
   width:40px;
   border-radius:10px;
   padding: 10px;
   cursor:pointer;
}
</style>

<div id="btnCarrito">
   <slot name="icon"></slot>
   <span>${this.cantidad}</span>
</div>
   `;
   }

      attributeChangedCallback(prop, oldVal, newVal) {
	 if(prop === "cantidad"){
	    this.shadowRoot.querySelector("span").textContent = newVal
	 }
      }

      
   connectedCallback(){
      this.shadowRoot.querySelector("#btnCarrito").
	 addEventListener("click", e => {
	    this.dispatchEvent(new CustomEvent("btnMostrarSaveItem", {
	       detail: "btn",
	       bubbles: true,
	       composed: true
	    }))
	 })
   }

})
