const chatter_box = angular.module('chatterBox', []);

chatter_box.controller('chatController', function($scope, $http) {
    
    $scope.getPage = function() {

    }

    $scope.login = function() {
        console.log($scope.username);
        if ($scope.username!="" && $scope.password!=="") {
            $http.post("/login", {username:$scope.username, password:$scope.password}).then(res => {
                if (res.data === "LOGIN INVALID") {
                    
                }
            });
        } else {
            alert("You must enter a username and password!");
        }
    }

});