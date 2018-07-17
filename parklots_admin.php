<?php
include 'needauth.php';
ini_set("display_errors","Off");
$hand = mysqli_connect("$db_host", "$db_user", "$db_pwd") or die('数据库连接失败');
mysqli_select_db($hand, "$db_name") or die('数据库无此库');
$user=$_SESSION["user"];
$total=10;
$min=$_POST["jsonPage"]["currentPage"]*$total-10;
$count=0;
if($_POST["jsonPage"]["currentPage"]=1)
{
    $sql_n="select count(id) from parklots_info";
    $result_n = mysqli_query($hand, $sql_n);
    $row_n = mysqli_fetch_array($result_n);
    $allnum=$row_n[0];
    $allpage=ceil($allnum/10);
    $dan["ProNum"]=$allnum;
    $dan["PageNum"]=$allpage;
}
$sql="select park_name,commu_name,park_price,lng,lat,status from parklots_info limit $min,10";
$result = mysqli_query($hand, $sql);
while($row = mysqli_fetch_assoc($result))
{
    $park_name=$row["park_name"];
    $sql_park="select count(id) from ownerpark_info where park_name='$park_name' and parkstatus='0'";
    $result_park = mysqli_query($hand, $sql_park);
    $row_park = mysqli_fetch_array($result_park);
    $num=$row_park[0];
    $dan["$count"]["lng"]=$row["lng"];
    $dan["$count"]["lat"]=$row["lat"];
    $dan["$count"]["ParkNum"]=$num;
    $dan["$count"]["park_name"]=$park_name;
    $dan["$count"]["commu_name"]=$row["commu_name"];
    $dan["$count"]["price"]=$row["park_price"];
    $dan["$count"]["status"]=$row["status"];
    $count++;
}
  $dan["count"]=$count+1;
echo json_encode($dan);
