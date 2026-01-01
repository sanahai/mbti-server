require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = 3003;

app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
}));

// 🔑 API 키 확인
if (!process.env.GEMINI_API_KEY) {
    console.error("🔥🔥🔥 [비상] .env 파일에 GEMINI_API_KEY가 없습니다! 확인해주세요! 🔥🔥🔥");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ⚙️ AI 모델 설정 (안전 필터 해제 및 모델 지정)
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
    generationConfig: { responseMimeType: "application/json" }
});

// 📂 파일 DB 설정
const DB_FILE = path.join(__dirname, 'database.json');
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], results: [] }, null, 2));
}

function readDB() { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
function writeDB(data) { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }

// 🔐 회원가입 & 로그인 & 카카오 (기존과 동일, 생략 없이 포함)
app.post('/register', (req, res) => {
    try {
        const { username, password } = req.body;
        const db = readDB();
        if (db.users.find(u => u.username === username)) return res.status(400).json({ error: "이미 있는 아이디" });
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        db.users.push({ id: Date.now(), username, password: hashedPassword });
        writeDB(db);
        res.json({ message: "가입 성공" });
    } catch (e) { res.status(500).json({ error: "회원가입 오류" }); }
});

app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const db = readDB();
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const user = db.users.find(u => u.username === username && u.password === hashedPassword);
        if (!user) return res.status(400).json({ error: "정보 불일치" });
        req.session.userId = user.id;
        req.session.username = user.username;
        res.json({ message: "로그인 성공", username: user.username });
    } catch (e) { res.status(500).json({ error: "로그인 오류" }); }
});

app.post('/auth/kakao', async (req, res) => {
    const { token } = req.body;
    try {
        const kRes = await fetch('https://kapi.kakao.com/v2/user/me', { headers: { Authorization: `Bearer ${token}` } });
        if(!kRes.ok) return res.status(400).json({error: "카카오 토큰 오류"});
        const info = await kRes.json();
        const kakaoId = `kakao_${info.id}`;
        const nickname = info.properties?.nickname || "카카오유저";
        const db = readDB();
        let user = db.users.find(u => u.username === kakaoId);
        if (!user) {
            user = { id: Date.now(), username: kakaoId, password: "KAKAO_USER" };
            db.users.push(user);
            writeDB(db);
        }
        req.session.userId = user.id;
        req.session.username = nickname;
        res.json({ success: true, message: `${nickname}님 환영합니다!` });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/logout', (req, res) => { req.session.destroy(); res.json({ message: "로그아웃" }); });
app.get('/check-login', (req, res) => { res.json({ loggedIn: !!req.session.userId, username: req.session.username }); });

app.get('/stats', (req, res) => {
    try {
        const r = readDB().results;
        const today = new Date().toISOString().split('T')[0];
        res.json({
            mbti_total: r.filter(x => x.type === 'mbti').length,
            egen_total: r.filter(x => x.type === 'egen').length,
            attach_total: r.filter(x => x.type === 'attachment').length,
            today: r.filter(x => x.date.startsWith(today)).length,
            yesterday: 0, week: r.length, month: r.length
        });
    } catch (e) { res.json({}); }
});

// 🧠 [핵심 수정] AI 분석 함수 (에러 방지 및 로깅 강화)
async function analyze(req, res, promptPrefix, type) {
    console.log(`📡 [${type}] 분석 시작...`); 
    try {
        const prompt = `${promptPrefix}. 
        중요: 반드시 순수한 JSON 형식으로만 답변해. 마크다운이나 잡담 금지.
        형식 예시: {"mbti": "INTJ", "desc": "설명..."}
        답변: ${JSON.stringify(req.body.answers)}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        console.log(`🤖 AI 원본 응답: ${text.substring(0, 50)}...`); // 터미널에 응답 앞부분 출력

        // 🧹 JSON 정제 (잡담 제거)
        // 1. ```json 과 ``` 제거
        text = text.replace(/```json/g, "").replace(/```/g, "");
        // 2. 맨 처음 '{' 부터 맨 마지막 '}' 까지만 추출 (앞뒤 잡담 잘라내기)
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        const data = JSON.parse(text);
        
        const db = readDB();
        db.results.push({ userId: req.session.userId, type, summary: data.mbti || "결과", date: new Date().toISOString() });
        writeDB(db);
        
        console.log(`✅ [${type}] 분석 완료!`);
        res.json(data);

    } catch (e) { 
        console.error(`❌ [${type}] 분석 실패! 이유:`, e);
        // 클라이언트에게 에러 내용 전달
        res.status(500).json({ error: "AI 분석 실패: " + e.message }); 
    }
}

app.post('/analyze/mbti', (req, res) => analyze(req, res, "MBTI 성격 분석해줘", 'mbti'));
app.post('/analyze/egen', (req, res) => analyze(req, res, "에겐/테토 성향 분석해줘", 'egen'));
app.post('/analyze/attachment', (req, res) => analyze(req, res, "연애 애착유형 분석해줘", 'attachment'));

app.listen(port, () => { 
    console.log(`🚀 서버 정상 가동: http://localhost:${port}`);
    console.log(`👉 터미널 창을 닫지 마세요! 에러가 나면 여기에 표시됩니다.`);
});