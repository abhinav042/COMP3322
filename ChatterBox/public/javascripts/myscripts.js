const chatter_box = angular.module('chatterBox', []);

chatter_box.controller('chatController', function($scope, $http) {

    $scope.load = function() {
        $http.get("/load").then(res => {
            $scope.showInfo = false;
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
                    $scope.login();
                    $scope.showLogin = false;
                    $scope.showInfo = false;
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

    $scope.getUserInfo = function() {
        $scope.showChat = false;
        $http.get(`/getuserinfo`).then(res => {
            $scope.showInfo = true;
            $scope.address = res.data.address;
            $scope.homeNumber = res.data.homeNumber;
            $scope.mobileNumber = res.data.mobileNumber;
        });
    };

    $scope.updateUserInfo = function() {
        $scope.showChat = false;
        $http.put(`/saveuserinfo`, {mobileNumber:$scope.mobileNumber, homeNumber:$scope.homeNumber, address:$scope.address}).then(res => {
            if (res.data.msg != "") {
                alert(err);
            }
        });
    };

    $scope.getConversation = function(friend_id) {
        $http.get(`/getconversation/${friend_id}`).then(res => {
            // console.log(res.data);
            $scope.showChat = true;
            $scope.showInfo = false;
            $scope.current_friend = res.data;
        });
    };
});