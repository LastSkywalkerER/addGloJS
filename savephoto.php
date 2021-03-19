<?php
    echo  $_FILES;

    $path = 'dbimage/' . $_FILES['photo']['name'];
    move_uploaded_file($_FILES['photo']['tmp_name'], $path);

?>
