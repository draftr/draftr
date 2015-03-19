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
          templateUrl: util.visual('work-space/list')
        })
        .state('work-space-detail', {
          url: '/work-space/:id',
          controller: 'WorkSpaceDetailController',
          templateUrl: util.visual('work-space/detail')
        })
        .state('signin', {
          url: '/sign-in',
          controller: 'SignInController',
          templateUrl: util.visual('sign-in')
        })
        .state('signup', {
          url: '/sign-up',
          controller: 'SignUpController',
          templateUrl: util.visual('sign-up')
        })
        .state('me-profile', {
          url: '/me/profile',
          controller: 'MeProfileController',
          templateUrl: util.visual('me/profile')
        })
        .state('me-work-space', {
          url: '/me/work-space',
          controller: 'MeWorkSpaceController',
          templateUrl: util.visual('me/work-space')
        })
      ;
    }
  ];
});