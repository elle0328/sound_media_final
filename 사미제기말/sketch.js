let song;
let fft, amp;
let colorModeIdx = 0;

function handleFile(file) {
  if (song) song.stop();
  song = loadSound(file, () => console.log("Music Load Success"));
}

const addFileBtn = document.getElementById("addFileBtn");
const fileInput = document.getElementById("fileInput");

addFileBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", e => {
  let file = e.target.files[0];
  if (file) handleFile(file);
});

function setup() {
  let canvas = createCanvas(500, 500); // 고정 정사각형
  canvas.parent(document.getElementById('canvas-container'));
  angleMode(DEGREES);

  fft = new p5.FFT(0.8, 2048);
  amp = new p5.Amplitude();

  document.getElementById("playBtn").addEventListener("click", playSong);
  document.getElementById("pauseBtn").addEventListener("click", pauseSong);
  document.getElementById("stopBtn").addEventListener("click", stopSong);
}

function playSong() {
  if (!song) return;
  if (!song.isPlaying()) song.play();
}

function pauseSong() {
  if (!song) return;
  if (song.isPlaying()) song.pause();
}

function stopSong() {
  if (song) song.stop();
}

function keyPressed() {
  if (key === '1') colorModeIdx = 0;
  if (key === '2') colorModeIdx = 1;
  if (key === '3') colorModeIdx = 2;
}

function draw() {
  background(255, 245, 250, 180);

  if (!song) {
    fill(180, 130, 170);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Please upload an audio file", width / 2, height / 2);
    return;
  }

  let waveform = fft.waveform();
  let level = amp.getLevel();
  let glow = map(level, 0, 0.3, 15, 100);

  let col;
  if (colorModeIdx === 0) col = color('#A8D0FF');  // pastel blue
  if (colorModeIdx === 1) col = color('#FFB8D9');  // pastel pink
  if (colorModeIdx === 2) col = color('#ADFFF1');  // pastel mint

  push();
  translate(width / 2, height / 2);
  let pulse = map(level, 0, 0.3, 1, 1.5);
  scale(pulse);
  rotate(sin(frameCount * 2) * 2);

  noFill();
  stroke(255);
  strokeWeight(3);
  drawingContext.shadowBlur = 40 + level * 100;
  drawingContext.shadowColor = "#FFFFFFCC";

  beginShape();
  for (let t = 0; t < 360; t++) {
    let x = 16 * pow(sin(t), 3);
    let y = -(13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t));
    vertex(x * 5, y * 5);
  }
  endShape(CLOSE);
  pop();

  drawingContext.shadowBlur = glow;
  drawingContext.shadowColor = col;

  noFill();
  stroke(red(col), green(col), blue(col), 200);
  strokeWeight(2 + level * 10);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height * 0.33, height * 0.67);
    vertex(x, y);
  }
  endShape();

  stroke(col);
  strokeWeight(3 + level * 8);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height * 0.33, height * 0.67);
    vertex(x, y);
  }
  endShape();
}
