window.customElements.define('btn-carrito-store',
   class WebComponent extends HTMLElement {

      static get observedAttributes(){ 
	 return ["db_name"] 
      }

      constructor(){super(); this.attachShadow({mode:'open'});
	 let dbstorage = JSON.parse(localStorage.getItem(this.getAttribute("db_name"))) || []
      this.cantidad = dbstorage.reduce((total, i) => total + i.cantidad, 0);
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

      connectedCallback(){
      }
      attributeChangedCallback(prop, oldVal, newVal) {
	 if(prop === "db_name"){
	    let dbstorage = JSON.parse(localStorage.getItem(this.getAttribute(newVal))) || []
	    let cantidad = dbstorage.reduce((total, i) => total + i.cantidad, 0);
	    console.log(cantidad)
	    this.shadowRoot.querySelector("span").textContent = cantidad
	 }
      }

})
