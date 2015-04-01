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
        .state('otherwise', {
          url: '/404',
          controller: 'ErrorController',
          templateUrl: util.visual('404')
        })
        .state('home', {
          url: '/',
          controller: 'HomeController',
          templateUrl: util.visual('home')
        })
        .state('feed-article', {
          url: '/feed/:id',
          controller: 'FeedArticleDetailController',
          templateUrl: util.visual('feed/articleDetail')
        })
        .state('work-space', {
          url: '/work-space',
          controller: 'WorkSpaceListController',
          templateUrl: util.visual('work-space/list')
        })
        .state('work-space-create', {
          url: '/work-space/create',
          controller: 'WorkSpaceCreateController',
          templateUrl: util.visual('work-space/create')
        })
        .state('work-space-detail', {
          url: '/work-space/:id',
          controller: 'WorkSpaceDetailController',
          templateUrl: util.visual('work-space/detail')
        })
        .state('work-space-detail.article', {
          url: '/article',
          views: {
            inner: {
              controller: 'WorkSpaceDetailArticleController',
              templateUrl: util.visual('work-space/detail/article')
            }
          }
        })
        .state('work-space-detail.team', {
          url: '/team',
          views: {
            inner: {
              controller: 'WorkSpaceDetailTeamController',
              templateUrl: util.visual('work-space/detail/team')
            }
          }
        })
        .state('work-space-detail.options', {
          url: '/options',
          views: {
            inner: {
              controller: 'WorkSpaceDetailOptionsController',
              templateUrl: util.visual('work-space/detail/options')
            }
          }
        })
        .state('work-space-detail.options.general', {
          url: '/general',
          views: {
            inner: {
              controller: 'WorkSpaceDetailOptionsGeneralController',
              templateUrl: util.visual('work-space/detail/options/general')
            }
          }
        })
        .state('work-space-detail.options.team', {
          url: '/team',
          views: {
            inner: {
              controller: 'WorkSpaceDetailOptionsTeamController',
              templateUrl: util.visual('work-space/detail/options/team')
            }
          }
        })
        .state('work-space-detail.options.feed', {
          url: '/feed',
          views: {
            inner: {
              controller: 'WorkSpaceDetailOptionsFeedController',
              templateUrl: util.visual('work-space/detail/options/feed')
            }
          }
        })
        .state('work-space-write', {
          url: '/work-space/:id/write/:articleId?',
          controller: 'WorkSpaceWriteController',
          templateUrl: util.visual('work-space/write')
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
        .state('me', {
          url: '/me',
          controller: 'MeHomeController',
          templateUrl: util.visual('me/home')
        })
        .state('me.profile', {
          url: '/profile',
          views: {
            inner: {
              controller: 'MeProfileController',
              templateUrl: util.visual('me/profile/profile')
            }
          }})
        .state('me.work-space-list', {
          url: '/work-space',
          views: {
            inner: {
              controller: 'MeWorkSpaceListController',
              templateUrl: util.visual('me/work-space/list')
            }
          }
        })
      ;
    }
  ];
});