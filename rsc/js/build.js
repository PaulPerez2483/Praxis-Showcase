console.log('here');
var articles, related;
var url = window.location.href;
var articlesUrl = "".concat(url, "rsc/api/articles_db.json");
var relatedUrl = "".concat(url, "rsc/api/related_db.json");
var e = document.getElementById('categories');
var readinessArticles = document.getElementById('job-readiness-articles');

var realFetch = function realFetch(apiCompanies, apiProducts) {
  Promise.all([fetch(apiProducts), fetch(apiCompanies)]).then(function (response) {
    return Promise.all(response.map(function (result) {
      return result.json();
    }));
  }).then(function (data) {
    articles = data[1]['articles'];
    related = data[0]['related'];
    renderHTML(articles);
  })["catch"](function (err) {
    return console.log(err);
  });
};

var renderHTML = function renderHTML() {
  var html = articles.map(function (article) {
    return "<div class=\"article-holder\">\n                    <div class=\"img\">\n                        <img src=\"./rsc/images/".concat(article.image, "\" alt=\"").concat(article.title, "\" >\n                    </div>\n                    <div class=\"category\">\n                        <p>").concat(article.categories, "</p>\n                    </div>\n                    <div class=\"article-date\">\n                        ").concat(article.date, "\n                    </div>\n                    <div class=\"desc\">\n                        <h2><a href=\"").concat(article.link, "\">").concat(article.title, "</a>\n                        </h2>\n                        <p>").concat(article.summary, "</p>\n                    </div>\n\n                </div>");
  }).join('');
  readinessArticles.innerHTML = html;
};

e.addEventListener('change', function () {
  var e = document.getElementById("categories");
  var result = e.options[e.selectedIndex].value;
  console.log(articles, related);
  console.log(result);
});
realFetch(articlesUrl, relatedUrl);