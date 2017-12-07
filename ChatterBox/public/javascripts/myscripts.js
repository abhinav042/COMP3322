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
                $scope.icon = res.data.icon;
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
            $scope.new_text = "";
            $scope.current_friend = res.data;
        });
    };

    $scope.postMessage = function() {
        console.log('hi');
        friend_id = $scope.current_friend._id;
        if ($scope.new_text != "") {
            console.log('hi');
            const curr_date = new Date().toLocaleDateString();
            const curr_time = new Date().toLocaleTimeString();            
            $http.post(`/postmessage/${friend_id}`, {message:$scope.new_text, date:curr_date, time:curr_time}).then(res => {
                $scope.new_text = "";
                // if (res.data.msg != err) {
                // }
            });
        }
    };
});

angular.module('chatterBox').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});