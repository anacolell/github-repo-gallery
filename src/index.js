import '../css/style.css';

const userDetails = document.querySelector('.user-details');
const repoList = document.querySelector('.repo-list');
const reposContainer = document.querySelector('.repos');
const repoInfo = document.querySelector('.repo-info');
const backBtn = document.querySelector('.view-repos');
const filterInput = document.querySelector('.filter-repos');

const github_data = {
  "token": process.env.MY_TOKEN,
  "username": "anacolell"
};

let repos = [];

const fetchUsers = async () => {
 const userUrl = await fetch(`https://api.github.com/users/${github_data["username"]}`);
 const userData = await userUrl.json();
 displayUser(userData)
}

const displayUser = (userData) => {
  let userDiv = document.createElement('div');
  userDiv.innerHTML = `
    <img class="avatar" src= ${userData.avatar_url}/>
    <div class="user-data">
      <p><strong>Name:</strong> ${userData.name}</p>
      <p><strong>Location:</strong> ${userData.location}</p>
      <p><strong>Number of public repos:</strong> ${userData.public_repos}</p>
    </div>`;
  userDetails.append(userDiv);
}

fetchUsers()

const baseUrl = "https://api.github.com/graphql";

const headers = {
  'Content-Type': "application/json",
  'Authorization': `bearer ${github_data["token"]}`
}

const body = {
  "query": `
  query {
    repositoryOwner(login:"${github_data["username"]}"){
      repositories(orderBy:{
        field:CREATED_AT, direction:DESC}, first:100, privacy:PUBLIC){
        nodes{
          openGraphImageUrl,
          name,
          description,
          url,
          homepageUrl,
          languages(first:10){
            nodes{
              name
            }
          }
        }
      }
    }
  }
  `
}

const fetchRepos = async () => {
  const reposUrl = await fetch(baseUrl, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(body)
})
  let reposResponse = await reposUrl.json();
  repos = await reposResponse.data.repositoryOwner.repositories.nodes;
  displayRepos(repos)
}

fetchRepos()

const displayRepos = (repos) => {
  filterInput.classList.remove('hide');
  repos.forEach((repo)=> {
    const repoLanguages = repo.languages.nodes;
    const languages = document.createElement("ul");
    languages.classList.add("language")

    repoLanguages.forEach(language => {
      const lang = document.createElement("li");
      lang.textContent = Object.values(language)
      languages.append(lang)
    })

    let reposLi = document.createElement('li');
    reposLi.classList.add('repo');
    reposLi.innerHTML = `
      <h3>${repo.name}</h3>
      <img src=${repo.openGraphImageUrl}>
      ${languages.outerHTML}
      <p>${repo.description}</p>
    `;
    repoList.append(reposLi);
    reposLi.classList.add('repo');
  })
}

repoList.addEventListener('click', function(e) {
  let item = e.target;
  if (item.classList.contains('repo-list')){
    return;
  } else {
    while (!item.classList.contains('repo')){
      item = item.parentElement
    }
  }
  let repoName = item.querySelector("h3").textContent
  let repoInfo = {};
  fetchRepo(repoName)
})

const fetchRepo = async (repoName) => {
  let repoPic = "";
  let repoHomeUrl = "";
  let repoUrl = "";
  let languagesList = [];
  let repoDescription = "";
  repos.forEach((repo) => {
    if (repo.name === repoName){
      repoPic = repo.openGraphImageUrl;
      repoHomeUrl = repo.homepageUrl;
      repoUrl = repo.url;
      repoDescription = repo.description
      repo.languages.nodes.forEach((language) => {
        languagesList.push(language.name)
      })
    }
  })
  fetchReadme(repoName)
  displayRepo(repoPic, languagesList, repoDescription, repoUrl, repoHomeUrl, repoName)
}

const displayRepo = (repoPic, languagesList, repoDescription, repoUrl, repoHomeUrl, repoName) => {
  let repoDiv = document.createElement('div');
  repoInfo.innerHTML = "";
  repoDiv.innerHTML = `
  <p class="repo-name">Name: ${repoName}<p>
  <p>Description: ${repoDescription}<p>
  <p>Languages: ${languagesList}
  <a class="visit" href="${repoUrl}" target="_blank" rel="noreferrer noopener">View Repo on GitHub</a>
  <a class="visit" href="${repoHomeUrl}" target="_blank" rel="noreferrer noopener">View live</a>`;
  repoInfo.append(repoDiv);
  reposContainer.classList.add('hide');
  repoInfo.classList.remove('hide');
  backBtn.classList.remove('hide')
  filterInput.classList.add('hide');
}

const fetchReadme = async (repoName) => {
  const readmeQuery = {
  "query": `
  query {
    repository(owner: "${github_data["username"]}", name: "${repoName}") {
    object(expression: "master:README.md") {
      ... on Blob {
        text
      }
    }
    }
  }
    `
  }
  const readmeUrl = await fetch(baseUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(readmeQuery)
  })

  let readmeResponse = await readmeUrl.json();
  let readme = await readmeResponse.data.repository.object.text
  fetchMarkDown(readme)
}

 const fetchMarkDown = async (readme) => {
  const res = await fetch("https://api.github.com/markdown", {
    method: "POST",
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      'text':readme
    })
  });
  let finalReadme = await res.text()
  const newDiv = document.createElement("div")
  newDiv.innerHTML = finalReadme
  repoInfo.append(newDiv)
 }

backBtn.addEventListener('click', (e) => {
  reposContainer.classList.remove('hide');
  repoInfo.classList.add('hide');
  backBtn.classList.add('hide');
  filterInput.classList.remove('hide')
})

filterInput.addEventListener('input', (e) => {
  let value = e.target.value;
  let valueLowerCase = e.target.value.toLowerCase();
  let repos = document.querySelectorAll('.repo')
  repos.forEach((repo)=>{
    let repoTitle = repo.innerText.toLowerCase();
    if (repoTitle.includes(valueLowerCase)){
      repo.classList.remove('hide');
    } else {
      repo.classList.add('hide');
    }
  })
})

