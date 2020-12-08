// For Collapsible orders menu
var coll = document.getElementsByClassName("collapsible");
var innerCol = document.getElementsByClassName("inner-collapsible")
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

for (i = 0; i < innerCol.length; i++) {
    innerCol[i].addEventListener("click", function() {
      this.classList.toggle("inner-active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
}