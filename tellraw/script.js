function addSection() {
    const sectionHTML = `
        <div class="section">
            <div class="form-group">
                <label for="text">Text:</label>
                <input type="text" class="text" placeholder="Enter your message">
            </div>
            <div class="form-group">
                <label for="color">Color:</label>
                <select class="color">
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="yellow">Yellow</option>
                    <option value="white">White</option>
                    <option value="black">Black</option>
                </select>
            </div>
            <div class="form-group">
                <label for="bold">Bold:</label>
                <input type="checkbox" class="bold">
            </div>
            <div class="form-group">
                <label for="italic">Italic:</label>
                <input type="checkbox" class="italic">
            </div>
        </div>
    `;
    const sectionsDiv = document.getElementById('sections');
    sectionsDiv.insertAdjacentHTML('beforeend', sectionHTML);
}

function generateCommand() {
    const sections = document.querySelectorAll('.section');
    let tellrawCommand = '/tellraw @a [';

    sections.forEach((section, index) => {
        const text = section.querySelector('.text').value;
        const color = section.querySelector('.color').value;
        const bold = section.querySelector('.bold').checked;
        const italic = section.querySelector('.italic').checked;

        let sectionCommand = `{"text":"${text}","color":"${color}"`;

        if (bold) {
            sectionCommand += `,"bold":true`;
        }

        if (italic) {
            sectionCommand += `,"italic":true`;
        }

        sectionCommand += '}';

        if (index < sections.length - 1) {
            sectionCommand += ',';
        }

        tellrawCommand += sectionCommand;
    });

    tellrawCommand += ']';
    document.getElementById('command').textContent = tellrawCommand;
}
