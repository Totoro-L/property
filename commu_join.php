<?php
include 'needauth.php';
$hand = mysqli_connect("$db_host", "$db_user", "$db_pwd") or die('数据库连接失败');
mysqli_select_db($hand, "$db_name") or die('数据库无此库');
$user=$_SESSION["user"];
$commu_name=$_POST["commu_name"];
$date=date('Ymdhis');
$fileName=$_FILES['pic']['name'];
$name=explode('.',$fileName);
$danth=$_POST['user_name'].$date.'.'.$name[1];
$newPath='pic/'.$danth;
$oldPath=$_FILES['pic']['tmp_name'];
rename($oldPath,$newPath);
$sql = "insert into commu_info(`commu_name`, user_name,`status`,`picture`)values('$commu_name','$user','0','$newPath')";
$result = mysqli_query($hand,$sql);
