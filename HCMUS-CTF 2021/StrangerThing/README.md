## StrangerThing

#### Solved by hieplpvip

```
This is not a difficult challenge. Just make sure that you can use linux :)

SSH Server username: ctf
password: hcmus-ctf
ip: 61.28.237.24
port: 30401

author: pakkunandy
```

```
❯ sshpass -p hcmus-ctf ssh ctf@61.28.237.24 -p30401
Welcome to Ubuntu 18.04.5 LTS (GNU/Linux 5.10.12-200.fc33.x86_64 x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage
This system has been minimized by removing packages and content that are
not required on a system that users do not log into.

To restore this content, you can run the 'unminimize' command.

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.


The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

Last login: Sun May 23 22:49:21 2021 from 10.76.0.4
$ ls
'-flag 2.txt'   flag1.txt   secret
$ cat flag1.txt
HCMUS-CTF{this
$ cat './-flag 2.txt'
_is_used_to_test
$ cd secret
$ cat .flag3.txt
_linux_command_line}
```

**Flag:** `HCMUS-CTF{this_is_used_to_test_linux_command_line}`
