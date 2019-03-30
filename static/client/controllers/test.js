controllers.controller("test", ["$scope", "$stateParams", "sysService", "loading", "$modal", "$state",
    function ($scope, $stateParams, sysService, loading, $modal, $state) {

        // 输入框 初始化
        $scope.filter_obj = {
            "biz_id": "",
            "ip": ""
        };
        $scope.biz_list = [{'bk_biz_id': 2, 'bk_biz_name': '蓝鲸'}, {'bk_biz_id': 3, 'bk_biz_name': '测试'}];
        $scope.search_test = function(){
            console.log($scope.filter_obj);
        };


        $scope.text = "告警";
        $scope.go_confirm = function () {
            console.log('go_confirm');
            let modalInstance = $modal.open({
                templateUrl: static_url + 'client/views/ConfirmModal.html',
                windowClass: 'dialogDetail',
                controller: 'confirm',
                backdrop: 'static',
                resolve: {
                    objectItem: function () {
                        return {text: $scope.text};
                    }
                }
            });
            modalInstance.result.then(function (result) {
                // $scope.search_host();
            })
        };

        // 模态框
        $scope.go_modal_page = function () {
            console.log('go_modal_page');
            let modalInstance = $modal.open({
                templateUrl: static_url + 'client/views/modalPage.html',
                windowClass: 'dialogDetail',
                controller: 'modalPageCtrl',
                backdrop: 'static',
                resolve: {
                    objectItem: function () {
                        return "";
                    }
                }
            });
            modalInstance.result.then(function (result) {
                // $scope.search_host();
            })
        };

        // 图表
        // $scope.show_pie = false;

        /*饼图*/
        $scope.get_pie_data = function () {
            loading.open();
            sysService.get_pie_data({}, {}, function (res) {
                loading.close();
                if (res.result) {
                    $scope.serverRepairList = res.data;

                    $scope.updateInfoReports = angular.extend({
                        data: "serverRepairList",
                        title: {text: "", enabled: true},
                        unit: "G",
                        size: "200px"
                    },
                        {
                            title: {text: res.pie_title, enabled: true}
                        });
                    // $scope.updateInfoReports.title.text = res.pie_title;
                    // $scope.show_pie = true;
                }
            })
        };
        $scope.get_pie_data();

        // 折线图
        $scope.get_line_data = function () {
            loading.open();
            sysService.get_line_data({}, {}, function (res) {
                loading.close();
                if (res.result) {
                    console.log(res.data);
                    $scope.data_list = res.data;
                    angular.forEach($scope.data_list, function (i, index) {
                        let var_name = 'taskList' + index;
                        $scope[var_name] = i.taskList;
                        i.chartOptions = {
                            data: var_name,
                            chart: {type: 'line'},//数据列类型，支持 area, areaspline, bar, column, line, pie, scatter or spline
                            title: {text: '折线图', enabled: true},
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
            sysService.get_table_data({}, {}, function (res) {
                $scope.disk_data_list = res.data;
                $scope.headers = res.headers;
            })
        };
        $scope.get_table_data();


         // 柱状图
        $scope.get_bar_data = function(){
            sysService.get_bar_data({}, {}, function (res) {
                if(res.result){
                    $scope.bar_data = res.data;
                    $scope.bar_chart.title.text = "机器"
                    // $scope.pie_title = res.pie_title;
                    // console.log($scope.pie_title);

                }
            })
        };
        $scope.get_bar_data();
        //    柱状图
        $scope.bar_chart = {
            //柱状图标题
            title: {text: '服务器', enabled: false},
            //y轴
            yAxis: {
                title: {text: '数目'}, //y轴标题
                lineWidth: 2, //基线宽度1
                //tickPositions: [0, 1, 2, 3, 4]
            },
            //提示框位置和显示内容
            tooltip: {
                headerFormat: '<table\>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:f} 台</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
                positioner: function () {
                    return {x: 80, y: 80}
                }
            },
            data: "bar_data"
        };


    //    列表
        $scope.host_list = [{'host_innerip': "10.1.1.1", 'bk_os_name': "linux", 'bk_host_name': "host_name", 'bk_cloud_name': "cloud", 'mem_usage': 40, 'disk_usage': 30, 'cpu_usage': 20}];
        $scope.gridOption = {
        data: 'host_list',
        columnDefs: [
            {field: 'host_innerip', displayName: '内网IP'},
            {field: 'bk_os_name', displayName: '系统名'},
            {field: 'bk_host_name', displayName: '主机名'},
            {field: 'bk_cloud_name', displayName: '云区域'},
            {field: 'mem_usage', displayName: 'Mem(%)'},
            {field: 'disk_usage', displayName: 'Disk(%)'},
            {field: 'cpu_usage', displayName: 'CPU(%)'},
            {
                displayName: '操作', width: 180,
                cellTemplate: '<div style="width:100%;text-align: center;padding-top: 5px;z-index: 1">' +
                '<li  class="fa fa-search" style="min-width:50px;margin-left: 5px;cursor:pointer;" ng-click="update_host(row.entity)"></li>' +
                '<li ng-show="row.entity.is_monitored" class="fa fa-eye-slash" style="min-width:50px;margin-left: 5px;cursor:pointer;" ng-click="del_monitor(row.entity)"></li>' +
                '<li ng-show="!row.entity.is_monitored" class="fa fa-eye" style="min-width:50px;margin-left: 5px;cursor:pointer;" ng-click="add_monitor(row.entity)"></li>' +
                '</div>'
            }
        ]
    };

    }]);
