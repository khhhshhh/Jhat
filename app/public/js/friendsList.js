(function() {
	$('button.remove').live('click', function(event) {
		var that = this;  
		$.ajax({
			url: '/removeFriend'
			,data: 'id=' + this.value
			,type: 'POST'
			,success: function(data){
				alert(data);
			}
			,error: function(error){
				alert('Connect error!');
			}
		});
	});
})();
