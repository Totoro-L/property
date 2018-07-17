<?php
include 'needauth.php';
$hand = mysqli_connect("$db_host", "$db_user", "$db_pwd") or die('数据库连接失败');
mysqli_select_db($hand, "$db_name") or die('数据库无此库');
switch ($_GET['action']) {
    case 'check':
        check();//密码验证
        break;
    case 'change':
        change();
        break;
    case 'delete':
        delete_d();
        break;
}
function check()
{
    global $hand;
    //print_r (json_decode($_POST));
    $name=$_POST["position"]["name"];
    $sql="select picture from commu_info where commu_name='$name'";
    $result = mysqli_query($hand, $sql);
    $row = mysqli_fetch_array($result);
    if($row)
    {
        $dan["pic"]=$row["picture"];
    }
    else
    {
        $dan["pic"]='0';
    }
    echo json_encode($dan);
}
function change()
{
    global $hand;
    $user=$_SESSION["user"];
    $park_name=$_POST["position"]["park_name"];
    switch ($_POST["position"]["flag"]) {
        case '0':
            $sql_de="update `commu_info` set status='2' where commu_name='$park_name'";
            $result_de = mysqli_query($hand, $sql_de);
            if(!$result_de)
            {
                $dan["status"]='0';
            }
            else
            {
                $dan["status"]='1';
            }
            break;
        case '1':
            $sql_de="update `commu_info` set status='1' where commu_name='$park_name'";
            $result_de = mysqli_query($hand, $sql_de);
            if(!$result_de)
            {
                $dan["status"]='0';
            }
            else
            {
                $dan["status"]='1';
            }
            break;
    }
    echo json_encode($dan);
}
function delete_d()
{
    global $hand;
    $user=$_SESSION["user"];
    $park_name=$_POST["position"]["park_name"];
    $sql_de="delete from commu_info where commu_name='$park_name'";
    $result_de = mysqli_query($hand, $sql_de);
    if(!$result_de)
    {
        $dan["status"]='0';
    }
    else
    {
        $dan["status"]='1';
    }
}
