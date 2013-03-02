(function() {
	var $opswd = $('#opassword');
	var $npswd = $('#npassword');
	var $vpswd = $('#vpassword');
	var $button = $('#button');

	$button.click(function(event) {
		event.preventDefault();
		if($npswd.val().length < 6) {
			alert('The legth must be longer than 6');
		} else if($npswd.val() !== $vpswd.val()) {
			alert('Passwords you typed are not the same');
		} else {
			$.ajax({
				url: '/passwordUpdate'
				,type: 'POST'
				,data: $('#profileUpdate').serialize()
				,success: function(data) {
					alert(data);
				}
				,error: function(error) {
					alert('connect error');
				}
			});
		}
	});
})();
