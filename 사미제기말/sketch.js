let song;
let fft, amp;
let colorModeIdx = 0;

// 파일 선택 이벤트 연결
function handleFile(file) {
  if (song) song.stop();
  song = loadSound(file.data, () => console.log("Music Load Success"));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // 분석 객체 생성 (FFT + Amplitude 둘 다 사용)
  fft = new p5.FFT(0.8, 128);
  amp = new p5.Amplitude();

  // UI 버튼 연결
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
  background(0, 30); // 잔상 효과

  if (!song) {
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("오디오 파일을 업로드하세요", width / 2, height / 2);
    return;
  }

  // 분석 값 가져오기
  let level = amp.getLevel();            // 0 ~ 1 사이 값
  let radius = map(level, 0, 0.3, 50, 300);

  let spectrum = fft.analyze();          // 주파수 배열
  let waveform = fft.waveform();

  // 색상 모드 변경
  let col;
  if (colorModeIdx === 0) col = color(255, 50, 50);
  if (colorModeIdx === 1) col = color(50, 255, 200);
  if (colorModeIdx === 2) col = color(150, 50, 255);

  push();
  translate(width / 2, height / 2);

  noFill();
  stroke(col);
  strokeWeight(3);

  // 원형 Audio Ring
  beginShape();
  for (let i = 0; i < spectrum.length; i++) {
    let angle = map(i, 0, spectrum.length, 0, 360);
    let ampVal = spectrum[i];
    let r = map(ampVal, 0, 255, radius, radius + 200);
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();

  // 중앙 Pulse Circle
  noStroke();
  fill(col);
  ellipse(width / 2, height / 2, radius, radius);
}
