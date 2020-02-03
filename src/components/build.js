console.log('here')
let articles, related;
const url = window.location.href;
const articlesUrl = `${url}rsc/api/articles_db.json`;
const relatedUrl = `${url}rsc/api/related_db.json`;
const e = document.getElementById('categories');
const readinessArticles = document.getElementById('job-readiness-articles');
const liButtons = [...document.querySelectorAll('.month-holder > ul > li > button')];

const goFetch = (apiCompanies, apiProducts) => {
    Promise.all([fetch(apiProducts), fetch(apiCompanies)])
    .then(response => Promise.all(response.map(result => result.json())))
    .then(data => {

        articles = data[1]['articles'];
        related =  data[0]['related'];
        
        renderHTML(articles);
        updateCalendar(articles);
      

    }).catch(err => console.log(err))
}

const renderHTML = (data) => {
    const html = data.map(article => {
        let month = article.date.slice(0, article.date.indexOf(' '));
        return `<div class="article-holder ${month}">
                <div class="mobile_only">
                    <div class="img">
                        <img src="./rsc/images/${article.image}" alt="${article.title}" >
                    </div>
                </div>
                <div class="mobile_only">
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
                </div>
                </div>` 
    }).join('');

    readinessArticles.innerHTML = html;

}

e.addEventListener('change', (event)=> {
    let e = document.getElementById("categories");
    let user = e.options[e.selectedIndex].value;
    const processed = articles.filter(article => article.category_id.includes(user));
          processed.relation = related.filter(key => key.article_id.includes(user));
    if(user === 'all') {
        renderHTML(articles);
        updateCalendar(articles);
        updatePanel(processed.relation, user);
    }else {
        const articleData =  processed.filter(article => article.category_id.includes(user));
        renderHTML(articleData);
        updateCalendar(articleData);
        updatePanel(processed.relation, user);
    }
});

const updatePanel = (data, pick) => {

    const knowPanel = document.getElementById('know-panel');
    const aboutPanel = document.getElementById('about-panel');
    
    let knowPanelElements = [...knowPanel.children[0].children];
    let aboutPanelElements = [...aboutPanel.children[0].children]; 

    if(pick === 'all') {
        knowPanelElements[0].innerHTML = 'Be In the Know';
        knowPanelElements[1].innerHTML = 'Get relevant resources and tips delivered right to your inbox with customized emails from ETS.';
        knowPanelElements[2].children[0].pathname = '/job-readiness/be-in-the-know'
    
        aboutPanelElements[0].innerHTML = 'About';
        aboutPanelElements[1].innerHTML = 'Find out more about ETS and our role within the workplace.';
        aboutPanelElements[2].children[0].pathname = '/job-readiness/about';
    }else{
        knowPanelElements[0].innerHTML = data[0].categories;
        knowPanelElements[1].innerHTML = data[0].summary;
        knowPanelElements[2].children[0].pathname = data[0].link;

        aboutPanelElements[0].innerHTML = data[1].categories;
        aboutPanelElements[1].innerHTML = data[1].summary;
        aboutPanelElements[2].children[0].pathname = data[1].link;
    }
}

const updateCalendar = (data) => {
    const articleHolder = [...document.querySelectorAll('.article-holder')];

    liButtons.forEach(button => {
        button.classList.remove('blue-link');
        button.nextSibling.innerHTML = ' ';
        updateArticleCounter(data);
        button.disabled = true;
        data.forEach(m => {
           
            if(button.textContent.includes(m.date.slice(0, m.date.indexOf(' ')))){
                button.classList.add('blue-link');
                if (button.classList.contains('blue-link')){

                }else{ 
                    button.nextSibling.innerHTML = ' '
                };
                
                button.disabled = false;
                button.addEventListener('click', (event)=>{
                    let currentMonth = event.target.textContent;
                    articleHolder.forEach(btn => {
                       if(!btn.classList.contains(currentMonth)){
                           btn.classList.add('hide');
                       }else{
                        btn.classList.remove('hide');
                       }
                    });
                });
                return
            }

        });
    });
    
}

const updateArticleCounter = (data) => {
  
    let articleCounter = {};

    data.forEach(obj => {
     let month = obj.date.slice(0, obj.date.indexOf(' '));
     articleCounter.hasOwnProperty(month) ? articleCounter[month]++ : articleCounter[month] = 1;
    });

    liButtons.forEach(li=> {
        let currentMonth = li.textContent;
        let arr = Object.keys(articleCounter);
        if(arr.includes(currentMonth)){
        console.dir(li.nextSibling.disabled =true)
        li.nextSibling.textContent = `(${articleCounter[currentMonth]})`
        }
    });
}

goFetch(articlesUrl, relatedUrl);
