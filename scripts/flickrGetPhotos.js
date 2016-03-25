var table

$('document').ready(function(){

  // onglets
  $('#tabs').tabs();

  // auto completion
  $('#inputCity').autocomplete({
    source: function(request, response){
      var url = "http://infoweb-ens/~jacquin-c/codePostal/commune.php";
      $.getJSON(url + "?commune=" + request.term + "&maxRows=100",  function( data ){
        response($.map(data, function (v, k) {
          return {
            label: v.Ville
          };
        }));
      });
    },
    select: function(event, ui){
      removeImages();
      photos = getJSON(ui.item.value,
        $('#nbImages').val(),
        $('#quality').val()
      );
    }
  });

  // recherche
  $('#submitCity').on("click",this,function(){
    removeImages();
    photos = getJSON($('#inputCity').val(),
      $('#nbImages').val(),
      $('#quality').val());
  });
  
  // table view
  table = $('#tableImages').dataTable({
    "autoWidth": false,
    columns: [
      { title: "Photo"},
      { title: "Name"},
      { title: "Date"},
      { title: "Author"}
    ]
  });

});

/* 
    Function: removeImages

    Will remove all the useless balise before getting images from Flickr

*/
function removeImages(){
  $("td").remove();
  $("tr").remove();
  $("#images").children().remove();
  $(".ui-dialog").remove();
}

/*
    Function: getJSON

    Will get a json file from the flickr api and parse it so it can add photo

    Parameters:
        city - the name of the city you want to search
        numberOfImages - the maximum of Images you want
        quality - the differents quality are m(bad) q(high) z(very high)

    Returns:
        At the end this function will call addPic
    See Also:
        <addPic>
*/
function getJSON (city, numberOfImages, qualityImages){
  $.ajax({
    url: "http://api.flickr.com/services/feeds/photos_public.gne",
    type:'GET',
    dataType:'jsonp',
    jsonp:'jsoncallback',
    data: 'tags='+city+'&tagmode=any&format=json',
    success:function( data) {
      var i = 0;
      var imgArray = [];
      $.each( data.items, function(i, item ) {
       if (i < numberOfImages){ 
        item.id = i;
        item.quality = qualityImages;
        addPic(item);
        imgArray.push([ 
          "<img src ='" + item.media.m.replace("_m.","_q.") + "''>", 
          item.title, 
          item.date_taken, 
          item.author
        ]);
        i++;
        }
      });

      table.fnClearTable();
      table.fnAddData(imgArray);
    },
    error:function(){
      alert("fail");
    }
  });
}

/*
    Function: addPic

    This will append a <img> balise to the document

    Parameters: 
    photo - the object photo that contains the informations necessary to create the balise

    Return:
    call the function dialogInformation

    See Also:
    <dialogInformation>
*/
function addPic(photo){
  $("<img>").attr("src",photo.media.m.replace("_m.","_"+photo.quality+".")).attr("id",photo.id).appendTo("#images");
  // $("<img>").attr("src", photo.media.m.replace("_m.","_q.")).appendTo($("#tableImagesBody")).wrap('<tr id =\"'+photo.id+1000+'\">').wrap('<td>');
  // $('<td>'+photo.title+'</td>').appendTo("#"+photo.id+1000);
  // $('<td>'+photo.date_taken+'</td>').appendTo("#"+photo.id+1000);
  // $('<td>'+photo.author+'</td>').appendTo("#"+photo.id+1000);
  // $('</br>').appendTo("#images");
  $('#'+photo.id).on("click",this,function(){
    dialogInformation(photo);
  });
}

/*
    Function: dialogInformation

    A function that will append a jquery ui dialog to the document on the specific photo

    Parameters: 
    photo - the object containning all the information to append to the img balise
*/
function dialogInformation(photo){
    var information = $('<div><p>Author:'+photo.author+'</p><p>Date:'+photo.date_taken+'</p><a href="maps.html?id='+getId(photo)+'"><p>maps</p></a></div>');
    information.appendTo('<div>').attr("class","ui-dialog").dialog({
    title: photo.title,
    p : photo.description,
    position:{
      of:$('#'+photo.id)
    }});
}

/*
	Function: getId

       	This function will return the ID of a photo, this function will be used to get maps informations of the photo

	Parameters:
	photo - the photo you want the id 
*/
function getId(photo){
	var splited =  photo.media.m.split("_");
	return splited[1];
}
