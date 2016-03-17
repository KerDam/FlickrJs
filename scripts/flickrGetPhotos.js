$('document').ready(function(){
	$('#submitCity').on("click",this,function(){
		printPhotos($('inputCity').value);
	}
}

function urlJSON(city){
	return "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=5945c3497beb97d690ae3d0579f0eb3d&tags="+city+"&format=json&nojsoncallback=1&api_sig=87008093508a640c3b1a29eddc2bc76f";
}

function getJSON (city){
	var url = urlJSON(city);
	var jsonResult = $.ajax( url )
  		.done(function() {
		    alert( "success" );
		  })
		  .fail(function() {
		    alert( "error" );
		  })
		  .always(function() {
		    alert( "complete" );
		  });
	return jsonResult
}
function getPhotos(json){

