<?php

include 'config.php';

$iso_code = $_GET['iso_code'];

$url = "http://api.mediastack.com/v1/news?access_key={$news_api_key}&languages=en&countries={$iso_code}&limit=20";

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo json_encode(['error' => "cURL Error: $err"]);
} else {
    $data = json_decode($response, true);
    if (isset($data['data'])) {
        $articles = $data['data'];

        $transformedArticles = [];
        foreach ($articles as $article) {
            $title = $article['title'];
            $url = $article['url'];
            $publishedAt = $article['published_at'];
            $imageUrl = $article['image'];
            $category = $article['category'];

            $transformedArticle = [
                'title' => $title,
                'url' => $url,
                'publishedAt' => $publishedAt,
                'imageUrl' => $imageUrl,
                'category' => $category
            ];
            $transformedArticles[] = $transformedArticle;
        }

        $response = json_encode(['articles' => $transformedArticles]);
        echo $response;
    } else {
        $response = json_encode(['error' => 'No articles found.']);
        echo $response;
    }
}
?>
