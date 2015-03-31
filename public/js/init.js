(function (requirejs) {
  'use strict';

  requirejs.config({
    basePath: '/',
    paths: {
      'draftr':            '/js/draftr',
      'jquery':            '/deps/jquery/dist/jquery',
      'angular':           '/deps/angular/angular',
      'angular/route':     '/deps/angular-route/angular-route',
      'angular/ui-router': '/deps/angular-ui-router/release/angular-ui-router',
      'bluebird':          '/deps/bluebird/js/browser/bluebird',
      'store':             '/deps/store.js/store+json2.min',
      'event-emitter':     '/deps/eventemitter2/lib/eventemitter2',
      'marked':            '/deps/marked/lib/marked',
      'angular/sanitize':  '/deps/angular-sanitize/angular-sanitize',
      'bootstrap':         '/deps/bootstrap/dist/js/bootstrap.min'
    },
    shim: {
      'angular':           { 'exports': 'angular', 'deps': ['jquery'] },
      'jquery':            { 'exports': 'jQuery'   },
      'angular/ui-router': { 'deps': ['angular']   },
      'angular/route':     { 'deps': ['angular']   },
      'angular/sanitize':  { 'deps': ['angular']   },
      'bootstrap':         { 'deps': ['jquery'] }
    },
    config: {
      'draftr/app': [
        { path: 'draftr/controller/header',               name: 'HeaderController' },
        { path: 'draftr/controller/home',                 name: 'HomeController'   },
        { path: 'draftr/controller/sign-in',              name: 'SignInController' },
        { path: 'draftr/controller/sign-up',              name: 'SignUpController' },
        { path: 'draftr/controller/feed/articleDetail',   name: 'FeedArticleDetailController' },
        { path: 'draftr/controller/work-space/list',      name: 'WorkSpaceListController' },
        { path: 'draftr/controller/work-space/detail',    name: 'WorkSpaceDetailController' },
        { path: 'draftr/controller/work-space/write',     name: 'WorkSpaceWriteController' },
        { path: 'draftr/controller/work-space/create',    name: 'WorkSpaceCreateController' },
        { path: 'draftr/controller/me/home',              name: 'MeHomeController' },
        { path: 'draftr/controller/me/profile/profile',   name: 'MeProfileController' },
        { path: 'draftr/controller/me/work-space/list',   name: 'MeWorkSpaceListController' },

        { path: 'draftr/controller/work-space/detail/article', name: 'WorkSpaceDetailArticleController' },
        { path: 'draftr/controller/work-space/detail/feed',    name: 'WorkSpaceDetailFeedController' },
        { path: 'draftr/controller/work-space/detail/team',    name: 'WorkSpaceDetailTeamController' },
        { path: 'draftr/controller/work-space/detail/options', name: 'WorkSpaceDetailOptionsController' },

        { path: 'draftr/controller/work-space/detail/options/settings', name: 'WorkSpaceDetailOptionsSettingsController' },
        { path: 'draftr/controller/work-space/detail/options/feed',     name: 'WorkSpaceDetailOptionsFeedController' },
        { path: 'draftr/controller/work-space/detail/options/team',     name: 'WorkSpaceDetailOptionsTeamController' },
        { path: 'draftr/controller/work-space/detail/options/article',  name: 'WorkSpaceDetailOptionsArticleController' },
      ]
    }
  });

  require(['draftr/bootstrap', 'bootstrap'], function () {});
})(window.requirejs);