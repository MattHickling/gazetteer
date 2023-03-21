<?php
// Get the ISO code from the POST data
$iso_code = $_POST['iso_code'];

// Build the API URL
$url = "http://api.geonames.org/searchJSON?featureClass=P&country={$iso_code}&maxRows=50&username=matt1883";

// Create a new cURL handle
$ch = curl_init();

// Set the cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
  echo 'Error: ' . curl_error($ch);
  exit();
}

// Decode the JSON response
$data = json_decode($response, true);

// Return the data as JSON
echo json_encode(array('geonames' => $data['geonames']));

// Close the cURL handle
curl_close($ch);
?>
