<?php
error_reporting(E_ERROR);
ini_set("display_errors","Off");
include 'session.php';
include 'configure.php';
session_set_save_handler($handler, true);
session_start();
//$dan["return"]=$_POST["password"];
//echo json_encode($dan);
if ($_POST["check"] == $_SESSION["check"]) {
    $pwd = md5($_POST["password"]);//加密
    $_SESSION["user"] = $_POST["user_name"];
    $user=$_SESSION["user"];
    $_SESSION["pwd"] = $pwd;
    $hand = mysqli_connect("$db_host", "$db_user", "$db_pwd") or die('数据库连接失败');
    mysqli_select_db($hand, "$db_name") or die('数据库无此库');
    $sql = "select `group` from user_info where user_name='$user' and password='$pwd'";//验证账号密码
    $result = mysqli_query($hand, $sql);
    $row = mysqli_fetch_array($result);
    if ($row) {
        if($row["group"]==0){
          $dan["return"]='2';
          echo json_encode($dan);
        }else {
          $dan["return"]='0';
          echo json_encode($dan);
        }
    } else {
      $dan["return"]='1';
      echo json_encode($dan);
    }
} else {
  $dan["return"]='3';
  echo json_encode($dan);
}
