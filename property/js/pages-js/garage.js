var pageSum;   //记录总页数
function addInit(){
	$(".gar-addth input").val("");
	$("#province1").get(0).selectedIndex=0;
	$("#city1").get(0).selectedIndex=0;
	$("#district1").get(0).selectedIndex=0;
	$("#commu1").get(0).selectedIndex=0;
	$(".gar-addth .gar-money select").get(0).selectedIndex=0;
	$(".gar-upfile").val("");
	$(".gar-upbtn").remove();
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
	var retPage;
	var getPush={
		"currentPage":currentPage
	};
	$.ajax({
		type: "POST",  //数据提交方式（post/get）
		url: '../parklots.php?action=check',  //提交到的url
		data: getPush,//提交的数据
		dataType: "json",//返回的数据类型格式
		//cache: false,
		processData: false,
		contentType: "application/json",
		success: function(ret){
			console.log("返回数据是："+ret);
			// alert("总数据数是："+ret.ProNum);
			// alert(ret.length);
			ret=JSON.stringify(ret);
			ret=JSON.parse(ret);	
			var tab="<tr><th>序号</th><th>车库名称</th><th>归属小区</th><th>详细地址</th><th>价格</th><th>空闲车位数</th><th>车位状态</th><th>操作</th></tr><tr><td class=\"space\"></td></tr>";
			var statusCec;
			for(var i=0;i<ret.count-1;i++)
			{
				var imgAdd="<td><span id=\"span3\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>查看平面图</span>"+
					 "<span id=\"span2\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>修改</span>"+
					 "<span id=\"span1\"><img src=\"images/error.png\" width=\"18px\" height=\"18px\"/>暂停使用</span></td>";
				var position="东经："+ret[i].lng+"北纬："+ret[i].lat;
				if(ret[i].status==0)
				{
					statusCec='暂停使用';
					var imgAdd="<td><span id=\"span3\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>查看平面图</span>"+
					 "<span id=\"span2\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>修改</span>"+
					 "<span id=\"span1\"><img src=\"images/right.png\" width=\"18px\" height=\"18px\"/>暂停使用</span></td>";
				}
				else if(ret[i].status==1)
				{
					statusCec='使用中';
				}
				tab+="<tr>";
				tab+="<td>"+parseInt(i+1)+"</td>";
				tab+="<td class=\"gar-td-width\" id=\"parkName\"><a href=\"#\">"+ret[i].park_name+"</a></td>"+
					 "<td class=\"gar-td-width\">"+ret[i].commu_name+"</td>"+
					 "<td class=\"gar-td-width\">"+position+"</td>"+
					 "<td>"+ret[i].price+"元/小时</td>"+
					 "<td>"+ret[i].ParkNum+"</td>"+
					 "<td>"+statusCec+"</td>"+
					 imgAdd;
				tab+="</tr>";
			}
			$("#gar").html(tab);
			$("tr:even").css("background-color","#ccc");
			
			if(currentPage==1)
			{
				pageSum=ret.PageNum;
				var total="共"+ret.PageNum+"页,"+ret.ProNum+"条数据";
				$(".gar-bottom-del").html(total);
				
				$("#gar-first-page").attr("class","gar-paging-down");
				$("#gar-last-page").attr("class","gar-paging-down");
				$("#gar-first-page").attr("disabled", true);
				$("#gar-last-page").attr("disabled", true);
				
				$("#gar-final-page").attr("class","gar-paging");
				$("#gar-next-page").attr("class","gar-paging");
				$("#gar-final-page").attr("disabled", false);
				$("#gar-next-page").attr("disabled", false);
			}
			else if(currentPage==pageSum)
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
			pageNow(currentPage,pageSum);
			retPage=pageSum;
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
			var pas={
				"password":$("#pasCh-pass").val()
			}
			pas=JSON.stringify(pas);
			$.ajax({
				type: "POST",  //数据提交方式（post/get）
				url: '../parklots.php?action=check',  //提交到的url
				data:pas,//提交的数据
				dataType: "json",//返回的数据类型格式
				//cache: false,
				processData: false,
				contentType: "application/json",
				success: function(ret){
					console.log("返回的数据是："+ret);
					//ret=JSON.stringify(ret);
					//ret=JSON.parse(ret);
					if(ret.result==1){     //密码正确
						var flag;
						if(some=="garPic"){
							flag=1;
						}
						else if(some=="garPau"){
							flag=2;
						}
						else if(some=="garRev"){
							flag=3;
						}
						var updata={
							"flag":flag,
							"park_name":name
						}
						updata=JSON.stringify(updata);
						if(flag==1)//查看平面图
						{
							$.ajax({
								type: "POST",  //数据提交方式（post/get）
								url: '../parklots.php?action=change',  //提交到的url
								data:updata,//提交的数据
								dataType: "json",//返回的数据类型格式
								cache: false,
								processData: false,
								contentType: "application/json",
								success: function(ret){
									console.log("返回的数据是："+ret);
									ret=JSON.stringify(ret);
									console.log("转为字符串后："+ret);
									ret=JSON.parse(ret);
									var html='<div class="gar-pic-floor">层数：'+
											'<span></span>'+
											'<img class="gar-pic-floor" width="300px" height="200px"/>'+
											'<button type="button">下载</button>'+
											'</div>';
									$(".gar-pic-floor").remove();
									$(".pasCh").hide();
									$(".gar-pic").show();
									
									for(var i=0;i<ret.count-1;i++)
									{
										$(".gar-pic").append(html);
										$(".gar-pic-floor span").html(ret[i].floor);
										$(".gar-pic-floor img").attr("src",ret[i].picture);
									}
									$(".gar-pic-btn1").click(function(){
										$(".shade").hide();
										$(".gar-pic").hide();
										$("body").css("overflow","scroll");
									})
									$(".gar-pic-floor button").off("click").on("click",(function(){
										var $eleForm = $("<form method='get'></form>");
										var download=$(this).siblings("img").attr("src");							
										$eleForm.attr("action",download);  
										$(document.body).append($eleForm);  
										$eleForm.submit();
									}))
								},
								error:function(XMLHttpRequest, textStatus, errorThrown){
									alert(XMLHttpRequest.status);
									alert(XMLHttpRequest.readyState);
									alert(textStatus);
								}
							});
						}
						else if(flag==2)//暂停使用
						{
							$.ajax({
								type: "POST",  //数据提交方式（post/get）
								url: '../parklots.php?action=change',  //提交到的url
								data:updata,//提交的数据
								dataType: "json",//返回的数据类型格式
								//cache: false,
								processData: false,
								contentType: "application/json",
								success: function(ret){
									console.log("返回的数据是："+ret);
									ret=JSON.stringify(ret);
									console.log("转为字符串后："+ret);
									ret=JSON.parse(ret);
									if(ret.status==1){
										curPage=1;
										finalPage=getData(1);
										$(".shade").hide();
										$(".pasCh").hide();
										$("body").css("overflow","scroll");
										alert("已暂停使用！");
									}
									else{
										alert("暂停使用操作失败！");
									}
								},
								error:function(XMLHttpRequest, textStatus, errorThrown){
									alert(XMLHttpRequest.status);
									alert(XMLHttpRequest.readyState);
									alert(textStatus);
								}
							});
							
						}
						else if(flag==3){//修改
							$(".pasCh").hide();
							$('.gar-rev-name input').val(name);
							$(".gar-rev-div").remove();
							var htmlRev;
							htmlRev='<div class="gar-rev-div">层数：'+
								'<input type="text" class="gar-rev-floor"/>F'+
								'<input class="gar-rev-up" type="file"/>'+
								'<div class="button">上传该层车库平面图</div>'+
								'<input type="button" value="删除"/>'+
							'</div>';
							for(var i=0;i<ret.count-1;i++)
							{
								var imgRev='<img width="200px" height="100px" src="'+ret[i].picture+'"/>';
								$(".gar-rev-pic").append(htmlRev);
								$(".gar-rev-floor").val(ret[i].floor);
								$(".gar-rev-div .button").html(imgRev);
							}
							$('.gar-revise').show();
							
							$(".gar-rev-pic .rev-pic").off("click").on("click",(function(){
								$(".gar-rev-pic").append(htmlRev);
								$('.gar-rev-pic .gar-rev-div input[type="button"]').click(function(){
									$(this).parent().remove();
								});
								var formNa="";
								$(".gar-rev-pic .gar-rev-div .button").off("click").on("click",(function(){
									var now=$(this).parent();
									now.find('.gar-rev-up').click();
									now.find('.gar-rev-up').change(function(){
										formNa=$(this).val();
										var FileSuf=formNa.lastIndexOf(".");
										FileSuf=formNa.substring(FileSuf,formNa.length).toUpperCase();
										if(FileSuf != ".JPG" && FileSuf != ".JPEG" && FileSuf != ".PNG"){
											alert("文件格式错误！");
											$(this).val("");
										}
										else{
											var file = this.files[0];    
											var reader = new FileReader();    
											reader.readAsDataURL(file);
											reader.onload = function(e){
												formNa='<img width="200px" height="100px" src="'+this.result+'"/>';
												now.find('.button').html(formNa);
												//alert('base64编码是：'+this.result);
											}
										}
									})
								}));
							}));
							var relength=$(".gar-rev-pic").children(".gar-rev-div").relength;
							var repicFlag=1;
							var rearr=[];
							for(var i=0;i<relength;i++)
							{
								var rethat=$(".gar-rev-pic").find(".gar-rev-div").eq(i);
								var rebase=rethat.find("img").attr("src");
								var refloor=rethat.find(".gar-rev-floor").val();
								//alert(base);
								rearr[rearr.relength]={
									"floor":refloor,
									"picture":rebase
								};// 数组追加一个元素
								
								if(!rebase){
									repicFlag=0;
								}
							}
							if(relength==0){
								alert("请添加车库平面图");
							}
							else if(refloor==""){
								alert("请输入层数");
							}
							else if(!repicFlag){
								alert("请添加正确的车库平面图");
							}
							else{
								var data={
									'price':$('.gar-rev-money option:selected').val(),
									'pictureSum':relength,
									'arr':rearr,
									"flag":flag,
									"park_name":name
								}
								data=JSON.stringify(data);
								console.log('传到后台的数据是：'+data);
								$.ajax({
									type: "POST",  //数据提交方式（post/get）
									url: '../parklots.php?action=change',  //提交到的url
									data: data,//提交的数据
									dataType: "json",//返回的数据类型格式
									//cache: false,
									processData: false,
									contentType: "application/json",
									success: function(ret){
										console.log('返回到前端的数据是：'+ret);
										//ret=JSON.stringify(ret);
										ret=JSON.parse(ret);	
										if(ret.status==1){
											alert("提交成功");
											curPage=1;
											finalPage=getData(1);
											$(".shade").hide();
											$(".gar-revise").hide();
											$("body").css("overflow","scroll");
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
	
	//添加车库
	$(".gar-add").click(function(){
		addInit();
		$("html,body").animate({scrollTop:"0"},1);
		$(".shade").show();
		$(".gar-addth").show();
		$("body").css("overflow","hidden");
	});
	   //级联获取小区
	function selectCom(){
		$("#commu1 option").remove();
		$("#commu1").append("<option>"+"—— 小区 ——"+"</option>");
		var place=$("#province1 option:selected").val()+$("#city1 option:selected").val()+$("#district1 option:selected").val();
		var getPush={
			"where":place
		};
		getPush=JSON.stringify(getPush);
		if($("#province1").get(0).selectedIndex!=0){
			$.ajax({
				type: "POST",  //数据提交方式（post/get）
				url: '../parklots.php?action=choose',  //提交到的url
				data: getPush,//提交的数据
				dataType: "json",//返回的数据类型格式
				//cache: false,
				processData: false,
				contentType: "application/json",
				success: function(ret){
					console.log("级联返回数据是："+ret);
					// alert("总数据数是："+ret.ProNum);
					// alert(ret.length);
					ret=JSON.stringify(ret);
					ret=JSON.parse(ret);
					for(var i=0;i<ret.count-1;i++)
					{
						$("#commu1").append("<option>"+ret[i].commu_name+"</option>");
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					alert(XMLHttpRequest.status);
					alert(XMLHttpRequest.readyState);
					alert(textStatus);
				}
			});
		}
	}
	$("#province1").change(function(){
		selectCom();
	});
	$("#city1").change(function(){
		selectCom();
	});
	$("#district1").change(function(){
		selectCom();
	});
	   //层数及车库平面图
	var arr=new Array;
	$(".gar-filediv .add-pic").off("click").on("click",(function(){
		var parkPicture='<div class="gar-upbtn">层数：'+
				"<select>"+
					"<option>3F</option>"+
					"<option>2F</option>"+
					"<option>1F</option>"+
					"<option>-1F</option>"+
					"<option>-2F</option>"+
					"<option>-3F</option>"+
				"</select>"+
				"<input class=\"gar-upfile\" type=\"file\"/>"+
				'<div class="button">上传该层车库平面图</div>'+
				"<input type=\"button\" value=\"删除\"/>"
			"</div>";
		$(".gar-filediv").append(parkPicture);
		$('.gar-filediv .gar-upbtn input[type="button"]').click(function(){
			$(this).parent().remove();
		});
		var formNa="";
		$(".gar-filediv .gar-upbtn .button").off("click").on("click",(function(){
			var now=$(this).parent();
			//alert(now.html());
		    //var nowBuf=now.lastIndexOf("k");
			//var j=nowBuf=now.substring(nowBuf+1,now.length);
			//now='#'+now;
			now.find('.gar-upfile').click();
			now.find('.gar-upfile').change(function(){
				formNa=$(this).val();
				var FileSuf=formNa.lastIndexOf(".");
				FileSuf=formNa.substring(FileSuf,formNa.length).toUpperCase();
				if(FileSuf != ".JPG" && FileSuf != ".JPEG" && FileSuf != ".PNG"){
					alert("文件格式错误！");
					$(this).val("");
				}
				else{
					var file = this.files[0];    
					var reader = new FileReader();    
					reader.readAsDataURL(file);
					reader.onload = function(e){
						formNa='<img width="200px" height="100px" src="'+this.result+'"/>';
						now.find('.button').html(formNa);
						//alert('base64编码是：'+this.result);
					}
				}
			})
		}));
	}));
		//退出
	$(".gar-btn1").click(function(){  
		$(".shade").hide();
		$(".gar-addth").hide();
		$("body").css("overflow","scroll");
	});
		//提交
	$(".gar-btn2").click(function(){
		var SeCec=$("#commu1").get(0).selectedIndex;
		var length=$(".gar-filediv").children(".gar-upbtn").length;
		var picFlag=1;
		var arr=[];
		for(var i=0;i<length;i++)
		{
			var that=$(".gar-filediv").find(".gar-upbtn").eq(i);
			var base=that.find("img").attr("src");
			var floor=that.find("select option:selected").val();
			//alert(base);
			arr[arr.length]={
				"floor":floor,
				"picture":base
			};// 数组追加一个元素
			
			if(!base){
				picFlag=0;
			}
		}
		if($(".gar-name input").val()=="")
		{
			alert("请输入小区名称");
		}
		else if(!SeCec)
		{
			alert("请选择所属小区");
		}
		else if($(".gar-position .lng").val()=="" || $(".gar-position .lat").val()=="")
		{
			alert("请选择车库位置");
		}
		else if(length==0){
			alert("请添加车库平面图");
		}
		else if(!picFlag){
			alert("请添加正确的车库平面图");
		}
		else if($("#gar-pos-del").val()=="")
		{
			alert("请输入车库详细地址");
		}
		else{
			var garName;
			garName=$("#province1 option:selected").val()+$("#city1 option:selected").val()+$("#district1 option:selected").val()+$("#commu1 option:selected").val();
			var data={
				'park_name':$(".gar-name input").val(),
				'commu_name':garName,
				'lng':$("#gar-Lng").val(),
				'lat':$("#gar-Lat").val(),
				//'place':
				'price':$('.gar-money option:selected').val(),
				'pictureSum':length,
				'arr':arr
			}
			data=JSON.stringify(data);
			console.log('传到后台的数据是：'+data);
			$.ajax({
				type: "POST",  //数据提交方式（post/get）
				url: '../parklots.php?action=join',  //提交到的url
				data: data,//提交的数据
				dataType: "json",//返回的数据类型格式
				//cache: false,
				processData: false,
			    contentType: "application/json",
				success: function(ret){
					console.log('返回到前端的数据是：'+ret);
					//ret=JSON.stringify(ret);
					ret=JSON.parse(ret);	
					if(ret.status==1){
						alert("提交成功");
						curPage=1;
						finalPage=getData(1);
						$(".shade").hide();
						$(".gar-addth").hide();
						$("body").css("overflow","scroll");
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
		//操作
	$("#gar td #span3").click(function(){  //查看平面图
		var name=$(this).parent("td").siblings("#parkName").text();
		pasCheck("garPic",name);
	});
	$("#gar td #span1").click(function(){  //暂停使用
		var name=$(this).parent("td").siblings("#parkName").text();
		pasCheck("garPau",name);
	});
	$("#gar td #span2").click(function(){  //修改
		var name=$(this).parent("td").siblings("#parkName").text();
		pasCheck("garRev",name);
	});
});