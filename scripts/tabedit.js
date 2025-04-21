(function() {
    // Storage for saved icons (localStorage)
    const savedIcons = JSON.parse(localStorage.getItem('savedIcons')) || [];

    // Predefined icons (Example for Google)
    const predefinedIcons = {
        2: 'https://www.gstatic.com/images/branding/product/1x/googledrive_48dp.png',  // Google Drive
        3: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',  // Google Search
    };

    // Function to update the tab title and icon
    function updateTab() {
        const newTitle = prompt("Enter the new title for this tab:", document.title);
        if (newTitle) document.title = newTitle;

        const newIcon = prompt("Enter the URL of the new icon (favicon):", document.querySelector("link[rel*='icon']") ? document.querySelector("link[rel*='icon']").href : "");
        
        if (newIcon) {
            let link = document.createElement("link");
            link.rel = "icon";
            link.href = newIcon;
            document.head.appendChild(link);
        }
    }

    // Function to save an icon
    function saveIcon(iconUrl) {
        if (savedIcons.length >= 10) {
            alert("You can save up to 10 icons.");
            return;
        }
        savedIcons.push(iconUrl);
        localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
        alert('Icon saved!');
    }

    // Function to display saved icons and predefined icons
    function showIconOptions() {
        let iconChoice = prompt(
            "Enter a number to select an icon:\n" +
            "1 - Change title and icon manually\n" +
            "2 - Google Drive\n" +
            "3 - Google Search\n" +
            "4 - Save custom icon URL\n" +
            "Saved icons: " + savedIcons.map((icon, idx) => `${idx + 5}: ${icon}`).join(", ")
        );

        // Check if it's a predefined icon
        if (predefinedIcons[iconChoice]) {
            const icon = predefinedIcons[iconChoice];
            let link = document.createElement("link");
            link.rel = "icon";
            link.href = icon;
            document.head.appendChild(link);
            alert(`Icon set to ${iconChoice === "2" ? "Google Drive" : "Google Search"}`);
        }
        // Check if it's a saved icon
        else if (iconChoice >= 5 && iconChoice <= 14) {
            const savedIcon = savedIcons[iconChoice - 5];
            let link = document.createElement("link");
            link.rel = "icon";
            link.href = savedIcon;
            document.head.appendChild(link);
            alert(`Icon set to saved icon ${iconChoice - 4}`);
        }
        // If it's 4, prompt for custom URL and save it
        else if (iconChoice == 4) {
            const customIconUrl = prompt("Enter the custom icon URL to save:");
            if (customIconUrl) {
                saveIcon(customIconUrl);
            }
        }
        // If it's 1, prompt for manual title and icon change
        else if (iconChoice == 1) {
            updateTab();
        } else {
            alert("Invalid option.");
        }
    }

    // Trigger the function to show options
    showIconOptions();
})();
