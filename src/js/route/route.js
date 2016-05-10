var app = angular.module('tableApp',['ngRoute', 'mgcrea.ngStrap', 'ngAnimate', 'ngSanitize'])
google.charts.load('current', {'packages':['timeline', 'table']});



app.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/home', {
                templateUrl : 'src/view/home.html',
                controller  : 'tableCtrl'
            })
    });

app.controller('tableCtrl', function($scope, $http, $modal) {
    $("#login-modal").modal({backdrop: 'static', keyboard: false});
    
    $scope.username = '';
    $scope.courses = ["01219113 Object-Oriented Programming II",
      "01219215 Computer System Laboratory",
      "01219216 Operating Systems for Software and Knowledge Engineers",
      "01219243 Software Specification and Design",
      "01219244 Software Specification and Design Laboratory",
      "01219245 Individual Software Development Process",
      "01219246 Individual Software Development Process Laboratory",
      "01219343 Software Testing",
      "01219344 Mobile Software Development",
      "01219347 Workgroup Software Development Process",
      "01219348 Workgroup Software Development Process Laboratory",
      "01219351 Web Application Development",
      "01219361 Business Intelligence",
      "01219412 Technical Writing for Software and Knowledge Engineers",
      "01219448 Software Patterns and Architecture Laboratory",
      "01219449 Software Patterns and Architecture",
      "01219492 Software Entrepreneurship",
      "01219496 Selected Topics in Software and Knowledge Engineering",
      "01219497 Seminar",
      "01219498 Special Problems",
      "01219499 Innovative Software Group Project"];
    $scope.error = '';
    var courseID, courseName,day,section,type,room,instructor,dateText,credit,courseCredit;
    var instructor = '';
    var day = '';
    var time = [0,0,0,0]
    var chart, dataTable, options, enrollTable, courseTable, etable, ctable, ttable;
    var numRows = 7;
    var numCourse = 0;

      //google.charts.load('current', {'packages':['timeline']});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var container = document.getElementById('timeline');
        etable = new google.visualization.Table(document.getElementById('etable_div'));
        //ctable = new google.visualization.Table(document.getElementById('ctable_div'));
        //ttable = new google.visualization.Table(document.getElementById('ttable_div'));
        chart = new google.visualization.Timeline(container);
        dataTable = new google.visualization.DataTable();
        courseTable = new google.visualization.DataTable();
        enrollTable = new google.visualization.DataTable();

        google.visualization.events.addListener(chart, 'select', myClickHandler);

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

      enrollTable.addColumn('string', 'Course ID');
      enrollTable.addColumn('string', 'Course Name');
      enrollTable.addColumn('string', 'Type');
      enrollTable.addColumn('string', 'Section');
      enrollTable.addColumn('number', 'Credit');

      courseTable.addColumn('string', 'Course ID');
      courseTable.addColumn('string', 'Course Name');
      courseTable.addColumn('string', 'Type');
      courseTable.addColumn('string', 'Section');
      courseTable.addColumn('number', 'Credit');

    options = {
      height: 450,
      title: 'Time Table',
      timeline: { colorByRowLabel: true },
      backgroundColor: '#ffd',
      fontSize: '50',
      tooltip: { isHtml: true, }
    };

    chart.draw(dataTable, options);
    etable.draw(enrollTable, {showRowNumber: true, width: '100%', height: '100%'});
    //ctable.draw(courseTable, {showRowNumber: true, width: '100%', height: '100%'});
    //ttable.draw(dataTable, {showRowNumber: true, width: '100%', height: '100%'});
}

function createTooltip(courseID, courseName, section, room, instructor, dateText, type, credit) {
  return '<div style="padding:10px 10px 10px 10px;">' +
      '<b>' + courseID + ' ' + courseName + '</b>' +
      '<p>' + 'Section ' + section + ' Room ' + room + '</p>' +
      '<p>' + 'Type: ' + type + ' Credit: ' + credit + '</p>' +
      '<p>' + instructor + '</p>' +
      '<p>' + 'Time: ' + dateText + '</p>' +'</div>';
}

function getCourseDetail(courseID){
  $http.get('https://whsatku.github.io/skecourses/combined.json')
  .success(function (data) {
    this.courseID = courseID;
    courseName = data[courseID].name.en;
    courseCredit = data[courseID].credit;
  })

  var link = 'https://whsatku.github.io/skecourses/sections/' + courseID + '.json';
  $http.get(link)
  .success(function (course) {
    for (var i = course.length - 1; i >= 0; i--) {
        section = course[i].id;
        type = course[i].type;
        if(type == 'Lab'){
          credit = courseCredit.lab;
        } else if(type == 'Lecture'){
          credit = courseCredit.lecture;
        }
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
        dateText = course[i].date;
        if(enrollTable.getNumberOfRows() == 0){
          addRow(courseID, courseName,section,type,room,instructor,day,time,dateText,credit);
          courseTable.addRows([[courseID, courseName, type, section, credit]]);
          //ctable.draw(courseTable, {showRowNumber: true, width: '100%', height: '100%'});
        } else{
          var isEnroll = 0;
          for (var j = 0; j < enrollTable.getNumberOfRows(); j++) {
            if(enrollTable.getValue(j,1) == courseName &&
               enrollTable.getValue(j,2) == type){
                isEnroll = 1;
            }
          }
          if(isEnroll == 0){
              addRow(courseID, courseName,section,type,room,instructor,day,time,dateText,credit);
                courseTable.addRows([[courseID, courseName, type, section, credit]]);
                //ctable.draw(courseTable, {showRowNumber: true, width: '100%', height: '100%'});
            }
        }
    };
  })
}

function addRow(courseID,courseName,section,type,room,instructor,day,time,dateText){
  dataTable.addRows([
    [ day, courseName, createTooltip(courseID, courseName, section, room, instructor, dateText, type, credit),
    new Date(0,0,0,time[0],time[1],0), new Date(0,0,0,time[2],time[3],0) ],
    [ day, '', '', new Date(0,0,0,time[2],time[3],1), new Date(0,0,0,time[2],time[3],1)],
    [ day, '', '', new Date(0,0,0,time[0],time[1],0), new Date(0,0,0,time[0],time[1],0)]]);
  chart.draw(dataTable, options);
  //ttable.draw(dataTable, {showRowNumber: true, width: '100%', height: '100%'});
}

$scope.searchID = function(){
  $scope.error = '';
  if($scope.courseID.length < 8){
    $scope.error = 'Wrong course ID';
  } else {
    courseID = $scope.courseID.substring(0,8);
    removeLabel();
    getCourseDetail(courseID);
  }
  
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
    time[0] = sh;
    time[1] = sm;
    time[2] = eh;
    time[3] = em;
    return time;
  }
}

