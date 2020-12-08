// For counter on new order page
var input = document.getElementById("list");
var qty = document.getElementById("qty");
var qtyValue = qty.value;

qty.addEventListener('change', function(){
  var item = document.getElementById('list').lastElementChild;
  var clone = item.cloneNode(true);
  if(this.value > qtyValue){
    console.log('up');
    input.appendChild(clone);
  }
  else if(this.value < qtyValue){
    console.log('down')
    input.removeChild(input.lastElementChild);
  }
    qtyValue = this.value
});