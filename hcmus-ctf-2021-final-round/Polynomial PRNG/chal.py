from Crypto.Util.number import isPrime
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
import random
import math

from poly import secret_poly1, secret_poly2

def eval_poly(poly, x):
    res = 0
    for coef in poly:
        res = res * x + coef
    return res

def sieving(poly, p):
    return [eval_poly(poly, i) % p == 0 for i in range(p)]

def get_prime(n):
    return filter(isPrime, range(2,n))

prime_list = list(get_prime(1000))
sieve1 = dict([(p, sieving(secret_poly1, p)) for p in prime_list])
sieve2 = dict([(p, sieving(secret_poly2, p)) for p in prime_list])

# each polynomial is a list of random integers coefficient from 1 to 2^32 of length 33 (hence of degree 32)
assert(len(secret_poly1) == 33)
assert(len(secret_poly2) == 33)

while True:
    x = random.randint(2**23, 2**24)
    # this part is only for optimizing, unimportant
    bad = False
    for p in prime_list:
        if sieve1[p][x % p] or sieve2[p][x % p]:
            bad = True
            break
    if bad:
        continue
    p = eval_poly(secret_poly1,x)
    q = eval_poly(secret_poly2,x)
    if isPrime(p) and isPrime(q):
        break

n = p * q
phi = (p-1) * (q-1)

while True:
    e = random.randint(2,phi-1)
    if math.gcd(e,phi) == 1:
        break

d = pow(e, -1, phi)

key = RSA.construct((n, e, d, p, q))
cipher = PKCS1_OAEP.new(key)

with open('/home/ctf/flag.txt', 'rb') as f:
    c =  cipher.encrypt(f.read()).hex()

print(n, e, c)

