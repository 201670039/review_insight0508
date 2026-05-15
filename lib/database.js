const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// 1. Supabase 클라이언트 초기화 (오류 방지를 위해 유효성 검사 포함)
let supabase;
try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'your_supabase_url_here') {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }
} catch (e) {
  console.error('[Insight Database] Initialization failed:', e.message);
}

// 2. 보안을 위한 암호화 설정
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'a_very_secret_key_32_chars_long!!';
const IV_LENGTH = 16;

/**
 * 텍스트 암호화 함수
 */
function encrypt(text) {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (err) {
    console.error('[Insight Database] Encryption error:', err.message);
    return text; // 실패 시 평문 반환 (상황에 따라 다르게 처리 가능)
  }
}

/**
 * 분석 결과 로그 저장 함수
 * @param {Object} data - 분석 결과 데이터 및 원문
 */
async function saveAnalysisLog({ text, sentiment, confidence, reason }) {
  if (!supabase) {
    console.warn('[Insight Database] Supabase client not initialized. Skipping DB log.');
    return;
  }

  try {
    const encryptedText = encrypt(text);
    const { error } = await supabase
      .from('analysis_logs')
      .insert([
        { 
          input_text: encryptedText, 
          sentiment,
          confidence,
          reason
        }
      ]);

    if (error) throw error;
    console.log('[Insight Database] Log saved successfully.');
  } catch (error) {
    console.error('[Insight Database] Log Save Error:', error.message);
  }
}

module.exports = {
  saveAnalysisLog
};
