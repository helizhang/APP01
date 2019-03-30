var app = angular.module("myApp", ['myController', 'utilServices', 'myDirective', 'ui.bootstrap', 'ui.router', 'webApiService','cwLeftMenu','ngGrid']);
var controllers = angular.module("myController", []);
var directives = angular.module("myDirective", []);


app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.headers.post['X-CSRFToken'] = $("#csrf").val();
    $urlRouterProvider.otherwise("/");//默认展示页面
    $stateProvider.state('home', {
        url: "/",
        controller: "home",
        templateUrl: static_url + "client/views/home.html"
    }).state('test', {
        url: "/test",
        controller: "test",
        templateUrl: static_url + "client/views/test.html"
    })
}]);
