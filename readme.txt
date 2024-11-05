Display a Geographical Map
[Leaflet.js](https://leafletjs.com/) mapping library

Real-time bus data

Create a solution that will do the following
* Display a map in the browser. 
* Fetch real-time transit data information data from a publicly available API. 
* Filter the raw data to a subset based on specified criteria.
* Convert the filtered API data into GeoJSON format.
* Using the GeoJSON data, plot markers on the map to display the current position of vehicles.
* Add functionality that will cause the map to auto refresh after a certain interval of time.
* Customize the vehicle display markers.

Real-time transit data can be accessed via [Halifax Transit open data](https://www.halifax.ca/home/open-data/halifax-transit-open-data). Halifax Transit has launched the General Transit Feed Specification (GTFS) open data feed to developers as a beta release. This data is used by Google and other third-party developers to create apps for use by the public.

* API Data Endpoint URL: https://prog2700.onrender.com/hrmbuses

This API endpoint will return real-time data for all buses currently in service throughout HRM. The application will need to fetch this data in its raw form and be able to filter the results according to the following criteria.

* Filter requirement: Filter the resulting data so that you keep buses on routes 1-10 only.