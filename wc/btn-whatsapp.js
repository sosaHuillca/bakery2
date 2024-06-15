window.customElements.define('btn-whatsapp',
   class WebComponent extends HTMLElement {

   static get observedAttributes(){ return ["db_name","telf"] }

   constructor(){super(); this.attachShadow({mode:'open'});
      this.shadowRoot.innerHTML =  `
<style>
a {
  background: cadetblue;
  padding: 5px;
  border-radius: 10px;
  color: white;
  height:40px;
  text-align:center;
  cursor:pointer;
  text-decoration:none;
  line-height:2.3;
}
</style>
<a href="/">enviar a mi whatsapp</a>
   `;
   }

   connectedCallback(){
   }
      attributeChangedCallback(prop, oldVa, newVa){
      let dbstorage = JSON.parse(localStorage.getItem(this.getAttribute("db_name"))) || []
      let stringTotal = '';
      let totalMax = 0;
      (async () => {
	 try{
	    const response = await fetch("../db_products.json");
	    const data = await response.json();
	    for(let i = 0; i < data.productos.length; i++){
	       for(let j = 0; j < dbstorage.length; j++){
		  let productId = +data.productos[i].id;
		  let dbstorageId = +dbstorage[j].id;

		  if(productId === dbstorageId){
		     let nombre = data.productos[i].nombre;
		     let precio = +data.productos[i].precio;
		     let cantidad = +dbstorage[j].cantidad;
		     let total = (precio)*(cantidad);
		     stringTotal+= `%0A*${nombre}%28${total.toFixed(2)}%29`;
		     totalMax+= total;
		  };
	       }
	    }
	    if(totalMax === 0){
	       this.shadowRoot.querySelector("a").style.display="none"
	    }else{

	    this.shadowRoot.querySelector("a").setAttribute("href",`whatsapp://send?phone=+51${this.getAttribute("telf")}&text=${stringTotal}%0ATotal=${totalMax.toFixed(2)}`)
	       this.shadowRoot.querySelector("a").style.display="block"
	    }
	 }catch(err){
	    console.log(err)
	 }
      })()

      }

})

