function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

console.log('here');
var articles, related;
var url = window.location.href;
var articlesUrl = "".concat(url, "rsc/api/articles_db.json");
var relatedUrl = "".concat(url, "rsc/api/related_db.json");
var e = document.getElementById('categories');
var readinessArticles = document.getElementById('job-readiness-articles');

var liButtons = _toConsumableArray(document.querySelectorAll('.month-holder > ul > li > button'));

var goFetch = function goFetch(apiCompanies, apiProducts) {
  Promise.all([fetch(apiProducts), fetch(apiCompanies)]).then(function (response) {
    return Promise.all(response.map(function (result) {
      return result.json();
    }));
  }).then(function (data) {
    articles = data[1]['articles'];
    related = data[0]['related'];
    renderHTML(articles);
    updateCalendar(articles);
  })["catch"](function (err) {
    return console.log(err);
  });
};

var renderHTML = function renderHTML(data) {
  var html = data.map(function (article) {
    var month = article.date.slice(0, article.date.indexOf(' '));
    return "<div class=\"article-holder ".concat(month, "\">\n                <div class=\"mobile_only\">\n                    <div class=\"img\">\n                        <img src=\"./rsc/images/").concat(article.image, "\" alt=\"").concat(article.title, "\" >\n                    </div>\n                </div>\n                <div class=\"mobile_only\">\n                    <div class=\"category\">\n                        <p>").concat(article.categories, "</p>\n                    </div>\n\n                    <div class=\"article-date\">\n                        ").concat(article.date, "\n                    </div>\n\n                    <div class=\"desc\">\n                        <h2><a href=\"").concat(article.link, "\">").concat(article.title, "</a>\n                        </h2>\n                        <p>").concat(article.summary, "</p>\n                    </div>\n                </div>\n                </div>");
  }).join('');
  readinessArticles.innerHTML = html;
};

e.addEventListener('change', function (event) {
  var e = document.getElementById("categories");
  var user = e.options[e.selectedIndex].value;
  var processed = articles.filter(function (article) {
    return article.category_id.includes(user);
  });
  processed.relation = related.filter(function (key) {
    return key.article_id.includes(user);
  });

  if (user === 'all') {
    renderHTML(articles);
    updateCalendar(articles);
    updatePanel(processed.relation, user);
  } else {
    var articleData = processed.filter(function (article) {
      return article.category_id.includes(user);
    });
    renderHTML(articleData);
    updateCalendar(articleData);
    updatePanel(processed.relation, user);
  }
});

var updatePanel = function updatePanel(data, pick) {
  var knowPanel = document.getElementById('know-panel');
  var aboutPanel = document.getElementById('about-panel');

  var knowPanelElements = _toConsumableArray(knowPanel.children[0].children);

  var aboutPanelElements = _toConsumableArray(aboutPanel.children[0].children);

  if (pick === 'all') {
    knowPanelElements[0].innerHTML = 'Be In the Know';
    knowPanelElements[1].innerHTML = 'Get relevant resources and tips delivered right to your inbox with customized emails from ETS.';
    knowPanelElements[2].children[0].pathname = '/job-readiness/be-in-the-know';
    aboutPanelElements[0].innerHTML = 'About';
    aboutPanelElements[1].innerHTML = 'Find out more about ETS and our role within the workplace.';
    aboutPanelElements[2].children[0].pathname = '/job-readiness/about';
  } else {
    knowPanelElements[0].innerHTML = data[0].categories;
    knowPanelElements[1].innerHTML = data[0].summary;
    knowPanelElements[2].children[0].pathname = data[0].link;
    aboutPanelElements[0].innerHTML = data[1].categories;
    aboutPanelElements[1].innerHTML = data[1].summary;
    aboutPanelElements[2].children[0].pathname = data[1].link;
  }
};

var updateCalendar = function updateCalendar(data) {
  var articleHolder = _toConsumableArray(document.querySelectorAll('.article-holder'));

  liButtons.forEach(function (button) {
    button.classList.remove('blue-link');
    button.nextSibling.innerHTML = ' ';
    updateArticleCounter(data);
    button.disabled = true;
    data.forEach(function (m) {
      if (button.textContent.includes(m.date.slice(0, m.date.indexOf(' ')))) {
        button.classList.add('blue-link');

        if (button.classList.contains('blue-link')) {} else {
          button.nextSibling.innerHTML = ' ';
        }

        ;
        button.disabled = false;
        button.addEventListener('click', function (event) {
          var currentMonth = event.target.textContent;
          articleHolder.forEach(function (btn) {
            if (!btn.classList.contains(currentMonth)) {
              btn.classList.add('hide');
            } else {
              btn.classList.remove('hide');
            }
          });
        });
        return;
      }
    });
  });
};

var updateArticleCounter = function updateArticleCounter(data) {
  var articleCounter = {};
  data.forEach(function (obj) {
    var month = obj.date.slice(0, obj.date.indexOf(' '));
    articleCounter.hasOwnProperty(month) ? articleCounter[month]++ : articleCounter[month] = 1;
  });
  liButtons.forEach(function (li) {
    var currentMonth = li.textContent;
    var arr = Object.keys(articleCounter);

    if (arr.includes(currentMonth)) {
      console.dir(li.nextSibling.disabled = true);
      li.nextSibling.textContent = "(".concat(articleCounter[currentMonth], ")");
    }
  });
};

goFetch(articlesUrl, relatedUrl);