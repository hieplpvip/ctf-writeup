## Dodge (50 points)

#### Solved by nhanlun

```
I catched your cat. Can you dodge it?

ssh ctf@61.28.237.24 -p30400 password: hcmus-ctf

author: pakkunandy
```

We have SSH access but our shell is restricted. We can bypass it using `--noprofile`:

```
$ ssh ctf@61.28.237.24 -p30400 -t "bash --noprofile"
ctf@61.28.237.24's password:
ctf@dodge-5bf54d476f-sfnpv:~$ ls
bin  flag.txt
ctf@dodge-5bf54d476f-sfnpv:~$ cat flag.txt
HCMUS-CTF{You_know_some_command_line_stuff}
```

**Flag:** `HCMUS-CTF{You_know_some_command_line_stuff}`
