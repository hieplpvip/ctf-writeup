## Permutation (100 points)

#### Solved by hieplpvip

```
Playing around with permutation is fun.

nc 61.28.237.24 30303

https://drive.google.com/drive/folders/1eS4bTtOuNvrAnwIXFeMGT3v1ZAKiSkGN?usp=sharing

author: vuonghy2442
```

```py
from typing import List
import random

def get_permutation(n : int) -> List[int]:
    arr = list(range(n))
    random.shuffle(arr)
    return arr

def compose_permutation(p1 : List[int], p2 : List[int]):
    return [p1[x] for x in p2]

def permutation_power(p : List[int], n : int) -> List[int]:
    if n == 0:
        return list(range(len(p)))
    if n == 1:
        return p

    x = permutation_power(p, n // 2)
    x = compose_permutation(x, x)
    if n % 2 == 1:
        x = compose_permutation(x, p)
    return x


with open("flag.txt", "rb") as f:
    flag = int.from_bytes(f.read().strip(), byteorder='big')

perm = get_permutation(512)
print(perm)
print(permutation_power(perm, flag))
```

We are given a permutation of length 512. The flag is read from `flag.txt` and is treated as a number to which the permutation is raised.

I'm not an expert in discrete mathematics, but my experience with permutations in competitive programing told me that the cycle decomposition of a permutation would not change if it is raised to arbitrary power. The order of elements in each cycle would change, though. However, the order in each cycle will repeat after `len(cycle)`.

I used that to generate a system of congruences and used Chinese remainder theorem to solve it.

### Scripts

- `get_remainder.py`:

```py
from pwn import *
from typing import List
from tqdm import tqdm
import random

def get_permutation(n: int) -> List[int]:
  arr = list(range(n))
  random.shuffle(arr)
  return arr

def compose_permutation(p1: List[int], p2: List[int]):
  return [p1[x] for x in p2]

def permutation_power(p: List[int], n: int) -> List[int]:
  if n == 0:
    return list(range(len(p)))
  if n == 1:
    return p

  x = permutation_power(p, n // 2)
  x = compose_permutation(x, x)
  if n % 2 == 1:
    x = compose_permutation(x, p)
  return x

def find_cycles(p):
  mark = set()
  cycles = list()
  cycles_mp = dict()
  for i in range(N):
    if i in mark:
      continue

    cycle = []
    j = i
    while not j in mark:
      cycle.append(j)
      mark.add(j)
      j = p[j]

    cycles.append(cycle)
    for j in cycle:
      cycles_mp[j] = cycle

  return cycles, cycles_mp

REMAINDER = set()
for K in tqdm(range(1000)):
  with context.local(log_level='error'):
    conn = remote('61.28.237.24', 30303)
    perm = eval(conn.recvline())
    power_perm = eval(conn.recvline())

  N = len(perm)
  cycles, cycles_mp = find_cycles(perm)
  power_cycles, power_cycles_mp = find_cycles(power_perm)

  for cycle in cycles:
    x = cycle[0]
    for i in range(len(cycle)):
      tmp = permutation_power(perm, i)
      _, tmp = find_cycles(tmp)
      if tmp[x] == power_cycles_mp[x]:
        REMAINDER.add((len(cycle), i))

REMAINDER = list(REMAINDER)
REMAINDER.sort()

with open('remainder.txt', 'w') as f:
  for (base, modulus) in REMAINDER:
    f.write(str(base) + ' ' + str(modulus) + '\n')
```

Output:

```
100%|█████████████████████████████████| 1000/1000 [16:52<00:00,  1.01s/it]
```

- `solve_remainder.py`:

```py
from functools import reduce

def prime_test(candidate):
  for divisor in range(2, candidate):
    if candidate % divisor == 0:
      return False
  return True

def mul_inv(a, b):
  b0 = b
  x0, x1 = 0, 1
  if b == 1:
    return 1
  while a > 1:
    q = a // b
    a, b = b, a % b
    x0, x1 = x1 - q * x0, x0
  if x1 < 0:
    x1 += b0
  return x1

def chinese_remainder(n, a):
  sum = 0
  prod = reduce(lambda a, b: a * b, n)
  for n_i, a_i in zip(n, a):
    p = prod // n_i
    sum += a_i * mul_inv(p, n_i) * p
  return sum % prod

with open('remainder.txt', 'r') as f:
  lines = f.readlines()

REMAINDER = set()
for line in lines:
  base, modulus = [int(x) for x in line.split(' ')]
  REMAINDER.add((base, modulus))

bases = []
moduli = []
for (base, modulus) in REMAINDER:
  if not prime_test(base):
    continue
  bases.append(base)
  moduli.append(modulus)

N = chinese_remainder(bases, moduli)
print('Base:', bases)
print('Moduli:', moduli)
print('N =', N)
print('Flag:', N.to_bytes((N.bit_length() + 7) // 8, byteorder='big').decode('utf-8'))

for line in lines:
  base, modulus = [int(x) for x in line.split(' ')]
  assert N % base == modulus
```

Output:

```
Base: [71, 11, 151, 3, 109, 137, 163, 101, 293, 313, 271, 197, 149, 29, 353, 191, 73, 283, 317, 239, 43, 173, 419, 233, 439, 47, 83, 311, 421, 61, 491, 19, 23, 31, 1, 463, 359, 37, 367, 139, 389, 281, 7, 167, 337, 223, 349, 211, 251, 89, 479, 53, 103, 227, 499, 397, 409, 431, 461, 467, 449, 107, 257, 2, 67, 307, 199, 157, 347, 181, 383, 373, 5, 13, 379, 229, 241, 131, 269, 509, 17, 113, 433, 401, 277, 127, 487, 193, 97, 79, 41, 263, 503, 179, 59]
Moduli: [47, 5, 29, 1, 19, 99, 88, 27, 188, 32, 62, 112, 81, 12, 243, 19, 45, 31, 42, 198, 26, 1, 416, 20, 152, 27, 62, 199, 43, 1, 390, 13, 1, 14, 0, 58, 355, 34, 345, 31, 81, 151, 6, 144, 182, 43, 133, 199, 101, 38, 85, 4, 90, 21, 71, 307, 272, 192, 300, 398, 182, 100, 17, 1, 5, 102, 160, 149, 166, 115, 348, 321, 1, 10, 94, 6, 227, 104, 172, 181, 11, 50, 140, 206, 170, 91, 254, 185, 68, 38, 29, 258, 468, 115, 46]
N = 47769820549048474554085009241876415140029853715293207780376101628764118194423054997144788103821976789913680919931090317439101
Flag: HCMUS-CTF{discrete_log_is_easy_on_permutation_group}
```

**Flag:** `HCMUS-CTF{discrete_log_is_easy_on_permutation_group}`

P/s: The server was down after I ran `get_remainder.py`. Not sure if it was my error...
