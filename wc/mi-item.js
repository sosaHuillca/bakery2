import "./btn-add.js";
import "./btn-show.js";
window.customElements.define('mi-item',
   class WebComponent extends HTMLElement {

      static get observedAttributes(){ return ["imagen","name","di","cantidad","nameStorage"] }

      constructor(){super(); this.attachShadow({mode:'open'});
	 let name = this.getAttribute("name");
	 let id = this.getAttribute("di");
	 let imagen = this.getAttribute("imagen");
	 let listImagen = imagen.split(",")
	 this.shadowRoot.innerHTML =  `
<style>
img { width: 100%; height:75px; }
.contendor{
   border:1px solid white;
   padding:11px;
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
   height:40px;
}
</style>

<div id=${id} class="contendor">
   <section>
      <img id="imgMain" src="imagenes/${listImagen[0]}"/>
      <span>${name}</span>
   </section>

   <div class="cont-btns">
      <btn-add 
      storageName="${this.getAttribute("nameStorage")}" 
      cantidad="${this.getAttribute("cantidad")}"
      di="${this.getAttribute("di")}"
      ></btn-add>
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
      }

   })
