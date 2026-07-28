/* =========================================================
   PORTFOLIO — github.js
   Récupère dynamiquement les statistiques et les dépôts
   publics GitHub via l'API REST publique (sans authentification).
   ========================================================= */

(function(){
  const GITHUB_USERNAME = 'jeconiasazokpota89-lgtm';

  const reposStatEl = document.getElementById('ghRepos');
  const followersEl = document.getElementById('ghFollowers');
  const followingEl = document.getElementById('ghFollowing');
  const reposGrid = document.getElementById('githubRepos');
  const aboutReposStat = document.getElementById('githubReposStat');

  if (!reposGrid) return;

  async function fetchGithubData(){
    try{
      const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
      if (!userRes.ok) throw new Error('user fetch failed');
      const user = await userRes.json();

      reposStatEl.textContent = user.public_repos ?? '–';
      followersEl.textContent = user.followers ?? '–';
      followingEl.textContent = user.following ?? '–';
      if (aboutReposStat) aboutReposStat.setAttribute('data-count', user.public_repos ?? 0);

      const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
      if (!reposRes.ok) throw new Error('repos fetch failed');
      const repos = await reposRes.json();

      reposGrid.innerHTML = repos
        .filter(r => !r.fork)
        .slice(0, 6)
        .map(r => `
          <a class="repo-card" href="${r.html_url}" target="_blank" rel="noopener">
            <h4><i class="fa-solid fa-code-branch"></i> ${r.name}</h4>
            <p>${r.description ? r.description : 'Pas de description fournie.'}</p>
            <div class="repo-meta">
              <span><i class="fa-solid fa-star"></i> ${r.stargazers_count}</span>
              <span>${r.language ? r.language : '—'}</span>
            </div>
          </a>
        `).join('');

    } catch(err){
      reposGrid.innerHTML = `<p style="color:var(--text-dim); grid-column:1/-1;">
        Impossible de charger les dépôts GitHub pour le moment (limite d'API ou hors-ligne).
      </p>`;
      console.warn('GitHub API error:', err);
    }
  }

  fetchGithubData();
})();
