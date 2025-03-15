// EDITOR

document.addEventListener("DOMContentLoaded", function () {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        var editor = monaco.editor.create(document.getElementById('editor'), {
            value: "",
            language: "html",
            theme: "vs-dark"
        });

        // Update iframe content when the editor's content changes
        editor.getModel().onDidChangeContent(function (event) {
            updateIframeContent(editor.getValue());
        });
    });

    function updateIframeContent(code) {
        const formattedCode = `<html><head></head><body>${code}</body></html>`;
        const iframeDocument = document.getElementById('result').contentDocument;
        iframeDocument.open();
        iframeDocument.write(formattedCode);
        iframeDocument.close();
    
        // Execute scripts in the iframe
        const existingScripts = [];
        const scriptTags = iframeDocument.getElementsByTagName('script');
        for (let i = 0; i < scriptTags.length; i++) {
            const script = scriptTags[i];
            if (script.src) {
                existingScripts.push(script.src);
            } else {
                existingScripts.push(script.textContent);
            }
        }
    
        const newScriptTags = code.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi);
        if (newScriptTags) {
            for (let i = 0; i < newScriptTags.length; i++) {
                const scriptText = newScriptTags[i];
                const srcMatch = scriptText.match(/src="([^"]+)"/);
                if (!srcMatch || !existingScripts.includes(srcMatch[1])) {
                    const newScript = document.createElement('script');
                    if (srcMatch) {
                        newScript.src = srcMatch[1];
                    } else {
                        newScript.textContent = scriptText.replace(/<\/?script[^>]*>/g, '');
                    }
                    iframeDocument.body.appendChild(newScript);
                }
            }
        }
    }    
});

var code = document.getElementById("editor").value;

// LESSON

var lesson = Number(localStorage.getItem('lesson') || "0");

document.getElementById('lessonNum').innerHTML = lesson + 1;

var instructions = [
    "In this tutorial, you will learn some basic tags and how to use them. Use the <h1> and <p> tags in your <body> tag to continue to lesson 2. Remember to add the ending tag (</tagname>)!",
    "In this lesson, you will learn about lists. Create an unordered list (<ul>) with at least three list items (<li>).",
    "In this lesson, you will learn about links. Create a link (<a>) that points to 'https://www.example.com' with the text 'Example'.",
    "In this lesson, you will learn about images. Add an image (<img>) with the source 'https://via.placeholder.com/150' and an alt text 'Placeholder Image'.",
    "In this lesson, you will learn about tables. Create a table (<table>) with at least one row (<tr>) and two cells (<td>).",
    "In this lesson, you will learn about forms. Create a form (<form>) with an input field (<input>) and a submit button (<button>)."
];

document.getElementById('lessonDesc').innerText = instructions[lesson];

setInterval(() => {
    code = document.getElementById("editor").value;
    let lessonChanged = false;
    if (lesson === 0 && code.includes('<p>') && code.includes('</p>') && code.indexOf('<p>') < code.indexOf('</p>') && code.includes('<h1>') && code.includes('</h1>') && code.indexOf('<h1>') < code.indexOf('</h1>')) {
        lesson += 1;
        lessonChanged = true;
    } else if (lesson === 1 && code.includes('<ul>') && code.includes('</ul>') && code.includes('<li>') && code.includes('</li>')) {
        lesson += 1;
        lessonChanged = true;
    } else if (lesson === 2 && code.includes('<a href="https://www.example.com">') && code.includes('</a>')) {
        lesson += 1;
        lessonChanged = true;
    } else if (lesson === 3 && code.includes('<img src="https://via.placeholder.com/150" alt="Placeholder Image">')) {
        lesson += 1;
        lessonChanged = true;
    } else if (lesson === 4 && code.includes('<table>') && code.includes('</table>') && code.includes('<tr>') && code.includes('</tr>') && code.includes('<td>') && code.includes('</td>')) {
        lesson += 1;
        lessonChanged = true;
    } else if (lesson === 5 && code.includes('<form>') && code.includes('</form>') && code.includes('<input') && code.includes('<button')) {
        lesson += 1;
        lessonChanged = true;
    }
    if (lessonChanged) {
        localStorage.setItem('lesson', lesson);
        document.getElementById('lessonNum').innerHTML = lesson + 1;
        document.getElementById('lessonDesc').innerText = instructions[lesson];
    }
}, 1000);
