var map = null;

var system;

//if there is a system parameter with another system
name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
var regexS = "[\\?&]system=([^&#]*)";
var regex = new RegExp( regexS );
var results = regex.exec( window.location.href );
if( results == null )
    system = "NMBS";
else
    system = results[1];

// initialise the 'map' object
function init() {

  // start position for the map (hardcoded here for simplicity)
  var lat = 50.9;
  var lon = 4.3;
  var zoom = 9; 

  // complex object of type OpenLayers.Map
  map = new OpenLayers.Map('map');
  var layerTileNL = new OpenLayers.Layer.OSM("OpenStreetMap", "http://tile.openstreetmap.nl/tiles/${z}/${x}/${y}.png", {numZoomLevels: 19});
  
  var halteStyleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({fillColor: "orange", fillOpacity: 0.5, strokeColor: "red", pointRadius: 5}, OpenLayers.Feature.Vector.style["default"]));


  var haltes = new OpenLayers.Layer.GML("Haltes", "http://dev.api.irail.be/stations/?format=kml&system="+system, 
                                {
				  styleMap: halteStyleMap,
                                  projection: new OpenLayers.Projection("EPSG:4326"),
                                  format: OpenLayers.Format.KML
                                });
    map.addLayers([layerTileNL, haltes]);
  
  selectControl = new OpenLayers.Control.SelectFeature(haltes, {onSelect: onFeatureSelect, onUnselect: onFeatureUnselect});
  map.addControl(selectControl);
  selectControl.activate();

  // center map
  if (!map.getCenter()) {
    map.setCenter(new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()), zoom);
  }

}

function onFeatureUnselect(feature) {
  map.removePopup(feature.popup);
  feature.popup.destroy();
  feature.popup = null;
}

function onPopupClose(evt) {
  selectControl.unselect(selectedFeature);
}

function queryGovi(tpc) {
    /* Zou natuurlijk nog mooier zijn om deze requests asynchroon te doen */
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET","http://api.irail.be/liveboard/?id="+tpc+"&system="+system,false);
    xmlhttp.send();
    xmlDoc=xmlhttp.responseXML;

    output = '';
    trips = xmlDoc.getElementsByTagName("departure");
    for (i = 0; i < trips.length; i++)
    {
        name      = trips[i].getElementsByTagName("station")[0].childNodes[0].nodeValue;
	expected_date= new Date(trips[i].getElementsByTagName("time")[0].childNodes[0].nodeValue * 1000);
        expected  = addzero(expected_date.getHours()) + ":" + addzero(expected_date.getMinutes());
	delay = trips[i].getAttribute("delay");
	delay = Math.floor(delay/60);
        if(delay >0){
            output   += '<b>'+expected+' <font color="red">+' + delay + '\'</font>' + '</b>' + '&nbsp;'+ name + '<br />';
	}else{
            output   += '<b>'+expected+'</font>' + '</b>' + '&nbsp;'+ name + '<br />';
	}

    }
    return output;
}

function addzero(i){
    if (i<10){
	i="0" + i;
    }
    return i;
}

function onFeatureSelect(feature) {
  selectedFeature = feature;

  popup = new OpenLayers.Popup.FramedCloud("chicken", 
                                     feature.geometry.getBounds().getCenterLonLat(),
                                     new OpenLayers.Size(400,200),
                                     "<div style='font-size:.8em; width: auto;'><h3>"+feature.attributes.name+"</h3>"+queryGovi(feature.fid)+"</div>",
                                     null, true, onPopupClose);
        
  
  feature.popup = popup;
  map.addPopup(popup);
  popup.autoSize = true; 
}
