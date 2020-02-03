console.log('here')
let articles, related;
const url = window.location.href;
const articlesUrl = `${url}rsc/api/articles_db.json`;
const relatedUrl = `${url}rsc/api/related_db.json`;
const e = document.getElementById('categories');
const readinessArticles = document.getElementById('job-readiness-articles');



const goFetch = (apiCompanies, apiProducts) => {
    Promise.all([fetch(apiProducts), fetch(apiCompanies)])
    .then(response => Promise.all(response.map(result => result.json())))
    .then(data => {

        articles = data[1]['articles'];
        related =  data[0]['related'];

        renderHTML(articles);

    }).catch(err => console.log(err))
}

const renderHTML = (data) => {
    const html = data.map(article => {
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

e.addEventListener('change', (event)=> {
    var e = document.getElementById("categories");
    var user = e.options[e.selectedIndex].value;
    
    // console.log(articles)
    // console.log(related)
    // console.dir(event.target)

    const processed = articles.filter(article => article.category_id.includes(user));
          processed.relation = related.filter(key => key.article_id.includes(user));
    // console.log(processed)
    // console.log(user)
    
    
    if(user === 'all') {
        // console.log(processed)
        renderHTML(articles);
        updatePanel(processed.relation, user);
      
    }else {

        const articleData =  processed.filter(article => article.category_id.includes(user));
        console.log(articleData)
        // console.log(processed.relation)
        renderHTML(articleData);
        updatePanel(processed.relation, user);
     
    }
   

});

const updatePanel = (data, pick) => {
    
    // if(pick !== 'all') {
    
    const knowPanel = document.getElementById('know-panel');
    const aboutPanel = document.getElementById('about-panel');
    
    let knowPanelElements = [...knowPanel.children[0].children];
    let aboutPanelElements = [...aboutPanel.children[0].children]; 

    if(pick === 'all') {
        knowPanelElements[0].innerHTML = 'Be In the Know';
        knowPanelElements[1].innerHTML = 'Get relevant resources and tips delivered right to your inbox with customized emails from ETS.'
        knowPanelElements[2].children[0].pathname = '/job-readiness/be-in-the-know'
    
        aboutPanelElements[0].innerHTML = 'About';
        aboutPanelElements[1].innerHTML = 'Find out more about ETS and our role within the workplace.';
        aboutPanelElements[2].children[0].pathname = '/job-readiness/about';
    }else{
        knowPanelElements[0].innerHTML = data[0].categories;
        knowPanelElements[1].innerHTML = data[0].summary;
        knowPanelElements[2].children[0].pathname = data[0].link

        aboutPanelElements[0].innerHTML = data[1].categories;
        aboutPanelElements[1].innerHTML = data[1].summary;
        aboutPanelElements[2].children[0].pathname = data[1].link
    }
}

goFetch(articlesUrl, relatedUrl);
