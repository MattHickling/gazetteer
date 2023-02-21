$('#submitName').on("click", function(e) {

	$.ajax({
		url: "libs/php/getCountryInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: $('#countryName').val(),
		},
		success: function(result) {

			console.log(JSON.stringify(result));

			if (result.status.name == "ok") {

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
		url: "libs/php/Ocean.php",
		type: 'POST',
		dataType: 'json',
		data: {
		long: $('#long').val(),
		lat: $('#lat').val()
		},
		success: function(result) {

		console.log(JSON.stringify(result));
	
			if (result.status.name == "ok") {

			$('#ocean').html(result);
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
			lng: $('#lng').val(),
			latitude: $('#latitude').val(),
			},

			success: function(result) {
	
			console.log(JSON.stringify(result));
		
				if (result.status.name == "ok") {
	
				$('#weatherObservation').html(result);
			}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert("something went wrong");
			}
		}); 
	
		});

