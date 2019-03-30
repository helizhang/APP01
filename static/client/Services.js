services = angular.module('webApiService', ['ngResource', 'utilServices']);

//生产代码
var POST = "POST";
var GET = "GET";

//测试代码
//var sourceRoute = "./Client/MockData";
//var fileType = ".html";
//var POST = "GET";
//var GET = "GET";
services.factory('sysService', ['$resource', function ($resource) {
    return $resource(site_url + ':actionName/', {},
        {
            get_pie_data: {method: POST, params: {actionName: 'get_pie_data'}, is_array: false},
            get_line_data: {method: POST, params: {actionName: 'get_line_data'}, is_array: false},
            get_table_data: {method: POST, params: {actionName: 'get_table_data'}, is_array: false},
            get_bar_data: {method: POST, params: {actionName: 'get_bar_data'}, is_array: false},
        });
}])


;//这是结束符，请勿删除