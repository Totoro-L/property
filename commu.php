<?php
include 'needauth.php';
$total=10;
$min=$_GET["jsonPage"]["currentPage"]*$total-10;
$user=$_SESSION["user"];
$hand = mysqli_connect("$db_host", "$db_user", "$db_pwd") or die('数据库连接失败');
mysqli_select_db($hand, "$db_name") or die('数据库无此库');
$sql="select `group` from user_info where user_name='$user'";
$result = mysqli_query($hand, $sql);
$row = mysqli_fetch_assoc($result);
if($row["group"]==2)
{
  $sql_commu="select commu_name,status from commu_info where user_name='$user'";
  $result_commu = mysqli_query($hand, $sql_commu);
  $row_commu = mysqli_fetch_assoc($result_commu);
  $num=count($row_commu);
  $page=ceil($num/10);
  $sql_s="select commu_name,status from commu_info where user_name='$user' limit $min,10";
  $result_s = mysqli_query($hand, $sql_s);
  $count=0;
  while($row_s = mysqli_fetch_assoc($result_s))
  {
    $dan["$count"]["commu_name"]=$row_s["commu_name"];
    $dan["$count"]["status"]=$row_s["status"];
    $dan["$count"]["user"]=$_SESSION["user"];
    $count++;
  }
  $dan["ProNum"]=$num;
  $dan["PageNum"]=$page;
  $dan["count"]=$count+1;
  echo json_encode($dan);
}
if($row["group"]==3)
{
  $sql_commu="select * from commu_info";
  $result_commu = mysqli_query($hand, $sql_commu);
  $row_commu = mysqli_fetch_assoc($result_commu);
  $num=count($row_commu);
  $page=ceil($num/10);
  $sql_s="select * from commu_info limit {$min},10";
  $result_s = mysqli_query($hand, $sql_s);
  $count=0;
  while($row_s = mysqli_fetch_assoc($result_s))
  {
    $dan["$count"]["commu_name"]=$row_s["commu_name"];
    $dan["$count"]["status"]=$row_s["status"];
    $dan["$count"]["user"]=$row_s["user_name"];
    $count++;
  }
  $dan["ProNum"]=$num;
  $dan["PageNum"]=$page;
  echo json_encode($dan);
}
