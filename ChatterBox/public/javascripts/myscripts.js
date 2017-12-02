const chatter_box = angular.module('chatterBox', []);

chatter_box.controller('chatController', function($scope, $http) {
    
    $scope.load = function() {
        $http.get("/load").then(res => {
            if (res.data === "") {
                $scope.showLogin = true;
            }
            else {
                console.log(`${res.data.name}`);
                $scope.name = res.data.name;
                $scope.friends = res.data.friends;
                $scope.showLogin = false;
                //$scope.name = res.data.name;
            }
        });
    }

    $scope.login = function() {
        console.log(`the username is : ${$scope.username}, the password is ${$scope.password}`);
        if ($scope.username && $scope.password) {
            $http.post("/login", {username:$scope.username, password:$scope.password}).then(res => {
                if (res.data.msg === 'LOGIN INVALID') {
                    console.log("THERE WAS A VALIDATION ERROR");
                    $scope.showLogin = true;
                } else {
                    $scope.showLogin = false;
                }
            });
        } else {
            alert("You must enter a username and password!");
        }
    }

    $scope.logout = function() {
        $http.get("/logout").then(res => {
            if (res.data === "") {
                $scope.showLogin = true;
            }
        });
    }

});