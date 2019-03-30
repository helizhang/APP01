controllers.controller("modalPageCtrl", ["$scope", "$modalInstance", "objectItem", "sysService", "loading",
    function ($scope, $modalInstance, objectItem, sysService, loading) {
    console.log('modal');
    $scope.newItem = objectItem;
    //关闭窗口
    $scope.filter_obj = {
        'lastName': '',
        'biz_id': '',
        'ip':""
    };
    // $scope.$watch($scope.filter_obj.biz_id, function () {
    //     console.log('int')
    //     console.log($scope.filter_obj.biz_id)
    //     if($scope.filter_obj.biz_id !== ""){
    //        $scope.get_host_list();
    //     }
    //
    // });
    // $scope.get_app_list = function(){
    //     loading.open();
    //     sysService.get_app_list({}, {}, function (res) {
    //         loading.close();
    //         console.log(res.data);
    //         $scope.biz_list = res.data
    //     })
    // };
    // $scope.get_app_list();
    //
    // $scope.get_host_list = function () {
    //     console.log($scope.filter_obj);
    //     if($scope.filter_obj.biz_id === ""){
    //         return
    //     }
    //     loading.open();
    //     sysService.get_host_list({}, $scope.filter_obj, function (res) {
    //         loading.close();
    //         if(res.result) {
    //             console.log(res.data);
    //             $scope.biz_host_list = res.data;
    //         }
    //     })
    // };


    //模态框
    console.log('modal');
    $scope.newItem = objectItem;
    $scope.biz_list = [{bk_biz_id: 1, bk_biz_name: "业务一"},{bk_biz_id: 2, bk_biz_name: "业务二"}]
    //关闭窗口
    $scope.filter_obj = {
        'lastName': '',
        'biz_id': '',
        'ip':""
    };

    $scope.confirm = function () {
        // sysService.add_host({}, $scope.filter_obj, function (res) {
        //     console.log('success');
        //     $modalInstance.close($scope.newItem);
        // });
        $modalInstance.close($scope.newItem);

    };
    //取消窗口
    $scope.cancel = function () {
        $modalInstance.dismiss("cancel");
    }
}]);