const { readFile, writeFile } = require('fs/promises')
const { v4: uuidv4 } = require('uuid')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await getQuestions()
    const result = questions.filter(obj => {
      return obj.id == questionId
    })
    if (!result.length) return null
    else return result
  }
  const addQuestion = async question => {
    let questions = await getQuestions()
    if (question.author == undefined || question.summary == undefined) {
      return false
    } else {
      questions.push({
        id: uuidv4(),
        author: question.author,
        summary: question.summary,
        answers: []
      })
      await writeFile(fileName, JSON.stringify(questions, null, '\t'))

      return true
    }
  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)
    if (!question) return null
    else return question[0].answers
  }
  const getAnswer = async (questionId, answerId) => {
    const question = await getQuestionById(questionId)
    if (!question) return null
    else {
      const answers = question[0].answers
      const result = answers.filter(obj => {
        return obj.id === answerId
      })[0]
      return result
    }
  }
  const addAnswer = async (questionId, answer) => {
    const questions = await getQuestions()
    const question = questions.filter(obj => {
      return obj.id === questionId
    })[0]
    if (
      !question ||
      answer.author == undefined ||
      answer.summary == undefined
    ) {
      return null
    } else {
      question.answers.push({
        id: uuidv4(),
        author: answer.author,
        summary: answer.summary
      })

      await writeFile(fileName, JSON.stringify(questions, null, '\t'))
      return true;
    }
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
