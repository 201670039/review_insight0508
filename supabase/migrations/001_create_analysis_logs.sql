-- 001_create_analysis_logs.sql
-- 분석 요청 및 결과를 기록하기 위한 테이블 생성

CREATE TABLE IF NOT EXISTS analysis_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    input_text TEXT NOT NULL,         -- 분석 대상 텍스트 (암호화하여 저장 가능)
    sentiment VARCHAR(20) NOT NULL,   -- 감성 결과 (Positive, Negative, Neutral)
    confidence INTEGER NOT NULL,      -- 신뢰도 (0-100)
    reason TEXT,                      -- 분석 이유
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 추가 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_analysis_logs_created_at ON analysis_logs (created_at DESC);
