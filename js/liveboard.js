var int = 0;
$(function() {
	  $(window).bind('irail.ready', fillTable() );
     });

function fillTable() {
     clearInterval(int);
     var station = $('#station').val();
     irail.liveboards.lookup(station, 'dep', update);
     int = setInterval(function() { irail.liveboards.lookup(station, 'dep', update); }, 5*1000);
     function update(liveboard){
	  var servertime = new Date(liveboard.timestamp * 1000);
	  $('#liveboard').find("tr:gt(0)").remove();
	  $.each(liveboard.entries, function(i, entry) {
		    var d = new Date(entry.time * 1000);
		    var min = d.getMinutes();
		    if(min < 10){
			 min = "0" + min;
		    }
		    var h = d.getHours();
		    if(h<10){
			 h = "0" + h;
		    }
		    var sched = new Date( (entry.time + entry.delay) * 1000 );
		    $('#liveboard').append([
						'<tr class="', (sched.getTime() + 2 * 60 * 1000 < (servertime.getTime()) ? 'left' : 'pending') ,'" >',
						'<td class="platform">',entry.platform,'</td>',
						'<td class="station">',entry.station,'</td>',
						'<td><b>',h,'</b>:<b>',min,'</b></td>',
						'<td>', ( entry.delay > 0 ? '<em>+'+parseInt(entry.delay / 60 , 10)+'</em> min' : '-'), '<td>',
						'</tr>'
						].join(''));
	       }
	       )};
}
