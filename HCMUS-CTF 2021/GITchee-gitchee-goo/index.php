<?php
    session_start();
    if (!isset($_SESSION["token"]))
        $_SESSION["token"] = bin2hex(random_bytes(16));
    if (isset($_POST["song"])) {
        if (!isset($_POST["token"]))
            die("Missing token");
        if ($_POST["token"] !== $_SESSION["token"])
            die("Mismatch token");
        if ($_POST["song"] === "index.php")
            die("Dont try to read my source code");
        echo "<pre>";
        include($_POST["song"]);
        echo "</pre>";
        $_SESSION["token"] = bin2hex(random_bytes(16));
    }
?>
<html>
    <form method="post">
        <label for="song">Your song:</label><br>
        <input name="song" value="gitchee_gitchee_goo"><br><br>
        <input name="token" value="<?=$_SESSION['token']?>" hidden>
        <input type="submit" value="Submit">
    </form>
<?php
    // echo "  <h1>If you stuck, here is a helping robot</h1>";
    // echo "  <img src=\"Norm.jpg\">";
?>
</html>
