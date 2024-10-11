document.addEventListener('DOMContentLoaded', () => {
    fetch('projects.json')
      .then(response => response.json())
      .then(data => displayProjects(data.projects));
  
    document.querySelectorAll('.category').forEach(button => {
      button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        filterProjects(category);
      });
    });
  
    document.getElementById('search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      searchProjects(query);
    });
  
    document.addEventListener('mousemove', handleMouseMove);
  });
  
  function displayProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    projects.forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.classList.add('project');
      projectElement.innerHTML = `
        <h2 class="project-title">${project.title}</h2>
        <p class="project-description">${project.description}</p>
        <a class="project-link" target="_blank" href="${project.link}">Visit Site</a>
      `;
      container.appendChild(projectElement);
    });
  }
  
  function filterProjects(category) {
    fetch('projects.json')
      .then(response => response.json())
      .then(data => {
        const filteredProjects = category === 'all' ? data.projects : data.projects.filter(project => project.category === category);
        displayProjects(filteredProjects);
      });
  }
  
  function searchProjects(query) {
    fetch('projects.json')
      .then(response => response.json())
      .then(data => {
        const filteredProjects = data.projects.filter(project => project.title.toLowerCase().includes(query) || project.description.toLowerCase().includes(query));
        displayProjects(filteredProjects);
      });
  }
  
  function handleMouseMove(e) {
    const x = e.clientX;
    const y = e.clientY;
    const tiles = document.querySelectorAll('.tile');
  
    tiles.forEach(tile => {
      const dx = tile.offsetLeft + 10 - x;
      const dy = tile.offsetTop + 10 - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance < 150) {
        tile.style.display = 'block';
        tile.style.transform = `translate(${x - 10}px, ${y - 10}px) rotateY(${distance / 5}deg)`;
      } else {
        tile.style.display = 'none';
      }
    });
  }
  
  for (let i = 0; i < 100; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    document.querySelector('.ripple-background').appendChild(tile);
  }
  