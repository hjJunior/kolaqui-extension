(function () {
  const baseUrl = 'https://kolaqui.herokuapp.com/api';
  // const baseUrl = 'http://127.0.0.1:8000/api';

  console.log('Capturing from exame result page!');

  const submitPageHtml = ()  => {
    const formData = new FormData();
    const blob = new Blob([
      `<html>${$("html").html()}</html>`
    ], { type: 'text/html' });

    formData.append('file', blob, 'exame-review.html');

    var request = new XMLHttpRequest();
    request.open('POST', `${baseUrl}/upload`);
    request.send(formData);
  }

  submitPageHtml();
})();

