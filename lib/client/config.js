define(['draftr/util'], function (util) {
  'use strict';

  return [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
      $locationProvider.html5Mode(true);

      $urlRouterProvider.otherwise('/404');

      $stateProvider
        .state('home', {
          url: '/',
          controller: 'HomeController',
          templateUrl: util.visual('home')
        })
        .state('work-space', {
          url: '/work-space',
          controller: 'WorkSpaceListController',
          template: 'Workspace'
        })
        .state('signin', {
          url: '/sign-in',
          controller: 'SignInController',
          template: 'SignIn'
        })
        .state('signup', {
          url: '/sign-up',
          controller: 'SignUpController',
          template: 'SignUp'
        })
      ;
    }
  ];
});