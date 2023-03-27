<?php
header("Content-Type: application/json");

$iso_code = $_GET['iso_code'];
echo $iso_code;
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://gnews.io/api/v4/top-headlines?lang=en&country=" . $iso_code . "&token=e84aabd947884c050af00e3e26325ada",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => [
        "Accept: application/json"
    ],
]);


$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo json_encode(array('error' => "cURL Error #:" . $err));
} else {
    $data = json_decode($response, true);
    $articles = $data["articles"];
    echo json_encode($articles);
}
?>