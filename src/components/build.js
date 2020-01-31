console.log('here')
let articles, related;
const url = window.location.href;
const articlesUrl = `${url}rsc/api/articles_db.json`;
const relatedUrl = `${url}rsc/api/related_db.json`;
const e = document.getElementById('categories');
const readinessArticles = document.getElementById('job-readiness-articles');



const realFetch = (apiCompanies, apiProducts) => {
    Promise.all([fetch(apiProducts), fetch(apiCompanies)])
    .then(response => Promise.all(response.map(result => result.json())))
    .then(data => {

        articles = data[1]['articles'];
        related =  data[0]['related'];

        renderHTML(articles);

    }).catch(err => console.log(err))
}

const renderHTML = () => {
    const html = articles.map(article => {
        return `<div class="article-holder">
                    <div class="img">
                        <img src="./rsc/images/${article.image}" alt="${article.title}" >
                    </div>
                    <div class="category">
                        <p>${article.categories}</p>
                    </div>
                    <div class="article-date">
                        ${article.date}
                    </div>
                    <div class="desc">
                        <h2><a href="${article.link}">${article.title}</a>
                        </h2>
                        <p>${article.summary}</p>
                    </div>

                </div>` 
    }).join('');

    readinessArticles.innerHTML = html;

}

e.addEventListener('change', ()=> {
    var e = document.getElementById("categories");
    var result = e.options[e.selectedIndex].value;
    console.log(articles, related)
	console.log(result)
})

realFetch(articlesUrl, relatedUrl);
