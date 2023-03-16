<?php

$iso_code = $_POST['iso_code'];

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.newscatcherapi.com/v2/latest_headlines?lang=en&countries=" . $iso_code . "&topic=business",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => [
        "x-api-key: Jtnrm4v2Ovp7Zfa6pakR5f_7etNnj94x-Kg_G0A3dQI"
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo json_encode(["error" => "cURL Error #:" . $err]);
} else {
    $data = json_decode($response, true);
    $result = [];

    foreach ($data['articles'] as $article) {
        $result[] = [
          'title' => $article['title'],
          'description' => $article['description'],
          'image' => $article['media'] ?? '',
          'url' => $article['link'],
        ];
      }
      

    echo json_encode($result);
}
