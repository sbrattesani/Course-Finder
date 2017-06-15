$(function(){
	var t = $('#schedule').html();
	var e = $('#relatedModules').html();
	$('#getModule').click(function(){
		$.getJSON('https://tracker.napier.ac.uk/timetable/cw.pl', {
			module:$('#pickModule').val()
		}, function(r){
			$('#moduleCode').text(r.SITS_MOD_CODE);
			$('#moduleName').text(r.SITS_MOD_NAME);
			$('#moduleLeader').text(r.SITS_MOD_LEADER);
			$('#credit').text(r.SITS_MOD_CRDT);
			$('#school').text(r.SITS_DPT_CODE);
			
				// On click generate a list of related subjects
				$.getJSON('https://tracker.napier.ac.uk/timetable/cw.pl?action=related', {
					module:$('#pickModule').val()
				}, function(m){
					$('#relatedModules').html(e); // Reset the paragraphs
					for (var a=0;a<m.alsotaking.length;a++){
						$('p#Module' +a).html(m.alsotaking[a].join(' - '));
					}
				});
			
			// Reset the table
			$('#schedule').html(t);
						
			//$('#schedule td').show();
			$('#schedule td').css('background-color', 'white');
			
			// Fill the timetable with the module information
			for (var i=0;i<r.events.length;i++){
			
				// Check if slot is empty, add information if not. Removes JSON repeats.
				$('#' + r.events[i].slot + ':empty').each(function(){
					$('#' + r.events[i].slot)
						.append(r.desc + "<br>")
						.append(r.events[i].type + "<br>")
						.append(r.events[i].rooms);
				
					// span colums equal to the duration and hide next siblings
					for (var j=1; j<r.events[i].duration; j++){
						$('#' + r.events[i].slot).next().remove();
					}
			
					$('#' + r.events[i].slot).attr('colspan', r.events[i].duration);
				});
			}
				
			// Change colour of the slots based on type of class
			$('td:contains("Practical")').css('background-color', 'rgb(255,153,102)');
			$('td:contains("Lecture")').css('background-color', 'rgb(100,200,200)');
			$('td:contains("Tutorial")').css('background-color', 'rgb(179,179,217)');
			$('td:contains("Clinic")').css('background-color', 'rgb(209,188,167)');
			$('td:contains("Reflection")').css('background-color', 'rgb(178,224,178)');
			
			// Change the school code to the school name
			$.getJSON('https://tracker.napier.ac.uk/timetable/cw.pl?action=list', {
				module:$('#pickModule').val()
			}, function(s){
				$('#school').text(s.school[r.SITS_DPT_CODE].name);
			});
		});
	});


	$.getJSON('https://tracker.napier.ac.uk/timetable/cw.pl', {
		action:'list'
	}, function(r){
		for (var s in r.school) {
			$('#pickSchool').append('<option value='+r.school[s].id+'>' + r.school[s].name + '</option>');
		}
	});

	$('#pickSchool').change(function(){
		$.getJSON('https://tracker.napier.ac.uk/timetable/cw.pl', {
			action:'list'
		}, function(r){
			var school = $('#pickSchool').val();
			$('#pickModule').html('');
			
			for (var s in r.school[school].subjects){
				for (var m in r.module[r.school[school].subjects[s]]){
					$('#pickModule').append('<option value="'+
						r.module[r.school[school].subjects[s]][m][0]+
						'">'+r.module[r.school[school].subjects[s]][m][1]+
						'</option>');
				}
			}
		});
	});

	// Print the page
	$('#printTimetable').click(function() { 
		window.print();
	});

});