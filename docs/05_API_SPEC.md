# API Specification

## Endpoint
POST /api/analyze

## Request
```json
{
  "text": "오늘 정말 행복한 하루였어!"
}
```

## Response
```json
{
  "success": true,
  "data": {
    "sentiment": "긍정",
    "confidence": 94,
    "reason": "긍정적인 표현이 반복됩니다."
  }
}
```

## Error Cases
- Empty input
- API failure
- Timeout
