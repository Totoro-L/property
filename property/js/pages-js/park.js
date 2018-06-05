function addInit(){
	$(".pk-name input").val("");
	$("#province1").get(0).selectedIndex=0;
	$("#city1").get(0).selectedIndex=0;
	$("#district1").get(0).selectedIndex=0;
	$("#pk-upfile").val("");
	$("#pk-upbtn span").html("");
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
	$.ajaxSetup({  
		async : false  
	});
	$.get("../commu-2.php",getPush,function(ret){
		//alert("返回数据是："+ret);
		// alert("总数据数是："+ret.ProNum);
		// alert(ret.length);
		//ret=JSON.stringify(ret);
		ret=JSON.parse(ret);	
		var tab="<tr><th>序号</th><th>小区名称</th><th>车库名称</th><th>车位编号</th><th>业主电话</th><th>车位状态</th><th>操作</th></tr><tr><td class=\"space\"></td></tr>";
		var statusCec;
		for(var i=0;i<ret.count-1;i++)
        {
			var imgAdd="<td><span id=\"span3\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>查看平面图</span>"+
				 "<span id=\"span2\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>修改</span>"+
				 "<span id=\"span1\"><img src=\"images/error.png\" width=\"18px\" height=\"18px\"/>暂停使用</span></td>";
            tab+="<tr>";
			tab+="<td>"+parseInt(i+1)+"</td>";
            tab+="<td class=\"pk-td-width\"><a href=\"#\">"+ret[i].commu_name+"</a></td>"+
			     "<td class=\"pk-td-width\">"+ret[i].commu_name+"</td>"+
				 "<td class=\"pk-td-width\">"+ret[i].commu_name+"</td>"+
				 "<td>"+"3元/小时"+"</td>"+
				 "<td>"+"12222"+"</td>"+
				 imgAdd;
            tab+="</tr>";
        }
		$("#pk").html(tab);
		$("tr:even").css("background-color","#ccc");
		var total="共"+ret.PageNum+"页,"+ret.ProNum+"条数据";
		$(".pk-bottom-del").html(total);
		pageNow(currentPage,ret.PageNum);
		
		if(currentPage==1)
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
			if(some=="pkFile"){
				flag=1;
			}
			else if(some=="pkDel"){
				flag=2;
			}
			else if(some=="pkRev"){
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
							$(".pk-revise-name input").val(name);
							$(".pk-revise-file span").html("（*支持pdf、doc、jpg、jpeg、gif、png格式）");
							$(".pk-revise").show();
							$(".pk-revise .pk-revise-file button").click(function(){
								$("#pk-revise-upfile").click();
								$("#pk-revise-upfile").change(function(){
									$(".pk-revise-file span").html($("#pk-revise-upfile").val());
								});
							});
							$(".pk-revise-btn1").click(function(){
								$(".pk-revise").hide();
								$(".shade").hide();
							});
							$(".pk-revise-btn2").click(function(){
								var formNa=$("#pk-revise-upfile").val();
								var FileSuf=formNa.lastIndexOf(".");
								FileSuf=formNa.substring(FileSuf,formNa.length).toUpperCase();
								if(FileSuf != ".PDF" && FileSuf != ".DOC" && FileSuf != ".GIF" && FileSuf != ".JPG" && FileSuf != ".JPEG" && FileSuf != ".PNG"){
									alert("文件格式错误！");
								}
								else{
									var data=new FormData();
									data.append("newPicture",$("#pk-revise-upfile")[0].files[0]);
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
											$(".pk-revise").hide();
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
$(".pk-pag-div").children("input").css("cursor","pointer");
addInit();      //添加小区初始化

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
	
	//添加小区
	$(".pk-add").click(function(){
		addInit();
		$("html,body").animate({scrollTop:"0"},1);
		$(".shade").show();
		$(".pk-addth").show();
		$("body").css("overflow","hidden");
	});
	var formNa="";
	$("#pk-upbtn button").click(function(){
		$("#pk-upfile").click();
		$("#pk-upfile").change(function(){
			formNa=$("#pk-upfile").val();
			$("#pk-upbtn span").html(formNa);
		})
	});
	$(".pk-btn1").click(function(){
		$(".shade").hide();
		$(".pk-addth").hide();
		$("body").css("overflow","scroll");
	});
	$(".pk-btn2").click(function(){
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
		
		if($(".pk-name input").val()=="")
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
			var pkName;
			pkName=$("#province1 option:selected").val()+$("#city1 option:selected").val()+$("#district1 option:selected").val()+$(".pk-name input").val();
			var data=new FormData();
			data.append("commu_name",pkName);
			data.append("pic",$("#pk-upfile")[0].files[0]);
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
					$(".pk-addth").hide();
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
	$("#pk td #span3").click(function(){
		var name=$(this).parent("td").siblings(".commu_name").text();
		pasCheck("pkFile",name);
	});
	$("#pk td #span1").click(function(){
		var name=$(this).parent("td").siblings(".commu_name").text();
		pasCheck("pkDel",name);
	});
	$("#pk td #span2").click(function(){
		var name=$(this).parent("td").siblings(".commu_name").text();
		pasCheck("pkRev",name);
	});
});