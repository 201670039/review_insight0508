const { OpenAI } = require('openai');

// OpenAI 클라이언트 초기화 (API 키는 호출 시점의 환경 변수에서 가져옴)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 텍스트 감성 분석 수행 함수
 * @param {string} text - 분석할 원문 텍스트
 * @returns {Promise<Object>} 분석 결과 (sentiment, confidence, reason)
 */
async function analyzeSentiment(text) {
  // 1. 데모를 위한 모의(Mock) 응답 처리 (API 키가 없거나 기본값인 경우)
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('your_')) {
    console.log('[Insight Analyzer] Using Mock Response...');
    await new Promise(resolve => setTimeout(resolve, 800)); // 지연 효과
    
    return {
      sentiment: text.includes('BMW') || text.includes('좋아') ? 'Positive' : 'Neutral',
      confidence: 95,
      reason: "BMW 브랜드 언급 또는 긍정적인 키워드가 포함되어 있어 긍정적으로 분석되었습니다. (모듈 모의 응답)"
    };
  }

  // 2. 실제 OpenAI API 호출
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the given text and return the result ONLY in JSON format with the following keys: 'sentiment' (Positive, Negative, or Neutral), 'confidence' (0-100 number), and 'reason' (a brief explanation in Korean)."
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('[Insight Analyzer] OpenAI Error:', error.message);
    throw new Error('AI 분석 중 오류가 발생했습니다.');
  }
}

module.exports = {
  analyzeSentiment
};
