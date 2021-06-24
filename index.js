const userDetails = document.querySelector('.user-details');
const repoList = document.querySelector('.repo-list')
const username = 'anacolell';

const fetchUsers = async () => {
  const userUrl = await fetch(`https://api.github.com/users/${username}`);
  const userData = await userUrl.json();
  displayUser(userData)
}

const displayUser = (userData) => {
  let userDiv = document.createElement('div');
  userDiv.innerHTML = "";
  userDiv.innerHTML = `
  <h3>Name: ${userData.name}</h3>
  <h3>Location: ${userData.location}</h3>
  <h3>Number of public repos: ${userData.public_repos}</h3>`;
  userDetails.append(userDiv);
}

fetchUsers()

const fetchRepos = async () => {
  const reposUrl = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
  const reposData = await reposUrl.json();
  displayRepos(reposData)
  console.log(reposData);
}

const displayRepos = (reposData) => {
  reposData.forEach((repo)=> {
    let reposDiv = document.createElement('div');
    reposDiv.innerHTML = `
    <li>${repo.name}</li>`
    repoList.append(reposDiv)
  })
}

fetchRepos()
