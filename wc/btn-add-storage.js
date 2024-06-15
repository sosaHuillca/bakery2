window.customElements.define('btn-add-storage',
   class WebComponent extends HTMLElement {

      static get observedAttributes(){ return ["db_name","cantidad","di"] }

      constructor(){super(); this.attachShadow({mode:'open'});
	 this.shadowRoot.innerHTML =  `
<style>
button{
   padding:7px;
   display:inline-block;
   width:100px;
   border:none;
   border-radius:15px;
   margin-bottom:10px;
   font-size:1.02rem;
}
button.action{
   background:green; 
   color:white;
}
</style>

<button id="${this.getAttribute("di")}">agregar</button>

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

	       uploaderStorage({"id":this.getAttribute("di"), "cantidad":cantidad})

	       this.dispatchEvent(new CustomEvent("updateCantidadStorage", { bubbles: true, composed: true }))


	       this.shadowRoot.querySelector("button").classList.add("action");
	       this.shadowRoot.querySelector("button").textContent = "se agrego!";
	       setTimeout(()=>{
		  this.shadowRoot.querySelector("button").classList.remove("action") 
		  this.shadowRoot.querySelector("button").textContent = "agregar"
	       },500)
	    });
      }

   })
