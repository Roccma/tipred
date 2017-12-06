/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'tipred',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
        'ember-websockets' : {
          socketIO : true
        }
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },
    'ember-websockets' : {
      socketIO : true
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created

    }
  };

  ENV.refreshToken = "968a080ccdc366c20bf1e729def3c7b8cd34eb44";
  ENV.access_token = "4359067f6eac02e468eb14ab5402b29f5172d49a";
  ENV.nickname = "";
  ENV.email = "";
  ENV.avatar = "https://soygrowers.com/wp-content/uploads/2017/02/default_bio_600x600.jpg";


  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    /*ENV.nickname = "";
    ENV.email = "";
    ENV.avatar = "https://soygrowers.com/wp-content/uploads/2017/02/default_bio_600x600.jpg";*/
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    /*ENV.nickname = "";
    ENV.email = "";
    ENV.avatar = "https://soygrowers.com/wp-content/uploads/2017/02/default_bio_600x600.jpg";*/
  }

  if (environment === 'production') {
    /*ENV.nickname = "";
    ENV.email = "";
    ENV.avatar = "https://soygrowers.com/wp-content/uploads/2017/02/default_bio_600x600.jpg";*/

  }

  return ENV;
};
