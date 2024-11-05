
/*
    Name: Hang Ngo
    Date: March 5, 2024
    References:  https://leafletjs.com/examples/geojson/
                https://maptimeboston.github.io/leaflet-intro/

 */

(function(){
    //create map in leaflet and tie it to the div called 'theMap'
    const map = L.map('theMap').setView([44.650627, -63.597140], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

 // Function to update bus positions on the map
 function updateBusPositions() {
    fetch('https://prog2700.onrender.com/hrmbuses')
        .then((response) => {
        if (!response.ok){
            throw new Error('There is an error in response! Maybe there is a problem of network');
        }
       return response.json();
    })
        .then((json) => {
            // Filter bus routes 1-10
            let busRoute = json.entity.filter((data) => {
                //replace the route that contains letter from a-->z, then parseInt the number
                let routeId = parseInt(data.vehicle.trip.routeId.replace(/[a-zA-Z]/g, ''));
                //console.log("this is list of route IDs:" + routeId);  
                if (routeId<11){//check if the number is less than 11
                    //console.log(routeId);
                    return routeId;}//return the routeId
            });
            console.log("THIS IS DATA FILTER OF BUS ROUTE 1-10:");
            console.log(busRoute);

             //call function convertToGeoJSOn to convert the filterd bus data into GeoJSON format
             const geoJSONData = convertToGeoJSON(busRoute);
             console.log("THIS IS GEOJSON DATA:");
             console.log(geoJSONData);

            // Clear existing markers
            map.eachLayer(layer => { //iterates over each layer currently added to the Leaflet map ('map'). It uses the 'eachLayer' method provided by Leaflet to iterate through all layers
                if (layer instanceof L.Marker) {//check if the current layer is an instance of L.Marker. this condition ensures that only marker layers are considered for removal
                    map.removeLayer(layer);// if the current layer is a marker(L.Marker), it removes that layer from the map using the 'removeLayer' method provided by Leaflet.
                    // This effectively clears all existing marker layers from the map.
                }
            });

            // Add markers for each bus with custom bus icon using map function
            const busIcon = L.icon({
                iconUrl: 'bus.png', // link to bus image
                iconSize: [32, 32], // size of image
                iconAnchor: [16, 16], // anchor point
            });

           
            //Plot the GeoJson data on the map
            L.geoJSON(geoJSONData, { // this fuction call creates a new GeoJSON layer from the provided GeoJSON Data. This layer will contain all the features defined in GeoJson data
                pointToLayer: function (feature, latlong){ //pointToLayer: callback function to allows customization of how points are rendered on the map. 
                                                                                                              
                    return L.marker(latlong,{ //this line create a LeafLet marker at the specificed latlong with a custom icon (busIcon). it then binds a popup to the marker
                        icon: busIcon, //using custom vehicle icon
                        rotationAngle: feature.properties.direction //rotate marker based on direction
                    }).bindPopup(`Bus ID: ${feature.properties.busId} <br> Route: ${feature.properties.routeId}` );
                    //bindPopup: this method attaches a popup to the marker. Display routeId and BusId 
                }
            }).addTo(map); // Adds the GeoJSON layer (containing all the markers ) to the Leaflet map, so the markers will be displayed on the map

        })
        .catch((error) => {
            console.error('Error fetching bus data:', error);
        });
}


// Convert the filtered API data into GeoJSON format : REFERENCE: https://leafletjs.com/examples/geojson/
function convertToGeoJSON (busData) // this function takes filtered bus data as input
{
    const features = busData.map(bus => { //iterates through each bus in busData and constructs a GeoJSOn feature for each bus
        const { latitude, longitude } = bus.vehicle.position; // for each bus, create a point geometry using the latitude and longitude coordinates
       
        const direction = bus.vehicle.position.bearing || 0; //Extract 'bearing' infos: represents the direction in which the vehicle is moving relative to True North, often expressed in degrees
        return {
            type: 'Feature', //This specifies the type of GeoJSON object being created, which is a Feature. A GeoJSON feature represents a spatially bounded entity. 
                            //It typically includes a geometry (the shape or location) and associated properties (attributes or metadata)
            geometry: {//this property defines the geometric shape or location of the feature. In this case, it specifies a point geometry using the Point type.
                type: 'Point',//Indicates that the geometry represents a point. 
                coordinates: [longitude, latitude] //This specifies the coordinates of the point.
                                                    //So, [longitude, latitude] indicates the exact position of the bus on the map.
                                                    
            },
            properties: { //assign propterties for each feature, for example: busId, routeId, direction
                busId: bus.vehicle.vehicle.id,
                routeId: bus.vehicle.trip.routeId,
                direction: direction 
            }
        };
    }).filter(Boolean);  // Remove any null values from the array
    return {
        type: 'FeatureCollection', // specifies the type of the GeoJSON object being returned, which is a FeatureCollection. A GeoJSON FeatureCollection is an object that represents a collection of GeoJSON features
        features: features //this line assigns the 'features' property to an array called 'features', this array hold all the GeoJson features constructed earlier in the function. Each feature represents a bus and its properties

    };
}

    console.log('Auto refresh initiated');
    //call the updateBusPositions function
    updateBusPositions();
    //refresh the map every 7 seconds
    setInterval(updateBusPositions, 7000);
    console.log('Auto refresh completed');
  
})();