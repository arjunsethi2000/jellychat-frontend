function submitForm(e) {
  console.log(e)
  if(e.preventDefault) {
    e.preventDefault()
  } else {
    e.cancel = true
  }
  $("#Send-Chat").click();
}

function getQueryParams() {
  qs = document.location.search;
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

IP = "192.168.15.101"

window.onload = function() {
  nick = ""
  room = getQueryParams().room

  if(room) {
    $(".chat-room").val(room)
  }

    $("#Start-Chat").click(function() {
        if($(".chat-name").val() != "" && $(".chat-room").val() != "") {
            nick = $(".chat-name").val()
            room = $(".chat-room").val()
            $(".chat-config").hide()
            $(".chat").show()
            $(".header").show()
            $(".room").show()
            $(".room").text("Room: " + room)
          }
    });



    $("#Go-Home").click(function() {
      $(".chat-config").show()
      $(".chat").hide()
      $(".header").hide()
      $(".room").hide()
      $(".chat-room").val("")
    });



    $("#Send-Chat").click(function() {
      if( $(".chat-textarea").val() != "") {
        $.ajax({
          method: "POST",
          url: "http://"+IP+":3000/api/chats/post",
          data: JSON.stringify({ nick: nick, message: $(".chat-textarea").val(), room: room }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        }).error(function(a, b, c) {
          console.log(a, b, c);
        })
        $(".chat-textarea").val("")
      }
    });

    function updateChat() {
      if(room!="" && nick!="") {
        $.get("http://"+IP+":3000/api/chats/list?room="+room).done(function(result) {
          html = ""
          result.forEach(function(val, index, array) {
            html += "<b>" + val.nick + "</b>: "
            html += val.message
            html += "</br>"
          });
          $(".chat-messages").html(html)
        })
      }
    }
    setInterval(updateChat, 100);

}
