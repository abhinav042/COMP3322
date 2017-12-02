const chatter_box = angular.module('chatterBox', []);

chatter_box.controller('chatController', function($scope, $http) {
    
    $scope.load = function() {
        $http.get("/load").then(res => {
            if (res.data == "") {
                $scope.showLogin = true;
            }
            else {
                $scope.showLogin = false;
            }
        });
    }

    $scope.login = function() {
        $scope.showLogin = false;
        console.log($scope.password);
        if ($scope.username && $scope.password) {
            $http.post("/login", {username:$scope.username, password:$scope.password}).then(res => {
                if (res.data === "LOGIN INVALID") {
                    $scope.showLogin = true;
                } else {
                    
                }
            });
        } else {
            alert("You must enter a username and password!");
        }
    }

});