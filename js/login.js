$(document).ready(function(){
	$(".login-pass").focus(function(){
		$(".pass-eye").show();
	});
	$(".pass-eye").click(function(){
		var Pass=document.getElementById("pass");
		if(Pass.type=="text"){
			Pass.type="password";
			$(".pass-eye").attr("src","images/eye3.png");
		}
		else{
			Pass.type="text";
			$(".pass-eye").attr("src","images/eye4.png");
		}
	});

	$.ajax({
        type: 'GET',
        dataType: 'json',
        url: '../captcha.php',
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);
		}
    }).done(function(data){
			var reg = new RegExp('"',"g");
			data=JSON.stringify(data);
			data = data.replace(reg, "");
            var base64Img='data:image/png;base64,'+data;
			//alert(base64Img);
			//$("#base").attr("src",base64Img);
			$(".login-img").attr("src",base64Img);
	});

	$(".submit").click(function(){
		// var userpar ={
			// "user_name":$(".login-user").val(),
			// "password":$(".login-pass").val(),
			// "check":$("login-check").val()
		// }
		// var userstr=JSON.stringify(userpar);
		// var data="data=" + userstr;
		var data=new FormData(document.getElementById("login"));
		$.ajax({
				type: "POST",  //数据提交方式（post/get）
				url: '../check.php',  //提交到的url
				data: data,//提交的数据
				dataType: "json",//返回的数据类型格式
				cache: false,
				processData: false,
			  contentType: false,
				success: function(ret){
				  //alert(ret);
					//var Repar=JSON.parse(ret);
					var result=JSON.stringify(ret.return);
					var reg = new RegExp('"',"g");
					result = result.replace(reg, "");
					if(result=='1'){
						alert("登录信息错误");
					}
					else if(result=='2'){
						alert("该用户正在审核中，请耐心等待");
					}
					else if(result=='3'){
						alert("验证码错误");
					}
					else if(result=='0'){
						window.location.href = "page.html";
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					alert(XMLHttpRequest.status);
					alert(XMLHttpRequest.readyState);
					alert(textStatus);
				}
			});
		return false;
	});
});
