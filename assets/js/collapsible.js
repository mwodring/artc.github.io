var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var par = this.parentNode;
        var children = par.children;
        for (i = 0; i < children.length; i++) {
        var content = children[i];
        if (content.style.display === "block" && content.classList.contains("content")) {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
        }
    });
}