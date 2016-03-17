QUnit.test( "test generation url", function( assert ) {
  assert.equal(urlJSON("Nantes"), "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d797caba5a23f4bfd58c5f0fb798b1ab&tags=Nantes&format=json&nojsoncallback=1");
  //assert.equal(getJSON(urlJSON("Nantes")).photos.photo[0].title, "Nantes Museum of Natural History");
  //alert(getJSON("nantes"));
    getJSON("nantes");
});
