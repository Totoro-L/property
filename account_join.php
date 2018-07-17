<?php
include 'configure.php';
$hand=mysqli_connect("$db_host","$db_user","$db_pwd")or die('数据库连接失败');
mysqli_select_db($hand,"$db_name")or die('数据库无此库');
$name=$_POST["position"]["name"];
$phone=$_POST["position"]["phone"];
$mail=$_POST["position"]["mail"];
$pwd = md5(000000);
$sql = "insert into user_info(`user_name`, `password`,`commu_name`,`park_number`,`car_number`,`cellphone`, `group`, `picture`, `email`)values('$name','$pwd','0','0','0','$phone','2','0','$mail')";
$result = mysqli_query($hand,$sql);
$dan["return"]='1';
echo json_encode($dan);
