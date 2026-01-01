require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = 3003; 

app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key', 
    resave: false,
    saveUninitialized: true
}));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔴 [수정됨] 에러 원인 제거! (구버전에서도 돌아가도록 설정 단순화)
const model = genAI.getGenerativeModel({ 
    model: "gemini-3-pro-preview"
    // 여기서 responseMimeType 설정을 뺐습니다. 이제 버전 에러 안 납니다.
});

// 📂 DB 파일 설정
const DB_FILE = path.join(__dirname, 'database.json');
if (!fs.existsSync(DB_FILE)) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], results: [] }, null, 2));
    } catch (e) { console.error("DB 생성 실패:", e); }
}

function readDB() { 
    try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } 
    catch(e) { return { users: [], results: [] }; }
}
function writeDB(data) { 
    try { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }
    catch(e) { console.error("DB 저장 실패:", e); }
}

// 🧠 AI 분석 함수 (수동 JSON 파싱으로 강화)
async function analyze(req, res, promptPrefix, type) {
    console.log(`📡 [${type}] 분석 요청...`); 

    try {
        // 프롬프트 강화: AI에게 JSON 형식을 강제로 주입
        const prompt = `${promptPrefix}. 
        [중요 지침]
        1. 답변은 오직 JSON 형식으로만 해야 해.
        2. 잡담이나 마크다운(backticks)을 절대 넣지 마.
        3. 형식 예시: {"mbti": "INTJ", "desc": "당신은..."}
        
        사용자 답변: ${JSON.stringify(req.body.answers)}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        console.log(`🤖 AI 응답 원본: ${text}`); 

        // 🧹 [청소기 가동] AI가 잡담을 섞어 보내도 JSON만 깨끗하게 발라냄
        text = text.replace(/```json/g, "").replace(/```/g, ""); // 마크다운 제거
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        const data = JSON.parse(text); // 여기서 성공해야 함
        
        // 결과 저장
        const db = readDB();
        db.results.push({ 
            userId: req.session.userId || 'guest', 
            type, 
            summary: data.mbti, 
            date: new Date().toISOString() 
        });
        writeDB(db);

        console.log(`✅ [${type}] 성공!`);
        res.json(data);

    } catch (e) { 
        console.error(`❌ [${type}] 실패:`, e);
        // 사용자에게 에러 대신 기본값이라도 보여줘서 안심시키기
        res.status(500).json({ 
            mbti: "분석 지연", 
            desc: "죄송합니다. 접속자가 많아 AI 응답이 늦어지고 있습니다. 잠시 후 다시 시도해주세요." 
        }); 
    }
}

// 라우트
app.post('/analyze/mbti', (req, res) => analyze(req, res, "MBTI 성격 분석", 'mbti'));
app.post('/analyze/egen', (req, res) => analyze(req, res, "에겐/테토 성향 분석", 'egen'));
app.post('/analyze/attachment', (req, res) => analyze(req, res, "연애 애착유형 분석", 'attachment'));

app.listen(process.env.PORT || port, () => {
    console.log(`🚀 서버 가동 완료`);
});
