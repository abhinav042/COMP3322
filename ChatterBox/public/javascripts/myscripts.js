const chatter_box = angular.module('chatterBox', []);

chatter_box.controller('chatController', function($scope, $http, $interval) {

    $scope.load = function() {
        $http.get("/load").then(res => {
            if (res.data == "") {
                $scope.showInfo = false;
                $scope.showLogin = true;
                $scope.showChat = false;
                $scope.userId = null;
                $scope.icon = null;
                $scope.name = null;
                $scope.friends = null;
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
                    alert("THERE WAS A VALIDATION ERROR");
                    $scope.showLogin = true;
                } else {
                    $scope.showChat = false;
                    $scope.showLogin = false;
                    $scope.showInfo = false;
                    $scope.load();
                }
            });
        } else {
            alert("You must enter a username and password!");
        }
    };

    $scope.logout = function() {
        $http.get("/logout").then(res => {
            if (res.data == "") {
                $scope.showChat = false;
                $scope.showInfo = false;
                $scope.showLogin = true;
                $scope.userId = null;
                $scope.icon = null;
                $scope.name = null;
                $scope.friends = null;
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
            $scope.showChat = true;
            $scope.showInfo = false;
            $scope.new_text = "";
            $scope.current_friend = res.data;
            for (let friend of $scope.friends) {
                if (friend._id == $scope.current_friend._id) {
                    friend.unread_counter = 0;
                }
            }
        });
    };

    $scope.postMessage = function() {
        friend_id = $scope.current_friend._id;
        if ($scope.new_text != "") {
            console.log('hi');
            const curr_date = new Date().toLocaleDateString();
            const curr_time = new Date().toLocaleTimeString();            
            $http.post(`/postmessage/${friend_id}`, {message:$scope.new_text, date:curr_date, time:curr_time}).then(res => {
                $scope.getConversation(friend_id);
                $scope.new_text = "";
            });
        }
    };

    $scope.deleteMessage = function(message_id) {
        const friend_id = $scope.current_friend;
        if (confirm("Are you sure you want to delete?") == true) {
            $http.delete(`/deletemessage/${message_id}`).then(res => {
                $scope.getConversation(friend_id);
            });
        }
    };

    $interval(() => {
        if ($scope.current_friend) {
            $http.get(`/getnewmessages/${$scope.current_friend._id}`).then(res => {
                $scope.current_friend.messageList = res.data.messages_id;
                $scope.current_friend.status = res.data.status;
            });
        }
        if ($scope.friends) {
            for (let friend of $scope.friends) {
                if ($scope.current_friend) {
                    if (friend._id != $scope.current_friend) {
                        $http.get(`/getnewmsgnum/${friend._id}`).then(res => {
                            friend.unread_counter = parseInt(res.data.message_not_retrieved);
                        });    
                    }
                } else {
                    $http.get(`/getnewmsgnum/${friend._id}`).then(res => {
                        friend.unread_counter = parseInt(res.data.message_not_retrieved);
                    });
                }
            }
        }
    }, 1000);

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