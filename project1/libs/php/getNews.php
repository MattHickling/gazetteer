<?php

// Set your API key and the 2 character ISO code for the country you want to get news from
$apiKey = '0144c3ed9bf94eef8b01e9df62e838c5';
$isoCode = $_GET["iso_code"];

// Load the countryBorders.geo.json file
$geoJson = file_get_contents('./countryBorders.geo.json');

// Decode the JSON into a PHP array
$geoData = json_decode($geoJson, true);

// Search for the country that matches the ISO code
$countryName = '';
foreach ($geoData['features'] as $feature) {
  if ($feature['properties']['iso_a2'] === $isoCode) {
    $countryName = $feature['properties']['name'];
    break;
  }
}

// If no country was found, display an error message
if (empty($countryName)) {
  echo 'Country not found.';
  exit;
}

// Use the News API to get the top headlines from the specified country
$url = "https://newsapi.org/v2/top-headlines?country={$isoCode}&apiKey={$apiKey}";
$response = file_get_contents($url);
$newsData = json_decode($response, true);

// Check if the API returned any data
if ($newsData['status'] !== 'ok') {
    echo "Error getting news for {$countryName}: {$newsData['message']}";
    exit;
  }

// Display the news articles
echo "<h1>Latest news from {$countryName}</h1>";
foreach ($newsData['articles'] as $article) {
  echo "<h2>{$article['title']}</h2>";
  echo "<p>{$article['description']}</p>";
  echo "<a href=\"{$article['url']}\">Read more</a>";
  echo "<hr>";
}
