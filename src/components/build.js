console.log('here')
let articles, related;
const url = window.location.href;
const articlesUrl = `${url}rsc/api/articles_db.json`;
const relatedUrl = `${url}rsc/api/related_db.json`;
const e = document.getElementById('categories');
const readinessArticles = document.getElementById('job-readiness-articles');
// const liButtons = [...document.querySelectorAll('.month-holder > ul > li > button')];

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
        let month = article.date.slice(0, article.date.indexOf(' '));
        return `<div data-date="${Date.parse(article.date)}" class="article-holder ${month}">
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
    sortData();

}

e.addEventListener('change', (event)=> {
    let e = document.getElementById("categories");
    let user = e.options[e.selectedIndex].value;
    const processed = articles.filter(article => article.category_id.includes(user));
          processed.relation = related.filter(key => key.article_id.includes(user));
    if(user === 'all') {
        renderHTML(articles);
        updatePanel(processed.relation, user);
        
    }else {
        const articleData =  processed.filter(article => article.category_id.includes(user));
        renderHTML(articleData);
        updatePanel(processed.relation, user);;
        
    }
});

const sortData = () => {
    const upAndDownArrows = [...document.querySelectorAll('#sort-arrow > button')];
  const raw = [...document.querySelectorAll('[data-date]')];
upAndDownArrows.forEach(div => {
    // console.log(div)
        div.addEventListener('click', (e)=> {
            e.stopPropagation();
        // console.log(e.target)
        // console.log(e.target.id)
        // console.log(e.target)
        console.log(e.currentTarget)
            const selected = document.querySelectorAll('#sort-arrow > button')
            // console.log(selected)
            let button = e.target;
            
            if(e.currentTarget.id === 'up-arrow') {
                // console.log(button)
                button.setAttribute('aria-selected', 'true');
                selected[1].setAttribute('aria-selected', 'false');
                //  console.log(e.target.id)
                readinessArticles.innerHTML = '';
               let ascendingData = raw.sort((a, b) => {
                    return a.getAttribute('data-date') - b.getAttribute('data-date')
                 }).forEach(el => readinessArticles.appendChild(el));
                
                //  console.log(ascendingData)

            }else{
                button.setAttribute('aria-selected', 'true');
                selected[0].setAttribute('aria-selected', 'false');
                readinessArticles.innerHTML = '';
                let descendingData = raw.sort((a, b) => {
                    return  b.getAttribute('data-date') - a.getAttribute('data-date');
                 }).forEach(el => readinessArticles.appendChild(el))
                //  console.log(descendingData)
          
            }
        })
})
}

const updatePanel = (data, pick) => {

    const knowPanel = document.getElementById('know-panel');
    const aboutPanel = document.getElementById('about-panel');
    
    let knowPanelElements = [...knowPanel.children[0].children];
    let aboutPanelElements = [...aboutPanel.children[0].children]; 

    if (pick === 'all') {
        knowPanelElements[0].innerHTML = 'Be In the Know';
        knowPanelElements[1].innerHTML = 'Get relevant resources and tips delivered right to your inbox with customized emails from ETS.';
        knowPanelElements[2].children[0].pathname = '/job-readiness/be-in-the-know'
    
        aboutPanelElements[0].innerHTML = 'About';
        aboutPanelElements[1].innerHTML = 'Find out more about ETS and our role within the workplace.';
        aboutPanelElements[2].children[0].pathname = '/job-readiness/about';
    }else {
        knowPanelElements[0].innerHTML = data[0].categories;
        knowPanelElements[1].innerHTML = data[0].summary;
        knowPanelElements[2].children[0].pathname = data[0].link;

        aboutPanelElements[0].innerHTML = data[1].categories;
        aboutPanelElements[1].innerHTML = data[1].summary;
        aboutPanelElements[2].children[0].pathname = data[1].link;
    }
}

goFetch(articlesUrl, relatedUrl);
