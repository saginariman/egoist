<?php 
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
require_once 'connect.php';
function resultToArray($result){
    $array = array();
    while (($row = $result->fetch_assoc()) != false) {
        $array[] = $row;
    }
    return $array;
}
if($_POST['createNewCat']){
    $name = $_POST['createNewCat'];
    $descr = $_POST['descr'];
    $token = $_POST['token'];
    $response = array();
    global $mysqli;
    connectDB();
    $path = "";
    $upload_path = '/home/f0497377/domains/f0497377.xsph.ru/public_html/imgs/';
    $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login` = '$token' AND `admin` = true");
    $result=$result->fetch_assoc();
    if(!count($result)){
        closeDB();
        $response['err'] = 'Нет доступа!!! Вы не админ!';
        exit(json_encode($response));
    }
    if ($_FILES['file']['error'] == UPLOAD_ERR_OK) {
        $extension_file = mb_strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
        $full_unique_name = $upload_path . uniqid('file_', true).'.'.$extension_file;
        if (move_uploaded_file($_FILES['file']['tmp_name'], $full_unique_name)) {
            $path  = substr($full_unique_name, strlen($_SERVER['DOCUMENT_ROOT']));
            
            $result=$mysqli->query("INSERT INTO `egoist_cats`(`name`, `img`, `descr`) VALUES ('$name','$path','$descr')");
            if($result){
                $response['mess'] = 'Успешно загрузилcя на сервер!';
                $result=$mysqli->query("SELECT * FROM `egoist_cats` WHERE `img` = '$path'");
                $result = $result->fetch_assoc();
                $response['cat']=$result;
            }else{
                $response['err'] = 'Ошибка. Данные не добавились к базе данных, но файл успешно загрузилcя на сервер!';
            }
        } else {
            $response['err'] = "Произошла обшибка при загрузке файла на сервер";
        }
    }else{
        $response['err'] = 'Файл не передан к серверу. Попробуйте перезагрузить страницу и отправить снова!';
    }

    closeDB();
    echo json_encode($response);
}

if($_POST['createNewTovar']){
    $name = $_POST['createNewTovar'];
    $descr = $_POST['descr'];
    $token = $_POST['token'];
    $cena = $_POST['cena'];
    $cat_id = $_POST['cat_id'];
    $response = array();
    global $mysqli;
    connectDB();
    $path = "";
    $upload_path = '/home/f0497377/domains/f0497377.xsph.ru/public_html/imgs/';
    $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login` = '$token' AND `admin` = true");
    $result=$result->fetch_assoc();
    if(!count($result)){
        closeDB();
        $response['err'] = 'Нет доступа!!! Вы не админ!';
        exit(json_encode($response));
    }
    if ($_FILES['file']['error'] == UPLOAD_ERR_OK) {
        $extension_file = mb_strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
        $full_unique_name = $upload_path . uniqid('file_', true).'.'.$extension_file;
        if (move_uploaded_file($_FILES['file']['tmp_name'], $full_unique_name)) {
            $path  = substr($full_unique_name, strlen($_SERVER['DOCUMENT_ROOT']));
            
            $result=$mysqli->query("INSERT INTO `egoist_tovars`(`cat_id`, `name`, `cena`, `img`, `descr`) VALUES ('$cat_id','$name', '$cena', '$path', '$descr')");
            if($result){
                $response['mess'] = 'Успешно загрузилcя на сервер!';
                $result=$mysqli->query("SELECT * FROM `egoist_tovars` WHERE `img` = '$path'");
                $result = $result->fetch_assoc();
                $response['tovar']=$result;
            }else{
                $response['err'] = 'Ошибка. Данные не добавились к базе данных, но файл успешно загрузилcя на сервер!';
            }
        } else {
            $response['err'] = "Произошла обшибка при загрузке файла на сервер";
        }
    }else{
        $response['err'] = 'Файл не передан к серверу. Попробуйте перезагрузить страницу и отправить снова!';
    }

    closeDB();
    echo json_encode($response);
}

