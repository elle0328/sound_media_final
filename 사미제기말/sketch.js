let song;
let fft, amp;
let colorModeIdx = 0;

function handleFile(file) {
  if (song) song.stop();
  song = loadSound(file.data, () => console.log("Music Load Success"));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  fft = new p5.FFT(0.8, 2048);
  amp = new p5.Amplitude();

  let fileInput = document.getElementById("fileInput");
  fileInput.addEventListener("change", e => {
    let file = e.target.files[0];
    if (file) handleFile(file);
  });

  document.getElementById("playBtn").addEventListener("click", playPause);
  document.getElementById("stopBtn").addEventListener("click", stopSong);
}

function playPause() {
  if (!song) return;
  if (song.isPlaying()) song.pause();
  else song.play();
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
  background(10, 10, 30, 50);

  if (!song) {
    fill(230, 255, 255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("오디오 파일을 업로드하세요", width / 2, height / 2);
    return;
  }

  let waveform = fft.waveform();
  let level = amp.getLevel();

  let col;
  if (colorModeIdx === 0) col = color(0, 255, 255);
  if (colorModeIdx === 1) col = color(255, 0, 255); 
  if (colorModeIdx === 2) col = color(255, 255, 0); 

  noFill();
  stroke(col);
  strokeWeight(4 + level * 50);

  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height * 0.2, height * 0.8);

    stroke(col);
    vertex(x, y);
  }
  endShape();

  drawingContext.shadowBlur = 40 + level * 200;
  drawingContext.shadowColor = col;
}
