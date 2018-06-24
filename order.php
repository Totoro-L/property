<?php
include 'needauth.php';
$total=10;
$min=$_GET["jsonPage"]["currentPage"]*$total-10;
$user=$_SESSION["user"];
$hand = mysqli_connect("$db_host", "$db_user", "$db_pwd") or die('数据库连接失败');
mysqli_select_db($hand, "$db_name") or die('数据库无此库');
if($_POST["jsonPage"]["currentPage"]=1)
{
    $sql_n="select id from order_info where commu_name in (select commu_name from commu_info where user_name='$user')";
    $result_n = mysqli_query($hand, $sql_n);
    $row_n = mysqli_fetch_assoc($result_n);
    $allnum=count($row_n);
    $allpage=ceil($allnum/10);
    $dan["ProNum"]=$allnum;
    $dan["PageNum"]=$allpage;
}
$sql="select car_number, commu_name, park_name, park_number, ordertime, reservetime, latesttime, outtime, canceltime, orderstatus from order_info where commu_name in (select commu_name from commu_info where user_name='$user') limit $min,10";
$result= mysqli_query($hand, $sql);
$count=0;
while ($row= mysqli_fetch_assoc($result)) {
    $dan["$count"]["commu_name"]=$row["commu_name"];
    $dan["$count"]["parkName"]=$row["park_name"];
    $dan["$count"]["parkNum"]=$row["park_number"];
    $dan["$count"]["plate"]=$row["car_number"];
    $dan["$count"]["timeOrder"]=$row["ordertime"];
    $dan["$count"]["timeApp"]=$row["reservetime"];
    $dan["$count"]["timeIn"]=$row["latesttime"];
    $dan["$count"]["timeOut"]=$row["outtime"];
    $dan["$count"]["timeCancel"]=$row["canceltime"];
    $dan["$count"]["status"]=$row["orderstatus"];
    $sql_cell="select cellphone from ownerpark_info where commu_name='$row[commu_name]'and park_name='$row[park_name]' and park_number='$row[park_number]'";
    $result_cell= mysqli_query($hand, $sql_cell);
    $row_cell= mysqli_fetch_assoc($result_cell);
    $dan["cell"]=$row_cell["cellphone"];
    $count++;
}
$dan["count"]=$count+1;
echo json_encode($dan);
