/**
 * 중앙 설정 (config)
 * ─────────────────────────────────────────────────────────────
 * 모든 환경변수를 여기 한 곳에서 읽습니다. 나머지 코드는 이 파일을 import 하세요.
 *
 *   const config = require('./config')
 *   config.port, config.db.host, config.public.kakaoMapsAppKey ...
 *
 * env 주입 경로:
 *   - PORT / DB_*  : 서버 provision 과정에서 .env 에 자동 기록
 *                    (로컬은 .env 를 직접 만들어 사용 — .env.example 참고)
 *   - public.*     : 선생님 공유 키(config/maps.env) → api 컨테이너 →
 *                    GET /config 로 프론트에 노출 (브라우저에 보여도 되는 값만!)
 *
 * 새 환경변수가 필요하면 아래에 한 줄씩 추가하세요.
 */
require('dotenv').config()

module.exports = {
  port: parseInt(process.env.PORT || '8000', 10),

  // ── DB (provision 자동 주입) ──────────────────────────────
  db: {
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },

  // ── 프론트에 내려줄 공개 값 (GET /config) ─────────────────
  //    ⚠ 브라우저에 노출됩니다. 공개해도 되는 값만 넣으세요.
  public: {
    naverMapsClientId: process.env.NAVER_MAPS_CLIENT_ID || '',
    kakaoMapsAppKey:   process.env.KAKAO_MAPS_APP_KEY   || '',
    // 새 공개 키는 여기 한 줄 추가
  },

  // ── 서버에서만 쓰는 비공개 값 (절대 /config 로 내보내지 말 것) ──
  secret: {
    // 예: openaiApiKey: process.env.OPENAI_API_KEY || '',
  },
}
