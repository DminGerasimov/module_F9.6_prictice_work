      var conn = null;
      function log(msg) {
        var control = $('#log');
        control.html(control.html() + msg + '<br/>');
        control.scrollTop(control.scrollTop() + 1000);
      }

      function checkState(){
        if (conn.readyState == 1){
          $('#status').text('ws opened.');
        }
        if (conn.readyState == 0) {
          $('#status').text('ws opening...');
        }
        if (conn.readyState == 2) {
          $('#status').text('ws closing...');
        }
      }

      function connect() {
        //disconnect(); // разрываем соединение если функция вызвана по-ошибке
        var wsUri = (window.location.protocol=='https:'&&'wss://'||'ws://') + '127.0.0.1:8080';
        conn = new WebSocket(wsUri); //открываем соединение
        log('Connecting...');
        const timerId = setInterval(checkState, 10);
        conn.onopen = function() {
          log('Connected.');
          update_ui();
        };
        conn.onmessage = function(e) {
          if (e.data =='ping') {
            log('ping ok: ' + e.data);
          }
          else {log('Received: ' + e.data);
        }
        };
        conn.onclose = function(e) {
          log('Disconnected.');
          conn = null;
          update_ui();
        };
      }
      function disconnect() {
        if (conn != null) {
          log('Disconnecting...');
          conn.close();
          conn = null;
          update_ui();
        }
      }
      function update_ui() {
        if (conn == null) {
          $('#connect').html('Connect');
          $('#status').text('ws closed.');
          clearInterval(timerId);
        } else {
          $('#connect').html('Disconnect');
          clearInterval(timerId);
        }
      }
      $('#connect').click(function() {
        if (conn == null) {
          connect();
        } else {
          disconnect();
        }
        update_ui();
        return false;
      });
      $('#send').click(function() {
        var text = $('#text').val();
        log('Sending: ' + text);
        conn.send(text);
        $('#text').val('').focus();
        return false;
      });
      $('#text').keyup(function(e) {
        if (e.keyCode === 13) {
          $('#send').click();
          return false;
        }
      });
