export const registeredLambdas = [
  {
    moduleName: 'getQuiz',
    moduleFunction: 'handler',
    method: 'GET',
    apiPaths: ['/quiz', '/actors-quiz', '/description-quiz'],
  },
  {
    moduleName: 'postQuiz',
    moduleFunction: 'handler',
    method: 'POST',
    apiPaths: ['/quiz'],
  },
];
