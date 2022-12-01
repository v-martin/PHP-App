<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header("Access-Control-Allow-Headers: X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $script_start = microtime(true);
        if (isset($_POST['r']) && isset($_POST['x']) && isset($_POST['y'])) {
            header('Content-Type: text/html');
            http_response_code(201);

            $xValue = floatval($_POST['x']);
            $yValue = floatval($_POST['y']);
            $rValue = floatval($_POST['r']);
            $hit = hit($xValue,$yValue,$rValue);
            $hitted = $hit ? 'hit' : 'miss';
            $current_time = time();
            $execution_time = ceil((microtime(true) - $script_start) * 100000000) /100;
            $response = array(
                "x" => "$xValue",
                "y" => "$yValue",
                "r" => "$rValue",
                "hit" => "$hit",
                "current_time" => "$current_time",
                "execution_time" => "$execution_time"
            );
            echo json_encode($response);
            exit(201);
        }else{
            http_response_code(400);
            echo 'Bad request';
            exit(400);
    }
}

function hit($x, $y, $r){
    if ($x <= 0 && 
        $y <= 0 && 
        $x >= $r && 
        $y >= $r) {
        return true;
    }
    elseif ($x > 0 && $y < 0) {
        return false;
    }
    elseif ($x <= 0 && $y >= 0) {
        if ($x >= ($y - $r)) {
            return true;
        }
        return false;
    }
    elseif($x >= 0 && $y >= 0) {
        if (($x**2 + $y**2) <= $r**2){
            return true;
        }
        return false;
    }
}