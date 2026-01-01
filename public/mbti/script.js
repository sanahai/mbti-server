// MBTI 질문 리스트 (총 48문항)
const questions = [
    "일주일 동안 약속이 하나도 없으면 편안하기보다 오히려 지루하거나 처진다.",
    "새로운 사람을 만나는 자리에서 어색함보다는 호기심과 흥미를 느낀다.",
    "많은 사람 앞에서 발표하거나 장기자랑을 하는 것에 큰 부담을 느끼지 않는다.",
    "대화를 할 때 상대방의 말을 듣기보다 내 이야기를 주도적으로 하는 편이다.",
    "친구들과 시끌벅적하게 노는 것이 집에서 혼자 쉬는 것보다 더 큰 휴식이 된다.",
    "처음 보는 사람에게도 거리낌 없이 말을 걸고 쉽게 친해진다.",
    "생각이 많아질 때 혼자 삭히기보다 누군가와 대화하면서 털어내야 풀린다.",
    "전화 통화가 문자나 메신저보다 더 편하고 빠르다고 느낀다.",
    "주목받는 것을 즐기며, 모임의 중심에 서는 것을 좋아한다.",
    "바쁜 한 주를 보내고 나면 주말에는 아무도 만나지 않고 혼자 있고 싶다.",
    "나의 속마음이나 사생활을 타인에게 쉽게 오픈하는 편이다.",
    "여러 사람과 대화할 때 리액션이 크고 목소리가 커지는 편이다.",
    "만약에 좀비가 나타난다면? 같은 비현실적인 상상을 자주 하며 즐거워한다.",
    "일을 처리할 때 독창적인 방법보다는 이미 검증된 확실한 방식을 선호한다.",
    "영화나 예술 작품을 볼 때, 스토리 자체보다 그 안에 담긴 숨은 의미나 상징을 찾으려 한다.",
    "미래의 불확실한 가능성보다는 현재 눈앞에 닥친 현실적인 문제 해결이 우선이다.",
    "대화할 때 구체적인 사실 위주보다는 비유나 추상적인 개념을 자주 사용한다.",
    "설명서를 꼼꼼히 읽고 순서대로 조립하는 것이 직관적으로 조립하는 것보다 편하다.",
    "전체적인 숲을 보기보다는 세부 사항 하나하나를 꼼꼼하게 챙기는 편이다.",
    "남들이 보기에 엉뚱하거나 현실성 없어 보이는 아이디어를 자주 낸다.",
    "과거의 경험과 데이터를 바탕으로 미래를 예측하는 것을 신뢰한다.",
    "멍하니 있으면서 꼬리에 꼬리를 무는 생각에 잠길 때가 많다.",
    "실제 존재하는 것, 오감으로 느낄 수 있는 감각적인 경험을 중요시한다.",
    "일상적인 반복 업무보다는 새롭고 변화가 많은 업무에서 흥미를 느낀다.",
    "고민을 상담하는 친구에게 위로보다는 현실적인 해결책을 먼저 제시한다.",
    "논쟁이 벌어졌을 때 상대방의 기분이 상하더라도 사실 관계를 명확히 하는 것이 중요하다.",
    "너는 너무 차가워 또는 냉정해라는 말을 종종 듣는 편이다.",
    "의사결정을 할 때 내 선택이 타인에게 미칠 감정적 영향보다 논리적 타당성을 먼저 고려한다.",
    "감정에 호소하는 것보다 데이터와 객관적 지표를 들이밀 때 더 잘 설득된다.",
    "공과 사는 확실히 구분해야 하며, 업무 중 인간적인 사정은 배제되어야 한다고 생각한다.",
    "영화나 드라마를 볼 때 슬픈 장면에서도 눈물을 잘 흘리지 않는다.",
    "친구가 잘못을 했을 때 감싸주기보다는 따끔하게 잘못된 점을 지적하는 편이다.",
    "칭찬을 들을 때 고마워라는 감정적 반응보다 어떤 부분이 좋았어?라고 분석하려 한다.",
    "나의 감정을 겉으로 드러내는 것이 어색하고 불편하다.",
    "조화와 화합을 깨뜨리지 않기 위해 나의 반대 의견을 숨길 때가 많다.",
    "어떤 사건을 접할 때 얼마나 슬플까보다 왜 저런 일이 일어났을까가 먼저 떠오른다.",
    "여행을 갈 때 분 단위 혹은 시간 단위로 세세하게 계획을 짜야 마음이 편하다.",
    "해야 할 일을 미리미리 끝내놓기보다 마감 기한에 임박해서 처리할 때 집중이 잘 된다.",
    "갑작스럽게 약속이 변경되거나 취소되면 스트레스를 많이 받는다.",
    "책상이나 컴퓨터 바탕화면이 항상 규칙에 따라 깔끔하게 정리되어 있다.",
    "일을 시작하기 전에 명확한 목표와 프로세스가 수립되어 있어야 한다.",
    "주말에는 아무 계획 없이 일어나서 끌리는 대로 행동하는 것을 좋아한다.",
    "한번 내린 결정은 번복하지 않고 빠르게 매듭짓는 것을 선호한다.",
    "쇼핑을 할 때 미리 살 목록을 적어가기보다 가서 마음에 드는 것을 고르는 편이다.",
    "일의 순서나 방법이 유연하게 바뀌는 상황보다는 정해진 매뉴얼대로 흘러가는 것이 좋다.",
    "선택의 여지를 남겨두기 위해 확정을 최대한 뒤로 미루는 경향이 있다.",
    "내일 입을 옷이나 가져갈 물건을 전날 밤에 미리 챙겨둔다.",
    "규칙이나 틀에 얽매이는 것을 싫어하고 자유로운 환경에서 능률이 오른다."
];

