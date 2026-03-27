/**
 * Academy Node.js Express 스타터 템플릿
 * ─────────────────────────────────────────────────────────────
 * DB 접근:
 *   환경변수(DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASS)는
 *   서버의 provision 과정에서 자동으로 .env에 기록됩니다.
 *
 * 라우트 추가 방법:
 *   src/routes/ 폴더를 만들어 라우트 파일을 분리하고
 *   아래 예시처럼 등록하세요.
 * ─────────────────────────────────────────────────────────────
 */
require('dotenv').config()

const express = require('express')
const cors    = require('cors')
const { query } = require('./db')

const app  = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())


// ── 헬스체크 (필수 — 배포 시 health check가 이 엔드포인트를 호출합니다) ──
app.get('/health', async (req, res) => {
  try {
    await query('SELECT 1')
    res.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    res.status(503).json({ status: 'error', message: err.message })
  }
})

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Academy API!' })
})


// ── 예시 CRUD (items 테이블) ───────────────────────────────────
// 테이블이 없으면 자동 생성
async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS items (
      id         SERIAL PRIMARY KEY,
      title      VARCHAR(100) NOT NULL,
      content    TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
}

// 목록 조회
app.get('/items', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM items ORDER BY id')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 단건 조회
app.get('/items/:id', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM items WHERE id = $1', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 생성
app.post('/items', async (req, res) => {
  const { title, content } = req.body
  if (!title) return res.status(400).json({ error: 'title은 필수입니다' })
  try {
    const { rows } = await query(
      'INSERT INTO items (title, content) VALUES ($1, $2) RETURNING *',
      [title, content ?? null],
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 삭제
app.delete('/items/:id', async (req, res) => {
  try {
    const { rowCount } = await query('DELETE FROM items WHERE id = $1', [req.params.id])
    if (!rowCount) return res.status(404).json({ error: 'Not found' })
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ── 라우트 추가 예시 ───────────────────────────────────────────
// const postsRouter = require('./routes/posts')
// app.use('/posts', postsRouter)


// ── 서버 시작 ─────────────────────────────────────────────────
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('DB 초기화 실패:', err)
    process.exit(1)
  })
