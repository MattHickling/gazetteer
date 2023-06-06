<?php
include 'config.php';

$url = 'http://api.geonames.org/countryInfoJSON';

$params = array(
    'lang' => 'en',
    'country' => $_POST['iso_code'],
    'username' => $username,
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
    $population = number_format($data['geonames'][0]['population'] / 1000000, 2, '.', ',') . ' million';
    $continent = $data['geonames'][0]['continentName'];
    $countryCode = $data['geonames'][0]['countryCode'];
    $area = number_format($data['geonames'][0]['areaInSqKm']);

    $country_info = array(
        'name' => $name,
        'capital' => $capital,
        'population' => $population,
        'continent' => $continent,
        'countryCode' => $countryCode,
        'area' => $area,
    );

    echo json_encode($country_info);
}

curl_close($ch);
?>