if($_POST['editCatOfId']){
    $name = $_POST['name'];
    $descr = $_POST['descr'];
    $token = $_POST['token'];
    $cat_id = $_POST['cat_id'];
    $response = array();
    global $mysqli;
    connectDB();
    $path = "";
    $upload_path = '/home/f0497377/domains/f0497377.xsph.ru/public_html/imgs/';
    $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login` = '$token' AND `admin` = true");
    $result=$result->fetch_assoc();
    if(!count($result)){
        closeDB();
        $response['err'] = 'Нет доступа!!! Вы не админ!';
        exit(json_encode($response));
    }
    if ($_FILES['file']['error'] == UPLOAD_ERR_OK && is_uploaded_file($_FILES['file']['tmp_name']) ) {
        $extension_file = mb_strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
        $full_unique_name = $upload_path . uniqid('file_', true).'.'.$extension_file;
        if (move_uploaded_file($_FILES['file']['tmp_name'], $full_unique_name)) {
            $path  = substr($full_unique_name, strlen($_SERVER['DOCUMENT_ROOT']));
        } else {
            $response['err'] = "Произошла обшибка при загрузке файла на сервер";
        }
    }

    if($response['err']){
        closeDB();
        exit(json_encode($response));
    }
    
    $str_query = '';
    if(isset($_POST['name']) && isset($_POST['descr']) && $_FILES['file']){
        $str_query = "UPDATE `egoist_cats` SET `name`='$name',`img`='$path',`descr`='$descr' WHERE `id` ='$cat_id'";
    }else if(isset($_POST['name']) && isset($_POST['descr'])){
        $str_query = "UPDATE `egoist_cats` SET `name`='$name', `descr`='$descr' WHERE `id` ='$cat_id'";
    }else if(isset($_POST['name']) && $_FILES['file']){
        $str_query = "UPDATE `egoist_cats` SET `name`='$name', `img`='$path' WHERE `id` ='$cat_id'";
    }else if(isset($_POST['descr']) && $_FILES['file']){
        $str_query = "UPDATE `egoist_cats` SET `img`='$path',`descr`='$descr' WHERE `id` ='$cat_id'";
    }else if(isset($_POST['name'])){
        $str_query = "UPDATE `egoist_cats` SET `name`='$name' WHERE `id` ='$cat_id'";
    }else if(isset($_POST['descr'])){
        $str_query = "UPDATE `egoist_cats` SET `descr`='$descr' WHERE `id` ='$cat_id'";
    }else if(isset($_FILES['file'])){
        $str_query = "UPDATE `egoist_cats` SET `img`='$path' WHERE `id` ='$cat_id'";
    }
    $result = $mysqli->query($str_query);
    if($result){
        $response['mess'] = 'Успешно данные обновились!';
        $result=$mysqli->query("SELECT * FROM `egoist_cats` ORDER BY `id` DESC");
        $result = resultToArray($result);
        $response['cat']=$result;
    }else{
        $response['err'] = 'Ошибка. Данные не обновились!';
    }
    closeDB();
    echo json_encode($response);
}
if($_POST['editTovarOfId']){
    $name = $_POST['name'];
    $cena = $_POST['cena'];
    $descr = $_POST['descr'];
    $token = $_POST['token'];
    $tovar_id = $_POST['tovar_id'];
    $response = array();
    global $mysqli;
    connectDB();
    $path = "";
    $upload_path = '/home/f0497377/domains/f0497377.xsph.ru/public_html/imgs/';
    $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login` = '$token' AND `admin` = true");
    $row=$result->fetch_assoc();
    if(!count($row)){
        closeDB();
        $response['err'] = 'Нет доступа!!! Вы не админ!';
        exit(json_encode($response));
    }
    if ($_FILES['file']['error'] == UPLOAD_ERR_OK && is_uploaded_file($_FILES['file']['tmp_name']) ) {
        $extension_file = mb_strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
        $full_unique_name = $upload_path . uniqid('file_', true).'.'.$extension_file;
        if (move_uploaded_file($_FILES['file']['tmp_name'], $full_unique_name)) {
            $path  = substr($full_unique_name, strlen($_SERVER['DOCUMENT_ROOT']));
        } else {
            $response['err'] = "Произошла обшибка при загрузке файла на сервер";
        }
    }

    if($response['err']){
        closeDB();
        exit(json_encode($response));
    }
    
    $str_query = '';
    if(isset($_POST['name']) && isset($_POST['cena']) && isset($_POST['descr']) && $_FILES['file']){// n c d f
        $str_query = "UPDATE `egoist_tovars` SET `name`='$name',`cena`='$cena',`img`='$path',`descr`='$descr' WHERE `id` ='$tovar_id'";
    }else if(isset($_POST['name']) && isset($_POST['cena']) && isset($_POST['descr']) ){ // n c d
        $str_query = "UPDATE `egoist_tovars` SET `name`='$name',`cena`='$cena',`descr`='$descr' WHERE `id` ='$tovar_id'";
    }else if(isset($_POST['name']) && isset($_POST['cena']) && $_FILES['file']){ // n c f
        $str_query = "UPDATE `egoist_tovars` SET `name`='$name',`cena`='$cena',`img`='$path' WHERE `id` ='$tovar_id'";
    }else if(isset($_POST['name']) && isset($_POST['descr']) && $_FILES['file']){//n d f
        $str_query = "UPDATE `egoist_tovars` SET `name`='$name', `img`='$path',`descr`='$descr' WHERE `id` ='$tovar_id'";
    }else if(isset($_POST['cena']) && isset($_POST['descr']) && $_FILES['file']){// c d f
        $str_query = "UPDATE `egoist_tovars` SET `cena`='$cena',`img`='$path',`descr`='$descr' WHERE `id` ='$tovar_id'";
    }
    // ПО 2
    else if(isset($_POST['name']) && isset($_POST['cena']) ){// n c
        $str_query = "UPDATE `egoist_tovars` SET `name`='$name',`cena`='$cena' WHERE `id` ='$tovar_id'";
    }else if(isset($_POST['name']) && isset($_POST['descr'])){// n d
        $str_query = "UPDATE `egoist_tovars` SET `name`='$name', `descr`='$descr' WHERE `id` ='$tovar_id'";
    }else if(isset($_POST['name']) && $_FILES['file']){// n f
        $str_query = "UPDATE `egoist_tovars` SET `name`='$name', `img`='$path' WHERE `id` ='$tovar_id'";
    }else if(isset($_POST['cena']) && isset($_POST['descr']) ){// c d
        $str_query = "UPDATE `egoist_tovars` SET `cena`='$cena', `descr`='$descr' WHERE `id` ='$tovar_id'";
    }else if(isset($_POST['cena']) && $_FILES['file']){// c f
        $str_query = "UPDATE `egoist_tovars` SET `cena`='$cena',`img`='$path' WHERE `id` ='$tovar_id'";
    }else if(isset($_POST['descr']) && $_FILES['file']){// d f
        $str_query = "UPDATE `egoist_tovars` SET `img`='$path',`descr`='$descr' WHERE `id` ='$tovar_id'";
    }
    // ПО 1
    else if(isset($_POST['name'])){// n
        $str_query = "UPDATE `egoist_tovars` SET `name`='$name' WHERE `id` ='$tovar_id'";
    }else if(isset($_POST['cena'])){// c
        $str_query = "UPDATE `egoist_tovars` SET `cena`='$cena' WHERE `id` ='$tovar_id'";
    }else if(isset($_POST['descr'])){// d
        $str_query = "UPDATE `egoist_tovars` SET `descr`='$descr' WHERE `id` ='$tovar_id'";
    }else if(isset($_FILES['file'])){// f
        $str_query = "UPDATE `egoist_tovars` SET `img`='$path' WHERE `id` ='$tovar_id'";
    }
    $result = $mysqli->query($str_query);
    if($result){
        $response['mess'] = 'Успешно данные обновились!';
        $result=$mysqli->query("SELECT * FROM `egoist_tovars` WHERE `id` = '$tovar_id'");
        $result = $result->fetch_assoc();
        $response['tovar']=$result;

        $user_id = $row['id'];
        $result1=$mysqli->query("SELECT `user_ocenka` FROM `egoist_ocenyli_users` WHERE `id_tovar`='$tovar_id' AND `id_user`='$user_id'");
        $result1 = $result1->fetch_assoc();
        if(count($result1))
            $response['tovar']['ocenka_from_current_user'] = $result1['user_ocenka'];
        
    }else{
        $response['err'] = 'Ошибка. Данные не обновились!';
    }
    closeDB();
    echo json_encode($response);
}

