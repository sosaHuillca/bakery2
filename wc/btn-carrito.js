window.customElements.define('btn-carrito',
   class WebComponent extends HTMLElement {

   static get observedAttributes(){ return ["cantidad"] }

   constructor(){super(); this.attachShadow({mode:'open'});
      this.shadowRoot.innerHTML =  `
<style>
div{
   display: block;
   width:60px;
   border-radius:10px;
   padding: 10px;
   cursor:pointer;
}
::slotted(.fa-cart-shopping) {
    font-size: 3rem;
  color: darkorange;
}
span{
  font-size: 2rem;
  color: darkslategray;
  position: absolute;
  left: 15px;
  top: 10px;
  font-weight: 500;
  font-family: sans-serif;
  width: 60px;
  display: block;
  text-align: center;
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
