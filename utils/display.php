<?php
    // Configuration
    $hostname = 'frontend-development.co.uk';
    $username = 'frontend-development.co.uk';
    $password = 'Bonnie2026';
    $database = 'frontend-development.co.uk';
 
    try {
        $dbh = new PDO('mysql:host='. $hostname .';dbname='. $database, $username, $password);
    } catch(PDOException $e) {
        echo '<h1>An error has occurred.</h1><pre>', $e->getMessage() ,'</pre>';
    }
 
    $sth = $dbh->query('SELECT * FROM scores ORDER BY score DESC LIMIT 5');
    $sth->setFetchMode(PDO::FETCH_ASSOC);
 
    $result = $sth->fetchAll();
 
    if(count($result) > 0) {
        foreach($result as $r) {
            echo $r['name'], "\t", $r['score'], "\n";
        }
    }
?>