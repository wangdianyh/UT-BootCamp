// from data.js
var tableData = data;

// YOUR CODE HERE!
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.rows = tableData;
});
// adding a filter to tbody
var tbody = d3.select('tbody').attr('ng-repeat', 'x in rows | filter: rowFilter');
// print data into html page
var tr = tbody.append('tr');
tr.append('td').text('{{x.datetime}}');
tr.append('td').text('{{x.city}}');
tr.append('td').text('{{x.state}}');
tr.append('td').text('{{x.country}}');
tr.append('td').text('{{x.shape}}');
tr.append('td').text('{{x.durationMinutes}}');
tr.append('td').text('{{x.comments}}');