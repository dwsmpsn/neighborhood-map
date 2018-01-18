var map;
var largeInfoWindow;
var clientID = 'LERAAYP3BV01BQZY0FLIBIBCM0U40FZEWLLEL03C2QR0NI2V';
var clientSecret = '1TZ0ZLXEZ33DA3E2KF3MLMYHL2DDSWQGS10EW1L0ZG2BVQ1L';

// viewModel for use in Knockout bindings
function ViewModel() {
  var self = this;

  // array to store created markers
  self.markers = ko.observableArray([]);

  // an array of categories for use in the dropdown menu
  self.categories = ko.observableArray(['Food', 'Entertainment', 'Shopping']);
  // observable for the dropdown selection to populate
  self.selectedCategory = ko.observable('');
  self.visibleLocations = ko.observableArray([]);

  self.filteredList = ko.computed(function() {
    var filter = self.selectedCategory();
    if (!filter) {
      for (var i = 0; i < self.markers().length; i++) {
        self.markers()[i].setMap(map);
      }
      return self.markers();
    } else {
      for (var i = 0; i < self.markers().length; i++) {
        if (self.markers()[i].category != filter) {
          self.markers()[i].setMap(null);
        } else {
          self.markers()[i].setMap(map);
        }
      }
      return ko.utils.arrayFilter(self.markers(), function(i) {
        return i.category == filter;
      });
    }
  });


  // a collection of some of my favorite places on the north side
  self.locations = ko.observableArray([
    { 
      title: 'Pequod\'s Pizza', 
      location: {lat: 41.921914, lng: -87.664307}, 
      type: 'Food',
    },{
      title: 'Kuma\'s Too',
      location: {lat: 41.933072, lng: -87.646153},
      type: 'Food',
    },{
      title: 'Piece Brewery and Pizzeria',
      location: {lat: 41.910484, lng: -87.676154},
      type: 'Food',
    },{
      title: 'Cheesie\'s Pub & Grub',
      location: {lat: 41.940897, lng: -87.653883},
      type: 'Food',
    },{
      title: 'Concord Music Hall',
      location: {lat: 41.918797, lng: -87.690044},
      type: 'Entertainment',
    },{
      title: 'Music Box Theatre',
      location: {lat: 41.950181, lng: -87.663821},
      type: 'Entertainment',
    },{
      title: 'Lincoln Hall',
      location: {lat: 41.925994, lng: -87.649752},
      type: 'Entertainment',
    },{
      title: 'Micro Center',
      location: {lat: 41.930364, lng: -87.683174},
      type: 'Shopping',
    },{
      title: 'Chicago Music Exchange',
      location: {lat: 41.942188, lng: -87.670538},
      type: 'Shopping',
    },{
      title: 'Dave\'s Records',
      location: {lat: 41.929851, lng: -87.643366},
      type: 'Shopping',
    }
  ]);


  // function to initialize map
  self.initMap = function() {
    // this constructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 41.932272, lng: -87.668119},
      zoom: 14
    });

    // instantiating an infowindow variable
    largeInfoWindow = new google.maps.InfoWindow();


    // styling default and highlighted markers
    var foodIcon = self.makeMarkerIcon('0091ff');
    var entertainmentIcon = self.makeMarkerIcon('ff670f');
    var shoppingIcon = self.makeMarkerIcon('20b21e');
    var highlightedIcon = self.makeMarkerIcon('FFFF24');

    // uses the array of locations to create an array of markers
    // added anonymous function for closure
    self.createMarkerArray = function() {
      for (var i = 0; i < self.locations().length; i++) {
        var resultIcon;
        if (self.locations()[i].type === 'Food') {
          resultIcon = foodIcon;
        } else if (self.locations()[i].type === 'Entertainment') {
          resultIcon = entertainmentIcon;
        } else {
          resultIcon = shoppingIcon;
        }
        
        // get the location from the array
        var position = self.locations()[i].location;
        var title = self.locations()[i].title;
        // grabbing the location category
        var category = self.locations()[i].type;
        // create a marker for each location and push to array
        var marker = new google.maps.Marker({
          map: map,
          position: position,
          title: title,
          category: category,
          icon: resultIcon,
          animation: google.maps.Animation.DROP,
          id: i
        });

        // event listener to open the infowindow for the marker
        marker.addListener('click', self.populateWorkaround());

        // listener events to highlight markers
        marker.addListener('mouseover', self.setIconWorkaround(highlightedIcon));
        marker.addListener('mouseout', self.setIconWorkaround(resultIcon));
        // push the new marker to the array of markers
        self.markers().push(marker);
      }

      
    };

    self.createMarkerArray();
    // calling show all to populate markers and side list
    self.showAll();
  };

  self.populateWorkaround = function() {
    return function() {
      self.populateInfoWindow(this, largeInfoWindow);
    };
  }

  self.setIconWorkaround = function(icon) {
    return function() {
      this.setIcon(icon);
    };
  }

  // function to populate the infowindow when a marker is clicked
  self.populateInfoWindow = function(marker, infowindow) {
    // checking to make sure there's no existing infowindow open
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('');
      // clear out marker property when infowindow closes
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // if status is OK, compute position of streetview image, calculate heading,
      // get panorama from that
      self.getStreetView = function(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
          //infowindow.setContent('<div>' + marker.title + 
          //  '</div><div id="pano"></div>');



          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 10
            }
          };

          // FOURSQUARE EXPERIMENTING
          // my map center Lat/Long, just to use for proximity
          var near = '41.932272,-87.668119';
          var name = marker.title;
          // stripping the spaces out of the venue name
          name = name.replace(/\s/g, '');
          // constructing the URL that will make the API call
          var requestURL = 'https://api.foursquare.com/v2/venues/search?ll=' +
            near + '&client_id=' + clientID + '&client_secret=' + clientSecret + 
            '&query=' + name + '&v=20180117';

          // a very frustrating exercise in Foursquare API usage,
          // but I survived.
          $.getJSON(requestURL).done(function(input) {
            var venuePhone = input.response.venues[0].contact.formattedPhone;
            infowindow.setContent('<div>' + marker.title + 
              '</div><div id="pano"></div><div>Phone Number: <span id="phone">' +
              venuePhone + '</span></div>');
            // putting the panorama in the infowindow
            var panorama = new google.maps.StreetViewPanorama(
              document.getElementById('pano'), panoramaOptions);
          }).fail(function() {
            console.log('oops');
          });
          // END FOURSQUARE EXPERIMENT //

          
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' + 
            '<div>No Street View Found</div>');
        }
      };


      // use streetview service to get closest image within 50m of marker
      streetViewService.getPanoramaByLocation(marker.position, radius, self.getStreetView);
      // open infowindow on correct marker
      infowindow.open(map, marker);
    }
  };

  // creates a new marker icon
  self.makeMarkerIcon =function(markerColor) {
    var markerImage = new google.maps.MarkerImage('http://chart.' + 
      'googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + 
      markerColor + '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
    return markerImage;
  };

  // loops through markers array and populates the map
  self.showAll = function() {
    var listItems = '';
    for (var i = 0; i < self.markers().length; i++) {
      self.markers()[i].setMap(map);
      listItems += '<li>' + self.markers()[i].title + '</li>';
    }
    // resets selection back to default when showing all
    // locations again
    self.selectedCategory(null);
    //document.getElementById('visibleLocations').innerHTML = listItems;
  };

  // loops through markers array and hides them from the map
  self.hideAll = function() {
    for (var i = 0; i < self.markers().length; i++) {
      self.markers()[i].setMap(null);
    }
    //document.getElementById('visibleLocations').innerHTML = null;
  };


  google.maps.event.addDomListener(window, 'load', self.initMap);
  google.maps.event.addDomListener(window, 'resize', function() {
    var center = map.getCenter();
    var bounds = new google.maps.LatLngBounds();
    // extend the boundaries of the map for each marker
    for (var i = 0; i < self.markers().length; i++) {
      bounds.extend(self.markers()[i].position);
    }
    map.fitBounds(bounds);
    // move center of map with window resize
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center);
  });

}



ko.applyBindings(new ViewModel());

