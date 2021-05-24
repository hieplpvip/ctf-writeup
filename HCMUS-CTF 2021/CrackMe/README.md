## CrackMe (100 points)

#### Solved by hieplpvip

```
There is some way to crack the hash...

https://drive.google.com/drive/folders/1NgygZjPeOI8isi2q5RVCB-fEu6XWNWJE?usp=sharing

author: pakkunandy
```

This challenge consists of two phases. In phase 1 you need to crack a password, while in phase 2 you need to crack an SSH private key.

### Phase 1

There is a hint in `README.md`:

```
Crack that hashed to plaintext. The base64 of the plaintext is the password to open the zip file.
```

Create file `mypasswd` with content:

```
root:$6$OQy2HYdK1F0RuFLv$OEsWe98lUzVkAiZy0.BDj.1GwjRtD72QZtQ7XugSdGss6TEXxnu4b3NWaVKBoSFtJ/LlG59l2sh4nLUPIqeLV1:0:0:root:/root:/bin/bash
```

Use John the Ripper to crack it with `rockyou` wordlist:

```
$ john --wordlist=/usr/share/wordlists/rockyou.txt mypasswd
Loaded 1 password hash (crypt, generic crypt(3) [?/64])
Press 'q' or Ctrl-C to abort, almost any other key for status
playboy123       (root)
1g 0:00:00:05 100% 0.1897g/s 674.0p/s 674.0c/s 674.0C/s girls..01234
Use the "--show" option to display all of the cracked passwords reliably
Session completed
```

Encode `playboy123` using Base64 and we get the password for `phase2.zip`: `cGxheWJveTEyMw==`

### Phase 2

There is a similar hint in `README.md`:

```
Crack it to find the passphrase. The password to opened the zip file is the base64 of that passphrase.
```

Use `ssh2john` to turn `id_rsa` into a hash file for John the Ripper to crack:

```shell
wget https://raw.githubusercontent.com/magnumripper/JohnTheRipper/bleeding-jumbo/run/ssh2john.py
python ssh2john.py id_rsa > id_rsa.hash
```

Again, use John the Ripper to crack it with `rockyou` wordlist:

```
$ john --wordlist=/usr/share/wordlists/rockyou.txt id_rsa.hash
Using default input encoding: UTF-8
Loaded 1 password hash (SSH [RSA/DSA/EC/OPENSSH (SSH private keys) 32/64])
Cost 1 (KDF/cipher [0=MD5/AES 1=MD5/3DES 2=Bcrypt/AES]) is 0 for all loaded hashes
Cost 2 (iteration count) is 1 for all loaded hashes
Will run 16 OpenMP threads
Note: This format may emit false positives, so it will keep trying even after
finding a possible candidate.
Press 'q' or Ctrl-C to abort, almost any other key for status
felecity (id_rsa)
1g 0:00:00:01 DONE (2021-05-24 18:22) 0.7692g/s 11032Kp/s 11032Kc/s 11032KC/s 0125457423 ..\*7¡Vamos!
Session completed
```

Encode `felecity` using Base64 and we get the password for `phase2.zip`: `cGxheWJveTEyMw==`

**Flag:** `HCMUS_CTF{cracking_for_fun}`
