const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 환경 변수 설정
dotenv.config();

// 핵심 로직 모듈 가져오기
const { analyzeSentiment } = require('./lib/analyzer');
const { saveAnalysisLog } = require('./lib/database');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

/**
 * [POST] 감성 분석 API
 * 분석과 DB 저장을 하나의 흐름으로 처리합니다.
 */
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: '분석할 텍스트가 필요합니다.' });
  }

  try {
    // 1. 감성 분석 수행 (AI)
    const result = await analyzeSentiment(text);
    
    // 2. 결과 DB 저장 (비동기 처리)
    // 분석 결과를 기다린 후 저장은 백그라운드에서 진행해도 되지만, 확실한 처리를 위해 await 사용 가능
    await saveAnalysisLog({
      text,
      sentiment: result.sentiment,
      confidence: result.confidence,
      reason: result.reason
    });

    // 3. 최종 결과 반환
    res.json(result);

  } catch (error) {
    console.error('[Server Error] Analysis failed:', error.message);
    res.status(500).json({ 
      error: '분석 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 루트 경로에서 index.html 반환
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Vercel 환경을 위해 app을 내보냅니다.
module.exports = app;

// 로컬 환경에서만 서버를 직접 실행합니다.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
