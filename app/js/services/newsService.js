angular.module('services').factory('news', function($http, $q) {
  // Demonstrates that the proxy an be used for HTTP requests that aren't APIs, but things like RSS feeds

  // To customize the parameters, see this very handy page:
  // http://blog.slashpoundbang.com/post/12975232033/google-news-search-parameters-the-missing-manual
  return function(city) {
    var defer = $q.defer();
    $http({
      method: 'GET',
      url: '/proxy',
      params: {
        url: 'http://news.google.com/news/feeds?pz=1&cf=all&hdlOnly=1&hl=en&geo=' + encodeURIComponent(city),
        cache: true,
        ttl: 300 // cache for 5 minutes
      },
      headers: {
        accept: 'application/xml'
      }
    }).then(function(resp) {
      var articles = parseNewsXml(resp.data);
      defer.resolve(articles);
    }, function(err) {
      defer.reject(err);
    });

    return defer.promise;
  };

  function parseNewsXml(xmlString) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    var articles = [];
    angular.forEach(xmlDoc.getElementsByTagName("item"), function(node) {
      articles.push({
        title: node.getElementsByTagName("title")[0].innerHTML,
        href: node.getElementsByTagName("link")[0].innerHTML
      });
    });
    return articles;
  }
});
