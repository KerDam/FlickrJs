QUnit.test( "test generation url", function( assert ) {
  assert.equals(urlJSON("nantes"), "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=5945c3497beb97d690ae3d0579f0eb3d&tags=nantes&format=json&nojsoncallback=1&api_sig=87008093508a640c3b1a29eddc2bc76f");
});
