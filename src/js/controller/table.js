var app = angular.module('tableApp', ['ui.router']);
var courseName,day,section,type,room,instructor,dateText;
var instructor = '';
var day = '';
var time = [0,0,0,0]
var chart, dataTable, options;

app.controller('tableCtrl', function($scope, $http) {

google.charts.load('current', {'packages':['timeline']});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var container = document.getElementById('timeline');
        chart = new google.visualization.Timeline(container);
        dataTable = new google.visualization.DataTable();

      dataTable.addColumn({ type: 'string', id: 'Day' });
    	dataTable.addColumn({ type: 'string', id: 'Name' });
    	dataTable.addColumn({ type: 'string', role:'tooltip', 'p': {'html': true}});
    	dataTable.addColumn({ type: 'date', id: 'Start' });
    	dataTable.addColumn({ type: 'date', id: 'End' });
    	dataTable.addRows([
    	  [ 'Sunday', '', '', new Date(0,0,0,7,0,0), new Date(0,0,0,7,0,0) ],
   		  [ 'Monday', '','', new Date(0,0,0,7,0,0), new Date(0,0,0,7,0,0) ],
    	  [ 'Tuesday', '','', new Date(0,0,0,21,0,0), new Date(0,0,0,21,0,0) ],
    	  [ 'Wednesday', '','', new Date(0,0,0,21,0,0), new Date(0,0,0,21,0,0) ],
    	  [ 'Thursday', '','', new Date(0,0,0,21,0,0), new Date(0,0,0,21,0,0) ],
    	  [ 'Friday', '','', new Date(0,0,0,21,0,0), new Date(0,0,0,21,0,0) ],
        [ 'Saturday', '','', new Date(0,0,0,21,0,0), new Date(0,0,0,21,0,0) ]]);

    options = {
      height: 1000,
      title: 'Time Table',
      timeline: { colorByRowLabel: true },
      backgroundColor: '#ffd',
      tooltip: { isHtml: true }
    };

    chart.draw(dataTable, options);
}

function createTooltip(subjectID, subjectName, section, room, instructor, dateText, type) {
  return '<div style="padding:10px 10px 10px 10px;">' +
      '<b>' + subjectID + ' ' + subjectName + '</b>' +
      '<p>' + 'Section ' + section + ' Room ' + room + '</p>' +
      '<p>' + 'Type: ' + type + '</p>' +
      '<p>' + instructor + '</p>' +
      '<p>' + 'Time: ' + dateText + '</p>' +'</div>';
}

function getCourseName(){
  return subjectName;
}

function getCourseDetail(courseID){
  $http.get('https://whsatku.github.io/skecourses/combined.json')
  .success(function (data) {
    console.log(data);
    courseName = data[courseID].name.en;
  })

  var link = 'https://whsatku.github.io/skecourses/sections/' + courseID + '.json';
  $http.get(link)
  .success(function (course) {
    console.log(course);
    for (var i = course.length - 1; i >= 0; i--) {
      section = course[i].id;
        type = course[i].type;
        room = course[i].location;
        if(course[i].instructors.length == 1){
          instructor = course[i].instructors[0]
        } else {
            for (var j = course[i].instructors.length - 1; j >= 0; j--) {
              instructor = instructor + ' ,' + course[i].instructors[j];
            };
        }
        day = getDay(course[i].date);
        time = getTime(course[i].date);
        dateText = course[i].date
        addRow(courseName,section,type,room,instructor,day,time,dateText);
    };
        
  })
  

}

function addRow(courseName,section,type,room,instructor,day,time,dateText){
  console.log(section+" "+type+' '+room);
  dataTable.addRows([
    [ day, courseName, createTooltip($scope.courseID, courseName, section, room, instructor, dateText, type),
    new Date(0,0,0,time[0],time[1],0), new Date(0,0,0,time[2],time[3],0) ],
    [ day, '', '', new Date(0,0,0,time[2],time[3],1), new Date(0,0,0,time[2],time[3],1)],
    [ day, '', '', new Date(0,0,0,time[0],time[1],0), new Date(0,0,0,time[0],time[1],0)]]);
  chart.draw(dataTable, options);
}

$scope.searchID = function(){
  getCourseDetail($scope.courseID);
}

function getDay(date){
    if(date == "Contact instructor"){
      return 'Not defined';
    } else{
    day = date.substring(0,3);
    if(day == 'Mon'){
      return 'Monday';
    } else if(day == 'Tue'){
      return 'Tuesday';
    } else if(day == 'Wed'){
      return 'Wednesday';
    } else if(day == 'Thu'){
      return 'Thursday';
    } else if(day == 'Fri'){
      return 'Friday';
    } else if(day == 'Sat'){
      return 'Saturday';
    } else if(day == 'Sun'){
      return 'Sunday';
    }}
}

function getTime(date){
  if(date == "Contact instructor"){
    time[0] = 7;
    time[1] = 0;
    time[2] = 21;
    time[3] = 0;
    return time;
  } else{
    sh = parseInt(date.substring(4,6));
    sm = parseInt(date.substring(7,9));
    eh = parseInt(date.substring(10,12));
    em = parseInt(date.substring(13,15));
    console.log(sh+' '+ sm+' '+eh+' '+em);
    time[0] = sh;
    time[1] = sm;
    time[2] = eh;
    time[3] = em;
    return time;
  }
}
})
