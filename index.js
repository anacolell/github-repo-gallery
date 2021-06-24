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
  // console.log(userData)
}

const displayUser = (userData) => {
  let userDiv = document.createElement('div');
  userDiv.innerHTML = `
  <img class="avatar" src= ${userData.avatar_url}/>
  <div>
    <p>Name: ${userData.name}</p>
    <p>Location: ${userData.location}</p>
    <p>Number of public repos: ${userData.public_repos}</p>
  </div>`;
  userDetails.append(userDiv);
}

fetchUsers()

/* fetch repos */

const fetchRepos = async () => {
  const reposUrl = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
  const reposData = await reposUrl.json();
  displayRepos(reposData)
  // console.log(reposData);
}

const displayRepos = (reposData) => {
  filterInput.classList.remove('hide');
  reposData.forEach((repo)=> {
    let reposLi = document.createElement('li');
    reposLi.classList.add('repo');
    reposLi.innerHTML = `
    <h3>${repo.name}</h3>`;
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
  <p>${repoData.name}<p>
  <p>${repoData.description}<p>
  <p>${languages.join(', ')}`;
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

