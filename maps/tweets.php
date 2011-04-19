<?php
/**
 * This page will return tweets in KML format
 *
 */

//First let's do the searches
$urls = array("http://search.twitter.com/search.json?q=NMBS&rpp=100",
	      "http://search.twitter.com/search.json?q=railtime&rpp=100",
	      "http://search.twitter.com/search.json?q=De Lijn&rpp=100",
	      "http://search.twitter.com/search.json?q=TEC&rpp=100",
	      "http://search.twitter.com/search.json?q=STIB&rpp=100",
	      "http://search.twitter.com/search.json?q=MIVB&rpp=100",
	      "http://search.twitter.com/search.json?q=%23NS&rpp=100",
	      "http://search.twitter.com/search.json?q=SNCB&rpp=100");
$tweets = array();
foreach($urls as $url){
     $r = new HttpRequest($url, HttpRequest::METH_GET);
     try {
	  $r->send();
	  if ($r->getResponseCode() == 200) {
	       $json = json_decode($r->getResponseBody(),true);
	       foreach($json["results"] as $result){
		    if($result["geo"] != NULL){
			 $tweets[sizeof($tweets)] = array($result["text"],$result["geo"]["coordinates"]);
		    }
	       }
	  }
     } catch (HttpException $ex) {
	  echo $ex;
     }

}
//OUTPUT
//set the header to KML
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/vnd.google-earth.kml+xml");
echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
echo "<kml xmlns=\"http://www.opengis.net/kml/2.2\">";
$i = 0;

foreach($tweets as $tweet){
     echo "<Placemark id='". $i ."'><name>". $tweet[0] ."</name><Point><coordinates>". $tweet[1][1] .",". $tweet[1][0]."</coordinates></Point></Placemark>";
     $i ++;
}
echo "</kml>";

?>