(function () {
  console.log('Capturing from exame result page!');

  const questionSectionSelector = '.que';
  const questionTextSelector = '.qtext';
  const gradeSelector = '.grade';
  const checkboxAnswerSelectedSelector = '.answer input:radio:checked'
  const exameResult = '#region-main > div:nth-child(2) > table > tbody > tr:nth-child(5) > td';
  const courseSlug = '#page-navbar > nav > ol > li:nth-child(3)';
  
  const getReplyForMultichoiceQuestion = (questionElement) => {
    const answer = $(questionElement).find(checkboxAnswerSelectedSelector);
    const answerId = $(answer).attr('name');
    const isCorrect = isQuestionCorrect(questionElement);
  
    return { answerId, isCorrect };
  }

  const isQuestionCorrect = (questionElement) => {
    const regex = /Atingiu (\d+\,\d+) de (\d+\,\d+)/;
    const gradeText = $(questionElement).find(gradeSelector).text();
    const matchResult = gradeText.match(regex);

    return matchResult ? matchResult[1] === matchResult[2] : false;
  }
  
  const getRepliesForQuestion = (questionElement) => {
    return getReplyForMultichoiceQuestion(questionElement);
  }

  const getAttemptId = () => new URLSearchParams(window.location.search).get('attempt');
  
  const getReplies = () => {
    const exameQuestions = [];
  
    $(questionSectionSelector).each((index, questionElement) => {
      const questionId = questionElement.id;
    
      exameQuestions.push({
        questionId,
        ...getRepliesForQuestion(questionElement),
      });
    });
  
    return exameQuestions;
  }
  
  const getExame = () => {
    return {
      exameResult: $(exameResult).text(),
      courseSlug: $(courseSlug).text(),
      replies: getReplies(),
      attemptId: getAttemptId(),
    }
  }

  const body = JSON.stringify(getExame());
  chrome.runtime.sendMessage({ path: 'exame-review', method: 'post', body });
})();

