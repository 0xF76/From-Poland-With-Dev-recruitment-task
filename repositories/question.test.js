const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })
  test('should add one question', async () => {
    const question = {
      author: 'Haddaway',
      summary: 'What is love?'
    }
    await questionRepo.addQuestion(question)
    expect(await questionRepo.getQuestions()).toHaveLength(3)
  })
  test('should return specific question', async () => {
    const question = {
      id: faker.datatype.uuid(),
      summary: 'Be, or not to be?',
      author: 'Hamlet',
      answers: []
    }
    const id = question.id
    let testQuestions = await questionRepo.getQuestions()
    testQuestions.push(question)
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestionById(id)).toEqual([question])
  })
  test('should return answers for specific question', async () => {
    const question = {
      id: faker.datatype.uuid(),
      summary: 'What is the shape of the Earth?',
      author: 'John Stocktonlet',
      answers: [
        {
          id: 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
          author: 'Brian McKenzie',
          summary: 'The Earth is flat.'
        },
        {
          id: 'd498c0a3-5be2-4354-a3bc-78673aca0f31',
          author: 'Dr Strange',
          summary: 'It is egg-shaped.'
        },
        {
          id: 'fd55c3ba-db27-4d26-a834-b8f055272111',
          author: 'John Doe',
          summary: "It's flat like pizza!"
        }
      ]
    }
    const id = question.id
    const answers = question.answers
    let testQuestions = await questionRepo.getQuestions()
    testQuestions.push(question)
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getAnswers(id)).toEqual(answers)
  })
  test('should return specific answer', async () => {
    const question = {
      id: '50f9e662-fa0e-4ec7-b53b-7845e8f821c3',
      author: 'John Stockton',
      summary: 'What is the shape of the Earth?',
      answers: [
        {
          id: 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
          author: 'Brian McKenzie',
          summary: 'The Earth is flat.'
        },
        {
          id: 'd498c0a3-5be2-4354-a3bc-78673aca0f31',
          author: 'Dr Strange',
          summary: 'It is egg-shaped.'
        },
        {
          id: 'fd55c3ba-db27-4d26-a834-b8f055272111',
          author: 'John Doe',
          summary: "It's flat like pizza!"
        }
      ]
    }
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([question]))
    const specific_answer = {
      id: 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
      author: 'Brian McKenzie',
      summary: 'The Earth is flat.'
    }
    expect(
      await questionRepo.getAnswer(
        '50f9e662-fa0e-4ec7-b53b-7845e8f821c3',
        'ce7bddfb-0544-4b14-92d8-188b03c41ee4'
      )
    ).toEqual(specific_answer)
  })
  test('should add an answer to specific question', async () => {
    const question = {
      id: '50f9e662-fa0e-4ec7-b53b-7845e8f821c3',
      author: 'John Stockton',
      summary: 'What is the shape of the Earth?',
      answers: [
        {
          id: 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
          author: 'Brian McKenzie',
          summary: 'The Earth is flat.'
        },
        {
          id: 'd498c0a3-5be2-4354-a3bc-78673aca0f31',
          author: 'Dr Strange',
          summary: 'It is egg-shaped.'
        },
        {
          id: 'fd55c3ba-db27-4d26-a834-b8f055272111',
          author: 'John Doe',
          summary: "It's flat like pizza!"
        }
      ]
    }
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([question]))
    const answer = {
      id: faker.datatype.uuid(),
      author: 'Salvador Dali',
      summary: "It's melting!"
    }
    const question_id = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3'
    await questionRepo.addAnswer(question_id, answer);
    expect(await questionRepo.getAnswers(question_id)).toHaveLength(4)
  })
})
