<?php

require_once 'config.php';

$url = 'http://api.geonames.org/countryInfoJSON';


$params = array(
    'lang' => 'en',
    'country' => $_POST['iso_code'],
    'username' => $geonames_key, 
);

$ch = curl_init();


curl_setopt($ch, CURLOPT_URL, $url . '?' . http_build_query($params));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);


$response = curl_exec($ch);

if (curl_errno($ch)) {
    $error_msg = curl_error($ch);
    echo json_encode(array('error' => $error_msg));
} else {
    $data = json_decode($response, true);

    $name = $data['geonames'][0]['countryName'];
    $capital = $data['geonames'][0]['capital'];
    $population = $data['geonames'][0]['population'];

    $country_info = array(
        'name' => $name,
        'capital' => $capital,
        'population' => $population,
    );

    echo json_encode($country_info);
}

curl_close($ch);
?>
