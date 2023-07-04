var img = [2400, 1600]

var minZoom = 3.35
var maxZoom = 6

var map = L.map("map", {
	crs: L.CRS.Simple,
	minZoom,
	maxZoom,
})

var rc = new L.RasterCoords(map, img)

L.control
	.layers(
		{},
		{
			Info: layerGeo(map, rc),
		}
	)
	.addTo(map)

function layerGeo(map, rc) {
	var imgDir = "img/"
	var markerCommon = {
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [-0, -41],
		shadowUrl: imgDir + "marker-shadow.png",
		shadowSize: [41, 41],
		shadowAnchor: [14, 41],
	}
	var redMarker = L.icon({ ...markerCommon, iconUrl: imgDir + "marker-icon-red.png" })
	var blueMarker = L.icon({ ...markerCommon, iconUrl: imgDir + "marker-icon.png" })
	var layerGeo = L.geoJson(
		[
			{
				type: "Feature",
				properties: {
					name: "Mare Germanicum",
					status: 1,
					detail: "lorem ipsum",
				},
				geometry: {
					type: "Point",
					coordinates: [1200, 800],
				},
			},
			{
				type: "Feature",
				properties: {
					name: "Mare Balticum",
					detail: "lorem ipsum",
					status: 1,
				},
				geometry: {
					type: "Point",
					coordinates: [1690, 1107],
				},
			},
			{
				type: "Feature",
				properties: {
					name: "Mare Mediteraneum",
					status: 0,
				},
				geometry: {
					type: "Point",
					coordinates: [1028, 453],
				},
			},
			{
				type: "Feature",
				properties: {
					name: "Mare Maggiore",
					status: 0,
				},
				geometry: {
					type: "Point",
					coordinates: [2023, 518],
				},
			},
		],
		{
			// correctly map the geojson coordinates on the image
			coordsToLatLng: function (coords) {
				return rc.unproject(coords)
			},
			// add a popup content to the marker
			onEachFeature: function (feature, layer) {
				if (feature.properties && feature.properties.name) {
					layer.bindPopup(
						"<p><b>" +
							feature.properties.name +
							"</b><br />" +
							feature.properties.detail +
							"</p>"
					)
				}
			},
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {
					icon: feature.properties.status === 1 ? blueMarker : redMarker,
				})
			},
		}
	)
	map.addLayer(layerGeo)
	return layerGeo
}

map.setView(rc.unproject([img[0], img[1]]), 2)

L.tileLayer("./img/tiles/{z}/{x}/{y}.png", {
	noWrap: true,
	bounds: rc.getMaxBounds(),
	maxNativeZoom: rc.zoomLevel(),
}).addTo(map)