let currentStep = 0;
let userAnswers = [];

// 1. 검사 시작
function startTest() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('question-screen').classList.remove('hidden');
    showQuestion();
}

// 2. 질문 화면 표시
function showQuestion() {
    // 진행 상황 업데이트
    document.getElementById('progress').innerText = `${currentStep + 1} / ${questions.length}`;
    document.getElementById('question-text').innerText = questions[currentStep];

    // 5점 척도 버튼 생성 (매우 비동의 ~ 매우 동의)
    const optionsDiv = document.getElementById('options');
    // 버튼 스타일은 CSS로 제어되지만, 여기서는 구조만 만듭니다.
    optionsDiv.innerHTML = `
        <button onclick="selectAnswer('매우 비동의')">😡 매우 아니다</button>
        <button onclick="selectAnswer('비동의')">🙁 아니다</button>
        <button onclick="selectAnswer('보통')">😐 보통이다</button>
        <button onclick="selectAnswer('동의')">🙂 그렇다</button>
        <button onclick="selectAnswer('매우 동의')">😍 매우 그렇다</button>
    `;

    // [이전 버튼] 보이기/숨기기
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
        if (currentStep === 0) {
            prevBtn.style.visibility = 'hidden';
        } else {
            prevBtn.style.visibility = 'visible';
        }
    }
}

