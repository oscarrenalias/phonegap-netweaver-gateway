(function(window) {
	var app = function() {}

	app.prototype.init = function() {
		console.log("Application initialized");	
	}

	app.prototype.loadData = function() {
		$.mobile.showPageLoadingMsg();

		Bank.getAll(function(banks) {	
			var list = $('#bank-list');
			$.each(banks, function(index, bank) {
				list.append('<li class="element"><a data-bankId="' + bank.id + '" href="#bank?id=' + bank.id + '">' + bank.name + '</a></li>');
			});
			$("li")
			$.mobile.hidePageLoadingMsg();
			list.listview('refresh');			
		});		
	}

	app.prototype.showBank = function(urlObj, options) {
		var bankId = urlObj.hash.replace( /.*id=/, "" ),
			bank = Bank.getById(bankId),
			pageSelector = urlObj.hash.replace( /\?.*$/, "" );

		var bankMarkup = function(bank) {
			var markup = "<p>" + bank.name + "</p>";
			if(bank.street != undefined)
				markup += "<p>" + bank.street + ", "+ bank.city + ", " + bank.country + "</p>";

			markup += '<div data-role="collapsible"><h3>See location</h3><p>map goes here</p></div>';
			
			return(markup);
		}

		if (bank) {
			// Get the page we are going to dump our content into.
			var $page = $( pageSelector ),
				$header = $page.children( ":jqmData(role=header)" ),
				$content = $page.children( ":jqmData(role=content)" );

			// page title
			$header.find( "h1" ).html( bank.name );
			// page content
			$content.html(bankMarkup(bank));

			// prepare the page
			$page.page();

			// We don't want the data-url of the page we just modified
			// to be the url that shows up in the browser's location field,
			// so set the dataUrl option to the URL for the category
			// we just loaded.
			options.dataUrl = urlObj.href;

			// Now call changePage() and tell it to switch to
			// the page we just modified.
			$.mobile.changePage( $page, options );
		}		
	}

	window.app = app;
})(window);

$(document).bind("mobileinit", function(){
  app = new app();
  app.init();
});

// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) {
	// We only want to handle changePage() calls where the caller is
	// asking us to load a page by URL.
	if ( typeof data.toPage === "string" ) {
		// only handle banks
		var u = $.mobile.path.parseUrl( data.toPage ),
			re = /^#bank/;
		if ( u.hash.search(re) !== -1 ) {
			app.showBank( u, data.options );
			e.preventDefault();
		}
	}
});