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

Create file `hash`:

```
$6$OQy2HYdK1F0RuFLv$OEsWe98lUzVkAiZy0.BDj.1GwjRtD72QZtQ7XugSdGss6TEXxnu4b3NWaVKBoSFtJ/LlG59l2sh4nLUPIqeLV1
```

Use John the Ripper to crack it with `rockyou` wordlist:

```
$ john --wordlist=/usr/share/wordlists/rockyou.txt hash
Using default input encoding: UTF-8
Loaded 1 password hash (sha512crypt, crypt(3) $6$ [SHA512 256/256 AVX2 4x])
Cost 1 (iteration count) is 5000 for all loaded hashes
Will run 20 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
playboy123       (?)
1g 0:00:00:00 DONE (2021-05-27 04:18) 4.347g/s 22260p/s 22260c/s 22260C/s gators..allison1
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```

Encode `playboy123` using Base64 and we get the password for `phase2.zip`: `cGxheWJveTEyMw==`

### Phase 2

There is a similar hint in `README.md`:

```
Crack it to find the passphrase. The password to opened the zip file is the base64 of that passphrase.
```

Use `ssh2john` to turn `id_rsa` into a hash file for John the Ripper to crack:

```shell
wget https://raw.githubusercontent.com/openwall/john/bleeding-jumbo/run/ssh2john.py
python ssh2john.py id_rsa > id_rsa.hash
```

Again, use John the Ripper to crack it with `rockyou` wordlist:

```
$ john --wordlist=/usr/share/wordlists/rockyou.txt id_rsa.hash
Using default input encoding: UTF-8
Loaded 1 password hash (SSH, SSH private key [RSA/DSA/EC/OPENSSH 32/64])
Cost 1 (KDF/cipher [0=MD5/AES 1=MD5/3DES 2=Bcrypt/AES]) is 0 for all loaded hashes
Cost 2 (iteration count) is 1 for all loaded hashes
Will run 20 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
felecity         (id_rsa)
1g 0:00:00:00 DONE (2021-05-27 04:19) 12.50g/s 3422Kp/s 3422Kc/s 3422KC/s felix19..faithers
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```

Encode `felecity` using Base64 and we get the password for `phase2.zip`: `cGxheWJveTEyMw==`

**Flag:** `HCMUS_CTF{cracking_for_fun}`
