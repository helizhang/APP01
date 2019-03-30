controllers.controller("performanceCtrl", ["$scope", "$stateParams", "sysService", "loading", "$modal", "$state",
    function ( $scope, $stateParams, sysService, loading, $modal, $state) {
    $scope.show_pie = false;

    /*饼图*/
    $scope.get_pie_data = function(){
        loading.open();
        sysService.pie_data({}, {}, function (res) {
            loading.close();
            if(res.result){
                $scope.serverRepairList = res.data;
                $scope.pie_title = res.pie_title;
                console.log($scope.pie_title);

                $scope.updateInfoReports = {
                    data: "serverRepairList",
                    title: {text: $scope.pie_title, enabled: true},
                    unit: "G",
                    size: "200px"
                };
                $scope.show_pie = true;
            }
        })
    };
    $scope.get_pie_data();

    // 折线图
    $scope.get_line_data = function () {
        console.log($stateParams.biz_id, $stateParams.ip, $stateParams.bk_cloud_id);
        loading.open();
        sysService.get_line_data({}, {biz_id:$stateParams.biz_id, ip: $stateParams.ip, bk_cloud_id: $stateParams.bk_cloud_id}, function (res) {
            loading.close();
            if(res.result) {
                console.log(res.data);
                $scope.data_list = res.data;
                angular.forEach($scope.data_list, function (i, index) {
                        let var_name = 'taskList' + index;
                        $scope[var_name] = i.taskList;
                         i.chartOptions = {
                        data: var_name,
                        chart: {type: 'line'},//数据列类型，支持 area, areaspline, bar, column, line, pie, scatter or spline
                        title: {text: '5分钟平均负载（近一小时）', enabled: true},
                        xAxis: {
                            categories: i.categories
                        },
                        //提示框位置和显示内容
                        tooltip: {
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:f}</b></td></tr>',
                            headerFormat: ""
                        }
                    };
                });
            }
        })
    };
    $scope.get_line_data();

    // 表格
    $scope.disk_data_list = [];
    $scope.get_table_data = function () {
        sysService.get_table_data({}, {biz_id:$stateParams.biz_id, ip: $stateParams.ip, bk_cloud_id: $stateParams.bk_cloud_id}, function (res) {
            $scope.disk_data_list = res.data;
            $scope.headers = res.headers;
        })
    };
    $scope.get_table_data();
}]);
