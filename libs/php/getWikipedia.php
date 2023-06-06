<?php 

$iso_code = strtoupper($_GET['iso_code']); // Convert to uppercase

if ($iso_code === 'GB') {
    $summary = "";
    $wikipediaLink = "https://en.wikipedia.org/wiki/Great_Britain";

    // Geonames API endpoint URL for Great Britain
    $gb_url = "http://api.geonames.org/wikipediaSearchJSON?q=Great%20Britain&maxRows=1&lang=en&username=matt1883";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $gb_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);

    if (!empty($data['geonames'][0])) {
        $summary = $data['geonames'][0]['summary'];
        $wikipediaLink = $data['geonames'][0]['wikipediaUrl'];
    }
} else {
    $rest_countries_url = "https://restcountries.com/v3/alpha/{$iso_code}";
    $rest_countries_response = file_get_contents($rest_countries_url);
    $rest_countries_data = json_decode($rest_countries_response, true);

    $latitude = $rest_countries_data[0]['latlng'][0];
    $longitude = $rest_countries_data[0]['latlng'][1];

    $url = "http://api.geonames.org/wikipediaBoundingBoxJSON?south={$latitude}&north={$latitude}&east={$longitude}&west={$longitude}&maxRows=1&lang=en&username=matt1883&feature=country&country={$iso_code}";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);

    if (!empty($data['geonames'][0])) {
        $summary = $data['geonames'][0]['summary'];
        $wikipediaLink = $data['geonames'][0]['wikipediaUrl'];
    } else {
        $summary = null;
        $wikipediaLink = null;
    }
}

$responseData = array(
    'summary' => $summary,
    'wikipediaLink' => $wikipediaLink
);

header('Content-Type: application/json');
echo json_encode($responseData);
