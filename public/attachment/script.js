// public/attachment/script.js

// 1. 질문 리스트 (간단 버전)
const questions = [
    { id: 1, text: "연인과 떨어져 있을 때 불안함을 자주 느낀다.", options: ["전혀 아니다", "별로 아니다", "약간 그렇다", "매우 그렇다"] },
    { id: 2, text: "연인이 나에게 관심을 덜 주는 것 같아 서운하다.", options: ["전혀 아니다", "별로 아니다", "약간 그렇다", "매우 그렇다"] },
    { id: 3, text: "나는 연인에게 내 속마음을 털어놓기 어렵다.", options: ["전혀 아니다", "별로 아니다", "약간 그렇다", "매우 그렇다"] },
    { id: 4, text: "연인이 너무 가까워지려고 하면 부담스럽다.", options: ["전혀 아니다", "별로 아니다", "약간 그렇다", "매우 그렇다"] },
    { id: 5, text: "나는 연애보다 나의 일이 더 중요하다고 생각한다.", options: ["전혀 아니다", "별로 아니다", "약간 그렇다", "매우 그렇다"] }
];

let currentStep = 0;
let answers = {};

// 2. 검사 시작하기 버튼 (이게 없어서 에러가 났던 겁니다!)
function startTest() {
    document.querySelector('.start-screen').style.display = 'none'; // 시작 화면 숨김
    document.querySelector('#question-container').style.display = 'block'; // 질문 화면 보임
    showQuestion();
}

// 3. 질문 보여주기
function showQuestion() {
    const q = questions[currentStep];
    const container = document.getElementById('question-container');
    
    // 질문 내용 업데이트
    container.innerHTML = `
        <div class="question-box" style="margin-top:20px;">
            <h3>Q${currentStep + 1}. ${q.text}</h3>
            <div class="options" style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
                ${q.options.map((opt, idx) => `
                    <button onclick="nextQuestion(${idx})" style="padding:15px; border:1px solid #ddd; border-radius:10px; background:white; cursor:pointer;">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

// 4. 다음 질문으로 이동
function nextQuestion(answerIdx) {
    // 답변 저장
    answers[`Q${currentStep + 1}`] = questions[currentStep].options[answerIdx];
    
    currentStep++;
    
    if (currentStep < questions.length) {
        showQuestion(); // 다음 문제
    } else {
        showLoading(); // 결과 분석 요청
    }
}

// 5. 로딩 화면 및 서버 전송
async function showLoading() {
    const container = document.getElementById('question-container');
    container.innerHTML = `
        <div style="text-align:center; padding:50px;">
            <h2>⏳ AI가 분석 중입니다...</h2>
            <p>잠시만 기다려주세요.</p>
        </div>
    `;

    try {
        // 서버로 답변 전송!
        const response = await fetch('/analyze/attachment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: answers })
        });

        const data = await response.json();
        
        if (data.error) {
            alert("분석 실패: " + data.error);
        } else {
            showResult(data);
        }

    } catch (error) {
        alert("서버 통신 중 오류가 발생했습니다.");
        console.error(error);
    }
}

// 6. 결과 보여주기
function showResult(data) {
    const container = document.getElementById('question-container');
    
    // AI가 분석해준 내용 표시
    container.innerHTML = `
        <div class="result-box" style="text-align:center; padding:20px;">
            <h1 style="color:#e91e63;">💖 분석 완료!</h1>
            <div style="background:#fff0f5; padding:20px; border-radius:15px; margin:20px 0; text-align:left; line-height:1.6;">
                <h3 style="color:#333;">당신의 애착 유형은?</h3>
                <p style="font-size:1.1rem; white-space: pre-wrap;">${data.mbti || JSON.stringify(data)}</p>
            </div>
            <a href="/" style="display:inline-block; padding:15px 30px; background:#333; color:white; text-decoration:none; border-radius:30px;">홈으로 돌아가기</a>
        </div>
    `;
}