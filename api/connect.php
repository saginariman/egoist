<?php
    $mysqli=true;
	function connectDB(){
		global $mysqli;
		$mysqli=new mysqli("localhost","root","root","f0497377_nari");
		$mysqli->query("SET NAMES 'utf8'");
		$mysqli->query("SET CHARACTER SET 'utf8'");
	}
	function closeDB(){
		global $mysqli;
		$mysqli->close();

	}
?>