// 3. 답변 선택
function selectAnswer(answerText) {
    // 답변 저장
    userAnswers.push({ 
        id: currentStep + 1, 
        question: questions[currentStep], 
        answer: answerText 
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
        userAnswers.pop(); // 마지막 답변 삭제
        showQuestion();
    }
}

// 5. [기능] 검사 종료하기
function quitTest() {
    if (confirm("정말 검사를 그만두시겠습니까? 모든 진행 내용이 사라집니다.")) {
        currentStep = 0;
        userAnswers = [];
        document.getElementById('question-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
    }
}

// 6. 로딩 문구 애니메이션
function startLoadingAnimation() {
    const texts = [
        "🧠 뇌파 패턴 분석 중...",
        "⚖️ 내향성 vs 외향성 계산 중...",
        "🤔 당신의 무의식을 탐구 중...",
        "📝 결과 보고서를 작성 중...",
        "🚀 거의 다 됐어요!"
    ];
    let i = 0;
    const loadingText = document.getElementById('loading-text');
    if(loadingText) {
        setInterval(() => {
            loadingText.innerText = texts[i % texts.length];
            i++;
        }, 2000);
    }
}

// 7. 결과 분석 요청 (서버 전송)
async function finishTest() {
    document.getElementById('question-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');
    
    // 로딩 멘트 애니메이션 시작
    startLoadingAnimation();

    try {
        console.log("🚀 MBTI 분석 요청 전송 중...");
        
        // ★ [중요] MBTI 전용 주소 (/analyze/mbti)
        const response = await fetch('/analyze/...', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: userAnswers })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `서버 오류: ${response.status}`);
        }

        const data = await response.json();
        showResult(data);

    } catch (error) {
        console.error("에러 발생:", error);
        alert(`😭 오류가 발생했습니다!\n이유: ${error.message}`);
        location.reload();
    }
}

// 8. 결과 화면 표시
// mbti/script.js의 showResult 함수 수정

// mbti/script.js 의 showResult 함수 (덮어쓰기)

// mbti/script.js 의 showResult 함수 (이걸로 덮어쓰세요)

// mbti/script.js 의 showResult 함수 (이걸로 덮어쓰세요)

function showResult(data) {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');

    // 1. 기본 정보
    document.getElementById('mbti-type').innerText = data.mbti;
    document.getElementById('mbti-summary').innerText = data.summary;
    
    // 2. 데이터 안전하게 꺼내기 (X-ray 기능 추가)
    const d = data.details || {}; 

    // AI가 쓸만한 모든 변수명을 다 뒤져봅니다.
    let strength = d.strength || d.Strength || d.pros || d.advantage || d.jangjeom;
    let weakness = d.weakness || d.Weakness || d.cons || d.disadvantage || d.danjeom;
    let career = d.career || d.Career || d.job || d.work || d.recommendation;
    let advice = d.advice || d.Advice || d.tip || d.solution;

    // ★ [핵심] 그래도 없으면? AI가 보낸 원본 데이터를 보여줘라! (디버깅용)
    if (!strength) strength = "🚨 데이터 없음. 원본: " + JSON.stringify(d);
    if (!weakness) weakness = "🚨 데이터 없음. 원본: " + JSON.stringify(d);
    if (!career) career = "🚨 데이터 없음. 원본: " + JSON.stringify(d);
    if (!advice) advice = "🚨 데이터 없음. 원본: " + JSON.stringify(d);

    // 3. 화면에 뿌리기
    const detailsDiv = document.getElementById('result-details');
    if (detailsDiv) {
        detailsDiv.innerHTML = `
            <div class="result-card" style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <h3 style="color: #4285F4; margin-bottom: 10px;">🌟 성격의 장점</h3>
                <p style="line-height: 1.6; color: #333; word-break: break-all;">${strength}</p>
            </div>

            <div class="result-card" style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <h3 style="color: #EA4335; margin-bottom: 10px;">⚠️ 주의할 점</h3>
                <p style="line-height: 1.6; color: #333; word-break: break-all;">${weakness}</p>
            </div>

            <div class="result-card" style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <h3 style="color: #FBBC05; margin-bottom: 10px;">💼 추천 직업</h3>
                <p style="line-height: 1.6; color: #333; word-break: break-all;">${career}</p>
            </div>

            <div class="result-card" style="padding: 15px; background: white; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <h3 style="color: #34A853; margin-bottom: 10px;">💌 AI의 조언</h3>
                <p style="line-height: 1.6; color: #333; word-break: break-all;">${advice}</p>
            </div>
        `;
    }

}
