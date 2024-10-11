document.addEventListener('DOMContentLoaded', function() {
    fetch('music.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const playlist = document.getElementById('playlist');

            data.forEach(track => {
                const li = document.createElement('li');
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.src = track.source;
                audio.innerHTML = `Your browser does not support the audio element.`;

                const title = document.createElement('p');
                title.textContent = track.title;

                li.appendChild(title);
                li.appendChild(audio);
                playlist.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching music data:', error));
});
