/* 게임 상태 변수 */
let state = {
  gold: 0,
  clickPower: 1,
  clickLevel: 1,
  autoIncome: 0,
  location: "고시원",
  gender: null,
  isAutoUnlocked: false
};

// DOM 요소들
const goldDisplay = document.getElementById('gold');
const autoRateDisplay = document.getElementById('auto-rate');
const locationDisplay = document.getElementById('location');
const playerSprite = document.getElementById('player-sprite');
const charSelectScreen = document.getElementById('char-select');
const gameScreen = document.getElementById('game-screen');
const tapBtn = document.getElementById('tap-area');
const roomBg = document.getElementById('room-bg');
const clickPowerText = document.getElementById('click-power-text');
const clickUpgradeBtn = document.getElementById('click-upgrade-btn');



/* 1. 게임 시작 (캐릭터 선택) */
window.startGame = (gender) => {
  state.gender = gender;
  playerSprite.src = gender === 'male' 
    ? import.meta.env.BASE_URL + 'assets/male_char.png' 
    : import.meta.env.BASE_URL + 'assets/female_char.png';
  
  charSelectScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  
  // 게임 루프 시작 (자동 수익)
  setInterval(() => {
    if (state.autoIncome > 0) {
      state.gold += state.autoIncome;
      updateUI();
    }
  }, 1000);
};

/* 2. 클릭(터치) 로직 */
roomBg.addEventListener('click', () => {
  state.gold += state.clickPower;
  
  // 클릭 애니메이션 효과
  roomBg.classList.add('active');
  setTimeout(() => roomBg.classList.remove('active'), 50);
  
  updateUI();
});


/* 3. 업그레이드 시스템 */
window.buyUpgrade = (type) => {
  if (type === 'click') {
    const cost = Math.floor(10 * Math.pow(1.5, state.clickLevel - 1));
    if (state.gold < cost) {
      alert("돈이 부족합니다!");
      return;
    }
    state.gold -= cost;
    state.clickPower += 1;
    state.clickLevel += 1;
  } else if (type === 'passive') {
    if (state.gold < 100) { alert("돈이 부족합니다!"); return; }
    state.gold -= 100;
    state.isAutoUnlocked = true;
    state.autoIncome = 1;
    document.getElementById('passive-unlock-item').classList.add('hidden');
    document.querySelectorAll('.passive-item').forEach(el => el.classList.remove('hidden'));
  } else if (type === 'auto') {
    if (state.gold < 500) { alert("돈이 부족합니다!"); return; }
    state.gold -= 500;
    state.autoIncome += 5;
  }

  updateUI();
};

/* 4. 이사하기 */
window.moveHouse = (level, cost) => {
  if (state.gold < cost) {
    alert("이사를 가기엔 아직 돈이 부족해요!");
    return;
  }

  state.gold -= cost;
  if (level === 1) state.location = "원룸";
  else if (level === 2) state.location = "투룸 (풀옵션)";
  
  updateUI();
  alert(`축하합니다! ${state.location}으로 이사했습니다!`);
};

/* 5. UI 업데이트 */
function updateUI() {
  goldDisplay.textContent = Math.floor(state.gold).toLocaleString();
  autoRateDisplay.textContent = state.autoIncome;
  locationDisplay.textContent = state.location;

  // 클릭 업그레이드 정보 업데이트
  if (clickPowerText && clickUpgradeBtn) {
    const nextCost = Math.floor(10 * Math.pow(1.5, state.clickLevel - 1));
    clickPowerText.textContent = `🔧 클릭 파워 (Lv.${state.clickLevel})`;
    clickUpgradeBtn.textContent = `가격: ${nextCost}G`;
  }
}

/* 탭 전환 로직 */
window.showTab = (tabId) => {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
};

/* --- 강아지 애니메이션 시스템 --- */
const dogSprite = document.getElementById('dog-sprite');
const dogContainer = document.getElementById('dog-container');
const walkFrames = [
  import.meta.env.BASE_URL + 'assets/dog_stand.png',
  import.meta.env.BASE_URL + 'assets/dog_walk_1.png',
  import.meta.env.BASE_URL + 'assets/dog_stand.png',
  import.meta.env.BASE_URL + 'assets/dog_walk_2.png',
  import.meta.env.BASE_URL + 'assets/dog_walk_3.png'
];
let walkFrameIdx = 0;
let dogState = 'walking'; // 'walking', 'standing', 'sitting'

// 1. 프레임 교체 (걷기 모션)
setInterval(() => {
  if (dogState === 'walking') {
    walkFrameIdx = (walkFrameIdx + 1) % walkFrames.length;
    dogSprite.src = walkFrames[walkFrameIdx];
  }
}, 150); // 0.15초마다 프레임 변경

// 2. 상태 전환 (5초 걷기 -> 15초 쉬기)
function dogRoutine() {
  if (dogState === 'walking') {
    // 5초 걷기 끝 -> 15초 쉬기 시작
    // 50% 확률로 가만히 서있기, 50% 확률로 앉기
    dogState = Math.random() < 0.5 ? 'sitting' : 'standing';
    
    // 화면상의 이동(animation)을 멈추기 위해 클래스 추가
    dogContainer.classList.add('sitting');
    
    if (dogState === 'sitting') {
      dogSprite.src = import.meta.env.BASE_URL + 'assets/dog_sit.png';
    } else {
      dogSprite.src = import.meta.env.BASE_URL + 'assets/dog_stand.png';
    }
    
    // 15초 후에 다시 걷기
    setTimeout(dogRoutine, 15000);
  } else {
    // 15초 쉬기 끝 -> 5초 걷기 시작
    dogState = 'walking';
    dogContainer.classList.remove('sitting');
    
    // 5초 후에 다시 쉬기
    setTimeout(dogRoutine, 5000);
  }
}

// 처음에 무조건 걷는 상태로 시작하므로, 5초 뒤에 쉬기 상태로 돌입
setTimeout(dogRoutine, 5000);

