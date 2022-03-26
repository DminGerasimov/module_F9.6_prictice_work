send.onclick = function (){

  // Получаем значение текстового поля с веб-формы
  //  для его отправки на сервер в fetch методом POST
  const messageText = $('#text').val();

  //Очищает текстовые поля статуса запроса и отправляемого сообщения
  $('#status').text('');
  $('#text').val('');


  fetch('http://localhost:8080/news', {  
    method: 'post',  
    headers: {  
      "Content-type": "text/plain; charset=UTF-8"  
    },  
    body: messageText,
  }
    )  
  .then(function(response) {  
    return response.text();  
  })  
  .then(function(text) {  
    console.log('Request successful', text);
    $('#status').text(text);
  })  
  .catch(function(error) {  
    log('Request failed', error)  
  });



  

}