## TestYourCmd (200 points)

#### Solved by hieplpvip

```
I have a dump of a disk which contains secret infomation. However, the secret is faded if you do not the password. In the real-world, analyzing log files is a very effective method.

file here https://mega.nz/file/WlpA1Dxb#1N8p1AyVRkFiKtWzCfTnmdn-Z08uCfVaHYANlcw5n2k

author: pakkunandy
```

Inside `.log` there is an image file named `Master.png`. It is broken so we fix its magic number and get the first hint:

![](Master.png)

`.log` also contains a lot of "emails". Let's find all emails that is sent by Messi to Ronaldo:

```shell
$ grep -l "Send To: Ronaldo" $(grep -l -r "From: Messi" .)
./.log/4/fd7faf6882396d5b4bb8ef51b9b94273.log
./.log/30/e79521d1d866f32ef2f0e7adbdc4cf3d.log
./.log/7/56613b6b2616aa1aefbd6edb75a7fdc5.log
./.log/12/d9480af67448f6e14dd29985616f4616.log
./.log/11/af08fa7cdd1912d920a35d2542e1e2c0.log
./.log/13/13bff2de21b5e589f010473b2af188be.log
./.log/26/d346d027b686f43bea9a76e5d16a9bfc.log
./.log/10/9fb0dbf9c55553c0c4d83b2ea36d0234.log
```

Let's read all of them:

```shell
$ grep -l "Send To: Ronaldo" $(grep -l -r "From: Messi" .) | xargs cat
[SOME RANDOM DATA]
Send To: Ronaldo
From: Messi
Content:
U3VQZXJfR29sZF8zeW1BckpyLg==
[SOME RANDOM DATA]

$ echo -n U3VQZXJfR29sZF8zeW1BckpyLg== | base64 -d
SuPer_Gold_3ymArJr.
```

We now have the passphrase for steghide. Let's use it to decrypt all files in `Secret`:

```py
import os
imgs = os.listdir('.')
for file in imgs:
  os.system('steghide extract -sf ' + file + ' -p SuPer_Gold_3ymArJr.')
```

```
...
steghide: could not extract any data with that passphrase!
256
steghide: could not extract any data with that passphrase!
256
steghide: could not extract any data with that passphrase!
256
steghide: could not extract any data with that passphrase!
256
wrote extracted data to "flag.txt".
0
```

**Flag:** `HCMUS-CTF{at_least_I_hope_you_can_code_a_bit}`
