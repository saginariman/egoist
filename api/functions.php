<?php
    header("Access-Control-Allow-Origin: *");
    require_once 'connect.php';
    $postData = file_get_contents('php://input');
    $data = json_decode($postData, true);

    function resultToArray($result){
        $array = array();
        while (($row = $result->fetch_assoc()) != false) {
            $array[] = $row;
        }
        return $array;
    }

    if($data['getDataCats']){
        // $token = $data['token'];
        global $mysqli;
        connectDB();
        // $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login`='$token'");
        // $row = $result->fetch_assoc();
        // if(count($row))
            $result=$mysqli->query("SELECT * FROM `egoist_cats` ORDER BY `id` DESC");
        // else{
        //     closeDB();
        //     $arr['mess'] = 'Не совпадение токена';
        //     exit(json_encode($arr));
        // }
        closeDB();
        $arr_cats = resultToArray($result);
        echo json_encode($arr_cats);
    }
    if($data['getTovarsofCatId']){
        $id = $data['getTovarsofCatId'];
        $token = $data['token'];
        global $mysqli;
        connectDB();
        $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login`='$token'");
        $row = $result->fetch_assoc();
        if(count($row)){
            if($row['admin'])
                $result=$mysqli->query("SELECT * FROM `egoist_tovars` WHERE `cat_id` = '$id' ORDER BY `id` DESC");
            else
                $result=$mysqli->query("SELECT * FROM `egoist_tovars` WHERE `cat_id` = '$id' AND `turnOn`= true ORDER BY `id` DESC");
        }else{
            $result=$mysqli->query("SELECT `id`, `cat_id`, `name`, `cena`, `img`, `descr` FROM `egoist_tovars` WHERE `cat_id` = '$id' AND `turnOn`= true ORDER BY `id` DESC");
        }
        closeDB();
        $arr_cats = resultToArray($result);
        echo json_encode($arr_cats);
    }
    if($data['getTovarOfId']){
        $id = $data['getTovarOfId'];
        $token = $data['token'];
        global $mysqli;
        connectDB();
        $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login`='$token'");
        $result1=false;
        $row = $result->fetch_assoc();
        if(count($row)){
            $user_id = $row['id'];
            $result=$mysqli->query("SELECT * FROM `egoist_tovars` WHERE `id` = '$id'");
            $result1=$mysqli->query("SELECT `user_ocenka` FROM `egoist_ocenyli_users` WHERE `id_tovar`='$id' AND `id_user`='$user_id'");
        }
        else{
            $result=$mysqli->query("SELECT `id`, `cat_id`, `name`, `cena`, `img`, `descr` FROM `egoist_tovars` WHERE `id` = '$id'");
        }
        closeDB();
        $arr_cats = $result->fetch_assoc();
        if($result1){
            $result1 = $result1->fetch_assoc();
            if(count($result1))
                $arr_cats['ocenka_from_current_user'] = $result1['user_ocenka'];
        }
        echo json_encode($arr_cats);
    }
    if($data['sendOcenkaTovaru']){
        $ocenka=$data['sendOcenkaTovaru'];
        $id = $data['id'];
        $token = $data['token'];
        global $mysqli;
        connectDB();
        $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login`='$token'");
        $row = $result->fetch_assoc();
        if(count($row)){
            $user_id = $row['id'];
            $result=$mysqli->query("UPDATE `egoist_tovars` SET `amountPeople`=`amountPeople`+1,`summGolos`=`summGolos`+'$ocenka' WHERE `id` = '$id'");
            $result1=$mysqli->query("INSERT INTO `egoist_ocenyli_users`(`id_tovar`, `id_user`, `user_ocenka`) VALUES ('$id', '$user_id', '$ocenka')");
            $result2=$mysqli->query("SELECT * FROM `egoist_tovars` WHERE `id` = '$id'");
        }
        else{
            closeDB();
            $arr['mess'] = 'Ошибка. Нет доступа для голосования!';
            exit(json_encode($arr));
        }
        closeDB();
        $arr_cats = $result2->fetch_assoc();
        $arr_cats['ocenka_from_current_user'] = $ocenka;
        echo json_encode($arr_cats);
    }
    if($data['getSoacials']){
        global $mysqli;
        connectDB();
        $result=$mysqli->query("SELECT * FROM `egoist_socials`");
        closeDB();
        $arr = resultToArray($result);
        echo json_encode($arr);
    }
    if($data['loginGuest']){
        $login = $data['loginGuest'];
        $pass = md5($data['pass']);
        $arr = [];
        global $mysqli;
        connectDB();
        $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login`='$login'");
        $row = $result->fetch_assoc();
        if(count($row)){
            if($row['pass']==$pass){
                if($row['admission']==true)
                    $arr['mess'] = 'Вы успешно вошли в аккаунт!';
                else
                    $arr['error'] = 'Пользователь был забанен! Обратитесь к тех-поддержку!';
            }
            else{
                $arr['error'] = 'Неправильный пароль!';
            }
        }else{
            $arr['error'] = 'Пользователь с таким логином не существует';
        }
        closeDB();
        $arr['user'] = $row;
        echo json_encode($arr);
    }

    if($data['signUpUser']){
        $login = $data['signUpUser'];
        $pass = md5($data['pass']);
        $arr = [];
        global $mysqli;
        connectDB();
        $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login`='$login'");
        $row = $result->fetch_assoc();
        if(count($row)){
            $arr['error'] = 'Пользователь с таким логином уже существует! Выберите другой логин!';
        }else{
            $result=$mysqli->query("INSERT INTO `egoist_users`(`login`, `pass`) VALUES ('$login', '$pass')");
            if($result){
                $arr['mess'] = 'Вы успешно авторизованы!';
                $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login`='$login'");
                $arr['user'] = $result->fetch_assoc();
            }else{
                $arr['error'] = 'Ошибка добавления пользователя в базу! Попробуйте снова!';
            }
        }
        closeDB();
        echo json_encode($arr);
    }

    // Переключение видимости
    if($data['turnSwitchTovar']){
        $login = $data['token'];
        $id = $data['id'];
        $valSwitch = $data['valSwitch'];
        $response = [];
        global $mysqli;
        connectDB();
        $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login`='$login'  AND `admin` = true ");
        $row = $result->fetch_assoc();
        if(!count($result)){
            closeDB();
            $response['err'] = 'Нет доступа!!! Вы не админ!';
            exit(json_encode($response));
        }

        $result=$mysqli->query("UPDATE `egoist_tovars` SET `turnOn`='$valSwitch' WHERE `id` = '$id'");
        if($result){
            $response['valSwitch'] = $valSwitch;
            $response['mess'] = 'Успешно переключен!';
        }else{
            $response['err'] = 'Ошибка переключение. Попробуйте снова!';
        }
        closeDB();
        echo json_encode($response);
    }
    // Удаление товара
    if($data['removeTovar']){
        $login = $data['token'];
        $id = $data['id'];
        $response = [];
        global $mysqli;
        connectDB();
        $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login`='$login'  AND `admin` = true ");
        $row = $result->fetch_assoc();
        if(!count($result)){
            closeDB();
            $response['err'] = 'Нет доступа!!! Вы не админ!';
            exit(json_encode($response));
        }

        $result=$mysqli->query("DELETE FROM `egoist_tovars` WHERE `id`='$id'");
        if($result){
            $response['mess'] = 'Успешно удален!';
        }else{
            $response['err'] = 'Ошибка удаления. Попробуйте снова!';
        }
        closeDB();
        echo json_encode($response);
    }
    // Взятие всех пользователей
    if($data['getUsers']){
        $login = $data['token'];
        $response = [];
        global $mysqli;
        connectDB();
        $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login`='$login'  AND `admin` = true ");
        $row = $result->fetch_assoc();
        if(!count($result)){
            closeDB();
            $response['err'] = 'Нет доступа!!! Вы не админ!';
            exit(json_encode($response));
        }
        $result=$mysqli->query("SELECT * FROM `egoist_users`");
        $result = resultToArray($result);
        if(count($result)){
            $response['users'] = $result;
            $response['mess'] = 'Успешно';
        }else{
            $response['err'] = 'Ошибка Сервера';
        }
        closeDB();
        echo json_encode($response);
    }

    // Забанить пользователей
    if($data['admissUser']){
        $login = $data['token'];
        $id = $data['id'];
        $valAdmiss = $data['valAdmiss'];
        $response = [];
        global $mysqli;
        connectDB();
        $result=$mysqli->query("SELECT * FROM `egoist_users` WHERE `login`='$login'  AND `admin` = true ");
        $row = $result->fetch_assoc();
        if(!count($result)){
            closeDB();
            $response['err'] = 'Нет доступа!!! Вы не админ!';
            exit(json_encode($response));
        }
        $result=$mysqli->query("UPDATE `egoist_users` SET `admission`='$valAdmiss' WHERE `id`='$id'");
        if($result){
            $result=$mysqli->query("SELECT * FROM `egoist_users`");
            $result = resultToArray($result);
            $response['users'] = $result;
            $response['mess'] = 'Успешно';
        }else{
            $response['err'] = 'Ошибка Сервера';
        }
        closeDB();
        echo json_encode($response);
    }
?>