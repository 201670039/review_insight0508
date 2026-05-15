const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 환경 변수 설정
dotenv.config();

// Review Insight 모듈 가져오기 (현재 폴더의 인덱스)
const { processReviewInsight } = require('./index');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 정적 파일 서빙 설정 (현재 폴더 기준으로 통합)
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// [POST] 감성 분석 API
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: '분석할 텍스트가 필요합니다.' });
  }

  try {
    const result = await processReviewInsight(text);
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

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
