(function(){
	var $submit = $('#submit');
	var $users = $('#users');
	var $form = $('#form');

	$('button.delete').live('click', function(event){
		var _id = $(this).attr('_id');
		var $that = $(this);
		$.ajax({
			type: 'POST'
			, url: '/userRemove'
			, data: '_id=' + _id
			, success: function(data) {
				if(data == 'ok') {
					$that.parents('li').remove();
				}
				else {
					alert(data);
				}
			}
			, error: function(e) {
				alert(e);
			}
		});
	});

	$submit.on('click', function(event){
		event.preventDefault();
		$.ajax({
			type: 'POST'
			, url: '/userCreate'
			, data: $form.serialize()
			, success: function(data) {
				var $li = $('<li class="user"><button class="delete">delete</button></li>');
				$li.prepend(JSON.stringify(data));
				$li.find('button.delete').attr('_id', data._id);
				$users.append($li);
			}
			, error: function(e) {
				alert(e);
			}
		});
	});
})();
