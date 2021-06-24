const userDetails = document.querySelector('.user-details');
const repoList = document.querySelector('.repo-list');
const reposContainer = document.querySelector('.repos');
const repoInfo = document.querySelector('.repo-info');
const backBtn = document.querySelector('.view-repos');

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
  <img src= ${userData.avatar_url}/>
  <h3>Name: ${userData.name}</h3>
  <h3>Location: ${userData.location}</h3>
  <h3>Number of public repos: ${userData.public_repos}</h3>`;
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
  reposData.forEach((repo)=> {
    let reposLi = document.createElement('li');
    reposLi.innerHTML = `
    <h3>${repo.name}</h3>`;
    repoList.append(reposLi);
    reposLi.classList.add('repo');
  })
}

fetchRepos()

/* fetch individual repos when click event */

repoList.addEventListener('click', function(e) {
  if (e.target.matches("h3")){
    let repoName = e.target.innerText;
    fetchRepo(repoName)
  }
})

const fetchRepo = async (repoName) => {
  // console.log(repoName)
  const repoUrl = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoData = await repoUrl.json();
  // console.log(repoData)
  displayRepo(repoData)
}

const displayRepo = (repoData) => {
  let repoDiv = document.createElement('div');
  repoDiv.innerHTML = "";
  repoDiv.innerHTML = `<p>${repoData.name}<p>`;
  repoInfo.append(repoDiv);
  reposContainer.classList.add('hide');
  repoInfo.classList.remove('hide');
  backBtn.classList.remove('hide');
}

backBtn.addEventListener('click', (e)=> {
  reposContainer.classList.remove('hide');
  repoInfo.classList.add('hide');
  backBtn.classList.add('hide');
})

