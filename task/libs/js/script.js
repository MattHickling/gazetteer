$('#submitName').on("click", function(e) {

	$.ajax({
		url: "libs/php/getCountryInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: $('#country').val(),
			

		},
		success: function(result) {		
			console.log(JSON.stringify(result));

			if (result.status.name == "ok") {
			console.log(result['data'][0]['population'])
			$('#txtCapital').html(result['data'][0]['capital']);
			$('#txtPopulation').html(result['data'][0]['population']);
			}
		},

		error: function(jqXHR, textStatus, errorThrown) {
			alert("something went wrong");

}}); 
});

$('#submitOcean').on('click', function(e) {

	$.ajax({
		url: "libs/php/ocean.php",
		type: 'POST',
		dataType: 'json',
		data: {
			longitude: $('#longitude').val(),
			latitude: $('#latitude').val()
		},
		success: function(result) {
			// console.log(result);
			console.log(JSON.stringify(result));
	
			if (result.status.name == "ok") {

			$('#ocean').html(result.data.name);
		}		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert("something went wrong");
		}
	}); 

	});

	$('#submitWeather').on('click', function(e) {

		$.ajax({
			url: "libs/php/weather.php",
			type: 'POST',
			dataType: 'json',
			data: {
				lat: $('#lat').val(),
				lng: $('#lng').val(),
			},

			success: function(result) {
				// console.log(result);
				console.log(JSON.stringify(result));
		
				if (result.status.name == "ok") {
	
				$('#weatherObservation').html(result.data.temperature);
				
			}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert("something went wrong");
			}
		}); 
	
		});

