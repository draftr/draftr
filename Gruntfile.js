module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    express: {
      options: {
        script: 'draftr.js',
        output: 'draftr is running'
      },
      prod: {
        options: {
          'node_env': 'prod'
        }
      },
      dev: {
        options: {
          'node_env': 'dev'
        }
      }
    },
    watch: {
      express: {
        files: ['./lib/server/**/*.js', './draftr.js', './config.js'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      },
      sass: {
        files: ['./public/sass/**/*.sass'],
        tasks: ['layout']
      }
    },
    'mocha_istanbul': {
      coverage: {
        src: 'test',
        options: {
          mask: '**/*.test.js',
          coverageFolder: 'dist/coverage'
        }
      }
    },
    'release-it': {
      options: {
        pkgFiles: ['package.json']
      }
    },
    jshint: {
      src: ['lib/**/*.js', 'test/**/*.js', 'draftr.js'],
      options: {
        jshintrc: true
      }
    },
    env: {
      dev: {
        'NODE_ENV': 'dev'
      },
      test: {
        'NODE_ENV': 'test'
      }
    },
    shell: {
      bower: {
        command: './node_modules/.bin/bower install'
      }
    },
    clean: {
      deps: [
        './public/deps',
        './public/css/style.css'
      ],
      dist: [
        './dist'
      ]
    },
    cssmin: {
      main: {
        files: {
          'public/css/draftr.css': [
            'public/deps/bootstrap/dist/css/bootstrap.css',
            'public/css/draftr.css'
          ]
        }
      }
    },
    sass: {
      main: {
        options: {
          sourcemap: 'none'
        },
        files: {
          './public/css/draftr.css': './public/sass/draftr.sass'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-release-it');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('layout', ['sass:main', 'cssmin:main']);
  grunt.registerTask('install', ['shell:bower']);
  grunt.registerTask('valid', ['jshint']);
  grunt.registerTask('test', ['env:test', 'mocha_istanbul']);
  grunt.registerTask('dev', ['env:dev', 'layout', 'express:dev', 'watch']);
};