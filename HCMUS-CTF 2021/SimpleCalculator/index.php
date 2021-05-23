<?php

    $html = '   <form>
        <label for="equation">Equation: </label>
            <input name="equation" value="13*37">
        <input type="submit">
    </form>
';
    if (isset($_GET["equation"])) {
        $formula = $_GET["equation"];
        if (preg_match_all('/[a-z\'"`]+/i', $formula)) {
            echo "<video controls autoplay><source src='static/video.mp4' type='video/mp4'></video>";
            echo "<h1>Are you trying to hack me? Alphabetic character and quote is not allowed here</h1>";
        }
        else if (strlen($formula) >= 20) {
            echo "<h1>This is just a simple calculator, not WolframAlpha, try a shorter equation</h1>";
        }
        else
        {
            eval('$res = ' . $formula . ';');
            echo isset($res) ? $res : '?';
        }
    }
    else
        echo $html;
?>
