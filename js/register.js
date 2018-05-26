$(document).ready(function(){
	var Check1=0;
	var Check2=0;
	var Check3=0;
	var Check4=0;
	var Check5=1;

	$("li:first-child").addClass("active1");
	$("li:first-child div").addClass("active2");
	// 用户名
	$(".regis-user input").focus(function(){
		$(".regis-user span").html("4-10位，中文、字母、数字和下划线组成");
	});
	$(".regis-user input").blur(function(){
		var reg =/^[\da-zA-Z_\u4e00-\u9f5a]{4,10}$/;
		if(reg.test($(".regis-user input").val())){       //输入正确
			$(".regis-user span").html('<img src="images/right.png" height="25px" width="25px"/>');
			Check1=1;
		}
		else{
			$(".regis-user span").html('<img src="images/error.png" height="25px" width="25px"/>');
			Check1=0;
		}
	});
	// 密码
	$(".regis-pass input").focus(function(){
		$(".regis-pass span").html("6-10位，字母、数字、下划线组成");
		$(".pass-eye").show();
	});
	$(".pass-eye").click(function(){
		var Pass=document.getElementById("pass");
		if(Pass.type=="text"){
			Pass.type="password";
			$(".pass-eye").attr("src","images/eye1.png");
		}
		else{
			Pass.type="text";
			$(".pass-eye").attr("src","images/eye2.png");
		}
	});
	$(".regis-pass input").blur(function(){
		var reg =/^\w{6,10}$/;
		if(reg.test($(".regis-pass input").val())){       //输入正确
			$(".regis-pass span").html('<img src="images/right.png" height="25px" width="25px"/>');
			Check2=1;
		}
		else{
			$(".regis-pass span").html('<img src="images/error.png" height="25px" width="25px"/>');
			Check2=0;
		}
	});
	// 联系电话
	$(".regis-call input").blur(function(){
		var reg =/^1\d{10}$/;
		if(reg.test($(".regis-call input").val())){       //输入正确
			$(".regis-call span").html('<img src="images/right.png" height="25px" width="25px"/>');
			Check3=1;
		}
		else{
			$(".regis-call span").html('<img src="images/error.png" height="25px" width="25px"/>');
			Check3=0;
		}
	});
	// 邮箱
	$(".regis-mail input").blur(function(){
		var reg =/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
		if(reg.test($(".regis-mail input").val())){       //输入正确
			$(".regis-mail span").html('<img src="images/right.png" height="25px" width="25px"/>');
			Check4=1;
		}
		else{
			$(".regis-mail span").html('<img src="images/error.png" height="25px" width="25px"/>');
			Check4=0;
		}
	});
	// 第一个 下一步
	$(".one-next").click(function(){
		$(".first input").each(function(i,obj){
			if(obj.value==""){
				Check5=0;
			}
		});
		if(!Check1 ||!Check2 ||!Check3 ||!Check4 ||!Check5){
			alert("请输入完整正确的信息！");
		}
		else{
			$(".first").hide();
			$(".second").show();
			$("li:nth-child(2)").addClass("active1");
			$("li:nth-child(2) div").addClass("active2");
		}
	});
	// 第二个 上一步
	$(".two-last").click(function(){
		$(".second").hide();
		$(".first").show();
		$("li:nth-child(2)").removeClass("active1");
		$("li:nth-child(2) div").removeClass("active2");
		$("li:first-child").addClass("active1");
		$("li:first-child div").addClass("active2");
	});
	// 第二个
	var FileSuf;
	$(".second img").click(function(){
		$(".file-btn").click();
		$(".file-btn").change(function(){
			var FileName=$(".file-btn").val();
			$(".second p").html(FileName);
			$(".second img").attr("src","images/file.png");
			FileSuf=FileName.lastIndexOf(".");
			FileSuf=FileName.substring(FileSuf,FileName.length).toUpperCase();
		});
	});
	// 第二个 下一步
	$(".two-next").click(function(){
		if(FileSuf != ".PDF" && FileSuf != ".DOC" && FileSuf != ".GIF" && FileSuf != ".JPG" && FileSuf != ".JPEG" && FileSuf != ".PNG"){
			alert("文件格式错误！");
		}
		else{
			var data=new FormData(document.getElementById("regis"));
			$.ajax({
				url: '../register.php',
				type: 'POST',
				data: data,
				cache: false,
				processData: false,
				contentType: false,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
							 alert(XMLHttpRequest.status);
							 alert(XMLHttpRequest.readyState);
							 alert(textStatus); // paser error;
						}
			}).done(function(ret){
				var Repar=JSON.parse(ret);
				var result=JSON.stringify(Repar.return);
				var reg = new RegExp('"',"g");
				result = result.replace(reg, "");
					if(result=='0'){
						alert('上传成功了');
						$(".second").hide();
						$(".third").show();
						$("li:nth-child(3)").addClass("active1");
						$("li:nth-child(3) div").addClass("active2");

						var t = 6;
						function showTime(){
							window.setInterval(function(){
								t -= 1;
								$(".three-btn").html('确认'+t+'秒');
								if(t==0){
									window.location.href = "login.html";
								}
							},1000);
						}
						showTime();
					}
					else if(result=='1'){
						alert('该用户名已被注册');
					}
					else if(result=='2'){
						alert('该手机号已被注册');
					}
					else if(result=='3'){
						alert('该邮箱已被注册');
					}
			})
		}
	});
			// //fd.append('user_name',$('input[name=user_name]').val());
			// fd.append('picture', $('input[name=picture]')[0].files[0]);
			// alert(JSON.stringify($('.regis').serializeArray()));
			//alert(JSON.stringify($('.regis').serializeArray()));
	$(".three-btn").click(function(){
		window.location.href = "login.html";
	});
	$(".back").click(function(){
		window.location.href = "login.html";
	});
});
