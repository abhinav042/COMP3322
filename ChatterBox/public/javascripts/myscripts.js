const chatter_box = angular.module('chatterBox', []);

chatter_box.controller('chatController', function($scope, $http) {
    
    $scope.load = function() {
        $http.get("/load").then(res => {
            console.log(res.data);
            if (res.data == "") {
                $scope.showLogin = true;
                $scope.showChat = false;
            }
            else {
                $scope.userId = res.data._id;
                $scope.name = res.data.name;
                $scope.friends = res.data.friends;
                $scope.showLogin = false;
            }
        });
    };

    $scope.login = function() {
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
    };

    $scope.logout = function() {
        $http.get("/logout").then(res => {
            if (res.data == "") {
                $scope.showLogin = true;
            }
        });
    };

    $scope.getConversation = function(friend_id) {
        $http.get(`/getconversation/${friend_id}`).then(res => {
            console.log(res.data);
            $scope.showChat = true;
            $scope.current_friend = res.data;
        });
    };

});