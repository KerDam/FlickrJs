var mymap = null;
var table;
$('document').ready(function(){

    // onglets
    $('#tabs').tabs();

    // DatePicker
    $('#datepicker').datepicker({ dateFormat: 'yy-mm-dd' });
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
    if (mymap != null){
        mymap.remove();
    }
    $('#mapid').children().remove();
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
    var date = ""
        if ($('#datepicker').datepicker("getDate") != null ){
            date = "&min_taken_date="+$('#datepicker').val()+" 00:00:00";
        }
    $.ajax({
        url: "https://api.flickr.com/services/rest/?method=flickr.photos.search",
        type:'GET',
        dataType:'jsonp',
        jsonp:'jsoncallback',
        data: 'api_key=7f08914a17a2acd4ddbc14a70ba1df7a&format=json&tags='+city+'&extras=media,geo,date_taken,url_q,description,owner_name&per_page='+numberOfImages+date,
        success:function( data) {
            if(data.photos.total != 0){
                var i = 0;
                var imgArray = [];
                var mapSet = false;
                $.each( data.photos.photo, function(i, item ) {
                    if (i < numberOfImages){ 
                        if (item.latitude != 0 && item.longitude != 0){
                            if (mapSet != true){
                                mapInit([item.latitude, item.longitude]);
                                mapSet = true;
                            }
                            addToMap([item.latitude, item.longitude], '<p>'+item.title+'</p><img src="'+item.url_q+'"></img>');
                        }

                        item.quality = qualityImages;
                        addPic(item);
                        imgArray.push([ 
                                "<img src ='" + item.url_q + "''>", 
                                item.title, 
                                item.datetaken, 
                                item.ownername
                        ]);
                        i++;
                    }
            });
            }
            else{
                alert('No photos are matching');
            }

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
    $("<img>").attr("src",photo.url_q.replace("_q.","_"+photo.quality+".")).attr("id",photo.id).appendTo("#images");
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
        var information = $('<div><p>Author:'+photo.ownername+'</p><p>Date:'+photo.datetaken+'</p></div>');
        information.appendTo('<div>').attr("class","ui-dialog").dialog({
            title: photo.title,
            p : photo.description,
            position:{
                of:$('#'+photo.id)
            }});
    }
/*
   Function: mapInit
   This function will initiate the map

   Parameters:
   coordonates - the coordonates to initialise the map
   */
                function mapInit(coordonates){
                    $('#mapid').css("height","300px");
                    mymap = L.map('mapid').setView(coordonates, 11);
                    L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            maxZoom: 18,
                            }).addTo(mymap);
                }

/*
   Function: addToMap
   this function will add a marker to the map

   Parameters: 
   coordonates - The coordonates of the marker
   informations - The informations that will be diplayed

*/
            function addToMap(coordonates, informations){
                var marker = L.marker(coordonates).addTo(mymap);
                marker.bindPopup(informations);
            }
