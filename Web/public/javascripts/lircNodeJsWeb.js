$(document).ready(function(){
  $('[data-ircommand]').click(function() {
    var cmd = $(this).data("ircommand");

    if (cmd.type === 'macro') {
      postKey('/macro/' + cmd.key);
    } else {
      postKey('/devices/' + cmd.device + '/SEND_ONCE/KEY_' + cmd.key + '/' + cmd.count);
    }
  });
});

function postKey(route){
  $.post(route, function(data){
    console.log(data); 
  });
}