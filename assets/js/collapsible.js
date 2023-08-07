var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    var children = content.childNodes;
    if (content.style.display === "inline-block") {
      content.style.display = "none";
      for (i = 0; i < children.length; i++) {
          children[i].style.display = "none";
      }
    } else {
      content.style.display = "inline-block";
      for (i = 0; i < children.length; i++) {
          children[i].style.display = "inline-block";
      }
    }
  });
}