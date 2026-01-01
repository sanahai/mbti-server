// 에겐 vs 테토 질문 리스트 (총 10문항)
// A: 에겐(감성/여성성/곡선), B: 테토(이성/남성성/직선)
const questions = [
    {
        q: "주말 약속이 갑자기 취소되었다면?",
        a: "아싸! 집에서 뒹굴거리며 밀린 드라마나 봐야지. (힐링 타임)",
        b: "시간이 아까운데... 바로 다른 친구에게 연락해 약속을 잡는다."
    },
    {
        q: "친구가 차 사고가 났다고 전화가 왔다. 나의 첫 마디는?",
        a: "헐 어떡해... 다친 데는 없어? 많이 놀랐겠다 ㅠㅠ",
        b: "보험사는 불렀어? 사진 찍어놨어? 과실 비율은 어떻게 돼?"
    },
    {
        q: "갖고 싶던 한정판 물건이 품절되었다.",
        a: "인연이 아닌가 보다... 아쉽지만 비슷한 다른 걸 찾아본다.",
        b: "어떻게든 구해야 한다. 중고거래, 해외 직구까지 싹 다 뒤진다."
    },
    {
        q: "연애를 할 때 나는?",
        a: "상대방의 감정을 살피고 맞춰주며, 다가와주길 기다리는 편이다.",
        b: "호감이 생기면 직진! 내가 리드하고 먼저 표현하는 편이다."
    },
    {
        q: "나의 평소 옷 스타일이나 분위기는?",
        a: "부드러운 소재, 따뜻한 색감, 분위기 있고 섬세한 스타일.",
        b: "딱 떨어지는 핏, 심플하고 강렬한 포인트, 혹은 활동적인 스타일."
    },
    {
        q: "경쟁에서 졌을 때 나의 반응은?",
        a: "속상하지만... 그래도 최선을 다했으니까 괜찮아. (자기 위로)",
        b: "분하다. 다음엔 무조건 이겨야 한다. (승부욕 폭발)"
    },
    {
        q: "낯선 모임에서 자기소개 시간이 왔다.",
        a: "(심장이 쿵쿵) 주목받는 건 부끄러워... 짧게 이름만 말하고 앉는다.",
        b: "(자신감 뿜뿜) 나를 알릴 기회다. 여유롭게 농담도 섞어서 인사한다."
    },
    {
        q: "슬픈 영화를 볼 때 나는?",
        a: "주인공에게 완전 이입해서 눈물 콧물 다 쏟는다.",
        b: "슬프긴 한데... '저 상황에서 왜 저러지?' 상황을 분석한다."
    },
    {
        q: "누군가 나를 싫어한다는 걸 알게 되었다면?",
        a: "내가 뭐 실수했나? 하루 종일 신경 쓰이고 마음이 무겁다.",
        b: "뭐 어때? 나도 걔 별로던데. 신경 끄고 내 할 일 한다."
    },
    {
        q: "나의 인생 목표에 더 가까운 것은?",
        a: "사랑하는 사람들과 함께하는 평화롭고 안정적인 행복.",
        b: "내 분야에서 최고가 되어 인정받고 성공하는 성취감."
    }
];

let currentStep = 0;
let userAnswers = [];

// 1. 검사 시작하기
function startTest() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('question-screen').classList.remove('hidden');
    showQuestion();
}

// 2. 질문 화면 보여주기
function showQuestion() {
    const q = questions[currentStep];
    
    // 진행도 (1 / 10)
    document.getElementById('progress').innerText = `${currentStep + 1} / ${questions.length}`;
    
    // 질문 내용
    document.getElementById('question-text').innerText = q.q;

    // 버튼 만들기 (A선택: 에겐, B선택: 테토)
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = `
        <button onclick="selectAnswer('A', '${q.a}')">A. ${q.a}</button>
        <button onclick="selectAnswer('B', '${q.b}')">B. ${q.b}</button>
    `;

    // [이전 버튼] 처리: 첫 문제에선 숨김
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
        if (currentStep === 0) {
            prevBtn.style.visibility = 'hidden';
        } else {
            prevBtn.style.visibility = 'visible';
        }
    }
}

// 3. 답변 선택 저장
function selectAnswer(type, text) {
    userAnswers.push({ 
        id: currentStep + 1, 
        question: questions[currentStep].q, 
        type: type, // A 또는 B
        answer: text 
    });

    currentStep++;

    if (currentStep < questions.length) {
        showQuestion();
    } else {
        finishTest();
    }
}

// 4. [기능] 이전 질문으로
function prevQuestion() {
    if (currentStep > 0) {
        currentStep--;
        userAnswers.pop(); // 마지막 답변 취소
        showQuestion();
    }
}

// 5. [기능] 검사 그만두기
function quitTest() {
    if (confirm("정말 검사를 그만두시겠습니까?")) {
        currentStep = 0;
        userAnswers = [];
        document.getElementById('question-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
    }
}

// 6. 결과 분석 및 서버 전송
async function finishTest() {
    // 로딩 화면 켜기
    document.getElementById('question-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');

    try {
        console.log("⚖️ 에겐/테토 분석 요청 전송 중...");

        // ★ [중요] 에겐 테스트 전용 주소 (/analyze/egen)
        const response = await fetch('http://localhost:3003/analyze/egen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: userAnswers })
        });

        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }

        const data = await response.json();

        // 결과 화면 켜기
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('result-screen').classList.remove('hidden');

        // 데이터 채워넣기
        document.getElementById('result-title').innerText = data.mbti; // 예: 에겐형, 테토형
        document.getElementById('result-summary').innerText = data.summary;
        
        // 상세 설명 채우기
        const detailsDiv = document.getElementById('result-details');
        if (detailsDiv) {
            detailsDiv.innerHTML = `
                <p><strong>💪 강점:</strong> ${data.details.strength}</p>
                <p><strong>⚠️ 주의:</strong> ${data.details.weakness}</p>
                <p><strong>💼 추천 역할:</strong> ${data.details.career}</p>
                <p><strong>💌 조언:</strong> ${data.details.advice}</p>
            `;
        }

    } catch (error) {
        console.error(error);
        alert("오류가 발생했습니다. 다시 시도해주세요.");
        location.reload();
    }
}