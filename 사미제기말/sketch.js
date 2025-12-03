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

  fft = new p5.FFT(0.7, 128);
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
  background(0, 30); 

  if (!song) {
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("오디오 파일을 업로드하세요", width / 2, height / 2);
    return;
  }

  // 분석 값 가져오기
  let level = amp.getLevel();            
  let radius = map(level, 0, 0.2, 80, 600);

  let spectrum = fft.analyze();         
  let waveform = fft.waveform();

  let col;
  if (colorModeIdx === 0) col = color(255, 50, 50);
  if (colorModeIdx === 1) col = color(50, 255, 200);
  if (colorModeIdx === 2) col = color(150, 50, 255);

  push();
translate(width / 2, height / 2);

noStroke();
fill(col);

let pulsing = map(level, 0, 0.1, 100, 800);
ellipse(0, 0, pulsing);

stroke(col);
strokeWeight(3);
beginShape();
for (let i = 0; i < spectrum.length; i++) {
  let angle = map(i, 0, spectrum.length, 0, 360);
  let ampVal = spectrum[i];
  let r = map(ampVal, 0, 255, radius, radius + 400);
  let x = r * cos(angle);
  let y = r * sin(angle);
  vertex(x, y);
}
endShape(CLOSE);
pop();

  noStroke();
  fill(col);
  ellipse(width / 2, height / 2, radius, radius);
}
