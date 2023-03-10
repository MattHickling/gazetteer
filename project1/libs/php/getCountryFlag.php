<?php
$iso_code = $_GET['iso_code']; // Get the ISO code from the query parameter
$url = 'https://restcountries.com/v2/alpha/' . $iso_code;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

if ($response) {
    $country_data = json_decode($response);
    $flag_url = $country_data->flag;
    $response_data = array('flag_url' => $flag_url);
    header('Content-Type: application/json');
    echo json_encode($response_data);
} else {
    echo 'Failed to retrieve country data.';
}

?>

