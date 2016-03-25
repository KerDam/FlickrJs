$(document).ready(function(){
	var coordonates = getCoordonates(getURLParameter("id"));
	if (coordonates != null ){
		var mymap = L.map('mapid').setView([coordonates.longitude, coordonates.lattitude], 13);
		var marker = L.marker([coordonates.longitude,coordonates.lattitude]).addTo(mymap);
	}
});


/*
  Function: getCoordonates

  This function will make a ajax request on the flickr api to get the coordonate.

  Parameters:
  id - This is the id of the photo you want to get the coordonates off
*/
function getCoordonates(id){
  $.ajax({
    url: "https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation",
    type:'GET',
    dataType:'jsonp',
    jsonp:'jsoncallback',
    data: 'api_key=5149a64fa91469647a7511af9adf33a5&photo_id='+id+'&tagmode=any&format=json',
    success:function( data) {
	var coordonate = [];
	if (data.stat == "fail"){
		alert(data.message);
		return null;
	}
	else {
		coordonate.push(data.longitude);
		coordonate.push(data.lattitude);
        }
    },
    fail:function(){
	    alert("fail");
    }
 });
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}
