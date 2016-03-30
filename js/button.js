var infoToggle = document.getElementById("udacity-info-toggle");
var infoBox = $("#udacity-info");

function udacityInfoFunction () {
	infoBox.toggleClass("udacity-info-hidden");
	infoBox.toggleClass("udacity-info-visible");
}

infoToggle.addEventListener("click", udacityInfoFunction);