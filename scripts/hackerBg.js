function getRandomBinary() {
    return Math.floor(Math.random() * 2);
  }

  function getRandomX() {
    return Math.random() * window.innerWidth;
  }

  class FallingDigit {
    constructor() {
      this.digit = getRandomBinary();
      this.x = getRandomX();
      this.y = 0;
      this.speed = Math.random() * 5 + 2;
      this.element = document.createElement('span');
      this.element.innerText = this.digit;
      this.element.style.position = 'fixed';
      this.element.classList.add('falling-digit');
      this.element.style.left = this.x + 'px';
      this.element.style.top = this.y + 'px';
      document.body.appendChild(this.element);
    }

    update() {
      this.y += this.speed;
      this.element.style.top = this.y + 'px';
    }

    isOutOfScreen() {
      return this.y > window.innerHeight;
    }

    remove() {
      document.body.removeChild(this.element);
    }
  }

  const fallingDigits = [];

  function startAnimation() {
    setInterval(function () {
      const digit = new FallingDigit();
      fallingDigits.push(digit);
    }, 10);

    requestAnimationFrame(updateAnimation);
  }

  function updateAnimation() {
    fallingDigits.forEach(function (digit) {
      digit.update();

      if (digit.isOutOfScreen()) {
        digit.remove();
        const index = fallingDigits.indexOf(digit);
        fallingDigits.splice(index, 1);
      }
    });

    requestAnimationFrame(updateAnimation);
  }

  if (document.body.classList.contains('background-animation')) {
    startAnimation();
  }