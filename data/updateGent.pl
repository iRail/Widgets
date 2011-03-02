#!/usr/bin/perl
# Copyright (C) 2011 by iRail vzw/asbl
# Author: pieterc <pieter@iRail.be>
use JSON;
use LWP::Simple;
use POSIX;

my $pageURL = "http://api.irail.be/liveboard/?station=gent-sint-pieters&format=json";
my $content = get($pageURL);
my $json = new JSON;
my $json_t = $json->utf8->decode($content);
open FILE, ">>Gent.txt" or die $!;
#RFC822
#print FILE strftime("%a, %d %b %Y %H:%M:%S %z", localtime($now));
my $total_delay = 0;
my $number_of_delay = 0;
foreach my $dep ($json_t->{departures}->{departure}){
  if($dep{delay} > 0){
    $total_delay += $dep{delay};
    $number_of_delay ++;
  }
}
if($number_of_delay>0){
  print FILE strftime("%a, %d %b %Y %H:%M:%S %z", localtime($now));
  print FILE ";";
  print FILE "http://widgets.iRail.be/liveboard.html?station=Gent-sint-pieters&time=";
  print FILE strftime("%H:%M", localtime($now));
  print FILE ";";
  print FILE "I'm suffering from " . $total_delay/60 . " minutes of total delay in my station.";
}
print FILE $str;


close FILE;

