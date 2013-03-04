(function() {
	$('button.add').live('click', function(event) {
		var that = this;  
		$.ajax({
			url: '/addFriend'
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
