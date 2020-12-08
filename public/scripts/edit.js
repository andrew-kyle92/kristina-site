// For counter on order edit page
const form = document.getElementById('user-edit');
var input = document.getElementById("list-edit");
var qty = document.getElementById("qty-edit");
var qtyValue = qty.value;

qty.addEventListener('change', function(){
  var item = document.getElementById('list-edit').lastElementChild;
  var clone = item.cloneNode(true);
  if(this.value > qtyValue){
    input.appendChild(clone);
    clone.childNodes[1].htmlFor = "newSize"; //Change label name for size input
    clone.childNodes[1].childNodes[1].name = "newSize"; //changing shirt size name for input
    clone.childNodes[1].childNodes[1].value = ""; //Clearing newSize input value
    clone.childNodes[3].htmlFor = "newColor"; //Change label name for color input
    clone.childNodes[3].childNodes[1].name = "newColor"; //changing shirt color name for input
    clone.childNodes[3].childNodes[1].value = null; //Clearing newColor input value
  }
  else if(this.value < qtyValue){
    input.removeChild(input.lastElementChild);
  }
    qtyValue = this.value
});