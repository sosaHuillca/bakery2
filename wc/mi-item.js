import "./btn-add.js";
import "./btn-add-storage.js";
import "./btn-show.js";
window.customElements.define('mi-item',
   class WebComponent extends HTMLElement {

      static get observedAttributes(){ return ["precio","imagen","name","di","cantidad","storage"] }

      constructor(){super(); this.attachShadow({mode:'open'});
	 let name = this.getAttribute("name");
	 let id = this.getAttribute("di");
	 let precio = this.getAttribute("precio");
	 let imagen = this.getAttribute("imagen");
	 let listImagen = imagen.split(",")
	 this.shadowRoot.innerHTML =  `
<style>
img { width: 100%; height:75px; }
.contendor{
     box-sizing:border-box;
   display: grid;
  gap: 15px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7); 
}
.contendor.action{
   border: 2px solid green;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Sombra oscura */
        //transition: border 0.3s ease, box-shadow 0.3s ease; /* Transición suave */
}
.cont-btns{
   display:flex;
   justify-content:space-around;
}
section{
   cursor:pointer;
}
span{
   display:inline-block;
}
p{
margin:0;
}

</style>

<div id=${id} class="contendor">
   <section>
      <img id="imgMain" src="imagenes/${listImagen[0]}"/>
      <span>${name}</span>
      <p>s/. ${precio}</p>
   </section>

   <div class="cont-btns">
      <btn-add-storage
      db_name="${this.getAttribute("storage")}" 
      cantidad="${this.getAttribute("cantidad")}"
      di="${this.getAttribute("di")}"
      ></btn-add-storage>
   </div>
</div>
   `;
      }

      connectedCallback(){
	 this.shadowRoot.querySelector("section").
	    addEventListener("click", e => {
	    this.dispatchEvent(new CustomEvent("verProducto", {
	       detail: {
		  "id": this.getAttribute("di"),
	       },
	       bubbles: true,
	       composed: true
	    }))
	    })
	 this.shadowRoot.querySelector("btn-add-storage").addEventListener("updateCantidadStorage", e =>{
	    this.shadowRoot.querySelector(".contendor").classList.add("action");
	    setTimeout(()=>{
	       this.shadowRoot.querySelector(".contendor").classList.remove("action") 
	    },500)
	 })
      }

   })
