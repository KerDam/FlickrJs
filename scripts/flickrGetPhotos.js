$('document').ready(function(){
        $('#tabs').tabs();
	$('#submitCity').on("click",this,function(){
                removeImages();
		photos = getJSON($('#inputCity').val(),
                        $('#nbImages').val(),
                        $('#quality').val());
	});

});


function removeImages(){
    $("td").remove();
    $("tr").remove();
    $("#images").children().remove();
    $(".ui-dialog").remove();
}
function getJSON (city, numberOfImages, qualityImages){
  $.ajax({
      url: "http://api.flickr.com/services/feeds/photos_public.gne",
      type:'GET',
      dataType:'jsonp',
      jsonp:'jsoncallback',
      data: 'tags='+city+'&tagmode=any&format=json',
      success:function( data) {
      var i = 0;
      $.each( data.items, function(i, item ) {
         if (i < numberOfImages){ 
            addPic(photo = {
                link : item.link,
                media : item.media,
                date_taken : item.date_taken,
                author: item.author,
                author_id: item.author_id,
                title: item.title,
                published: item.published,
                description: item.description,
	    	id: i,
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
    $("<img>").attr("src", photo.media.m.replace("_m.","_q.")).appendTo($("#tableImages")).wrap('<tr id =\"'+photo.id+1000+'\">').wrap('<td>');
    $('<td>'+photo.title+'</td>').appendTo("#"+photo.id+1000);
    $('<td>'+photo.date_taken+'</td>').appendTo("#"+photo.id+1000);
    $('<td>'+photo.author+'</td>').appendTo("#"+photo.id+1000);
    $('</br>').appendTo("#images");
    $('#'+photo.id).on("click",this,function(){
        dialogInformation(photo);
    });
}

function dialogInformation(photo){
        $('<div>').attr("class","ui-dialog").dialog({
            title: photo.title,
            position:{
                of:$('#'+photo.id)
            }});
}

