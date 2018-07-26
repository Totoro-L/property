var pageSum;   //记录总页数
function addInit(){
	$(".vla-name input").val("");
	$("#province1").get(0).selectedIndex=0;
	$("#city1").get(0).selectedIndex=0;
	$("#district1").get(0).selectedIndex=0;
	$("#vla-upfile").val("");
	$("#vla-upbtn span").html("（*支持pdf、doc、jpg、jpeg、gif、png格式）");
};
function pageNow(i,max){
	for(var j=0;j<5;j++)
	{
		$($(".vla-pag-div").children("input").get(j)).removeClass("vla-btn-active");
	}
	var x=i%5;
	if(x==0)
	{
		$($(".vla-pag-div").children("input").get(4)).addClass("vla-btn-active");
		x+=5;
	}
	else
	{
		$($(".vla-pag-div").children("input").get(x-1)).addClass("vla-btn-active");
	}
	var y=i-x;
	for(var j=0;j<5;j++)
	{
		y=y+1;
		$($(".vla-pag-div").children("input").get(j)).val(y);
		if(y>max)
		{
			$($(".vla-pag-div").children("input").get(j)).hide();
		}
	}
};
function getData(currentPage){
	getPush={
		currentPage:currentPage
	};
	getPush={
		"jsonPage":getPush
	};
	var retPage;
	$.ajaxSetup({
		async : false
	});
	$.get("../commu.php",getPush,function(ret){
		console.log(ret);
		ret=JSON.stringify(ret);
		ret=JSON.parse(ret);
		var tab="<tr><th>序号</th><th>小区名称</th><th>归属物业</th><th>审核状态</th><th>操作</th></tr><tr><td class=\"space\"></td></tr>";
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
            tab+="<td class=\"commu_name\"><a href=\"#\">"+ret[i].commu_name+"</a></td>"+
			     "<td>"+ret[i].user+"</td>"+
				 "<td>"+statusCec+"</td>"+
				 imgAdd;
            tab+="</tr>";
        }
		$("#vla").html(tab);
		$("tr:even").css("background-color","#ccc");
		
		pageSum=ret.PageNum;
		var total="共"+ret.PageNum+"页,"+ret.ProNum+"条数据";
		$(".vla-bottom-del").html(total);
		if(currentPage==1 && ret.PageNum==1){
			$("#vla-first-page").attr("class","vla-paging-down");
			$("#vla-last-page").attr("class","vla-paging-down");
			$("#vla-first-page").attr("disabled", true);
			$("#vla-last-page").attr("disabled", true);

			$("#vla-final-page").attr("class","vla-paging-down");
			$("#vla-next-page").attr("class","vla-paging-down");
			$("#vla-final-page").attr("disabled", true);
			$("#vla-next-page").attr("disabled", true);
		}
		else if(currentPage==1)
		{
			$("#vla-first-page").attr("class","vla-paging-down");
			$("#vla-last-page").attr("class","vla-paging-down");
			$("#vla-first-page").attr("disabled", true);
			$("#vla-last-page").attr("disabled", true);

			$("#vla-final-page").attr("class","vla-paging");
			$("#vla-next-page").attr("class","vla-paging");
			$("#vla-final-page").attr("disabled", false);
			$("#vla-next-page").attr("disabled", false);
		}
		else if(currentPage==ret.PageNum)
		{
			$("#vla-final-page").attr("class","vla-paging-down");
			$("#vla-next-page").attr("class","vla-paging-down");
			$("#vla-final-page").attr("disabled", true);
			$("#vla-next-page").attr("disabled", true);

			$("#vla-first-page").attr("class","vla-paging");
			$("#vla-last-page").attr("class","vla-paging");
			$("#vla-first-page").attr("disabled", false);
			$("#vla-last-page").attr("disabled", false);
		}
		else{
			$("#vla-first-page").attr("class","vla-paging");
			$("#vla-last-page").attr("class","vla-paging");
			$("#vla-first-page").attr("disabled", false);
			$("#vla-last-page").attr("disabled", false);

			$("#vla-final-page").attr("class","vla-paging");
			$("#vla-next-page").attr("class","vla-paging");
			$("#vla-final-page").attr("disabled", false);
			$("#vla-next-page").attr("disabled", false);
		}
		pageNow(currentPage,pageSum);
		retPage=ret.PageNum;
		retPage=ret.PageNum;
	});
	return retPage;
};
function pasCheck(some,name){
	if(some=="vlaPic"){  //查看车位凭证
		$.ajax({
			type: "POST",  //数据提交方式（post/get）
			url: '../commu_admin.php?action=check',  //提交到的url
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
	else if(some=="vlaCek1"){ //审核通过
		console.log(name);
		$.ajax({
			type:"POST",
			url:'../commu_admin.php?action=change',
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
	else if(some=="vlaCek2"){ //审核失败
			console.log(name);
			
			$.ajax({
				type:"POST",
				url:'../commu_admin.php?action=change',
				data:name,
				dataType:"json",
				success:function(ret){
					console.log(ret);
					if(ret.result==1){
						alert("已上传审核结果！");
						finalPage=getData(1);
						curPage=1;
						$(".shade").hide();
						$(".vla-error").hide();
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
				url:'../commu_admin.php?action=delete',
				data:name,
				dataType:"json",
				success:function(ret){
					console.log(ret);
					// if(ret.result==1){
						alert("已删除！");
						$(".shade").hide();
						$(".vla-error").hide();
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
$(".vla-pag-div").children("input").css("cursor","pointer");
addInit();      //添加小区初始化

$(document).ready(function(){
	finalPage=getData(1);
	curPage=1;
	//选择页数
	$("#vla-first-page").click(function(){
		curPage=1;
		finalPage=getData(1);
	});
	$("#vla-final-page").click(function(){
		curPage=finalPage;
		finalPage=getData(finalPage);
	});
	$(".vla-pag-div .vla-pag").click(function(){
		curPage=$(this).val();
		finalPage=getData(curPage);
	})
	$("#vla-next-page").click(function(){
		curPage=parseInt(curPage)+1;
		finalPage=getData(curPage);
	})
	$("#vla-last-page").click(function(){
		curPage=parseInt(curPage)-1;
		finalPage=getData(curPage);
	})

	//添加小区
	$(".vla-add").click(function(){
		addInit();
		$("html,body").animate({scrollTop:"0"},1);
		$(".shade").show();
		$(".vla-addth").show();
		$("body").css("overflow","hidden");
	});
	var formNa="";
	$("#vla-upbtn button").click(function(){
		$("#vla-upfile").click();
		$("#vla-upfile").change(function(){
			formNa=$("#vla-upfile").val();
			$("#vla-upbtn span").html(formNa);
		})
	});
	$(".vla-btn1").click(function(){
		$(".shade").hide();
		$(".vla-addth").hide();
		$("body").css("overflow","scroll");
	});
	$(".vla-btn2").click(function(){
		var FileSuf=formNa.lastIndexOf(".");
		FileSuf=formNa.substring(FileSuf,formNa.length).toUpperCase();
		var SeIndex1=$("#province1").get(0).selectedIndex;
		var SeIndex2=$("#city1").get(0).selectedIndex;
		var SeIndex3=$("#district1").get(0).selectedIndex;
		var SeCec=0;
		if($('#district1').length==1 && SeIndex2 && SeIndex1)
		{
			SeCec=1;
		}
		else if(SeIndex3)
		{
			SeCec=1;
		}

		if($(".vla-name input").val()=="")
		{
			alert("请输入小区名称");
		}
		else if(!SeIndex1 || !SeIndex2 || !SeCec)
		{
			alert("请选择所在地区");
		}
		else if(FileSuf != ".PDF" && FileSuf != ".DOC" && FileSuf != ".GIF" && FileSuf != ".JPG" && FileSuf != ".JPEG" && FileSuf != ".PNG"){
			alert("文件格式错误！");
		}
		else{
			var vlaName;
			vlaName=$("#province1 option:selected").val()+$("#city1 option:selected").val()+$("#district1 option:selected").val()+$(".vla-name input").val();
			var data=new FormData();
			data.append("commu_name",vlaName);
			data.append("picture",$("#vla-upfile")[0].files[0]);
			$.ajax({
				type: "POST",  //数据提交方式（post/get）
				url: '../commu_join.php',  //提交到的url
				data: data,//提交的数据
				dataType: "json",//返回的数据类型格式
				cache: false,
				processData: false,
			    contentType: false,
				success: function(){
					alert("提交成功，请等待管理员审核！");
					curPage=1;
					finalPage=getData(1);
					$(".shade").hide();
					$(".vla-addth").hide();
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
	$("#vla").on("click","#span3",function(){//查看凭证照片
		// num=$(this).parent("td").siblings("#park_number").text();
		vlaName=$(this).parent("td").siblings(".commu_name").text();
		// call=$(this).parent("td").siblings("#call").text();
		name={
			"position":{
				"name":vlaName
			}
		}
		pasCheck("vlaPic",name);
	})
	$("#vla").on("click","#span1",function(){  //审核失败
		// num=$(this).parent("td").siblings("#park_number").text();
		vlaName=$(this).parent("td").siblings(".commu_name").text();
		// call=$(this).parent("td").siblings("#call").text();
		name={
			"position":{
				"park_name":vlaName,
				"flag":"0"
			}
		}
		pasCheck("vlaCek2",name);
	});
	$("#vla").on("click","#span2",function(){  //审核通过
		// num=$(this).parent("td").siblings("#park_number").text();
		vlaName=$(this).parent("td").siblings(".commu_name").text();
		// call=$(this).parent("td").siblings("#call").text();
		name={
			"position":{
				"park_name":vlaName,
				"flag":"1"
			}
		}
		pasCheck("vlaCek1",name);
	});
	$("#vla").on("click","#span4",function(){  //删除
		// num=$(this).parent("td").siblings("#park_number").text();
		vlaName=$(this).parent("td").siblings(".commu_name").text();
		// call=$(this).parent("td").siblings("#call").text();
		name={
			"position":{
				"name":vlaName
			}
		}
		pasCheck("delete",name);
	});
});
