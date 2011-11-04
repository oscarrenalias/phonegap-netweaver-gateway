var isDesktop = ( navigator.platform.indexOf("iPhone") < 0 && navigator.platform.indexOf("iPod") < 0 && navigator.platform.indexOf("iPad") < 0 );

String.prototype.prx = function() {
	if(isDesktop)
		return("http://localhost:8080/proxy/" + this);
	else
		return(this);
}