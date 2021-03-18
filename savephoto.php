<?php
    echo "<script>console.log('Debug Objects: " . $_FILES . "' );</script>";

    $path = 'dbimage/' . $_FILES['photo']['name'];
    move_uploaded_file($_FILES['photo']['tmp_name'], $path);

?>
