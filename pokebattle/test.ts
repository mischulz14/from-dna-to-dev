export default class Test {
  options: HTMLDivElement[];
  currentPosition: number;
  constructor() {
    console.log('test');
    this.options = Array.from(document.querySelectorAll('.option'));
    this.currentPosition = 0;
    console.log(this.options);

    // set the first option as active initially
    this.options[this.currentPosition].classList.add('active');
    let options = this.options;
    let currentPosition = this.currentPosition;

    window.addEventListener('keydown', function (event) {
      // remove active class from current option
      options[currentPosition].classList.remove('active');

      // use a switch statement to handle the arrow key inputs
      switch (event.key) {
        case 'ArrowDown':
          // move down by adding 2 to the current position
          currentPosition = (currentPosition + 2) % options.length;
          break;
        case 'ArrowUp':
          // move up by subtracting 2 from the current position
          currentPosition =
            (currentPosition - 2 + options.length) % options.length;
          break;
        case 'ArrowRight':
          // move right by adding 1 to the current position
          currentPosition = (currentPosition + 1) % options.length;
          break;
        case 'ArrowLeft':
          // move left by subtracting 1 from the current position
          currentPosition =
            (currentPosition - 1 + options.length) % options.length;
          break;
      }

      // add active class to the new current option
      options[currentPosition].classList.add('active');
    });
  }
}
