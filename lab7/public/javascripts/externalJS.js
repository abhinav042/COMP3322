var report_app = angular.module('reportList', []);

report_app.controller('reportListController', function($scope, $http){

    //to be completed
    $scope.reports = null;

    $scope.getReports = function(){
        $http.get("/users/annualreports").then(function(response){
            $scope.reports = response.data;
        }, function(response){
            alert("Error getting reports:"+response.statusText);
        });
    };

    $scope.deleteReport = function(id){
        // Pop up a confirmation dialog
        var confirmation = confirm('Are you sure you want to delete this report?');
        // Check and make sure the deletion confirmed
        if (confirmation === true) {
            var url = `/users/delete/${id}`;
            $http.delete(url).then(function(response){
                $scope.getReports();
            }, function(response){
                alert("Error deleting report:"+response.statusText);
            });
        }
        else {
            // If they said no to the confirm, do nothing
            return false;
        }
    };

    $scope.new_report = {company:"", year:"", profit:""};
    $scope.addorupdateReport = function(report){
        if(report.company==''||report.year==''||report.profit==''){
            alert("please fill in all fields");
            return;
        }
        $http.put("/users/addorupdatereport", report).then(function(response){
            if(response.data.msg===''){
                $scope.getReports();
                $scope.new_report = {company:"", year:"", profit:""};
            }
            else{
                alert("Error adding/updating report:"+response.data.msg);
            }
        }, function(response){
            alert("Error adding/updating report:"+response.statusText);
        });
    };
});
