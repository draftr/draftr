define(['draftr/api'], function (api) {
  'use strict';

  function WorkSpaceDetailOptionsController($scope, $state, $stateParams) {
    $scope.feeds      = null;
    $scope.team       = null;
    $scope.articles   = null;
    $scope.errUser    = null;
    $scope.errFeed    = null;
    $scope.feedUrl    = null;
    $scope.search     = null;
    $scope.success    = null;
    $scope.right      = null;
    $scope.user       = null;

    api()
      .resource('user/permission/' + $stateParams.id)
      .request()
      .then(function (result) {
        $scope.right = result.data.right;
      })
    ;

    api()
      .resource('me')
      .request()
      .then(function (result) {
        $scope.user = result.data;
      })
    ;

    $scope.updateWorkSpace = function updateWorkSpace() {
      api()
        .method('post')
        .resource('work-space/' + $stateParams.id)
        .data('name', $scope.entity.name)
        .data('description', $scope.entity.description)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.err = null;
            $scope.success = { message: "WorkSpace updated"};
            $scope.$apply();
            $scope.loadUser();
          });
          setTimeout(function () {
            $scope.success = null;
            $scope.$apply();
          },2000);
        })
        .catch(function(e) {
          setTimeout(function () {
            $scope.err = e;
            $scope.$apply();
          });
          setTimeout(function () {
            $scope.err = null;
            $scope.$apply();
          },2000);

          return;
        })
      ;
    }

    $scope.loadFeed = function loadFeed() {
      api()
        .resource('work-space/' + $stateParams.id + '/feed')
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.feeds = res.data;
            $scope.$apply();
          });
        })
      ;
    };

    $scope.loadUser = function loadUser() {
      api()
        .resource('work-space/' + $stateParams.id + '/user')
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.team = res.data;
            $scope.$apply();
          });
        })
      ;
    };

    $scope.loadArticle = function loadArticle() {
      api()
        .resource('work-space/' + $stateParams.id + '/article')
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.articles = res.data;
            $scope.$apply();
          });
        })
      ;
    }

    $scope.toOwner = function toOwner(id) {
      api()
        .method('post')
        .resource('work-space/' + $stateParams.id + '/user/' + id)
        .data('isModerator', true)
        .data('isOwner', true)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.errUser = null;
            $scope.success = { message: "User is now Owner"};
            $scope.$apply();
            $scope.loadUser();
          });
          setTimeout(function () {
            $scope.success = null;
            $scope.$apply();
          },2000);
        })
        .catch(function(e) {
          setTimeout(function () {
            $scope.errUser = e;
            $scope.$apply();
          });
          setTimeout(function () {
            $scope.errUser = null;
            $scope.$apply();
          },2000);

          return;
        })
      ;
    };

    $scope.remouveOwner = function toOwner(id) {
      api()
        .resource('user/permission/' + $stateParams.id)
        .request()
        .then(function (result) {
          if(result.data.right === "admin") {
             api()
              .method('post')
              .resource('work-space/' + $stateParams.id + '/user/' + id)
              .data('isModerator', true)
              .data('isOwner', false)
              .request()
              .then(function (res) {
                setTimeout(function () {
                  $scope.errUser = null;
                  $scope.success = { message: "Remouve Owner"};
                  $scope.$apply();
                  $scope.loadUser();
                });
                setTimeout(function () {
                  $scope.success = null;
                  $scope.$apply();
                },2000);
              })
              .catch(function(e) {
                setTimeout(function () {
                  $scope.errUser = e;
                  $scope.$apply();
                });
                setTimeout(function () {
                  $scope.errUser = null;
                  $scope.$apply();
                },2000);

                return;
              })
            ;
          }
        })
      ;
    };
    $scope.addNewUser = function addNewUser() {
       api()
        .method('post')
        .resource('user/search')
        .data('search', $scope.search)
        .request()
        .then(function (res) {
          api()
            .method('post')
            .resource('work-space/' + $stateParams.id + '/user')
            .data('user', res.data.id)
            .data('isModerator', true)
            .data('isOwner', false)
            .request()
            .then(function (res) {
              setTimeout(function () {
                $scope.errUser = null;
                $scope.success = { message: 'User "'+$scope.search+'" added'};
                $scope.$apply();
                $scope.loadUser();
              });
              setTimeout(function () {
                $scope.success = null;
                $scope.$apply();
              },2000);
            })
            .catch(function(e) {
              setTimeout(function () {
                $scope.errUser = e;
                $scope.$apply();
              });
              setTimeout(function () {
                $scope.errUser = null;
                $scope.$apply();
              },2000);
              return;
            })
          ;
        })
        .catch(function(e) {
          setTimeout(function () {
            $scope.errUser = e;
            $scope.$apply();
          });
         setTimeout(function () {
            $scope.errUser = null;
            $scope.$apply();
          },2000);
          return;
        })
    }

    $scope.addFeed = function addFeed() {
     api()
        .method('post')
        .resource('work-space/' + $stateParams.id + '/feed')
        .data('url', $scope.feedUrl)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.errFeed = null;
            $scope.success = { message: 'Feed "'+ $scope.feedUrl +'" added'};
            $scope.$apply();
            $scope.loadFeed();
          });
          setTimeout(function () {
            $scope.success = null;
            $scope.$apply();
          },2000);
        })
        .catch(function(e) {
          setTimeout(function () {
            $scope.errFeed = e;
            $scope.$apply();
          });
          setTimeout(function () {
            $scope.errFeed = null;
            $scope.$apply();
          },2000);
          return;
        })
      ;
    }

    $scope.removeFeed = function removeFeed(id) {
      api()
        .method('delete')
        .resource('work-space/' + $stateParams.id + '/feed/' + id)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.loadFeed();
          });
        })
      ;
    };

    $scope.removeArticle = function removeArticle(id) {
       api()
        .method('delete')
        .resource('work-space/' + $stateParams.id + '/article/' + id)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.loadArticle();
          });
        })
      ;
    };

    $scope.removeUser = function removeUser(id) {
       api()
        .method('delete')
        .resource('work-space/' + $stateParams.id + '/user/' + id)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.loadUser();
          });
        })
      ;
    };

    $scope.deleteWorkSpace = function deleteWorkSpace() {
      if($scope.right === "admin") {
        api()
          .method('delete')
          .resource('work-space/' + $stateParams.id)
          .request()
          .then(function (res) {
            setTimeout(function () {
              $state.go('work-space');
            });
          })
          .catch(function(e) {
            setTimeout(function () {
              $scope.errFeed = e;
              $scope.$apply();
            });
            setTimeout(function () {
              $scope.errFeed = null;
              $scope.$apply();
            },2000);
            return;
          })
        ;
      } else {
        setTimeout(function () {
          $scope.errFeed = { message: "Only the Admin can remouve the WorkSpace"};
          $scope.$apply();
        });
        setTimeout(function () {
          $scope.errFeed = null;
          $scope.$apply();
        },2000);
      }
    }

    $scope.loadUser();
    $scope.loadFeed();
    $scope.loadArticle();
  }

  return WorkSpaceDetailOptionsController;
});