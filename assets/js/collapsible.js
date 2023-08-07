var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.childNodes;
    for(var i = 0, size = content.length; i < size ; i++){
      if (content[i].style.display === "block") {
        content[i].style.display = "none";
      } else {
        content[i].style.display = "block";
      }
    }
  });
}