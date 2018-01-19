# Dylan's Neighborhood Map

## To run the app:
To run the app, just open index.html in the browser of your choice!

## Explanation
This is my shot at the Udacity neighborhood map project. While it may not be flashy, I'm proud of the work I've done and the functionality I've incorporated.

When this app loads, 10 points of interest are displayed on the map. On the left side of the screen, there are two buttons, Show All and Hide All, which will restore all markers to the map or hide them all, respectively. Clicking on any of these markers will bring up information and a street view for the location.

Below the buttons, a dropdown list can be used to select the type of location you're interested in: *food, entertainment, or shopping*. These will display only markers of the category you choose, as well as list their names below. Handily enough, your selected category is also shown below the dropdown, in the event you forget what you just chose.

I used the Foursquare API to call up the phone number for each location, which is displayed on each marker's infowindow. This was an exercise in frustration but I learned a great deal about third party API documentation and navigation. The implementation may be small, but the learning opportunity was not.


## Sources

- http://knockoutjs.com/documentation/introduction.html

### 1/16/2018

- http://knockoutjs.com/documentation/click-binding.html
- https://developers.google.com/maps/documentation/javascript/markers
- https://www.tutorialspoint.com/knockoutjs/options-binding.htm
- https://stackoverflow.com/questions/24875414/addeventlistener-change-and-option-selection

### 1/17/2018
- https://stackoverflow.com/questions/19586137/addeventlistener-using-for-loop-and-passing-values
- https://stackoverflow.com/questions/27816682/setting-google-maps-api-v3-zoom-level-based-on-screen-device-width
- https://stackoverflow.com/questions/7939063/trying-to-use-json-value-outside-getjson-function

### 1/18/2018
#### Review suggestion fixes:
- https://stackoverflow.com/questions/13664499/how-to-filter-using-a-dropdown-in-knockout
- https://developers.google.com/maps/documentation/javascript/markers#animate
- http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html