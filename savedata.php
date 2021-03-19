<?php
    echo "<script>console.log('Debug Objects: " . $_FILES . "' );</script>";
    echo "<script>console.log('Debug Objects: " . $_POST . "' );</script>";

    $path = 'dbHeroes.json';
    move_uploaded_file($_FILES['dbHeroes']['tmp_name'], $path);
    move_uploaded_file($_POST['dbHeroes']['tmp_name'], $path);

?>
