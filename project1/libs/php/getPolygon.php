<?php

if (isset($_POST['iso_code'])) {

  $isoCode = $_POST['iso_code'];

 
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, "libs/php/json/countryBorders.geo.json");
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  $output = curl_exec($ch);
  curl_close($ch);


  $data = json_decode($output, true);
  foreach ($data['features'] as $feature) {
    
    if ($feature['properties']['iso_a2'] == $isoCode) {
      $coordinates = $feature['geometry']['coordinates'];
      
      
      echo json_encode($coordinates);
      break;
    }
  }
}

?>


