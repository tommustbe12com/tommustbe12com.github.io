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
    "In this tutorial, you will learn some basic tags and how to use them. Use the <h1> and <p> tags in your <body> tag to continue to lesson 2. Remember to add the ending tag (</tagname>)!"
]

document.getElementById('lessonDesc').innerText = instructions[lesson];

setInterval(() => {
    if (lesson === 0 && code.includes('<p>') && code.includes('</p>') && code.indexOf('<p>') < code.indexOf('</p>') && code.includes('<h1>') && code.includes('</h1>') && code.indexOf('<h1>') < code.indexOf('</h1>')) {
        lesson += 1;
    }    
}, 1);


