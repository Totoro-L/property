var pageSum;   //记录总页数
function addInit(){
	$("#pro-name").val("");
	$("#pro-mail").val("");
	$("#pro-call").val("");
};
function pageNow(i,max){
	for(var j=0;j<5;j++)
	{
		$($(".pro-pag-div").children("input").get(j)).removeClass("pro-btn-active");
	}
	var x=i%5;
	if(x==0)
	{
		$($(".pro-pag-div").children("input").get(4)).addClass("pro-btn-active");
		x+=5;
	}
	else
	{
		$($(".pro-pag-div").children("input").get(x-1)).addClass("pro-btn-active");
	}
	var y=i-x;
	for(var j=0;j<5;j++)
	{
		y=y+1;
		$($(".pro-pag-div").children("input").get(j)).val(y);
		if(y>max)
		{
			$($(".pro-pag-div").children("input").get(j)).hide();
		}
	}
};
function getData(currentPage){
	getPush={
		"currentPage":currentPage
	};
	getPush={
		"jsonPage":getPush
	};
	var retPage;
	console.log(getPush);
	
	
	$.ajax({
		 type: "POST",  //数据提交方式（post/get）
		 url: '../account.php?action=change',  //提交到的url
		 data: getPush,//提交的数据
		 dataType: "json",//返回的数据类型格式
		 success: function(ret){
			ret=JSON.stringify(ret);
			ret=JSON.parse(ret);
			var tab="<tr><th>序号</th><th>用户名</th><th>公司邮箱</th><th>联系电话</th><th>审核状态</th><th>操作</th></tr><tr><td class=\"space\"></td></tr>";
			var statusCec;
			for(var i=0;i<ret.count-1;i++)
			{
				var imgAdd="<td><span id=\"span3\"><img src=\"images/u30.png\" width=\"18px\" height=\"18px\"/>下载凭证文件</span>"+
					 "<span id=\"span2\"><img src=\"images/right.png\" width=\"18px\" height=\"18px\"/>审核通过</span>"+
					 "<span id=\"span1\"><img src=\"images/error.png\" width=\"18px\" height=\"18px\"/>审核失败</span></td>";
				if(ret[i].status==0)
				{
					statusCec='待审核';
				}
				else if(ret[i].status==1)
				{
					statusCec='审核成功';
					imgAdd="<td><span id=\"span3\"><img src=\"images/u30.png\" width=\"18px\" height=\"18px\"/>下载凭证文件</span></td>";
				}
				else
				{
					statusCec='审核失败';
					imgAdd="<td><span id=\"span3\"><img src=\"images/u30.png\" width=\"18px\" height=\"18px\"/>下载凭证文件</span>"+
					 "<span id=\"span4\"><img src=\"images/error.png\" width=\"18px\" height=\"18px\"/>删除</span></td>";
				}
				tab+="<tr>";
				tab+="<td>"+parseInt(i+1)+"</td>";
				tab+="<td class=\"pro-td-width\" id=\"comName\"><a href=\"#\">"+ret[i].name+"</a></td>"+
					 "<td class=\"pro-td-width\" id=\"park_name\">"+ret[i].mail+"</td>"+
					 "<td class=\"pro-td-width\" id=\"park_number\">"+ret[i].phone+"</td>"+
					 "<td>"+statusCec+"</td>"+
					 imgAdd;
				tab+="</tr>";
			}
			$("#pro").html(tab);
			$("tr:even").css("background-color","#ccc");
			pageSum=ret.PageNum;
			var total="共"+ret.PageNum+"页,"+ret.ProNum+"条数据";
			$(".pro-bottom-del").html(total);
			
			if(currentPage==1 && currentPage==ret.PageNum){
				$("#pro-first-page").attr("class","pro-paging-down");
				$("#pro-last-page").attr("class","pro-paging-down");
				$("#pro-first-page").attr("disabled", true);
				$("#pro-last-page").attr("disabled", true);
				
				$("#pro-final-page").attr("class","pro-paging-down");
				$("#pro-next-page").attr("class","pro-paging-down");
				$("#pro-final-page").attr("disabled", true);
				$("#pro-next-page").attr("disabled", true);
			}
			else if(currentPage==1)
			{
				pageSum=ret.PageNum;
				var total="共"+ret.PageNum+"页,"+ret.ProNum+"条数据";
				$(".pro-bottom-del").html(total);

				$("#pro-first-page").attr("class","pro-paging-down");
				$("#pro-last-page").attr("class","pro-paging-down");
				$("#pro-first-page").attr("disabled", true);
				$("#pro-last-page").attr("disabled", true);

				$("#pro-final-page").attr("class","pro-paging");
				$("#pro-next-page").attr("class","pro-paging");
				$("#pro-final-page").attr("disabled", false);
				$("#pro-next-page").attr("disabled", false);
			}
			else if(currentPage==ret.PageNum)
			{
				$("#pro-final-page").attr("class","pro-paging-down");
				$("#pro-next-page").attr("class","pro-paging-down");
				$("#pro-final-page").attr("disabled", true);
				$("#pro-next-page").attr("disabled", true);

				$("#pro-first-page").attr("class","pro-paging");
				$("#pro-last-page").attr("class","pro-paging");
				$("#pro-first-page").attr("disabled", false);
				$("#pro-last-page").attr("disabled", false);
			}
			else{
				$("#pro-first-page").attr("class","pro-paging");
				$("#pro-last-page").attr("class","pro-paging");
				$("#pro-first-page").attr("disabled", false);
				$("#pro-last-page").attr("disabled", false);

				$("#pro-final-page").attr("class","pro-paging");
				$("#pro-next-page").attr("class","pro-paging");
				$("#pro-final-page").attr("disabled", false);
				$("#pro-next-page").attr("disabled", false);
			}
			pageNow(1,1);
			retPage=ret.PageNum;
			retPage=ret.PageNum;
		 },
		 error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);
		 }
	 });
	return retPage;
};
function pasCheck(some,name){
	if(some=="proPic"){  //查看车位凭证
		$.ajax({
			type: "POST",  //数据提交方式（post/get）
			url: '../account_admin.php?action=check',  //提交到的url
			data: name,//提交的数据
			dataType: "json",//返回的数据类型格式
			success: function(ret){
				console.log(ret);
				var $eleForm = $("<form method='get'></form>");
				$eleForm.attr("action",ret.pic);
				$(document.body).append($eleForm);
				$eleForm.submit();
				$(".shade").hide();
				$(".pasCh").hide();
				$("body").css("overflow","scroll");
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
				alert(textStatus);
			}
		});
	}
	else if(some=="proCek1"){ //审核通过
		console.log(name);
		$.ajax({
			type:"POST",
			url:'../account_admin.php?action=change',
			data:name,
			dataType:"json",
			success:function(ret){
				console.log(ret);
				if(ret.result==1){
					alert("已上传审核结果！");
					finalPage=getData(1);
					curPage=1;
					$(".nav li:nth-child(1)").click();
				}
				else{
					alert("审核操作失败，请稍后重试！");
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
				alert(textStatus);
			}
		})
	}
	else if(some=="proCek2"){ //审核失败
			console.log(name);
			
			$.ajax({
				type:"POST",
				url:'../account_admin.php?action=change',
				data:name,
				dataType:"json",
				success:function(ret){
					console.log(ret);
					if(ret.result==1){
						alert("已上传审核结果！");
						finalPage=getData(1);
						curPage=1;
						$(".shade").hide();
						$(".pro-error").hide();
						$("body").css("overflow","scroll");
						$(".nav li:nth-child(1)").click();
					}
					else{
						alert("审核操作失败，请稍后重试！");
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					alert(XMLHttpRequest.status);
					alert(XMLHttpRequest.readyState);
					alert(textStatus);
				}
			})
	}
	else if(some=="delete"){    //删除
			console.log(name);
			
			$.ajax({
				type:"POST",
				url:'../account_admin.php?action=delete',
				data:name,
				dataType:"json",
				success:function(ret){
					console.log(ret);
					// if(ret.result==1){
						alert("已删除！");
						$(".shade").hide();
						$(".pro-error").hide();
						$("body").css("overflow","scroll");
						$(".nav li:nth-child(1)").click();
					// }
					// else{
						// alert("删除操作失败，请稍后重试！");
					// }
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					alert(XMLHttpRequest.status);
					alert(XMLHttpRequest.readyState);
					alert(textStatus);
				}
			})
	}
}

var finalPage=1;
$(".pro-pag-div").children("input").css("cursor","pointer");
addInit();      //添加小区初始化

$(document).ready(function(){
	finalPage=getData(1);
	curPage=1;
	//选择页数
	$("#pro-first-page").click(function(){
		curPage=1;
		finalPage=getData(1);
	});
	$("#pro-final-page").click(function(){
		curPage=finalPage;
		finalPage=getData(finalPage);
	});
	$(".pro-pag-div .pro-pag").click(function(){
		curPage=$(this).val();
		finalPage=getData(curPage);
	})
	$("#pro-next-page").click(function(){
		curPage=parseInt(curPage)+1;
		finalPage=getData(curPage);
	})
	$("#pro-last-page").click(function(){
		curPage=parseInt(curPage)-1;
		finalPage=getData(curPage);
	})
	//添加物业
	$(".pro-add").click(function(){
		addInit();
		$("html,body").animate({scrollTop:"0"},1);
		$(".shade").show();
		$(".pro-addth").show();
		$("body").css("overflow","hidden");
	});
	$(".pro-btn1").click(function(){
		$(".shade").hide();
		$(".pro-addth").hide();
		$("body").css("overflow","scroll");
	});
	$(".pro-btn2").click(function(){

		if($(".pro-name").val()=="")
		{
			alert("请输入用户名！");
		}
		else if($(".pro-mail").val()=="")
		{
			alert("请输入公司邮箱！");
		}
		else if($(".pro-call").val()==""){
			alert("请输入联系电话！");
		}
		else{
			var data={
				"position":{
					"name":$(".pro-name").val(),
					"phone":$(".pro-call").val(),
					"email":$(".pro-mail").val()
				}
			}
			$.ajax({
				type: "POST",  //数据提交方式（post/get）
				url: '../account_join.php',  //提交到的url
				data: data,//提交的数据
				dataType: "json",//返回的数据类型格式
				cache: false,
				processData: false,
			    contentType: false,
				success: function(){
					alert("提交成功！");
					curPage=1;
					finalPage=getData(1);
					$(".shade").hide();
					$(".pro-addth").hide();
					$("body").css("overflow","scroll");
					$(".nav li:nth-child(1)").click();
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					alert(XMLHttpRequest.status);
					alert(XMLHttpRequest.readyState);
					alert(textStatus);
				}
			});
			return false;
		}
	});
	
	var proName;
	var call;
	var name;
	$("#pro").on("click","#span3",function(){//查看凭证照片
		// num=$(this).parent("td").siblings("#park_number").text();
		proName=$(this).parent("td").siblings("#comName").text();
		// call=$(this).parent("td").siblings("#call").text();
		name={
			"position":{
				"name":proName
			}
		}
		pasCheck("proPic",name);
	})
	$("#pro").on("click","#span1",function(){  //审核失败
		// num=$(this).parent("td").siblings("#park_number").text();
		proName=$(this).parent("td").siblings("#comName").text();
		// call=$(this).parent("td").siblings("#call").text();
		name={
			"position":{
				"park_name":proName,
				"flag":"0"
			}
		}
		pasCheck("proCek2",name);
	});
	$("#pro").on("click","#span2",function(){  //审核通过
		// num=$(this).parent("td").siblings("#park_number").text();
		proName=$(this).parent("td").siblings("#comName").text();
		// call=$(this).parent("td").siblings("#call").text();
		name={
			"position":{
				"park_name":proName,
				"flag":"1"
			}
		}
		pasCheck("proCek1",name);
	});
	$("#pro").on("click","#span4",function(){  //删除
		// num=$(this).parent("td").siblings("#park_number").text();
		proName=$(this).parent("td").siblings("#comName").text();
		// call=$(this).parent("td").siblings("#call").text();
		name={
			"position":{
				"name":proName
			}
		}
		pasCheck("delete",name);
	});
});
