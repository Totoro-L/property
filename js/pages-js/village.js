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
	}
	$.get("../commu.php",getPush,function(ret){
		//alert("返回数据是："+ret);
		// alert("总数据数是："+ret.ProNum);
		// alert(ret.length);
		alert("第一个审核状态是："+ret[0].status);
		var tab="<tr><th>序号</th><th>小区名称</th><th>归属物业</th><th>审核状态</th><th>操作</th></tr><tr><td class=\"space\"></td></tr>";
		var statusCec;
		for(var i=0;i<ret.length;i++)
        {
			if(ret[i].status=="0")
			{
				statusCec='审核中';
			}
			else if(ret[i].status=="1")
			{
				statusCec='审核通过';
			}
			else
			{
				statusCec='审核失败';
			}
            tab+="<tr>";
			tab+="<td>"+i+"</td>";
            tab+="<td>"+ret[i].commu_name+"</td>"+
			     "<td>"+ret[i].user+"</td>"+
				 "<td>"+statusCec+"</td>"+
				 "<td><span><img src=\"images/error.png\" width=\"18px\" height=\"18px\"/>删除</span>"+
				 "<span><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>修改</span></td>";
            tab+="</tr>";
        }
		$("#vla").html(tab);
		$("tr:even").css("background-color","#ccc");
		var total="共"+ret.PageNum+"页,"+ret.ProNum+"条数据";
		$(".vla-bottom-del").html(total);
	});
	pageNow(currentPage,ret.PageNum);
	if(currentPage==1)
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
	return ret.PageNum;
};

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
		$(".shade").show();
		$(".vla-addth").show();
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
			data.append("pic",$("#vla-upfile")[0].files[0]);
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
					alert(result);
					addInit();
					if(result=='0'){
						alert("提交成功");
						$(".shade").hide();
						$(".vla-addth").hide();
						addInit();
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
});