var map;
var largeInfoWindow;
var clientID = "LERAAYP3BV01BQZY0FLIBIBCM0U40FZEWLLEL03C2QR0NI2V";
var clientSecret = "1TZ0ZLXEZ33DA3E2KF3MLMYHL2DDSWQGS10EW1L0ZG2BVQ1L";

// styling default and highlighted markers
var foodIcon;
var entertainmentIcon;
var shoppingIcon;
var highlightedIcon;

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
      for (i = 0; i < self.markers().length; i++) {
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

  self.selectedListItem = function(item) {
    var marker = item;
    self.populateInfoWindow(marker, largeInfoWindow);
    for (var i = 0; i < self.markers().length; i++) {
      if (self.markers()[i] == marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      } else {
        self.markers()[i].setAnimation(null);
      }
    }
  };


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
    foodIcon = self.makeMarkerIcon('0091ff');
    entertainmentIcon = self.makeMarkerIcon('ff670f');
    shoppingIcon = self.makeMarkerIcon('20b21e');
    highlightedIcon = self.makeMarkerIcon('FFFF24');

    // creating the marker array -- I removed the for loop inside and then 
    // created a separate for loop to run the function in afterwards
    self.createMarkerArray = function(index) {
      var resultIcon;
      if (self.locations()[index].type === 'Food') {
        resultIcon = foodIcon;
      } else if (self.locations()[index].type === 'Entertainment') {
        resultIcon = entertainmentIcon;
      } else {
        resultIcon = shoppingIcon;
      }
      
      // get the location from the array
      var position = self.locations()[index].location;
      var title = self.locations()[index].title;
      // grabbing the location category
      var category = self.locations()[index].type;
      // create a marker for each location and push to array
      var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        category: category,
        icon: resultIcon,
        origIcon: resultIcon,
        animation: google.maps.Animation.DROP,
        id: index
      });

      // function to toggle bouncing animation on markers
      self.toggleBounce = function() {
        // loop to turn off any other bounce animations when a new
        // marker is selected
        for (var i = 0; i < self.markers().length; i++) {
          self.markers()[i].setAnimation(null);
        }
        // if marker is bouncing, stop it
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          // if it isn't bouncing, start it
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      };

      // event listener to open the infowindow for the marker
      marker.addListener('click', self.populateWorkaround());
      marker.addListener('click', self.toggleBounce);

      // listener events to highlight markers
      marker.addListener('mouseover', self.setIconWorkaround(highlightedIcon));
      marker.addListener('mouseout', self.setIconWorkaround(resultIcon));
      // push the new marker to the array of markers
      self.markers().push(marker);
    };

    for (var i = 0; i < self.locations().length; i++) {
      self.createMarkerArray(i);
    }
    // calling show all to populate markers and side list
    self.showAll();
  };


  self.populateWorkaround = function() {
    return function() {
      self.populateInfoWindow(this, largeInfoWindow);
    };
  };

  self.setIconWorkaround = function(icon) {
    return function() {
      this.setIcon(icon);
    };
  };


  // function to populate the infowindow when a marker is clicked
  self.populateInfoWindow = function(marker, infowindow) {
    // checking to make sure there's no existing infowindow open
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('');
      // clear out marker property when infowindow closes
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
        marker.setAnimation(null);
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
            window.alert('Foursquare information could not be retrieved. Please refresh to try again.');
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
    for (var i = 0; i < self.markers().length; i++) {
      self.markers()[i].setMap(map);
    }
    // resets selection back to default when showing all
    // locations again
    self.selectedCategory(null);
  };

  // loops through markers array and hides them from the map
  self.hideAll = function() {
    self.selectedCategory(null);
    for (var i = 0; i < self.markers().length; i++) {
      self.markers()[i].setMap(null);
    }
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

