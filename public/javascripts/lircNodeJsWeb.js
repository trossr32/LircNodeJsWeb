$(document).ready(function(){
  // $('div[id^="device-"]').each(function(){
  //   var id = $(this).attr('id');
  //   var device = /device-(.*)/.exec(id)[1];
  //   $(this).on('click', function(){
  //     window.location.href = '/devices/' + device;
  //   });
  // });

  // $('div[id^="KEY_"]').each(function(){
  //   var device = $('input#currentDevice').val();
  //   $(this).on('click', function(){
  //     postKey('/devices/'+device+'/SEND_ONCE/' + $(this).attr('id'));
  //   });
  // });

  // $('div[id^="ALT_"]').each(function(){
  //   var id = $(this).attr('id');
  //   var device = id.match(/ALT_(.*)_KEY/)[1];
  //   var key = id.match(/KEY_.*/)[0];
  //   $(this).on('click', function(){
  //     postKey('/devices/'+device+'/SEND_ONCE/' + key);
  //   }); 
  // });

  // $('div[id^="MACRO_"]').each(function(){
  //   var id = $(this).attr('id');
  //   var macro = id.match(/MACRO_(.*)/)[1];
  //   $(this).on('click', function (){
  //     postKey('/macro/'+macro);
  //   });
  // });

  $('[data-ircommand]').click(function() {
    var splitter = $(this).attr("data-ircommand").split(',');

    if (splitter.length === 2) {
      postKey('/macro/' + splitter[1]);

      //irCommand = { Type: splitter[0], Id: splitter[1], Remote: "", Delay: 0 };
    } else {
      postKey('/devices/' + splitter[0] + '/SEND_ONCE/' + splitter[2]);

      //irCommand = { Type: splitter[1], Id: splitter[2], Remote: splitter[0], Delay: 0 };
    }
});
});

function postKey(route){
  $.post(route, function(data){
    console.log(data); 
  });
}
