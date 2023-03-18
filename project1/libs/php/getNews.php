
<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if (!isset($_GET['iso_code'])) {
      echo 'Missing ISO code parameter';
      exit;
  }
  
  $iso_code = $_GET['iso_code'];
  // rest of the code
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (!isset($_POST['iso_code'])) {
      echo 'Missing ISO code parameter';
      exit;
  }
  
  $iso_code = $_POST['iso_code'];
  // rest of the code
}
else {
  echo 'Unsupported HTTP method';
  exit;
}
$api_key = "0144c3ed9bf94eef8b01e9df62e838c5";
$url = "https://newsapi.org/v2/top-headlines?country={$iso_code}&apiKey={$api_key}&language=en&pageSize=10";


// Initialize cURL
$curl = curl_init();

// Set the cURL options
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, array(
  'User-Agent: YourApp/1.0'
));

// Execute the cURL request
$response = curl_exec($curl);

// Close the cURL session
curl_close($curl);

// Decode the response JSON
$data = json_decode($response);
// Debugging statements
// var_dump($response);
// var_dump($data);


// Output the response as JSON
header('Content-Type: application/json');
echo json_encode(array_map(function ($article) {
  return [
      'title' => $article->title,
      'author' => $article->author,
      'publishedAt' => $article->publishedAt,
      'url' => $article->url
  ];
}, $data->articles));


?>
