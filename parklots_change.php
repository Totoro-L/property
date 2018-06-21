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
    $user=$_SESSION["user"];
    $pwd=md5($_POST["position"]["password"]);
    $sql="select id from user_info where user_name='$user' and password='$pwd'";
    $result = mysqli_query($hand, $sql);
    $row = mysqli_fetch_array($result);
    if($row)
    {
        $dan["result"]='1';
    }
    else
    {
        $dan["result"]='0';
    }
    echo json_encode($dan);
}
function change()
{
    global $hand;
    $user=$_SESSION["user"];
    $park_name=$_POST["position"]["park_name"];
    switch ($_POST["position"]["flag"]) {
        case '1':
            $sql_commu="select picture from parklots_info where park_name='$park_name'";
            $result_commu = mysqli_query($hand, $sql_commu);
            $row_commu = mysqli_fetch_array($result_commu);
            $dan["picture"]=$row_commu["picture"];
            break;
        case '2':
            $sql_de="update `parklots_info` set status='0' where park_name='$park_name'";
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
        case '3':
            $price=$_POST["position"]["price"];
            $sql_s="update `parklots_info` set park_price='$price' where park_name='$park_name'";
            $result_s = mysqli_query($hand, $sql_s);
            if(!$result_s)
            {
                $dan["status"]='0';
            }
            else
            {
                $dan["status"]='1';
            }
            break;
        case '4':
            $sql_de="update `parklots_info` set status='1' where park_name='$park_name'";
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
    $sql_de="delete from parklots_info where park_name='$park_name' and user_name='$user'";
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
