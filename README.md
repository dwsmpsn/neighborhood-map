#### Note:
- Google API is not loaded synchronously because after porting my js work into the knockout format, I kept getting a "google is not defined error". The only way I could fix it was to make sure the API loaded before the JS files.
  - update: it was working asynchronously and then stopped again. I have no idea what the issue is and cannot find a solution.

### Sources

- http://knockoutjs.com/documentation/introduction.html

## 1/16/2018

- http://knockoutjs.com/documentation/click-binding.html
- https://developers.google.com/maps/documentation/javascript/markers
- https://www.tutorialspoint.com/knockoutjs/options-binding.htm
- https://stackoverflow.com/questions/24875414/addeventlistener-change-and-option-selection

## 1/17/2018
- https://stackoverflow.com/questions/19586137/addeventlistener-using-for-loop-and-passing-values
- https://stackoverflow.com/questions/27816682/setting-google-maps-api-v3-zoom-level-based-on-screen-device-width
- https://stackoverflow.com/questions/7939063/trying-to-use-json-value-outside-getjson-function