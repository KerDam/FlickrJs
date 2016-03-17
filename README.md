#A simple web application that will get the pictures from Flickr that match the city you enter

##What is used
We are using JQuery for ajax request mainly
##How does it works
An ajax query for autocompletion of the city, and then the parameters are send to a new fonction that will get the JSON from flickr API, this JSON contains all the data needed to get the pictures and then request the pictures with a GET request