function myClickHandler(){
  var selection = chart.getSelection();
  if(dataTable.getValue(selection[0].row,1) != ''){
    console.log(selection[0].row + ' ' + numRows);
    
    var minusRow = 0;
    var i = 0;
    while(minusRow <= selection[0].row){
        if(minusRow==10 || minusRow==13 || minusRow==16 || minusRow==19 || minusRow==22 || 
            minusRow==25 || minusRow==28 || minusRow==31 || minusRow==33 || minusRow==36){
          i++;
        }
        minusRow++;
    }
    var tmpID = courseTable.getValue(i, 0);
    var tmpName = courseTable.getValue(i, 1);
    var tmpType = courseTable.getValue(i, 2);
    var tmpSec = courseTable.getValue(i, 3);
    var tmpCredit = courseTable.getValue(i, 4);
    $scope.dropName = tmpID + ' ' + tmpName + ' ' + tmpType;
    if(enrollTable.getNumberOfRows() == 0){
        enroll(tmpID, tmpName, tmpType, tmpSec, tmpCredit);
        alert('You enroll ' + tmpName + ' ' + tmpType);
    } else{
      var isEnroll = 0;
      for (var j = 0; j < enrollTable.getNumberOfRows(); j++) {
            if(enrollTable.getValue(j,1) == tmpName &&
               enrollTable.getValue(j,2) == tmpType){
                isEnroll = 1;
              if(enrollTable.getNumberOfRows() == 1){ i = 0 }
                //alert('Drop course ' + tmpName + ' ' + tmpType);
                $scope.dropRow = i;
                $("#myModal").modal();
                //$scope.drop(i-1);
              }
          }
          if(isEnroll == 0){
                enroll(tmpID, tmpName, tmpType, tmpSec, tmpCredit);
                //alert('You enroll ' + tmpName + ' ' + tmpType);
              }
    }
  }
}

