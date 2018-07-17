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
    case 'join':
        join_join();
        break;
}
function all()
{
    global $hand;
    $user=$_SESSION["user"];
    $total=10;
    $min=$_POST["jsonPage"]["currentPage"]*$total-10;
    $count=0;
    if($_GET["jsonPage"]["currentPage"]=1)
    {
        $sql_n="select count(*) from ownerpark_info where commu_name in (select commu_name from commu_info where user_name='$user')";
        $result_n = mysqli_query($hand, $sql_n);
        $row_n = mysqli_fetch_array($result_n);
        $allnum=$row_n[0];
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
        $sql="update `ownerpark_info` set parkstatus='3', reason='$reason' where park_name='$park_name' and cellphone='$cell' and park_number='$park_number'";
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
function join_join()
{
    global $hand;
    $user=$_SESSION["user"];
    $commu_name=$_POST["position"]["commu_name"];
    $park_name=$_POST["position"]["park_name"];
    $sharetime=$_POST["position"]["sharetime"];
    $starttime=$_POST["position"]["starttime"];
    $endtime=$_POST["position"]["endtime"];
    $sql_p="select cellphone from user_info where user_name='$user'";
    $result_p = mysqli_query($hand, $sql_p);
    $row_p = mysqli_fetch_assoc($result_p);
    $cellphone=$row_p["cellphone"];
    $image=$_POST["position"]["picture"];
    $imageName = $user.date('Ymdhis')."_".rand(1111,9999).'.txt';
    if (strstr($image,",")){
        $image = explode(',',$image);
        $image = $image[1];
    }

    $path = "pic/".date("Ymd",time());
    if (!is_dir($path)){ //判断目录是否存在 不存在就创建
        mkdir($path,0777,true);
    }
    $imageSrc=  $path."/". $imageName;  //图片名字

    $r = file_put_contents($imageSrc, base64_decode($image));//返回的是字节数
    if (!$r) {
        $dan["status"]='0';
    }else{
        $myfile = fopen("class.txt", "r") or die("Unable to open file!");
        while(!feof($myfile))
        {
            $class=fgets($myfile);//按行读取
            $class=trim($class);//去除换行符
            $sql="insert into ownerpark_info(`commu_name`,`park_name`,`park_number`,`cellphone`,`park_img`,`sharetime`,`starttime`,`endtime`)values('$commu_name','$park_name','$class','$cellphone','pic/theone.jpg','$sharetime','$starttime','$endtime')";
            $result = mysqli_query($hand, $sql);
            if(!$result)
            {
                $dan["result"]='0';
            }
        }
    }
    if($dan["result"]!='0')
    {
        $dan["result"]='1';
    }
    echo json_encode($dan);
}
