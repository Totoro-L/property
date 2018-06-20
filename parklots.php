<?php
include 'needauth.php';
ini_set("display_errors","Off");
$hand = mysqli_connect("$db_host", "$db_user", "$db_pwd") or die('数据库连接失败');
mysqli_select_db($hand, "$db_name") or die('数据库无此库');
switch ($_GET['action']) {
    case 'check':
        check();//密码验证
        break;
    case 'choose':
        choose();//级联选择小区
        break;
    case 'join':
        join_join();//添加车库
        break;
}
function check()
{
    global $hand;
    $user=$_SESSION["user"];
    $total=10;
    $min=$_GET["jsonPage"]["currentPage"]*$total-10;
    $count=0;
    if($_GET["jsonPage"]["currentPage"]=1)
    {
        $sql_n="select park_name from parklots_info where commu_name in (select commu_name from commu_info where user_name='$user')";
        $result_n = mysqli_query($hand, $sql_n);
        $row_n = mysqli_fetch_assoc($result_n);
        $allnum=count($row_commu);
        $allpage=ceil($allnum/10);
        $dan["ProNum"]=$allnum;
        $dan["PageNum"]=$allpage;
    }
    $sql="select park_name,commu_name,price,lng,lat from parklots_info where commu_name in (select commu_name from commu_info where user_name='$user') limit $min,10";
    $result = mysqli_query($hand, $sql);
    while($row = mysqli_fetch_assoc($result))
    {
        $park_name=$row["park_name"];
        $sql_park="select id from ownerpark_info where park_name='$park_name' and parkstatus='0'";
        $result_park = mysqli_query($hand, $sql_park);
        $row_park = mysqli_fetch_assoc($result);
        $num=count($row_park);
        $dan["$count"]["lng"]=$row["lng"];
        $dan["$count"]["lat"]=$row["lat"];
        $dan["$count"]["ParkNum"]=$num;
        $dan["$count"]["park_name"]=$park_name;
        $dan["$count"]["commu_name"]=$row["commu_name"];
        $dan["$count"]["price"]=$row["price"];
        $count++;
    }
    echo json_encode($dan);
}
function choose()
{
    global $hand;
    $user=$_SESSION["user"];
    $where=$_POST["position"]["where"];
    $count=0;
    $sql="select commu_name from commu_info where user_name='$user' and status=1 and commu_name like '%$where%'";
    $result = mysqli_query($hand, $sql);
    while($row = mysqli_fetch_assoc($result))
    {
        //echo $row["commu_name"];
        $name=str_replace($where,'',$row["commu_name"]);
        $dan["$count"]["commu_name"]=$name;
        $count++;
    }
    $dan["count"]=$count;
    echo json_encode($dan);
}
function join_join()
{
    global $hand;
    $user=$_SESSION["user"];
    $arr=$_POST["position"]["arr"];
    $num=$_POST["position"]["pictureSum"];
    $commu_name=$_POST["position"]["commu_name"];
    $lng=$_POST["position"]["lng"];
    $lat=$_POST["position"]["lat"];
    $price=$_POST["position"]["price"];
    $place=$_POST["position"]["place"];
    for($i=1;$i<=$num;$i++)
    {
        $floor=$arr["$i"]["floor"];
        $image=$arr["$i"]["picture"];
        $imageName = $user.date('Ymdhis')."_".rand(1111,9999).'.png';
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
            $name=$_POST["position"]["park_name"].$floor;
            $sql="insert into parklots_info (`commu_name`, `park_name`,`park_price`, `status`,`picture`,`lng`,`lat`,`place`) values('$commu_name','$name','$price','1','$imageSrc','$lng','$lat','$place')";
            $result = mysqli_query($hand, $sql);
        }
    }
    if($dan["status"]!='0')
    {
        $dan["status"]='1';
    }
    echo json_encode($dan);
}