function removeLabel(){
  var tmp = 0;
  var tmp2 = 0;
  var rowTable = 0;
  if(enrollTable.getNumberOfRows() == 0 && courseTable.getNumberOfRows() != 0){
    rowTable = dataTable.getNumberOfRows();
    for (var i = numRows; i < rowTable; i++) {
      dataTable.removeRow(numRows);
    }
    rowTable = courseTable.getNumberOfRows();
    for (var i = 0; i < rowTable; i++) {
      courseTable.removeRow(0);
    }
  } else{
    var isEnroll = 0;
    for (var i = 0; i < courseTable.getNumberOfRows(); i++) {
      isEnroll = 0;
    for (var j = 0; j < enrollTable.getNumberOfRows(); j++) {
      if(enrollTable.getValue(j,1) == courseTable.getValue(i,1) &&
         enrollTable.getValue(j,2) == courseTable.getValue(i,2)){
        isEnroll = 1;
      }
    }
    console.log(isEnroll);
    if(isEnroll == 0){
      console.log(enrollTable.getValue(j-1,1)+ '   '+courseTable.getValue(i,1));
      console.log(enrollTable.getValue(j-1,2)+ '   '+courseTable.getValue(i,2));
      if(i >= 1){
          tmp2 = tmp2*i;
        }
        dataTable.removeRow(i + numRows + tmp2 - (numCourse*3));
        dataTable.removeRow(i + numRows + tmp2 - (numCourse*3));
        dataTable.removeRow(i + numRows + tmp2 - (numCourse*3));
        courseTable.removeRow(i);
        console.log('course removed');
    }
  };
  }
  /*if(courseTable.getNumberOfRows() > enrollTable.getNumberOfRows()){
    var isEnroll = 0;
    rowTable = courseTable.getNumberOfRows();
    for (var i = enrollTable.getNumberOfRows(); i < rowTable; i++) {

      courseTable.removeRow(rowTable);
    }
  }*/
  
}

function enroll(courseID,courseName,type,section,credit){
  enrollTable.addRows([[courseID, courseName, type, section, credit]]);
  numCourse++;
  numRows = 7 + (numCourse*3);
  etable.draw(enrollTable, {showRowNumber: true, width: '100%', height: '100%'});
}

$scope.drop = function(){
  $("#myModal").modal("hide");
  enrollTable.removeRow($scope.dropRow);
  numCourse--;
  numRows = 7 + (numCourse*3);
  etable.draw(enrollTable, {showRowNumber: true, width: '100%', height: '100%'});
}

$scope.exportJSON = function(){
  $scope.saveToPc(enrollTable.toJSON());
}

$scope.saveToPc = function (data) {

  if (!data) {
    console.error('No data');
    return;
  }
  

  if (typeof data === 'object') {
    data = JSON.stringify(data, undefined, 2);
  }

  var blob = new Blob([data], {type: 'text/json'}),
    e = document.createEvent('MouseEvents'),
    a = document.createElement('a');

  a.download = 'download.json';
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
  e.initEvent('click', true, false, window,
      0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(e);
};
});
function SelectAll(id)
{
    document.getElementById(id).focus();
    document.getElementById(id).select();
}

