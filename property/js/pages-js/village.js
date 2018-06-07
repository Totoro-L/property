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
		//alert("返回数据是："+ret);
		// alert("总数据数是："+ret.ProNum);
		// alert(ret.length);
		ret=JSON.stringify(ret);
		ret=JSON.parse(ret);
		var tab="<tr><th>序号</th><th>小区名称</th><th>归属物业</th><th>审核状态</th><th>操作</th></tr><tr><td class=\"space\"></td></tr>";
		var statusCec;
		for(var i=0;i<ret.count-1;i++)
        {
			var imgAdd="<td><span id=\"span3\"><img src=\"images/u30.png\" width=\"18px\" height=\"18px\"/>下载资质文件</span>"+
				 "<span id=\"span2\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>修改</span>"+
				 "<span id=\"span1\"><img src=\"images/error.png\" width=\"18px\" height=\"18px\"/>删除</span></td>";
			if(ret[i].status==0)
			{
				statusCec='审核中';
			}
			else if(ret[i].status==1)
			{
				statusCec='审核通过';
				imgAdd="<td><span id=\"span3\"><img src=\"images/u30.png\" width=\"18px\" height=\"18px\"/>下载资质文件</span></td>";
			}
			else
			{
				statusCec='审核失败';
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

		if(currentPage==1)
		{
			pageSum=ret.PageNum;
			var total="共"+ret.PageNum+"页,"+ret.ProNum+"条数据";
			$(".vla-bottom-del").html(total);

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
	$("#pasCh-pass").val("");
	$(".pasCh").show();
	$(".shade").show();
	$("html,body").animate({scrollTop:"0"},1);
	$("body").css("overflow","hidden");
	$(".pas-back").click(function(){
		$(".pasCh").hide();
		$(".shade").hide();
		$("body").css("overflow","scroll");
	});
	$(".pas-ok").click(function(){
		if($("#pasCh-pass").val()==""){
			alert("请输入密码！");
		}
		else{
			//alert(jsonpas);
			$.ajax({
				type: "POST",  //数据提交方式（post/get）
				url: '../commu_change.php?action=check',  //提交到的url
				data: {"password":$("#pasCh-pass").val()},//提交的数据
				dataType: "json",//返回的数据类型格式
				//cache: false,
				//processData: false,
				//contentType: false,
				success: function(ret){
					console.log('重输密码返回的数据是：'+ret);
					console.log('重输密码转为字符串后是：'+JSON.stringify(ret));
					console.log(ret.result);
					if(ret.result==1){
						var flag;
						if(some=="vlaFile"){
							flag=1;
						}
						else if(some=="vlaDel"){
							flag=2;
						}
						else if(some=="vlaRev"){
							flag=3;
						}
						var updata={
							"flag":flag,
							"commu_name":name
						}
						if(flag==1)//下载资质文件
						{
							$.ajax({
								type: "POST",  //数据提交方式（post/get）
								url: '../commu_change.php?action=change',  //提交到的url
								data: updata,//提交的数据
								dataType: "json",//返回的数据类型格式
								cache: false,
								processData: false,
								contentType: false,
								success: function(ret){
									console.log('下载文件返回的数据是：'+ret);
									console.log('下载文件转为字符串后是：'+JSON.stringify(ret));
									var $eleForm = $("<form method='get'></form>");
									$eleForm.attr("action",ret.proveSrc);
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
						else if(flag==2)//删除
						{
							$.ajax({
								type: "POST",  //数据提交方式（post/get）
								url: '../commu_change.php?action=change',  //提交到的url
								data: updata,//提交的数据
								dataType: "json",//返回的数据类型格式
								cache: false,
								processData: false,
								contentType: false,
								success: function(ret){
									console.log('删除返回的数据是：'+ret);
									console.log('删除转为字符串后是：'+JSON.stringify(ret));
									if(ret.status==1){
										curPage=1;
										finalPage=getData(1);
										$(".shade").hide();
										$(".pasCh").hide();
										$("body").css("overflow","scroll");
										alert("删除成功！");
									}
									else{
										alert("删除失败，请稍后重试！");
									}
								},
								error:function(XMLHttpRequest, textStatus, errorThrown){
									alert(XMLHttpRequest.status);
									alert(XMLHttpRequest.readyState);
									alert(textStatus);
								}
							});
						}
						else if(flag==3){//修改资质文件
							$(".vla-revise-name input").val(name);
							$(".vla-revise-file span").html("（*支持pdf、doc、jpg、jpeg、gif、png格式）");
							$(".vla-revise").show();
							$(".vla-revise .vla-revise-file button").click(function(){
								$("#vla-revise-upfile").click();
								$("#vla-revise-upfile").change(function(){
									$(".vla-revise-file span").html($("#vla-revise-upfile").val());
								});
							});
							$(".vla-revise-btn1").click(function(){
								$(".vla-revise").hide();
								$(".shade").hide();
							});
							$(".vla-revise-btn2").click(function(){
								var formNa=$("#vla-revise-upfile").val();
								var FileSuf=formNa.lastIndexOf(".");
								FileSuf=formNa.substring(FileSuf,formNa.length).toUpperCase();
								if(FileSuf != ".PDF" && FileSuf != ".DOC" && FileSuf != ".GIF" && FileSuf != ".JPG" && FileSuf != ".JPEG" && FileSuf != ".PNG"){
									alert("文件格式错误！");
								}
								else{
									var data=new FormData();
									data.append("picture",$("#vla-revise-upfile")[0].files[0]);

									data.append("flag",flag);
									data.append("commu_name",name);

									$.ajax({
										type: "POST",  //数据提交方式（post/get）
										url: '../commu_change.php?action=change',  //提交到的url
										data:data,//提交的数据
										dataType: "json",//返回的数据类型格式
										cache: false,
										processData: false,
										contentType: false,
										success: function(ret){
											console.log('修改文件返回的数据是：'+ret);
											console.log('修改文件转为字符串后是：'+JSON.stringify(ret));
											if(ret.status==1){
												alert("凭证文件修改成功！");
												curPage=1;
												finalPage=getData(1);
												$(".shade").hide();
												$(".vla-revise").hide();
												$("body").css("overflow","scroll");
											}
											else{
												alert("凭证文件修改失败，请稍后重试！");
											}
										},
										error:function(XMLHttpRequest, textStatus, errorThrown){
											alert(XMLHttpRequest.status);
											alert(XMLHttpRequest.readyState);
											alert(textStatus);
										}
									});
								}
							});
						}
					}
					else{
						alert("密码错误！");
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					alert(XMLHttpRequest.status);
					alert(XMLHttpRequest.readyState);
					alert(textStatus);
				}
			});
		}
	});
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
	$("#vla td #span3").click(function(){
		var name=$(this).parent("td").siblings(".commu_name").text();
		pasCheck("vlaFile",name);
	});
	$("#vla td #span1").click(function(){
		var name=$(this).parent("td").siblings(".commu_name").text();
		pasCheck("vlaDel",name);
	});
	$("#vla td #span2").click(function(){
		var name=$(this).parent("td").siblings(".commu_name").text();
		pasCheck("vlaRev",name);
	});
});
