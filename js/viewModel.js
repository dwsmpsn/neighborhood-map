var map;

// viewModel for use in Knockout bindings
function viewModel() {
  var self = this;

  // array to store created markers
  self.markers = [];

  // an array of categories for use in the dropdown menu
  self.categories = ko.observableArray(['Food', 'Entertainment', 'Shopping'])
  // observable for the dropdown selection to populate
  self.selectedCategory = ko.observable();
  // subscription to the observable which executes a
  //filter based on the selection
  self.selectedCategory.subscribe(function() {
    console.log(self.selectedCategory());
    if (self.selectedCategory() == 'Food') {
      self.switchOn('Food');
    } else if (self.selectedCategory() == 'Entertainment') {
      self.switchOn('Entertainment');
    } else if (self.selectedCategory() == 'Shopping') {
      self.switchOn('Shopping');
    } else {
      self.showAll();
    }
  });

  // a collection of some of my favorite places on the north side
  self.locations = ko.observableArray([
    { 
      title: 'Pequod\'s Pizza', 
      location: {lat: 41.9217965, lng: -87.66430749999999}, 
      type: 'Food'
    },{
      title: 'Kuma\'s Too',
      location: {lat: 41.933072, lng: -87.646153},
      type: 'Food'
    },{
      title: 'Piece Brewery and Pizzeria',
      location: {lat: 41.910484, lng: -87.676154},
      type: 'Food'
    },{
      title: 'Cheesie\'s Pub & Grub',
      location: {lat: 41.940897, lng: -87.653883},
      type: 'Food'
    },{
      title: 'Concord Music Hall',
      location: {lat: 41.918797, lng: -87.690044},
      type: 'Entertainment'
    },{
      title: 'Music Box Theatre',
      location: {lat: 41.950181, lng: -87.663821},
      type: 'Entertainment'
    },{
      title: 'Lincoln Hall',
      location: {lat: 41.925994, lng: -87.649752},
      type: 'Entertainment'
    },{
      title: 'Micro Center',
      location: {lat: 41.930834, lng: -87.682755},
      type: 'Shopping'
    },{
      title: 'Chicago Music Exchange',
      location: {lat: 41.942188, lng: -87.670538},
      type: 'Shopping'
    },{
      title: 'Dave\'s Records',
      location: {lat: 41.929851, lng: -87.643366},
      type: 'Shopping'
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
    var largeInfoWindow = new google.maps.InfoWindow();

    // styling default and highlighted markers
    var foodIcon = self.makeMarkerIcon('0091ff');
    var entertainmentIcon = self.makeMarkerIcon('ff670f');
    var shoppingIcon = self.makeMarkerIcon('20b21e');
    var highlightedIcon = self.makeMarkerIcon('FFFF24');

    // uses the array of locations in model.js to
    // create an array of markers
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
      // push the new marker to the array of markers
      self.markers.push(marker);
    }

  }

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
  }

  // loops through markers array and populates the map
  self.showAll = function() {
    for (var i = 0; i < self.markers.length; i++) {
      self.markers[i].setMap(map);
    }
    // resets selection back to default when showing all
    // locations again
    self.selectedCategory(null);
  }

  // loops through markers array and hides them from the map
  self.hideAll = function() {
    for (var i = 0; i < self.markers.length; i++) {
      self.markers[i].setMap(null);
    }
  }

  // switch on certain marker types
  self.switchOn = function(category) {
    for (var i = 0; i < self.markers.length; i++) {
      if (self.markers[i].category == category) {
        self.markers[i].setMap(map);
      } else {
        self.markers[i].setMap(null);
      }
    }
  }

  self.initMap();
};



ko.applyBindings(new viewModel);

