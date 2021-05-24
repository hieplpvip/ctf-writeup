## Memory

#### Solved by hieplpvip

```
There is a computer incident. We have collected the memory dump of the victim's computer. Can you guys help us to retrive some evidence?

https://drive.google.com/file/d/1msKRWfouY9g7TMxxx1XTW7jJ9MuSEsrO/view?usp=sharinga

author: pakkunandy
```

We use `volatility` to inspect the memory dump.

View system information:

```
$ volatility -f memory.raw imageinfo
Volatility Foundation Volatility Framework 2.6
INFO    : volatility.debug    : Determining profile based on KDBG search...
          Suggested Profile(s) : Win7SP1x64, Win7SP0x64, Win2008R2SP0x64, Win2008R2SP1x64_23418, Win2008R2SP1x64, Win7SP1x64_23418
                     AS Layer1 : WindowsAMD64PagedMemory (Kernel AS)
                     AS Layer2 : FileAddressSpace (/home/hieple/memory/memory.raw)
                      PAE type : No PAE
                           DTB : 0x187000L
                          KDBG : 0xf800028080a0L
          Number of Processors : 2
     Image Type (Service Pack) : 1
                KPCR for CPU 0 : 0xfffff80002809d00L
                KPCR for CPU 1 : 0xfffff880009eb000L
             KUSER_SHARED_DATA : 0xfffff78000000000L
           Image date and time : 2021-05-08 10:58:53 UTC+0000
     Image local date and time : 2021-05-08 17:58:53 +0700
```

Find flag file:

```
$ volatility -f memory.raw --profile=Win7SP1x64 filescan | grep flag
Volatility Foundation Volatility Framework 2.6
0x000000001e903f20      2      0 RW-r-- \Device\HarddiskVolume2\Users\Test\Desktop\flag.txt.txt
```

Dump `flag.txt.txt`:

```
$ volatility -f memory.raw --profile=Win7SP1x64 dumpfiles -Q 0x000000001e903f20 -D .
Volatility Foundation Volatility Framework 2.6
DataSectionObject 0x1e903f20   None   \Device\HarddiskVolume2\Users\Test\Desktop\flag.txt.txt
$ cat file.None.0xfffffa8000659910.dat
Second part of secret_key: P@zzw0rD
```

Scan commands:

```
$ volatility -f memory.raw --profile=Win7SP1x64 cmdscan
Volatility Foundation Volatility Framework 2.6
**************************************************
CommandProcess: conhost.exe Pid: 3900
CommandHistory: 0x2c0a40 Application: cmd.exe Flags: Allocated, Reset
CommandCount: 2 LastAdded: 1 LastDisplayed: 1
FirstCommand: 0 CommandCountMax: 50
ProcessHandle: 0x64
Cmd #0 @ 0x299940: You should get the flag online
Cmd #1 @ 0x2c4de0: But here is the first part of the encryption key: SuP3r_
Cmd #15 @ 0x270158: +
Cmd #16 @ 0x2bfbb0: ,
**************************************************
CommandProcess: conhost.exe Pid: 1572
CommandHistory: 0x200c10 Application: DumpIt.exe Flags: Allocated
CommandCount: 0 LastAdded: -1 LastDisplayed: -1
FirstCommand: 0 CommandCountMax: 50
ProcessHandle: 0x60
Cmd #15 @ 0x1b0158:
Cmd #16 @ 0x1ff5a0:
```

Now we know the key is `SuP3r_P@zzw0rD`. The flag is online, so let "`strings`" some URLs:

```shell
strings memory.raw | grep https:// > https.txt
```

We find a Google Drive URL right at the top: https://drive.google.com/file/d/1BBtY2q5h89Wkml6DLwlUSMJUUls3khtE/view?usp=sharing

Downloading it and extracting with the key, we get our flag.

**Flag:** `HCMUS-CTF{simple_memory_forensics_stuff}`
