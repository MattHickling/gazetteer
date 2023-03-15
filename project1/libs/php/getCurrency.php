
<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);
$executionStartTime = microtime(true);
$iso_code = $_POST["iso_code"];


$url = 'http://api.geonames.org/countryInfoJSON?formatted=true&country=' . $iso_code . '&username=matt1883';


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode['geonames'];
// get currency
$iso_code = $output['data'][0]['currencyCode'];


$curl = curl_init();

curl_setopt_array($curl, [
CURLOPT_URL => "https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency?have=USD&want=" . $iso_code . "&amount=1",
CURLOPT_RETURNTRANSFER => true,
CURLOPT_FOLLOWLOCATION => true,
CURLOPT_ENCODING => "",
CURLOPT_MAXREDIRS => 10,
CURLOPT_TIMEOUT => 30,
CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
CURLOPT_CUSTOMREQUEST => "GET",
CURLOPT_HTTPHEADER => [
"X-RapidAPI-Host: currency-converter-by-api-ninjas.p.rapidapi.com",
"X-RapidAPI-Key: 69b2458fbfmshc6ef36f24cc74d5p14abe0jsnf4b46806325a"
],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
echo "cURL Error #:" . $err;
} else {
echo $response;
}

// $curl = curl_init();

// curl_setopt_array($curl, [
// CURLOPT_URL => "https://openexchangerates.org/api/currencies.json?prettyprint=false&show_alternative=false&show_inactive=false&app_id=ff09f150cd784314ad3f48549d72000a",
// CURLOPT_RETURNTRANSFER => true,
// CURLOPT_ENCODING => "",
// CURLOPT_MAXREDIRS => 10,
// CURLOPT_TIMEOUT => 30,
// CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
// CURLOPT_CUSTOMREQUEST => "GET",
// CURLOPT_HTTPHEADER => [
// "accept: application/json"
// ],
// ]);

// $response = curl_exec($curl);
// $err = curl_error($curl);

// curl_close($curl);

// if ($err) {
// echo "cURL Error #:" . $err;
// } else {
// echo $response;
// }
