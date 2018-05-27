$(document).ready(function(){ 
　　$.get("pages/village.html",function(data){
		$("#main-frame").html(data);
		$(".nav li:first").addClass("active");
　　}); 
	$(".nav li").click(function(){
		$(".nav").children("li").removeClass("active");
		$(this).addClass("active");
		var NavTar=$(this).find('a').attr('target');
		$.get(NavTar,function(data){
			$("#main-frame").html(data);
		});
	});
	
	$(".rec1").mouseover(function(){
		$(".add").show();
	});
	$(".add").mouseover(function(){
		$(".add").show();
	});
	$(".add").mouseleave(function(){
		$(".add").hide();
	});
	$(".rec2").mouseover(function(){
		$(".set").show();
	});
	$(".rec2").mouseover(function(){
		$(".set").show();
	});
	$(".set").mouseleave(function(){
		$(".set").hide();
	});
});