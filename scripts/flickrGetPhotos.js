$('document').ready(function(){
        $('#tabs').tabs();
	$('#submitCity').on("click",this,function(){
                removeImages();
		photos = getJSON($('#inputCity').val(),
                        $('#nbImages').val(),
                        $('#quality').val());
	});

});

function urlJSON(city){
	return ("http://api.flickr.com/services/feeds/photos_public.gne?tags="+city+"&tagmode=any&format=json&nojsoncallback=1");
}

function removeImages(){
    $("img").remove();
}
function getJSON (city, numberOfImages, qualityImages){
  var flickerAPI = urlJSON(city);
  console.log(flickerAPI);
  $.ajax({
      flickerAPI,
      type:'GET',
      dataType:'jsonp',
      //json:'jsoncallback',
      success:function( data) {
    var i = 0;
      $.each( data.items, function(i, item ) {
         if (i < numberOfImages){ 
            addPic(photo = {
                link : item.link,
                medio : item.media,
                date_taken : item.date_taken,
                author: item.author,
                author_id: item.author_id,
                title: item.title,
                published: item.published,
                description: item.description,
                quality: qualityImages});
        i++;
      }
      });
    },
      error:function(){
          alert("fail");
      }
  });
}

function addPic(photo){
    $("<img>").attr("src",photo.media.m.replace("_m.","_"+photo.quality+".")).attr("id",photo.id).appendTo("#images");
    $("<img>").attr("src", photo.media.m.replace("_m.","_q.")).appendTo($("#tableImages")).wrap('<tr id =\"'+photo.secret+'\">').wrap('<td>');
    $('<td>salut</td>').appendTo("#"+photo.secret);
    $('</br>').appendTo("#images");
    $('#'+photo.id).on("click",this,function(){
        dialogInformation(photo);
    });
}

function dialogInformation(photo){
    //$('#'+photo.id).dialog({
        //title: photo.title});
        $('<div>').attr("class","ui-dialog").dialog({
            title: photo.title,
            position:{
                of:$('#'+photo.id)
            }});
}

