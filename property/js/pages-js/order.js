function addInit(){
	$(".ord-name input").val("");
	$("#province1").get(0).selectedIndex=0;
	$("#city1").get(0).selectedIndex=0;
	$("#district1").get(0).selectedIndex=0;
	$("#ord-upfile").val("");
	$("#ord-upbtn span").html("");
};
function pageNow(i,max){
	for(var j=0;j<5;j++)
	{
		$($(".ord-pag-div").children("input").get(j)).removeClass("ord-btn-active");
	}
	var x=i%5;
	if(x==0)
	{
		$($(".ord-pag-div").children("input").get(4)).addClass("ord-btn-active");
		x+=5;
	}
	else
	{
		$($(".ord-pag-div").children("input").get(x-1)).addClass("ord-btn-active");
	}
	var y=i-x;
	for(var j=0;j<5;j++)
	{
		y=y+1;
		$($(".ord-pag-div").children("input").get(j)).val(y);
		if(y>max)
		{
			$($(".ord-pag-div").children("input").get(j)).hide();
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
		var tab="<tr><th>序号</th><th>车位信息</th><th>业主电话</th><th>车牌号</th><th>下单时间</th><th>预约时间</th><th>入场时间</th><th>出场时间</th><th>取消时间</th><th>订单状态</th></tr><tr><td class=\"space\"></td></tr>";
		var statusCec;
		for(var i=0;i<ret.count-1;i++)
        {
			var imgAdd="<td><span id=\"span3\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>查看平面图</span>"+
				 "<span id=\"span2\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>修改</span>"+
				 "<span id=\"span1\"><img src=\"images/error.png\" width=\"18px\" height=\"18px\"/>暂停使用</span></td>";
            tab+="<tr>";
			tab+="<td>"+parseInt(i+1)+"</td>";
            tab+="<td class=\"ord-td-width1\"><a href=\"#\">"+ret[i].commu_name+"</a></td>"+
			     "<td class=\"ord-td-width\">"+ret[i].commu_name+"</td>"+
				 "<td class=\"ord-td-width\">"+ret[i].commu_name+"</td>"+
				 "<td>"+"3元/小时"+"</td>"+
				 "<td>"+"12222"+"</td>";
            tab+="</tr>";
        }
		$("#ord").html(tab);
		$("tr:even").css("background-color","#ccc");
		var total="共"+ret.PageNum+"页,"+ret.ProNum+"条数据";
		$(".ord-bottom-del").html(total);
		pageNow(currentPage,ret.PageNum);
		
		if(currentPage==1)
		{
			$("#ord-first-page").attr("class","ord-paging-down");
			$("#ord-last-page").attr("class","ord-paging-down");
			$("#ord-first-page").attr("disabled", true);
			$("#ord-last-page").attr("disabled", true);
			
			$("#ord-final-page").attr("class","ord-paging");
			$("#ord-next-page").attr("class","ord-paging");
			$("#ord-final-page").attr("disabled", false);
			$("#ord-next-page").attr("disabled", false);
		}
		else if(currentPage==ret.PageNum)
		{
			$("#ord-final-page").attr("class","ord-paging-down");
			$("#ord-next-page").attr("class","ord-paging-down");
			$("#ord-final-page").attr("disabled", true);
			$("#ord-next-page").attr("disabled", true);
			
			$("#ord-first-page").attr("class","ord-paging");
			$("#ord-last-page").attr("class","ord-paging");
			$("#ord-first-page").attr("disabled", false);
			$("#ord-last-page").attr("disabled", false);
		}
		else{
			$("#ord-first-page").attr("class","ord-paging");
			$("#ord-last-page").attr("class","ord-paging");
			$("#ord-first-page").attr("disabled", false);
			$("#ord-last-page").attr("disabled", false);
			
			$("#ord-final-page").attr("class","ord-paging");
			$("#ord-next-page").attr("class","ord-paging");
			$("#ord-final-page").attr("disabled", false);
			$("#ord-next-page").attr("disabled", false);
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
			if(some=="ordFile"){
				flag=1;
			}
			else if(some=="ordDel"){
				flag=2;
			}
			else if(some=="ordRev"){
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
							$(".ord-revise-name input").val(name);
							$(".ord-revise-file span").html("（*支持pdf、doc、jpg、jpeg、gif、png格式）");
							$(".ord-revise").show();
							$(".ord-revise .ord-revise-file button").click(function(){
								$("#ord-revise-upfile").click();
								$("#ord-revise-upfile").change(function(){
									$(".ord-revise-file span").html($("#ord-revise-upfile").val());
								});
							});
							$(".ord-revise-btn1").click(function(){
								$(".ord-revise").hide();
								$(".shade").hide();
							});
							$(".ord-revise-btn2").click(function(){
								var formNa=$("#ord-revise-upfile").val();
								var FileSuf=formNa.lastIndexOf(".");
								FileSuf=formNa.substring(FileSuf,formNa.length).toUpperCase();
								if(FileSuf != ".PDF" && FileSuf != ".DOC" && FileSuf != ".GIF" && FileSuf != ".JPG" && FileSuf != ".JPEG" && FileSuf != ".PNG"){
									alert("文件格式错误！");
								}
								else{
									var data=new FormData();
									data.append("newPicture",$("#ord-revise-upfile")[0].files[0]);
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
											$(".ord-revise").hide();
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
$(".ord-pag-div").children("input").css("cursor","pointer");
addInit();      //添加小区初始化

$(document).ready(function(){
	finalPage=getData(1);
	curPage=1;
	//选择页数
	$("#ord-first-page").click(function(){
		curPage=1;
		finalPage=getData(1); 
	});
	$("#ord-final-page").click(function(){
		curPage=finalPage;
		finalPage=getData(finalPage);
	});
	$(".ord-pag-div .ord-pag").click(function(){
		curPage=$(this).val();
		finalPage=getData(curPage);
	})
	$("#ord-next-page").click(function(){
		curPage=parseInt(curPage)+1;
		finalPage=getData(curPage);
	})
	$("#ord-last-page").click(function(){
		curPage=parseInt(curPage)-1;
		finalPage=getData(curPage);
	})
	
	//添加小区
	$(".ord-add").click(function(){
		addInit();
		$("html,body").animate({scrollTop:"0"},1);
		$(".shade").show();
		$(".ord-addth").show();
		$("body").css("overflow","hidden");
	});
	var formNa="";
	$("#ord-upbtn button").click(function(){
		$("#ord-upfile").click();
		$("#ord-upfile").change(function(){
			formNa=$("#ord-upfile").val();
			$("#ord-upbtn span").html(formNa);
		})
	});
	$(".ord-btn1").click(function(){
		$(".shade").hide();
		$(".ord-addth").hide();
		$("body").css("overflow","scroll");
	});
	$(".ord-btn2").click(function(){
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
		
		if($(".ord-name input").val()=="")
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
			var ordName;
			ordName=$("#province1 option:selected").val()+$("#city1 option:selected").val()+$("#district1 option:selected").val()+$(".ord-name input").val();
			var data=new FormData();
			data.append("commu_name",ordName);
			data.append("pic",$("#ord-upfile")[0].files[0]);
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
					$(".ord-addth").hide();
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
	$("#ord td #span3").click(function(){
		var name=$(this).parent("td").siblings(".commu_name").text();
		pasCheck("ordFile",name);
	});
	$("#ord td #span1").click(function(){
		var name=$(this).parent("td").siblings(".commu_name").text();
		pasCheck("ordDel",name);
	});
	$("#ord td #span2").click(function(){
		var name=$(this).parent("td").siblings(".commu_name").text();
		pasCheck("ordRev",name);
	});
});