// Добавление соц. сети
if($_POST['addNewSocial']){
    $url = $_POST['url'];
    $token = $_POST['token'];
    $response = array();
    global $mysqli;
    connectDB();
    $path = "";
    $upload_path = '/home/f0497377/domains/f0497377.xsph.ru/public_html/imgs/';
    $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login` = '$token' AND `admin` = true");
    $result=$result->fetch_assoc();
    if(!count($result)){
        closeDB();
        $response['err'] = 'Нет доступа!!! Вы не админ!';
        exit(json_encode($response));
    }
    if ($_FILES['file']['error'] == UPLOAD_ERR_OK) {
        $extension_file = mb_strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
        $full_unique_name = $upload_path . uniqid('file_', true).'.'.$extension_file;
        if (move_uploaded_file($_FILES['file']['tmp_name'], $full_unique_name)) {
            $path  = substr($full_unique_name, strlen($_SERVER['DOCUMENT_ROOT']));
            
            $result=$mysqli->query("INSERT INTO `egoist_socials`(`img`, `url`) VALUES ('$path', '$url')");
            if($result){
                $response['mess'] = 'Успешно загрузилcя на сервер!';
                $result=$mysqli->query("SELECT * FROM `egoist_socials`");
                $result = resultToArray($result);
                $response['socials']=$result;
            }else{
                $response['err'] = 'Ошибка. Данные не добавились к базе данных, но файл успешно загрузилcя на сервер!';
            }
        } else {
            $response['err'] = "Произошла обшибка при загрузке файла на сервер";
        }
    }else{
        $response['err'] = 'Файл не передан к серверу. Попробуйте перезагрузить страницу и отправить снова!';
    }

    closeDB();
    echo json_encode($response);
}
?>