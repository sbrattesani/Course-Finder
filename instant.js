var url='https://tracker.napier.ac.uk/timetable/cw.pl';
$(function(){
  $.getJSON(url,{module:'SET08101'},
      function(r){
        $('#desc').text(r.desc);
        $('#credit').text(r['SITS_MOD_CRDT']);
        $('#eCount').text(r.events.length);
        for(var i=0;i<r.events.length;i++){
          $('<div/>',{text:r.events[i].id})
            .appendTo($('body'));
        }
      }
  )
})
