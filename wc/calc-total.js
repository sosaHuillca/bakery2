window.customElements.define('calc-total',
   class WebComponent extends HTMLElement {

   static get observedAttributes(){ return ["db_name"] }

   constructor(){super(); this.attachShadow({mode:'open'});
      this.shadowRoot.innerHTML =  `
<style>
p {
   text-align:right;
   font-size:1.1rem;
  width: 85%;
}
</style>
<p>total = 0</p>
   `;
   }

   connectedCallback(){
   }
      attributeChangedCallback(prop, oldVa, newVa){
	 let dbstorage = JSON.parse(localStorage.getItem(this.getAttribute("db_name"))) || [];
	 this.total = 0;
	 (async () => {
	    try{
	       const response = await fetch("../db_products.json");
	       const data = await response.json();
	       for(let i = 0; i < data.productos.length; i++){
		  for(let j = 0; j < dbstorage.length; j++){
		     let productId = +data.productos[i].id;
		     let dbstorageId = +dbstorage[j].id;

		     if(productId === dbstorageId){
			let precio = +data.productos[i].precio;
			let cantidad = +dbstorage[j].cantidad;
			this.total += (precio)*(cantidad);
		     };
		  }
	       }
	       if(this.total === 0){
		  this.shadowRoot.querySelector("p").style.display="none"
	       }else{

		  this.shadowRoot.querySelector("p").textContent = `Total = s/. ${this.total.toFixed(2)}`;
		  this.shadowRoot.querySelector("p").style.display="block"
	       }

	    }catch(err){
	       console.log(err)
	    }
	 })()
      }

})

