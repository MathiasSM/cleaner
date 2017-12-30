import { Meteor } from 'meteor/meteor';
import { Mongo, MongoInternals } from 'meteor/mongo';

if (Meteor.isServer) {
  const _resetDatabase = function (options) {
    if (Meteor.isDevelopment) {
      throw new Error(
        'resetDatabase is not allowed outside of a development mode. ' +
        'Aborting.'
      );
    }

    options = options || {};
    var excludedCollections = ['system.indexes'];
    if (options.excludedCollections) {
      excludedCollections = excludedCollections.concat(options.excludedCollections);
    }

    var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
    db.getCollectionNames.forEach(
      function(cname) {
        db[cname].remove({});
      }
    );
  };

  Meteor.methods({
    'testing/resetDatabase': function (options) {
      _resetDatabase(options);
    }
  });

  resetDatabase = function(options, callback) {
    _resetDatabase(options);
    if (typeof callback === 'function') { callback(); }
  }

}
if (Meteor.isClient) {
  resetDatabase = function(options, callback) {
    Meteor.call('testing/resetDatabase', options, callback);
  }
}
