const cube = document.querySelector('.cube');
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotation = { x: -30, y: -45 };

document.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        rotation.x -= deltaY * 0.5;
        rotation.y += deltaX * 0.5;
        cube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    } else {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        cube.style.transform = `rotateX(${rotation.x + y * 45}deg) rotateY(${rotation.y - x * 45}deg)`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});
