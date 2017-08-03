(function() {
  "use strict";

  angular
    .module("spa-demo.layout")
    .component("sdNavbar", {
      templateUrl: templateUrl,
      controller: NavbarController
    });


  templateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.navbar_html;
  }

  NavbarController.$inject = ["$scope","spa-demo.authn.Authn","spa-demo.authn.whoAmI"];
  function NavbarController($scope, Authn, WhoAmI) {
    var vm=this;
    vm.getLoginLabel = getLoginLabel;
    vm.user_image_show = false;
    vm.user_image_url = null;

    vm.$onInit = function() {
      console.log("NavbarController",$scope);
      $scope.$watch(function(){ return Authn.isAuthenticated(); },
                    function(){
                      checkUser()
                    });
    }
    return;
    
    function getLoginLabel() {
      return Authn.isAuthenticated() ? Authn.getCurrentUserName() : "Login";
    }

    function checkUser() {
      if (Authn.isAuthenticated()) {
        WhoAmI.get().$promise.then(
          function(value){
            console.log("checkUser: " , value);
            if (value.content_url !== undefined && value.content_url != null) {
              vm.user_image_show = true;
              vm.user_image_url = value.content_url + "?width=50";
            }else{
              vm.user_image_show = false;
              vm.user_image_url = null;
            }
           },
          function(value){
            console.log("checkUser reject: " , value);
            vm.user_image_show = false;
            vm.user_image_url = null;
          }
        );
      }else{
        vm.user_image_show = false;
        vm.user_image_url = null;
      }
    }
  }
})();
