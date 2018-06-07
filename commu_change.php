<?php
include 'needauth.php';
$hand = mysqli_connect("$db_host", "$db_user", "$db_pwd") or die('数据库连接失败');
mysqli_select_db($hand, "$db_name") or die('数据库无此库');
switch ($_GET['action']) {
    case 'check':
        check();
        break;
    case 'change':
        change();
        break;
}
function check()
{
    global $hand;
    //print_r (json_decode($_POST));
    $user=$_SESSION["user"];
    $pwd=md5($_POST["password"]);
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
    $commu_name=$_POST["commu_name"];
    switch ($_POST["flag"]) {
        case '1':
            $sql_commu="select pic from commu_info where commu_name='$commu_name' and user_name='$user'";
            $result_commu = mysqli_query($hand, $sql_commu);
            $row_commu = mysqli_fetch_array($result_commu);
            $dan["proveSrc"]=$row_commu["pic"];
            break;
        case '2':
            $sql_de="delete from commu_info where commu_name='$commu_name' and user_name='$user'";
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
            if ($_FILES["file"]["error"] > 0)
            {
                $dan["status"]='0';
            }
            else
            {
                $sql_commu="select pic from commu_info where commu_name='$commu_name' and user_name='$user'";
                $result_commu = mysqli_query($hand, $sql_commu);
                $row_commu = mysqli_fetch_array($result_commu);
                unlink($row_commu["pic"]);
                $date=date('Ymdhis');
                $fileName=$_FILES['picture']['name'];
                $name=explode('.',$fileName);
                $danth=$_POST['user_name'].$date.'.'.$name[1];
                $newPath='pic/'.$danth;
                $oldPath=$_FILES['picture']['tmp_name'];
                rename($oldPath,$newPath);
                $sql_file="update `commu_info` set pic='$newPath' where commu_name='$commu_name' and user_name='$user'";
                $result_file = mysqli_query($hand, $sql_file);
                $dan["status"]='1';
            }
            break;
    }
    echo json_encode($dan);
}
