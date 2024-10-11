$(document).ready(function() {
    var sections = $('section');
    var currentIndex = 0;

    // Show the initial section
    sections.eq(currentIndex).fadeIn(500);

    // Handle left and right arrow key presses
    $(document).keydown(function(e) {
        if (e.keyCode === 37) { // Left arrow key
            showPreviousSection();
        } else if (e.keyCode === 39) { // Right arrow key
            showNextSection();
        }
    });

    // Show the previous section
    function showPreviousSection() {
        sections.eq(currentIndex).fadeOut(500, function() {
            currentIndex = (currentIndex === 0) ? (sections.length - 1) : (currentIndex - 1);
            sections.eq(currentIndex).fadeIn(500);
        });
    }

    // Show the next section
    function showNextSection() {
        sections.eq(currentIndex).fadeOut(500, function() {
            currentIndex = (currentIndex === sections.length - 1) ? 0 : (currentIndex + 1);
            sections.eq(currentIndex).fadeIn(500);
        });
    }
});

$(document).ready(function() {
  var images = [
    "https://tommustbe12.com/assets/profile.png",
    "https://tommustbe12.com/assets/endscreenshot.png",
    "https://tommustbe12.com/assets/endislands.png",
    "https://tommustbe12.com/assets/mchouse.png"
  ];

  var textContainer = $("#text-container");

  textContainer.removeClass("show");

  setInterval(function() {
    var randomIndex = Math.floor(Math.random() * images.length);
    var randomImage = images[randomIndex];

    textContainer.addClass("show");
    textContainer.css("background-image", "url('" + randomImage + "')");

    setTimeout(function() {
      textContainer.removeClass("show");
    }, 4500);

  }, 5000);
});
