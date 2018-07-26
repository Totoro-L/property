var pageSum;   //记录总页数
function addInit(){
	$("#province1").get(0).selectedIndex=0;
	$("#city1").get(0).selectedIndex=0;
	$("#district1").get(0).selectedIndex=0;
	$("#commu1").get(0).selectedIndex=0;
	$("#pk-add-file").val("");
	$("#pk-file span").html("请上传txt文件");
};
function pageNow(i,max){
	for(var j=0;j<5;j++)
	{
		$($(".pk-pag-div").children("input").get(j)).removeClass("pk-btn-active");
	}
	var x=i%5;
	if(x==0)
	{
		$($(".pk-pag-div").children("input").get(4)).addClass("pk-btn-active");
		x+=5;
	}
	else
	{
		$($(".pk-pag-div").children("input").get(x-1)).addClass("pk-btn-active");
	}
	var y=i-x;
	for(var j=0;j<5;j++)
	{
		y=y+1;
		$($(".pk-pag-div").children("input").get(j)).val(y);
		if(y>max)
		{
			$($(".pk-pag-div").children("input").get(j)).hide();
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
	console.log(getPush);
	
	$.ajax({
		 type: "POST",  //数据提交方式（post/get）
		 url: '../ownerpark.php?action=all',  //提交到的url
		 data: getPush,//提交的数据
		 dataType: "json",//返回的数据类型格式
		 success: function(ret){
			ret=JSON.stringify(ret);
			ret=JSON.parse(ret);
			var tab="<tr><th>序号</th><th>小区名称</th><th>车库名称</th><th>车位编号</th><th>业主电话</th><th>车位状态</th><th>操作</th></tr><tr><td class=\"space\"></td></tr>";
			var statusCec;
			for(var i=0;i<ret.count-1;i++)
			{
				var imgAdd="<td><span id=\"span3\"><img src=\"images/u30.png\" width=\"18px\" height=\"18px\"/>查看凭证图片</span>"+
					 "<span id=\"span2\"><img src=\"images/right.png\" width=\"18px\" height=\"18px\"/>审核通过</span>"+
					 "<span id=\"span1\"><img src=\"images/error.png\" width=\"18px\" height=\"18px\"/>审核失败</span></td>";
				if(ret[i].status==2)
				{
					statusCec='待审核';
				}
				else if(ret[i].status==1)
				{
					statusCec='占用';
					imgAdd="<td><span id=\"span3\"><img src=\"images/u30.png\" width=\"18px\" height=\"18px\"/>查看凭证图片</span></td>";
				}
				else if(ret[i].status==0)
				{
					statusCec='未占用';
					imgAdd="<td><span id=\"span3\"><img src=\"images/u30.png\" width=\"18px\" height=\"18px\"/>查看凭证图片</span></td>";
				}
				else
				{
					statusCec='审核失败';
					imgAdd="<td><span id=\"span3\"><img src=\"images/u30.png\" width=\"18px\" height=\"18px\"/>查看凭证图片</span>"+
					 "<span id=\"span4\"><img src=\"images/error.png\" width=\"18px\" height=\"18px\"/>删除</span></td>";
				}
				tab+="<tr>";
				tab+="<td>"+parseInt(i+1)+"</td>";
				tab+="<td class=\"pk-td-width\" id=\"comName\"><a href=\"#\">"+ret[i].commu_name+"</a></td>"+
					 "<td class=\"pk-td-width\" id=\"park_name\">"+ret[i].parkName+"</td>"+
					 "<td class=\"pk-td-width\" id=\"park_number\">"+ret[i].parkNum+"</td>"+
					 "<td id=\"call\">"+ret[i].call+"</td>"+
					 "<td>"+statusCec+"</td>"+
					 imgAdd;
				tab+="</tr>";
			}
			$("#pk").html(tab);
			$("tr:even").css("background-color","#ccc");
			
			pageSum=ret.PageNum;
			var total="共"+ret.PageNum+"页,"+ret.ProNum+"条数据";
			$(".pk-bottom-del").html(total);
			if(currentPage==1 && ret.PageNum==1){
				$("#pk-first-page").attr("class","pk-paging-down");
				$("#pk-last-page").attr("class","pk-paging-down");
				$("#pk-first-page").attr("disabled", true);
				$("#pk-last-page").attr("disabled", true);

				$("#pk-final-page").attr("class","pk-paging-down");
				$("#pk-next-page").attr("class","pk-paging-down");
				$("#pk-final-page").attr("disabled", true);
				$("#pk-next-page").attr("disabled", true);
			}
			else if(currentPage==1)
			{
				$("#pk-first-page").attr("class","pk-paging-down");
				$("#pk-last-page").attr("class","pk-paging-down");
				$("#pk-first-page").attr("disabled", true);
				$("#pk-last-page").attr("disabled", true);

				$("#pk-final-page").attr("class","pk-paging");
				$("#pk-next-page").attr("class","pk-paging");
				$("#pk-final-page").attr("disabled", false);
				$("#pk-next-page").attr("disabled", false);
			}
			else if(currentPage==ret.PageNum)
			{
				$("#pk-final-page").attr("class","pk-paging-down");
				$("#pk-next-page").attr("class","pk-paging-down");
				$("#pk-final-page").attr("disabled", true);
				$("#pk-next-page").attr("disabled", true);

				$("#pk-first-page").attr("class","pk-paging");
				$("#pk-last-page").attr("class","pk-paging");
				$("#pk-first-page").attr("disabled", false);
				$("#pk-last-page").attr("disabled", false);
			}
			else{
				$("#pk-first-page").attr("class","pk-paging");
				$("#pk-last-page").attr("class","pk-paging");
				$("#pk-first-page").attr("disabled", false);
				$("#pk-last-page").attr("disabled", false);

				$("#pk-final-page").attr("class","pk-paging");
				$("#pk-next-page").attr("class","pk-paging");
				$("#pk-final-page").attr("disabled", false);
				$("#pk-next-page").attr("disabled", false);
			}
			pageNow(currentPage,pageSum);
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
	if(some=="pkPic"){  //查看车位凭证
		$(".shade").show();
		$("html,body").animate({scrollTop:"0"},1);
		$("body").css("overflow","hidden");
		$(".pk-revise").show();
		console.log(name);
		$.ajax({
			type:"POST",
			url:'../ownerpark.php?action=pic',
			data:name,
			dataType:"json",
			success:function(ret){
				console.log(ret);
				var srcPic="../"+ret.pic;
				$("#park-check-img").attr("src",srcPic);
				$(".pk-revise-btn1").click(function(){ //退出
					$(".shade").hide();
					$(".pk-revise").hide();
					$("body").css("overflow","scroll");
				})
				// 下载
				$(".pk-revise-btn2").off("click").on("click",(function(){
					$("#park-img-down").attr("href",srcPic);
					$("#park-img-down").attr("download",srcPic);
					$("#park-img-down").click();
				}))
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
				alert(textStatus);
			}
		})
	}
	else if(some=="pkCek1"){ //审核通过
		console.log(name);
		$.ajax({
			type:"POST",
			url:'../ownerpark.php?action=check',
			data:name,
			dataType:"json",
			success:function(ret){
				console.log(ret);
				if(ret.result==1){
					alert("已上传审核结果！");
					// finalPage=getData(1);
					curPage=1;
					$(".nav li:nth-child(3)").click();
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
	else if(some=="pkCek2"){ //审核失败
		$(".pk-error").show();
		
		$(".pk-error-btn1").click(function(){ //退出
			$(".shade").hide();
			$(".pk-error").hide();
			$("body").css("overflow","scroll");
		})
		$(".pk-error-btn2").off("click").on("click",(function(){//确认
			name.position.reason=$(".pk-error-reason textarea").val();
			console.log(name);
			$.ajax({
				type:"POST",
				url:'../ownerpark.php?action=check',
				data:name,
				dataType:"json",
				success:function(ret){
					console.log(ret);
					if(ret.result==1){
						alert("已上传审核结果！");
						$(".nav li:nth-child(3)").click();
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
		}))
	}
}

var finalPage=1;
$(".pk-pag-div").children("input").css("cursor","pointer");
addInit();      //初始化

$(document).ready(function(){
	finalPage=getData(1);
	curPage=1;
	//选择页数
	$("#pk-first-page").click(function(){
		curPage=1;
		finalPage=getData(1);
	});
	$("#pk-final-page").click(function(){
		curPage=finalPage;
		finalPage=getData(finalPage);
	});
	$(".pk-pag-div .pk-pag").click(function(){
		curPage=$(this).val();
		finalPage=getData(curPage);
	})
	$("#pk-next-page").click(function(){
		curPage=parseInt(curPage)+1;
		finalPage=getData(curPage);
	})
	$("#pk-last-page").click(function(){
		curPage=parseInt(curPage)-1;
		finalPage=getData(curPage);
	})

	//批量添加车位
	$(".pk-add").click(function(){
		addInit();
		$("html,body").animate({scrollTop:"0"},1);
		$(".shade").show();
		$(".pk-addth").show();
		$("body").css("overflow","hidden");
	});
	var formNa="";
	$(".pk-file button").click(function(){   //选择文件
		$("#pk-add-file").click();
		$("#pk-add-file").change(function(){
			formNa=$("#pk-add-file").val();
			$(".pk-file span").html(formNa);
		})
	});
	$(".pk-btn1").click(function(){      //退出
		$(".shade").hide();
		$(".pk-addth").hide();
		$("body").css("overflow","scroll");
	});
	$(".pk-btn2").click(function(){     //提交
		var FileSuf=formNa.lastIndexOf(".");
		FileSuf=formNa.substring(FileSuf,formNa.length).toUpperCase();
		
		if(FileSuf != ".TXT"){
			alert("文件格式错误！");
		}
		else{
			var datax=new FormData();
			datax.append("picture",$("#pk-add-file")[0].files[0]);
			
			var comName=$("#pk-add-com select").val();
			datax.append("commu_name",comName);
			
			var pkName=$("#pk-add-pk select").val();
			datax.append("park_name",pkName);
			
			var sharetime=$(".pk-add-time select").val();
			datax.append("sharetime",sharetime);
			
			var starttime=$("#calend").html();
			datax.append("starttime",starttime);
			
			var endtime=$("#calend1").html();
			datax.append("endtime",endtime);
			
			console.log(comName);
			console.log(pkName);
			console.log(sharetime);
			console.log(starttime);
			console.log(endtime);
			
			$.ajax({
				type: "POST",  //数据提交方式（post/get）
				url: '../ownerpark.php?action=join',  //提交到的url
				data: datax,//提交的数据
				dataType: "json",//返回的数据类型格式
				success: function(ret){
					console.log(ret);
					if(ret.result==1){
						alert("提交成功，请等待管理员审核！");
						$(".nav li:nth-child(3)").click();
					}
					else{
						alert("提交失败，请稍后重试！");
					}
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
	
	
	var num;
	var pkName;
	var call;
	var name;
	$("#pk").on("click","#span3",function(){//查看凭证照片
		num=$(this).parent("td").siblings("#park_number").text();
		pkName=$(this).parent("td").siblings("#park_name").text();
		call=$(this).parent("td").siblings("#call").text();
		name={
			"position":{
				"cell":call,
				"park_name":pkName,
				"park_number":num
			}
		}
		pasCheck("pkPic",name);
	})
	$("#pk").on("click","#span1",function(){  //审核失败
		num=$(this).parent("td").siblings("#park_number").text();
		pkName=$(this).parent("td").siblings("#park_name").text();
		call=$(this).parent("td").siblings("#call").text();
		name={
			"position":{
				"cell":call,
				"park_name":pkName,
				"park_number":num,
				"result":"0"
			}
		}
		pasCheck("pkCek2",name);
	});
	$("#pk").on("click","#span2",function(){  //审核通过
		num=$(this).parent("td").siblings("#park_number").text();
		pkName=$(this).parent("td").siblings("#park_name").text();
		call=$(this).parent("td").siblings("#call").text();
		name={
			"position":{
				"cell":call,
				"park_name":pkName,
				"parkNum":num,
				"result":"1"
			}
		}
		pasCheck("pkCek1",name);
	});
});
