function addInit(){
	$(".gar-name input").val("");
	$("#province1").get(0).selectedIndex=0;
	$("#city1").get(0).selectedIndex=0;
	$("#district1").get(0).selectedIndex=0;
	$("#gar-upfile").val("");
	$("#gar-upbtn span").html("");
};
function pageNow(i,max){
	for(var j=0;j<5;j++)
	{
		$($(".gar-pag-div").children("input").get(j)).removeClass("gar-btn-active");
	}
	var x=i%5;
	if(x==0)
	{
		$($(".gar-pag-div").children("input").get(4)).addClass("gar-btn-active");
		x+=5;
	}
	else
	{
		$($(".gar-pag-div").children("input").get(x-1)).addClass("gar-btn-active");
	}
	var y=i-x;
	for(var j=0;j<5;j++)
	{
		y=y+1;
		$($(".gar-pag-div").children("input").get(j)).val(y);
		if(y>max)
		{
			$($(".gar-pag-div").children("input").get(j)).hide();
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
	$.get("../commu-2.php",getPush,function(ret){
		//alert("返回数据是："+ret);
		// alert("总数据数是："+ret.ProNum);
		// alert(ret.length);
		//ret=JSON.stringify(ret);
		ret=JSON.parse(ret);	
		var tab="<tr><th>序号</th><th>车库名称</th><th>归属小区</th><th>详细地址</th><th>价格</th><th>空闲车位数</th><th>操作</th></tr><tr><td class=\"space\"></td></tr>";
		var statusCec;
		for(var i=0;i<ret.count-1;i++)
        {
			var imgAdd="<td><span id=\"span3\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>查看平面图</span>"+
				 "<span id=\"span2\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>修改</span>"+
				 "<span id=\"span1\"><img src=\"images/error.png\" width=\"18px\" height=\"18px\"/>暂停使用</span></td>";
            tab+="<tr>";
			tab+="<td>"+parseInt(i+1)+"</td>";
            tab+="<td class=\"gar-td-width\"><a href=\"#\">"+ret[i].commu_name+"</a></td>"+
			     "<td class=\"gar-td-width\">"+ret[i].commu_name+"</td>"+
				 "<td class=\"gar-td-width\">"+ret[i].commu_name+"</td>"+
				 "<td>"+"3元/小时"+"</td>"+
				 "<td>"+"12222"+"</td>"+
				 imgAdd;
            tab+="</tr>";
        }
		$("#gar").html(tab);
		$("tr:even").css("background-color","#ccc");
		var total="共"+ret.PageNum+"页,"+ret.ProNum+"条数据";
		$(".gar-bottom-del").html(total);
		pageNow(currentPage,ret.PageNum);
		
		if(currentPage==1)
		{
			$("#gar-first-page").attr("class","gar-paging-down");
			$("#gar-last-page").attr("class","gar-paging-down");
			$("#gar-first-page").attr("disabled", true);
			$("#gar-last-page").attr("disabled", true);
			
			$("#gar-final-page").attr("class","gar-paging");
			$("#gar-next-page").attr("class","gar-paging");
			$("#gar-final-page").attr("disabled", false);
			$("#gar-next-page").attr("disabled", false);
		}
		else if(currentPage==ret.PageNum)
		{
			$("#gar-final-page").attr("class","gar-paging-down");
			$("#gar-next-page").attr("class","gar-paging-down");
			$("#gar-final-page").attr("disabled", true);
			$("#gar-next-page").attr("disabled", true);
			
			$("#gar-first-page").attr("class","gar-paging");
			$("#gar-last-page").attr("class","gar-paging");
			$("#gar-first-page").attr("disabled", false);
			$("#gar-last-page").attr("disabled", false);
		}
		else{
			$("#gar-first-page").attr("class","gar-paging");
			$("#gar-last-page").attr("class","gar-paging");
			$("#gar-first-page").attr("disabled", false);
			$("#gar-last-page").attr("disabled", false);
			
			$("#gar-final-page").attr("class","gar-paging");
			$("#gar-next-page").attr("class","gar-paging");
			$("#gar-final-page").attr("disabled", false);
			$("#gar-next-page").attr("disabled", false);
		}
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
			var flag;
			if(some=="garFile"){
				flag=1;
			}
			else if(some=="garDel"){
				flag=2;
			}
			else if(some=="garRev"){
				flag=3;
			}
			var pass={
				"password":$("#pasCh-pass").val(),
				"flag":flag,
				"commu_name":name
			};
			//alert(pass.commu_name);
			$.ajax({
				type: "POST",
				url: '../yyy.php',
				data: pass,
				dataType: "json",
				cache: false,
				processData: false,
				contentType: false,
				success: function(ret){
					alert("返回数据是："+ret);
					//ret=JSON.parse(ret);
					alert("返回的地址是："+ret.proveSrc);
					if(ret.result==1)
					{
						$(".pasCh").hide();
						if(flag==1)
						{
							var $eleForm = $("<form method='get'></form>");  
							$eleForm.attr("action",ret.proveSrc);  
							$(document.body).append($eleForm);  
							$eleForm.submit(); 
							$(".shade").hide();
							$(".pasCh").hide();
							$("body").css("overflow","scroll");
						}
						else if(flag==2)
						{
							curPage=1;
							finalPage=getData(1);
							$(".shade").hide();
							$(".pasCh").hide();
							$("body").css("overflow","scroll");
							alert("删除成功！");
						}
						else if(flag==3)
						{
							$(".gar-revise-name input").val(name);
							$(".gar-revise-file span").html("（*支持pdf、doc、jpg、jpeg、gif、png格式）");
							$(".gar-revise").show();
							$(".gar-revise .gar-revise-file button").click(function(){
								$("#gar-revise-upfile").click();
								$("#gar-revise-upfile").change(function(){
									$(".gar-revise-file span").html($("#gar-revise-upfile").val());
								});
							});
							$(".gar-revise-btn1").click(function(){
								$(".gar-revise").hide();
								$(".shade").hide();
							});
							$(".gar-revise-btn2").click(function(){
								var formNa=$("#gar-revise-upfile").val();
								var FileSuf=formNa.lastIndexOf(".");
								FileSuf=formNa.substring(FileSuf,formNa.length).toUpperCase();
								if(FileSuf != ".PDF" && FileSuf != ".DOC" && FileSuf != ".GIF" && FileSuf != ".JPG" && FileSuf != ".JPEG" && FileSuf != ".PNG"){
									alert("文件格式错误！");
								}
								else{
									var data=new FormData();
									data.append("newPicture",$("#gar-revise-upfile")[0].files[0]);
									$.ajax({
										type: "POST",  //数据提交方式（post/get）
										url: '../commu.php',  //提交到的url
										data: data,//提交的数据
										dataType: "json",//返回的数据类型格式
										cache: false,
										processData: false,
										contentType: false,
										success: function(){
											alert("凭证文件修改成功！");
											curPage=1;
											finalPage=getData(1);
											$(".shade").hide();
											$(".gar-revise").hide();
											$("body").css("overflow","scroll");
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
						alert("密码输入错误！");
						$("#pasCh-pass").val("");
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
$(".gar-pag-div").children("input").css("cursor","pointer");
addInit();      //添加小区初始化

$(document).ready(function(){
	finalPage=getData(1);
	curPage=1;
	//选择页数
	$("#gar-first-page").click(function(){
		curPage=1;
		finalPage=getData(1); 
	});
	$("#gar-final-page").click(function(){
		curPage=finalPage;
		finalPage=getData(finalPage);
	});
	$(".gar-pag-div .gar-pag").click(function(){
		curPage=$(this).val();
		finalPage=getData(curPage);
	})
	$("#gar-next-page").click(function(){
		curPage=parseInt(curPage)+1;
		finalPage=getData(curPage);
	})
	$("#gar-last-page").click(function(){
		curPage=parseInt(curPage)-1;
		finalPage=getData(curPage);
	})
	
	//添加小区
	$(".gar-add").click(function(){
		addInit();
		$("html,body").animate({scrollTop:"0"},1);
		$(".shade").show();
		$(".gar-addth").show();
		$("body").css("overflow","hidden");
	});
	var formNa="";
	$("#gar-upbtn button").click(function(){
		$("#gar-upfile").click();
		$("#gar-upfile").change(function(){
			formNa=$("#gar-upfile").val();
			$("#gar-upbtn span").html(formNa);
		})
	});
	$(".gar-btn1").click(function(){
		$(".shade").hide();
		$(".gar-addth").hide();
		$("body").css("overflow","scroll");
	});
	$(".gar-btn2").click(function(){
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
		
		if($(".gar-name input").val()=="")
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
			var garName;
			garName=$("#province1 option:selected").val()+$("#city1 option:selected").val()+$("#district1 option:selected").val()+$(".gar-name input").val();
			var data=new FormData();
			data.append("commu_name",garName);
			data.append("pic",$("#gar-upfile")[0].files[0]);
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
					$(".gar-addth").hide();
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
	$("#gar td #span3").click(function(){
		var name=$(this).parent("td").siblings(".commu_name").text();
		pasCheck("garFile",name);
	});
	$("#gar td #span1").click(function(){
		var name=$(this).parent("td").siblings(".commu_name").text();
		pasCheck("garDel",name);
	});
	$("#gar td #span2").click(function(){
		var name=$(this).parent("td").siblings(".commu_name").text();
		pasCheck("garRev",name);
	});
});