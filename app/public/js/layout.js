(function(){
	/*Slidedown menu*/
	var $slide = $('ul.slide');
	$slide.hover(function(event) {
		$slide.find('li.item').css({
			display: 'inline-block'
		});
	}, function(event) {
		$slide.find('li.item').css({
			display: 'none'
		});
	});

	$('a.button-link').click(function(event) {
		window.location.href = this.href;
	});
})();
