<?php
include 'needauth.php';
$hand = mysqli_connect("$db_host", "$db_user", "$db_pwd") or die('数据库连接失败');
mysqli_select_db($hand, "$db_name") or die('数据库无此库');
switch ($_GET['action']) {
    case 'all':
        all();
        break;
    case 'pic':
        pic();
        break;
    case 'check':
        check();
        break;
}
function all()
{
    global $hand;
    $user=$_SESSION["user"];
    $total=10;
    $min=$_GET["jsonPage"]["currentPage"]*$total-10;
    $count=0;
    if($_GET["jsonPage"]["currentPage"]=1)
    {
        $sql_n="select id from onwerpark_info where commu_name in (select commu_name from commu_info where user_name='$user')";
        $result_n = mysqli_query($hand, $sql_n);
        $row_n = mysqli_fetch_assoc($result_n);
        $allnum=count($row_commu);
        $allpage=ceil($allnum/10);
        $dan["ProNum"]=$allnum;
        $dan["PageNum"]=$allpage;
    }
    $sql="select park_name,commu_name,park_number,cellphone,parkstatus from ownerpark_info where commu_name in (select commu_name from commu_info where user_name='$user') limit $min,10";
    $result = mysqli_query($hand, $sql);
    while($row = mysqli_fetch_assoc($result))
    {
        $dan["$count"]["parkName"]=$row["park_name"];
        $dan["$count"]["commu_name"]=$row["commu_name"];
        $dan["$count"]["parkNum"]=$row["park_number"];
        $dan["$count"]["call"]=$row{"cellphone"};
        $dan["$count"]["status"]=$row["parkstatus"];
        $count++;
    }
    echo json_encode($dan);
}
function pic()
{
    global $hand;
    $user=$_SESSION["user"];
    $park_name=$_POST["position"]["park_name"];
    $cell=$_POST["position"]["cell"];
    $park_number=$_POST["position"]["park_number"];
    $sql="select park_img from ownerpark_info where park_name='$park_name' and cellphone='$cell' and park_number='$park_number'";
    $result = mysqli_query($hand, $sql);
    $row = mysqli_fetch_assoc($result);
    $dan["pic"]=$row["park_img"];
    echo json_encode($dan);
}
function check()
{
    global $hand;
    $user=$_SESSION["user"];
    $park_name=$_POST["position"]["park_name"];
    $cell=$_POST["position"]["cell"];
    $park_number=$_POST["position"]["park_number"];
    $so=$_POST["position"]["result"];
    if($so=='1')
    {
        $sql="update `ownerpark_info` set parkstatus='0' where park_name='$park_name' and cellphone='$cell' and park_number='$park_number'";
        $result = mysqli_query($hand, $sql);
        if(!$result)
        {
            $dan["result"]='0';
        }
        else
        {
            $dan["result"]='1';
        }
    }
    else if($so='0')
    {
        $reason=$_POST["position"]["reason"];
        $sql="update `ownerpark_info` set parkstatus='0' and reason='$reason' where park_name='$park_name' and cellphone='$cell' and park_number='$park_number'";
        $result = mysqli_query($hand, $sql);
        if(!$result)
        {
            $dan["result"]='0';
        }
        else
        {
            $dan["result"]='1';
        }
    }
    echo json_encode($dan);
}
