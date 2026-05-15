import './style.css';

// DOM 요소 선택
const textInput = document.getElementById('textInput');
const currentCharCount = document.getElementById('currentCharCount');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultModal = document.getElementById('resultModal');
const closeModal = document.getElementById('closeModal');

const resultBadge = document.getElementById('resultBadge');
const confidenceBar = document.getElementById('confidenceBar');
const confidenceText = document.getElementById('confidenceText');
const analysisReason = document.getElementById('analysisReason');

// 1. 글자수 카운트 기능
// 사용자가 텍스트를 입력할 때마다 실시간으로 글자수를 업데이트합니다.
textInput.addEventListener('input', () => {
  const length = textInput.value.length;
  currentCharCount.textContent = length;
  
  // 텍스트가 없으면 분석 버튼 비활성화
  analyzeBtn.disabled = length === 0;
});

// 2. 모달 닫기 기능
closeModal.addEventListener('click', () => {
  resultModal.style.display = 'none';
  // 모달을 닫을 때 바의 너비도 초기화 (다시 열 때 애니메이션을 위해)
  confidenceBar.style.width = '0%';
});

// 모달 바깥 영역 클릭 시 닫기
resultModal.addEventListener('click', (e) => {
  if (e.target === resultModal) {
    resultModal.style.display = 'none';
    confidenceBar.style.width = '0%';
  }
});

// 3. 분석 버튼 클릭 핸들러
analyzeBtn.addEventListener('click', async () => {
  const text = textInput.value.trim();
  
  if (!text) {
    alert('분석할 내용을 입력해 주세요.');
    return;
  }

  // 로딩 상태 표시
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing...';

  try {
    // 백엔드 API 호출 (나중에 구현할 서버 주소)
    // 현재는 로컬 호스트 5000번 포트로 가정합니다.
    const response = await fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('서버 응답에 문제가 발생했습니다.');
    }

    const result = await response.json();
    
    // UI 업데이트 함수 호출
    showResult(result);

  } catch (error) {
    console.error('Error:', error);
    alert('분석 중 오류가 발생했습니다. 서버가 실행 중인지 확인해 주세요.');
  } finally {
    // 버튼 상태 복구
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze Sentiment';
  }
});

/**
 * 분석 결과를 화면(모달)에 표시하는 함수
 * @param {Object} data - 서버로부터 받은 결과 데이터
 */
function showResult(data) {
  const { sentiment, confidence, reason } = data;

  // 1. 결과 뱃지 스타일 및 텍스트 설정
  resultBadge.textContent = sentiment;
  resultBadge.className = 'result-badge'; // 클래스 초기화
  
  if (sentiment === 'Positive') {
    resultBadge.classList.add('badge-positive');
  } else if (sentiment === 'Negative') {
    resultBadge.classList.add('badge-negative');
  } else {
    resultBadge.classList.add('badge-neutral');
  }

  // 2. 신뢰도 바 및 텍스트 업데이트
  confidenceText.textContent = `Confidence: ${confidence}%`;
  
  // 3. 분석 이유 텍스트 삽입
  analysisReason.textContent = reason;

  // 4. 모달 표시
  resultModal.style.display = 'flex';

  // 5. 바 애니메이션 효과를 위해 약간의 지연 후 너비 조절
  setTimeout(() => {
    confidenceBar.style.width = `${confidence}%`;
  }, 100);
}
