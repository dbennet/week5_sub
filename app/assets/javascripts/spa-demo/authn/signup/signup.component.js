(function() {
  "use strict";

  angular
    .module("spa-demo.authn")
    .component("sdSignup", {
      templateUrl: templateUrl,
      controller: SignupController,
    });


  templateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.authn_signup_html;
  }

  SignupController.$inject = ["$scope",
                              "$state",
                              "spa-demo.authn.Authn",
                              "spa-demo.layout.DataUtils",
                              "spa-demo.subjects.Image"];
  function SignupController($scope, $state, Authn, DataUtils, Image) {
    var vm=this;
    vm.setImageContent = setImageContent;
    vm.signupForm = {}
    vm.signup = signup;
    vm.image_content = {};
    vm.mandatory = false;

    vm.$onInit = function() {
      console.log("SignupController",$scope);
    }
    return;
    //////////////
    function signup() {
      console.log("signup...");
      $scope.signup_form.$setPristine();
      Authn.signup(vm.signupForm).then(
        function(response){
          vm.id = response.data.data.id;
          console.log("signup complete", response.data.data, vm);
          console.log("signup complete headers", response.config.headers);
          if (hasImage()) {
            uploadImage(response.headers, response.data.data.id);
          }else{
            $state.go("home");
          }
        },
        function(response){
          vm.signupForm["errors"]=response.data.errors;
          console.log("signup failure", response, vm);
        }
      );
    }

    function uploadImage(headers, userId){
        console.log("headers: " , headers);
        console.log("header: ", headers("access-token"));
        console.log("userId: ", userId);
        var image = new Image();
        image.user = {};
        image.user.id = userId;
        image.image_content = {};
        image.image_content.content_type = "image/jpeg"
        image.image_content.content = vm.image_content.content;
        image.$save().then(
          function(result){
            console.log("uploadImage: ", result);
            vm.image_content = null;
            activateUser();            
          },
          function(error){
            console.log("uploadImage error: ", error);
            $state.go("home");
            vm.image_content = null;
          });
    }

    function activateUser(){
      Authn.activateUser().then(function(response){
          $state.go("home");
      }).catch(function(error){
        console.log("activateUser: ", error);
      });
    }

    function setImageContent(dataUri) {
      console.log(" SignupController-setImageContent", dataUri ? dataUri.length : null);
      vm.image_content = DataUtils.getContentFromDataUri(dataUri);
      console.log("content: ", vm.image_content);
    }

    function hasImage(){
      return vm.image_content != null;
    }
  }
})();
