<?php
include 'configure.php';
$hand=mysqli_connect("$db_host","$db_user","$db_pwd")or die('数据库连接失败');
mysqli_select_db($hand,"$db_name")or die('数据库无此库');
$sql_user="select user_name from user_info where user_name='$_POST[user_name]'";
$result_user = mysqli_query($hand, $sql_user);
$row_user = mysqli_num_rows($result_user);
if($row_user==0)
{
  $sql_num="select cellphone from user_info where cellphone='$_POST[cellphone]'";
  $result_num = mysqli_query($hand, $sql_num);
  $row_num = mysqli_num_rows($result_num);
  if($row_num==0)
  {
    $sql_email="select email from user_info where email='$_POST[email]'";
    $result_email = mysqli_query($hand, $sql_email);
    $row_email = mysqli_num_rows($result_email);
    if($row_email==0)
    {
      $date=date('Ymdhis');
      $fileName=$_FILES['picture']['name'];
      $name=explode('.',$fileName);
      $danth=$_POST['user_name'].$date.'.'.$name[1];
      $newPath='pic/'.$danth;
      $oldPath=$_FILES['picture']['tmp_name'];
      rename($oldPath,$newPath);
      $pwd = md5($_POST["password"]);
      $sql = "insert into user_info(`user_name`, `password`,`commu_name`,`park_number`,`car_number`,`cellphone`, `group`, `picture`, `email`)values('$_POST[user_name]','$pwd','0','0','0','$_POST[cellphone]','0','$newPath','$_POST[email]')";
      $result = mysqli_query($hand,$sql);
      $dan["return"]='0';
      echo json_encode($dan);
    }
    else
    {
      $dan["return"]='3';
      echo json_encode($dan);
    }
  }
  else
  {
    $dan["return"]='2';
    echo json_encode($dan);
  }
}
else
{
  $dan["return"]='1';
  echo json_encode($dan);
}
