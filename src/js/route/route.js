angular.module('tableApp')
.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /home
  $urlRouterProvider.otherwise("/home");
  //
  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "src/view/home.html"
    })
    .state('changepage', {
      url: "/changepage",
      templateUrl: "src/view/changepage.tmpl"
    })
});
