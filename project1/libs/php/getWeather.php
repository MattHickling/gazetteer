<?php
    ini_set('display_errors', 'On');
	error_reporting(E_ALL);
    // $countryCode = $_GET["c"];

	$executionStartTime = microtime(true);

	$url='https://restcountries.com/v3.1/alpha/"'. $countryCode;
	//name=countries.name

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);
    $decode = json_decode($result, true);
    $latlng = £decode[0]['latlng'];
	curl_close($ch);


    $url='https://api.openweathermap.org/data/3.0/onecall?lat=' . $latlng . '&lon=' . $latlng[1] . '&appid=4473ba7b37a2cbeb1a3ab44ef32eb0dd';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>