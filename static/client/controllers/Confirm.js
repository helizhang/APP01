controllers.controller('confirm', ["$scope", "$modalInstance", "objectItem", function ($scope, $modalInstance, objectItem) {
    $scope.text = objectItem.text;

    $scope.confirm = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);