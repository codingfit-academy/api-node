/**
 * PostgreSQL 연결 풀
 * ─────────────────────────────────────────────────────────────
 * 환경변수는 서버의 provision 과정에서 자동으로 .env에 기록됩니다.
 * 로컬 개발 시에는 프로젝트 루트에 .env 파일을 만들어 사용하세요.
 *
 *   DB_HOST=localhost
 *   DB_PORT=5432
 *   DB_NAME=mydb
 *   DB_USER=myuser
 *   DB_PASS=mypassword
 */
require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  host:     process.env.DB_HOST || 'postgres',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
})

pool.on('error', (err) => {
  console.error('DB 연결 오류:', err)
})

/**
 * 쿼리 실행 헬퍼
 * @param {string} text  SQL 쿼리
 * @param {Array}  params 파라미터 배열 [$1, $2, ...]
 */
const query = (text, params) => pool.query(text, params)

module.exports = { pool, query }
