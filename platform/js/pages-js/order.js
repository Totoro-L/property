function addInit(){ //筛选订单初始化
	
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
	console.log(getPush);
	
	$.ajax({
		 type: "POST",  //数据提交方式（post/get）
		 url: '../order_admin.php',  //提交到的url
		 data: getPush,//提交的数据
		 dataType: "json",//返回的数据类型格式
		 success: function(ret){
			console.log(ret);
			ret=JSON.stringify(ret);
			ret=JSON.parse(ret);	
			var tab="<tr><th>序号</th><th>车位信息</th><th>业主电话</th><th>车牌号</th><th>下单时间</th><th>预约时间</th><th>入场时间</th><th>出场时间</th><th>取消时间</th><th>订单状态</th></tr><tr><td class=\"space\"></td></tr>";
			var statusCec;
			for(var i=0;i<ret.count-1;i++)
			{
				// var imgAdd="<td><span id=\"span3\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>查看平面图</span>"+
					 // "<span id=\"span2\"><img src=\"images/edit.png\" width=\"18px\" height=\"18px\"/>修改</span>"+
					 // "<span id=\"span1\"><img src=\"images/error.png\" width=\"18px\" height=\"18px\"/>暂停使用</span></td>";
				if(ret[i].status==2)
				{
					statusCec='已取消';
				}
				else if(ret[i].status==1)
				{
					statusCec='超时';
				}
				else if(ret[i].status==0)
				{
					statusCec='正常';
				}
				tab+="<tr>";
				tab+="<td>"+parseInt(i+1)+"</td>";
				tab+="<td class=\"ord-td-width1\"><a href=\"#\">"+ret[i].commu_name+ret[i].parkName+ret[i].parkNum+"</a></td>"+
					 "<td class=\"ord-td-width\">"+ret[i].call+"</td>"+
					 "<td class=\"ord-td-width\">"+ret[i].plate+"</td>"+
					 "<td>"+ret[i].timeOrder+"</td>"+
					 "<td>"+ret[i].timeApp+"</td>"+
					 "<td>"+ret[i].timeIn+"</td>"+
					 "<td>"+ret[i].timeOut+"</td>"+
					 "<td>"+ret[i].timeCancel+"</td>"+
					 "<td>"+statusCec+"</td>";
				tab+="</tr>";
			}
			$("#ord").html(tab);
			$("tr:even").css("background-color","#ccc");
			var total="共"+ret.PageNum+"页,"+ret.ProNum+"条数据";
			$(".ord-bottom-del").html(total);
			pageNow(currentPage,ret.PageNum);
			
			if(currentPage==1 && ret.PageNum==1){
				$("#ord-first-page").attr("class","ord-paging-down");
				$("#ord-last-page").attr("class","ord-paging-down");
				$("#ord-first-page").attr("disabled", true);
				$("#ord-last-page").attr("disabled", true);

				$("#ord-final-page").attr("class","ord-paging-down");
				$("#ord-next-page").attr("class","ord-paging-down");
				$("#ord-final-page").attr("disabled", true);
				$("#ord-next-page").attr("disabled", true);
			}
			else if(currentPage==1)
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
		 },
		 error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);
		 }
	 });
	return retPage;
};

var finalPage=1;
$(".ord-pag-div").children("input").css("cursor","pointer");
addInit();      //筛选订单初始化

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
	//筛选订单
});