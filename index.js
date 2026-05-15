/**
 * Review Insight Module
 * 통합 인터페이스 제공
 */

const { analyzeSentiment } = require('./lib/analyzer');
const { saveAnalysisLog } = require('./lib/database');

/**
 * 텍스트 분석 및 자동 로그 저장 통합 함수
 * @param {string} text - 분석할 텍스트
 * @returns {Promise<Object>} 분석 결과
 */
async function processReviewInsight(text) {
  // 1. 감성 분석 수행
  const result = await analyzeSentiment(text);
  
  // 2. 결과를 비동기적으로 DB에 저장 (응답 속도를 위해 대기하지 않거나 병렬 처리 가능)
  // 여기서는 명시적으로 저장 호출
  await saveAnalysisLog({
    text,
    sentiment: result.sentiment,
    confidence: result.confidence,
    reason: result.reason
  });
  
  return result;
}

module.exports = {
  analyzeSentiment,
  saveAnalysisLog,
  processReviewInsight
};
