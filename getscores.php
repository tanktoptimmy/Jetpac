<?php
header('Access-Control-Allow-Origin: *');

$host="frontend-development.co.uk.mysql"; // Host name 
$username="frontend_develo"; // Mysql username 
$password="prague95"; // Mysql password 
$db_name="frontend_develo"; // Database name 
$tbl_name="jetpac"; // Table name

// Connect to server and select database.
mysql_connect("$host", "$username", "$password")or die("cannot connect"); 
mysql_select_db("$db_name")or die("cannot select DB");

// Retrieve data from database 
$sql="SELECT * FROM jetpac ORDER BY score DESC LIMIT 10";
$result=mysql_query($sql);

// Start looping rows in mysql database.
while($rows=mysql_fetch_array($result)){
echo $rows['name'] . "|" . $rows['score'] . "|";

// close while loop 
}

// close MySQL connection 
mysql_close();
?>