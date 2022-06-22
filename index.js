const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const question = await req.repositories.questionRepo.getQuestionById(
    req.params.questionId
  )
  if (!question) {
    res.status(404)
    res.send('Question not found')
  } else res.json(question)
})

app.post('/questions', async (req, res) => {
  const result = await req.repositories.questionRepo.addQuestion(req.headers)
  if (!result) {
    res.status(400)
    res.send('Missing required headers')
  } else {
    res.status(201)
    res.send('New question created')
  }
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const answers = await req.repositories.questionRepo.getAnswers(
    req.params.questionId
  )
  if (!answers) {
    res.status(404)
    res.send('Answers to the question not found')
  } else res.send(answers)
})

app.post('/questions/:questionId/answers', async (req, res) => {
  const result = await req.repositories.questionRepo.addAnswer(
    req.params.questionId,
    req.headers
  )
  if(!result) {
    res.sendStatus(400)
  } else {
    res.status(201)
    res.send('New answer created')
  }
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const answer = await req.repositories.questionRepo.getAnswer(
    req.params.questionId,
    req.params.answerId
  )
  if (!answer) {
    res.status(404)
    res.send('Answer not found')
  } else {
    res.send(answer)
  }
})
app.get('*', (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => {
  //console.log(`Responder app listening on port ${PORT}`)
  console.log(`Responder app working on http://localhost:${PORT}`)
})
