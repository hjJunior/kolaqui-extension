(function () {
  console.log('spyAttempt');

  const questionSectionSelector = '.que';
  const questionTextSelector = '.qtext';
  const responseForm = '#responseform';
  const checkboxAnswerSelectedSelector = '.answer input:radio:checked'
  const answersSelector = '.answer > div';

  const searchForReplies = async () => {
    const id = getQuestionDetails().questionId;
    
    fetch(`https://kolaqui.herokuapp.com/api/questions/${id}`)
      .then(response => response.json())
      .then(markTheAnswersAccordingToResponse);
  }

  const markTheAnswersAccordingToResponse = (response) => {
    response.answers.forEach((answer) => {
      const answerElement = $(document.getElementById(answer.slug)).parent();

      answer.replies.forEach((reply) => {
        if (reply.correct === true) {
          answerElement.css("background-color", "green");
        } else if (reply.correct == false) {
          answerElement.css("background-color", "red");
        }
      });
    });
  }

  const getQuestionDetails = () => {
    const questionId = $(questionSectionSelector).attr("id");
    const questionHtml = $(questionSectionSelector).find(questionTextSelector).html();

    return { questionId, questionHtml };
  }

  const getAnswerForMultichoiceQuestion = () => {
    const answer = $(questionSectionSelector).find(checkboxAnswerSelectedSelector);
    const answerId = $(answer).attr('id');
    const answerHtml = answer.find('+ label').html();
  
    return { answerId, answerHtml };
  }

  const getAvailableAnswers = () => {
    const answers = [];

    $(answersSelector).each((index, answer) => {
      answers.push({
        slug: $(answer).find('input').attr('name'),
        content: $(answer).html()
      })
    });

    return { answers };
  }

  const getAnswerDetails = () => {
    return getAnswerForMultichoiceQuestion();
  }

  searchForReplies();
  
  $(responseForm).submit(() => {
    const details = {
      ...getQuestionDetails(),
      ...getAnswerDetails(),
      ...getAvailableAnswers(),
    }

    const body = JSON.stringify(details);
    chrome.runtime.sendMessage({ path: 'questions', method: 'post', body });
  });
})();
