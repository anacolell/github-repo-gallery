import '../css/style.css';

const userDetails = document.querySelector('.user-details');
const repoList = document.querySelector('.repo-list');
const reposContainer = document.querySelector('.repos');
const repoInfo = document.querySelector('.repo-info');
const backBtn = document.querySelector('.view-repos');
const filterInput = document.querySelector('.filter-repos');
const username = 'anacolell';
/* fetch users */

 const fetchUsers = async () => {
   const userUrl = await fetch(`https://api.github.com/users/${username}`);
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

/* fetch repos from Graphql */

const baseUrl = "https://api.github.com/graphql";

const github_data = {
  "token": process.env.MY_TOKEN,
  "username": "anacolell"
};

const headers = {
  'Content-Type': "application/json",
  'Authorization': "bearer " + github_data["token"]
}

const body = {
  "query": `
  query {
    repositoryOwner(login:"anacolell"){
      repositories(orderBy:{
        field:CREATED_AT, direction:DESC}, first:100, privacy:PUBLIC){
        nodes{
          openGraphImageUrl,
          name,
          description,
          url,
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
  let repos = await reposResponse.data.repositoryOwner.repositories.nodes;
  console.log(repos)

  filterInput.classList.remove('hide');
  repos.forEach((repo)=> {

  const repoLanguages = repo.languages.nodes;
  const languages = document.createElement("ul");
  languages.classList.add("language-pill")

  repoLanguages.forEach(language => {
    const lang = document.createElement("li");
    lang.textContent = Object.values(language)
    languages.append(lang)
  })
      console.log(languages)
  let reposLi = document.createElement('li');
  reposLi.classList.add('repo');
  reposLi.innerHTML = `
  <h3>${repo.name}</h3>
  <img src=${repo.openGraphImageUrl}>
  ${languages.outerHTML}
  `;
  repoList.append(reposLi);
  reposLi.classList.add('repo');
})
}

fetchRepos()

/* fetch individual repos when clicked */

repoList.addEventListener('click', function(e) {
  if (e.target.matches("h3")){
    let repoName = e.target.innerText;
    fetchRepo(repoName)
  }
})

const fetchRepo = async (repoName) => {
  const repoUrl = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoData = await repoUrl.json();
  const languagesUrl = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);
  const languagesData = await languagesUrl.json();
  const languages = Object.keys(languagesData);
  console.log(repoData)
  displayRepo(repoData, languages)
}

const displayRepo = (repoData, languages) => {
  let repoDiv = document.createElement('div');
  repoInfo.innerHTML = "";
  repoDiv.innerHTML = `
  <p class="repo-name">Name: ${repoData.name}<p>
  <p>Description: ${repoData.description}<p>
  <p>Languages: ${languages.join(', ')}
  <a class="visit" href="${repoData.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub</a>`;
  repoInfo.append(repoDiv);
  reposContainer.classList.add('hide');
  repoInfo.classList.remove('hide');
  backBtn.classList.remove('hide')
  filterInput.classList.add('hide');
}

/* hide button when going back to repo list */

backBtn.addEventListener('click', (e)=> {
  reposContainer.classList.remove('hide');
  repoInfo.classList.add('hide');
  backBtn.classList.add('hide');
  filterInput.classList.remove('hide')
})

/* search function */

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

const fetchReadme = async () => {
  const readmeUrl = await fetch(baseUrl, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(bodyQuery)
})
  let readmeResponse = await readmeUrl.json();
  let readme = await readmeResponse.data.repository.object.text
  console.log(readme)
}
   const bodyQuery = {
  "query": `
  query {
    repository(owner: "anacolell", name: "locally") {
    object(expression: "master:README.md") {
      ... on Blob {
        text
      }
  }
  }
}
  `
}


