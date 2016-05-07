var app = angular.module('tableApp', ['ui.router']);
var subjectName;

app.controller('tableCtrl', function($scope, $http) {
	$http.get('https://whsatku.github.io/skecourses/list.json')
	.success(function (data) {
		console.log(data);
    subjectName = data[0].name.en;
	})

google.charts.load('current', {'packages':['timeline']});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var container = document.getElementById('timeline');
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();

      dataTable.addColumn({ type: 'string', id: 'Day' });
    	dataTable.addColumn({ type: 'string', id: 'Name' });
    	dataTable.addColumn({ type: 'string', role:'tooltip', 'p': {'html': true}});
    	dataTable.addColumn({ type: 'date', id: 'Start' });
    	dataTable.addColumn({ type: 'date', id: 'End' });
    	dataTable.addRows([
    	  [ 'Sunday', subjectName, createTooltip('012222', 'Object Oriented Programming', 450, 17202, 'Jim', '17:00 - 19:00'),
    	  		new Date(0,0,0,9,0,0), new Date(0,0,0,12,0,0) ],
   		  [ 'Monday', '','', new Date(0,0,0,7,0,0), new Date(0,0,0,7,0,1) ],
    	  [ 'Tuesday', '','', new Date(0,0,0,12,0,0), new Date(0,0,0,13,0,0) ],
    	  [ 'Wednesday', '','', new Date(0,0,0,12,0,0), new Date(0,0,0,13,0,0) ],
    	  [ 'Thursday', '','', new Date(0,0,0,12,0,0), new Date(0,0,0,13,0,0) ],
    	  [ 'Friday', '','', new Date(0,0,0,12,0,0), new Date(0,0,0,13,0,0) ],
        [ 'Staurday', '','', new Date(0,0,0,21,0,0), new Date(0,0,0,21,0,1) ]]);

    var options = {
      height: 400,
      title: 'Time Table',
      timeline: { colorByRowLabel: true },
      backgroundColor: '#ffd',
      tooltip: { isHtml: true }
    };

    chart.draw(dataTable, options);
}

function createTooltip(subjectID, subjectName, section, room, teacher, time) {
  return '<div style="padding:10px 10px 10px 10px;">' +
      '<b>' + subjectID + ' ' + subjectName + '</b>' +
      '<p>' + 'Section ' + section + ' Room ' + room + '</p>' +
      '<p>' + teacher + '</p>' +
      '<p>' + 'Time: ' + time + '</p>' +'</div>';
}

$scope.searchID = function(){
  
}
})
