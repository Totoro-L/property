window.onLoad  = function(){
	var map;
	$(".gar-addth .gar-position button").click(function(){
		$("#gar-Lng").val("");
		$("#gar-Lat").val("");
		map = new AMap.Map('gar-map',{
			resizeEnable: true
		});
		var clickEventListener = map.on('click', function(e) {
			$("#gar-Lng").val(e.lnglat.getLng());
			$("#gar-Lat").val(e.lnglat.getLat());
		});
		
		AMap.plugin(['AMap.ToolBar','AMap.Autocomplete'],function(){//异步同时加载多个插件
			var auto = new AMap.Autocomplete({
				input: "garmap-checkin"
			});
			AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
			function select(e) {
				if (e.poi && e.poi.location) {
					map.setZoom(15);
					map.setCenter(e.poi.location);
				}
			}
		});
		$("#gar-map").show();
		$("#gar-map-input").show();
	});
    $("#gar-map-input td button").click(function(){
		$("#gar-map").hide();
		$("#gar-map-input").hide();
		$(".gar-addth .gar-position .lng").val($("#gar-Lng").val());
		$(".gar-addth .gar-position .lat").val($("#gar-Lat").val());
		map.destroy();
	});
}
var url = 'http://webapi.amap.com/maps?v=1.4.6&key=1f16a80978ad04190fc3b07ab092380f&callback=onLoad';
var jsapi = document.createElement('script');
jsapi.charset = 'utf-8';
jsapi.src = url;
document.head.appendChild(jsapi);