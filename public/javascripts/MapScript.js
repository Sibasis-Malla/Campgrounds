
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: JSON.parse(mapCoordinates), // starting position [lng, lat]
zoom: 8 // starting zoom
});

const marker = new mapboxgl.Marker()
.setLngLat(JSON.parse(mapCoordinates))

.addTo(map);
//console.log(mapCoordinates)
