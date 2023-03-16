<?php

// Get the latitude and longitude coordinates from the URL parameters
$lat = $_GET['lat'];
$lng = $_GET['lng'];

// Use the OpenCage API to reverse geocode the coordinates into a two-character ISO code
$opencage_key = "aa2b92718386464a8fb461ba54715c53";
$url = 'https://api.opencagedata.com/geocode/v1/json?q=' . $lat . '+' . $lng . '&key=' . $opencage_key;
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$geo_data = json_decode($response, true);
$iso_code = $geo_data['results'][0]['components']['ISO_3166-1_alpha-2'];

// Retrieve the geometry for the polygon from the GeoJSON file
$geojson_file = './countryBorders.geo.json';
$geojson_data = file_get_contents($geojson_file);
$geojson = json_decode($geojson_data, true);

foreach ($geojson['features'] as $feature) {
  if ($feature['properties']['iso_a2'] == $iso_code) {
    $polygon_geometry = $feature['geometry'];
    break;
  }
}

// Use the polygon geometry however you need to
header('Content-Type: application/json; charset=UTF-8');

// Print the geometry object
echo json_encode($polygon_geometry);

?>
