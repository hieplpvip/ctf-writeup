## Faded (100 points)

#### Solved by hieplpvip

```
Do you know that you can generate the executable file for Windows or Linux from Python code?

https://drive.google.com/drive/folders/1iwEngS8LISDao0S_SCzmPxf_SJB2ISCe?usp=sharing

author: pakkunandy
```

The file is created using PyInstaller. We use pyinstxtractor to extract it:

```shell
wget https://raw.githubusercontent.com/extremecoders-re/pyinstxtractor/master/pyinstxtractor.py
objcopy --dump-section pydata=pydata.dump authentication
python pyinstxtractor.py pydata.dump
strings pydata.dump_extracted/authentication.pyc
```

**Flag:** `HCMUS-CTF{Python_is_fun_somehow}`
