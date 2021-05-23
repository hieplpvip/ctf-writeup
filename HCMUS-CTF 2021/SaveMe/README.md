## SaveMe

#### Solved by hieplpvip

```
There is which was corrupted in the transmision. Can you help me to recover it?

file here https://mega.nz/file/ekQWGJYB#e6-bup7JsCTno8blEKyfGCJUQ0FtbFp-fARm5j0Pt4o

author: pakkunandy
```

The file looks like `xxd` output, so we use reverse hex dump. Bytes 0x1b0 to 0x1bf are missing. All bytes around them are 0x32, so we fill them with 0x32.

```shell
cat text | xxd -r >data
```

Let's check `data` with `strings`:

```
$ strings data | head
FJFI
bDxEfi
IGPM2 1..022
02120::4621 :0651:
FJFI
.$ ',"
)70,4144'
=928.<43
22222222222222222222222222222222222222222222222222
'&)(4*6587:9DCFEHGJITSVUXWZYdcfehgjitsvuxwzy
```

`FJFI` looks like `JFIF` (JPEG), and `IGPM` looks like `GIMP` (an image editor). This is definitely a JPEG file. It seems that every two consecutive bytes are swapped. Let's swap it back:

```py
with open('data', 'rb') as f:
  data = bytearray(f.read())

N = len(data)
for i in range(0, N, 2):
  data[i], data[i + 1] = data[i + 1], data[i]

with open('fixed.jpg', 'wb') as f:
  f.write(data)
```

`fixed.jpg` can't be opened yet because its magic number is wrong. Patch it to `FF D8 FF E0 00 10 4A 46 49 46 00 01` and we can finally open it.

The flag is `HCMUS-CTF{You_Know_How_To_Manipulate_Images_1324587}`
