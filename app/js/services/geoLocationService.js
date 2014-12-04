angular.module('services').factory('geoLocation', function($q, $timeout, $http) {
  // TODO: Enhance this service to use a GeoLocation API such as the Google maps API
  // https://developers.google.com/maps/documentation/javascript/geocoding

  // For now just hardcoding the lat/long for our test cities
  var geoloc = function(city, ST){
     return $http({
      method: 'GET',
      url: '/proxy',
      params: {
        url: 'http://www.datasciencetoolkit.org/street2coordinates/' + city + '+' + ST,
        cache: 1,
        ttl: 300 // cache for 5 minutes
      }
    });
  };

  var deferred = $q.defer();
  geoloc("Seattle", "WA").then(function(resp) {
    var seattle = resp.data;
    var slat = seattle['Seattle WA'].latitude;
    var slon = seattle['Seattle WA'].longitude;
    seattle = slat + ',' + slon;
    deferred.resolve(seattle);
    //window.mytest = seattle;
    console.log(slat + ', ' + slon);
    return seattle;
  });

  return function(city) {
    var latLong = null;
    var deferred = $q.defer();

    // Use a $q resolved to simulate a $http call that returns a promise
    $timeout(function() {
      switch (city.toLowerCase()) {
        case "seattle":

          deferred.resolve([seattle]);
          break;
        case "london":
          deferred.resolve([51.5171,-0.1062]);
          break;
        case "tokyo":
          deferred.resolve([35.6832,139.8089]);
          break;
        case "new york":
          deferred.resolve([40.7142,-74.0064]);
          break;
        default:
          deferred.reject("Invalid city");
      }
    }, 20);
    return deferred.promise;
  };
});
