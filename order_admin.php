<?php
include 'needauth.php';
$total=10;
$min=$_POST["jsonPage"]["currentPage"]*$total-10;
$user=$_SESSION["user"];
$hand = mysqli_connect("$db_host", "$db_user", "$db_pwd") or die('数据库连接失败');
mysqli_select_db($hand, "$db_name") or die('数据库无此库');
if($_POST["jsonPage"]["currentPage"]=1)
{
    $sql_n="select count(id) from order_info";
    $result_n = mysqli_query($hand, $sql_n);
    $row_n = mysqli_fetch_array($result_n);
    $allnum=$row_n[0];
    $allpage=ceil($allnum/10);
    $dan["ProNum"]=$allnum;
    $dan["PageNum"]=$allpage;
}
$count=0;
$sql="select car_number,commu_name,park_name,park_number,ordertime,reservetime,latesttime,outtime,canceltime,orderstatus from order_info limit $min,10";
$result= mysqli_query($hand, $sql);
if (!$result) {
 printf("Error: %s\n", mysqli_error($hand));
 exit();
}
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
    $dan["call"]=$row_cell["cellphone"];
    $count++;
}
$dan["count"]=$count+1;
echo json_encode($dan);
