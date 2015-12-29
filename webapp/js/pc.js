/**
 * 执行
 */

window.onload = function(){
	'use strict';

	$.get('ajax/data.do','json',function(data){
		$('#J-ajaxTest').html(data.content.age);
	});
};