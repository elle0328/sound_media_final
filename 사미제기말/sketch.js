// 🎵 전역 변수 선언
let song;       // 현재 재생 중인 오디오 객체
let fft, amp;   // FFT 분석기와 Amplitude 분석기
let colorModeIdx = 0; // 색상 모드 인덱스 (1~3 키로 변경)

// 🎵 오디오 파일 처리 함수
function handleFile(file) {
  if (song) song.stop(); // 이전에 재생 중인 곡 정지
  song = loadSound(file, () => console.log("Music Load Success")); // 새 오디오 로드
}

// 🎵 DOM 요소 선택
const addFileBtn = document.getElementById("addFileBtn");
const fileInput = document.getElementById("fileInput");

// 🎵 파일 업로드 버튼 클릭 이벤트
addFileBtn.addEventListener("click", () => fileInput.click());

// 🎵 파일 선택 시 handleFile 호출
fileInput.addEventListener("change", e => {
  let file = e.target.files[0];
  if (file) handleFile(file);
});

// 🎵 p5.js setup 함수 - 초기 설정
function setup() {
  createCanvas(windowWidth, windowHeight); // 캔버스 생성 (윈도우 크기)
  angleMode(DEGREES);                      // 각도를 도 단위로 설정

  // FFT와 Amplitude 객체 초기화
  fft = new p5.FFT(0.8, 2048);  // FFT smooth=0.8, bins=2048
  amp = new p5.Amplitude();     // 소리 세기 측정

  // 재생, 일시정지, 정지 버튼 이벤트 연결
  document.getElementById("playBtn").addEventListener("click", playSong);
  document.getElementById("pauseBtn").addEventListener("click", pauseSong);
  document.getElementById("stopBtn").addEventListener("click", stopSong);
}

// 🎵 오디오 재생
function playSong() {
  if (!song) return;        // 파일 없으면 종료
  if (!song.isPlaying()) song.play(); // 재생
}

// 🎵 오디오 일시정지
function pauseSong() {
  if (!song) return;
  if (song.isPlaying()) song.pause();
}

// 🎵 오디오 정지
function stopSong() {
  if (song) song.stop();
}

// 🎨 색상 모드 전환 (1~3 키 입력)
function keyPressed() {
  if (key === '1') colorModeIdx = 0; // 파스텔 블루
  if (key === '2') colorModeIdx = 1; // 파스텔 핑크
  if (key === '3') colorModeIdx = 2; // 파스텔 민트
}

// 🎨 p5.js draw 함수 - 매 프레임마다 호출
function draw() {
  // 배경색 - 밝은 연핑크 + 투명도
  background(255, 245, 250, 180);

  // 오디오 파일 미선택 시 안내 텍스트 표시
  if (!song) {
    fill(180, 130, 170); // 파스텔 딥라일락 텍스트
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Please upload an audio file", width / 2, height / 2);
    return;
  }

  // FFT와 Amplitude 데이터 가져오기
  let waveform = fft.waveform();    // 파형 데이터
  let level = amp.getLevel();       // 현재 소리 세기
  let glow = map(level, 0, 0.3, 15, 100); // 파형/하트 글로우 강도

  // 색상 설정 (선택한 colorModeIdx 기준)
  let col;
  if (colorModeIdx === 0) col = color('#A8D0FF');  // pastel blue
  if (colorModeIdx === 1) col = color('#FFB8D9');  // pastel pink
  if (colorModeIdx === 2) col = color('#ADFFF1');  // pastel mint

  // ❤️ 하트 모양 그리기 (파형 뒤)
  push();                   // 현재 변환 상태 저장
  translate(width / 2, height / 2);  // 캔버스 중앙 이동

  let pulse = map(level, 0, 0.3, 1, 1.5); // 소리에 따른 확대
  scale(pulse);
  rotate(sin(frameCount * 2) * 2);       // 살짝 흔들림 효과

  noFill();
  stroke(255);               // 하트 흰색
  strokeWeight(3);
  drawingContext.shadowBlur = 40 + level * 100;  // 그림자 확대
  drawingContext.shadowColor = "#FFFFFFCC";      // 반투명 흰색 그림자

  beginShape();
  for (let t = 0; t < 360; t++) {
    let x = 16 * pow(sin(t), 3);
    let y = -(13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t));
    vertex(x * 5, y * 5); // 하트 좌표
  }
  endShape(CLOSE);
  pop(); // 이전 변환 상태 복원

  // WAVEFORM 그리기
  drawingContext.shadowBlur = glow;   // 파형 글로우
  drawingContext.shadowColor = col;

  noFill();
  stroke(red(col), green(col), blue(col), 200); // 반투명 컬러
  strokeWeight(2 + level * 10);                 // 선 굵기 소리 세기 비례
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width); // X 좌표
    let y = map(waveform[i], -1, 1, height * 0.33, height * 0.67); // Y 좌표
    vertex(x, y);
  }
  endShape();

  stroke(col);
  strokeWeight(3 + level * 8);                  // 두 번째 레이어
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height * 0.33, height * 0.67);
    vertex(x, y);
  }
  endShape();
}
