var map;

function setupLayer() {
    if(map) {
        map.remove();
        map = null;
    }

    // Setting up the initial API key input
    var key = document.getElementById('keyInput').value;
    var message = document.getElementById('message');
    var instructions = document.getElementById('instructions');

    if(!key) {
        message.classList.add("warning");
        message.textContent = 'To view the map, please enter a valid API key.';
        instructions.classList.remove("hidden");
        return;
    }
    message.classList.remove("warning");
    message.textContent = 'To view the map, please enter a valid API key.';
    instructions.classList.add("hidden");
   
    // This sets up the actual VTS layer
    // Center coordinates are defined in EPSG:3857 lon/lat and we are asking for srs=3857 in the "transformRequest"
    var serviceUrl = "https://api.os.uk/maps/vector/v1/vts"
    var map = L.map('map', {
      maxZoom: 20,
      minZoom: 7
    }).setView([53.2934429, -2.4784419], 9);
    L.control.browserPrint().addTo(map);
    
    var drawnFeatures = new L.FeatureGroup();
    map.addLayer(drawnFeatures);

    var drawControl = new L.Control.Draw({
        position: 'topright',
        edit: {
            featureGroup: drawnFeatures,
            remove: true
        },
        draw: {
		    polygon: {
		     shapeOptions: {
		      color: 'purple'
		     },
		     allowIntersection: false,
		     drawError: {
		      color: 'orange',
		      timeout: 1000
		     },
		    },
		    polyline: {
		     shapeOptions: {
		      color: 'red'
		     },
		    },
		    rect: {
		     shapeOptions: {
		      color: 'green'
		     },
		    },
		    circle: {
		     shapeOptions: {
		      color: 'steelblue'
            }
        }
        }
    });
    map.addControl(drawControl);
 
    
    map.on("draw:created", function(e){
        var type = e.layerType;
        var layer = e.layer;
        console.log(layer)
        drawnFeatures.addLayer(layer);
    });
    
    map.on("draw:edited", function(e){
        var layers = e.layers;
        var type = e.layerType;

        layers.eachLayer(function(layer){
            console.log(layer)
        })
    });


    var gl = L.mapboxGL({
        accessToken: 'no-token',
        style: serviceUrl + '/resources/styles',
        transformRequest: url => {
            if(url.indexOf('?key=') === -1) {
                url += '?key=' + key;
            }
            url += '&srs=3857';
            return {
                url: url
            }
        }
    }).addTo(map);




    map.attributionControl.addAttribution('&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>');
    map.attributionControl.addAttribution('&copy; <a href="http://www.fgplimited.co.uk/">FGP Surevyors Limited</a>');
    
    gl.getMapboxMap().on('error', error => {
        console.log(error);
        message.classList.add("warning");
        message.textContent = 'Could not connect to the API. Ensure you are entering a project API key for a project that contains the OS Vector Tile API';
        instructions.classList.remove("hidden");
    });
}

