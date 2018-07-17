<?php
include 'needauth.php';
$total=10;
$min=$_GET["jsonPage"]["currentPage"]*$total-10;
$user=$_SESSION["user"];
$hand = mysqli_connect("$db_host", "$db_user", "$db_pwd") or die('数据库连接失败');
mysqli_select_db($hand, "$db_name") or die('数据库无此库');
$sql_commu="select count(id) from user_info where group='0' or group='1'";
$result_commu = mysqli_query($hand, $sql_commu);
$row_commu = mysqli_fetch_array($result_commu);
$num=$row_commu[0];
$page=ceil($num/10);
$sql_s="select user_name,group,mail,cellphone from user_info where group='0' or group='1' limit $min,10";
$result_s = mysqli_query($hand, $sql_s);
$count=0;
while($row_s = mysqli_fetch_assoc($result_s))
{
  $dan["$count"]["name"]=$row_s["user_name"];
  $dan["$count"]["status"]=$row_s["group"];
  $dan["$count"]["mail"]=$row_s["mail"];
  $dan["$count"]["phone"]=$row_s["cellphone"];
  $count++;
}
$dan["ProNum"]=$num;
$dan["PageNum"]=$page;
$dan["count"]=$count+1;
echo json_encode($dan);
