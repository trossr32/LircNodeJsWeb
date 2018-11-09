$(document).ready(function(){
  $('[data-ircommand]').click(function() {
    var splitter = $(this).attr("data-ircommand").split(',');

    if (splitter.length === 2) {
      postKey('/macro/' + splitter[1]);
    } else {
      postKey('/devices/' + splitter[0] + '/SEND_ONCE/' + 'KEY_' + splitter[2]);
    }
  });
});

function postKey(route){
  $.post(route, function(data){
    console.log(data); 
  });
}