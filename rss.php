<?
/* Copyright (C) 2011 by iRail vzw/asbl */
/**
 * This script will create an RSS feed from data retrieved from another script. http://widgets.iRail.be/rss.php will return an rss feed for the delays in Gent Sint Pieters.
 *
 * @author: Pieter Colpaert <pieter@iRail.be>
 */

//data layer: get the right data

$lastBuildDate;
$data;

$file_handle = fopen("data/Gent.txt", "r");
//$line = fgets($file_handle);
//$lastBuildDate = $line;
$line = fgets($file_handle);
$count = 0;
while (!feof($file_handle) && $line != "") {
     
     $data[$count] = explode(";", $line);
//data[$count][0] == the date and time
//data[$count][1] == the url with hour specification
//data[$count][2] == an awesome message in less than 120 char (20 for the url, which should be shortened)
     $count ++;
     $line = fgets($file_handle);
}
fclose($file_handle);

//output layer: output the data according to the RSS specs.

header ("content-type: text/xml");
echo '<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
        <title>Gent Sint Pieters</title>
        <description>This is Gent Sint Pieters speaking</description>
        <link>http://widgets.irail.be/liveboard.html?station=Gent-sint-pieters</link>
        <lastBuildDate>' . $data[sizeof($data)-1][0] . '</lastBuildDate>
        <pubDate>Wed, 02 Mar 2011 22:00:00 +0001</pubDate>';

foreach($data as $item){
     echo '<item>';
     echo '<title>' .$item[2] . '</title>';
     echo '<description>' . $item[2] . '</description>';
     echo '<link>' . htmlspecialchars($item[1]) .'</link>';
     echo '<guid>'. $item[0] .'</guid>';
     echo '<pubDate>'. $item[0] .'</pubDate>';
     echo '</item>'; 
}

echo '</channel>
</rss>';


?>