(function() {
	var $signin = $('#signin');
	var $signup = $('#signup');
	var $form = $('#form');
	$signin.click(function(event) {
		event.preventDefault();
		$.ajax({
			type: 'POST'
			, url: '/signin'
			, data: $form.serialize()
			, success: function(data) {
				if(data == 'OK') {
					window.location.href = '/';
				} else {
					alert(data);
				}
			}
			, error: function() {	
				alert('Error');
			}
		});
	});

	$signup.click(function(event) {
		event.preventDefault();
		window.location.href = '/signup';
	});

})();
