import Phaser from 'phaser';

export function addProgressBar(scene: Phaser.Scene) {
  let progressBar = scene.add.graphics();
  let progressBox = scene.add.graphics();
  progressBox.fillStyle(0x222222, 0.8);
  progressBox.fillRect(240, 270, 320, 50);

  let width = scene.cameras.main.width;
  let height = scene.cameras.main.height;
  let loadingText = scene.make.text({
    x: width / 2,
    y: height / 2 - 50,
    text: 'Loading...',
    style: {
      font: '20px monospace',
    },
  });
  loadingText.setOrigin(0.5, 0.5);

  // Update progress bar based on the progress of the asset loader
  scene.load.on('progress', function (value) {
    // console.log(value);
    progressBar.clear();
    progressBar.fillStyle(0xffffff, 1);
    progressBar.fillRect(250, 280, 300 * value, 30);
  });

  scene.load.on('complete', function () {
    progressBar.destroy();
    progressBox.destroy();
    loadingText.destroy();
  });
}
