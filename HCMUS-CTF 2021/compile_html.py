import sys
import os
import re
import tempfile

if len(sys.argv) != 2:
  print('Usage: python ' + sys.argv[0] + ' MD_FILE')
  exit(1)

with open(sys.argv[1], 'r') as f:
  md = f.read()

include = re.findall(r'!include (.*)', md)

for challenge in include:
  with open(challenge + '/README.md', 'r') as f:
    content = f.read()
    content = re.sub(r'!\[\]\((.*)\)', '![](' + challenge + r'/\g<1>)', content)
    md = md.replace('!include ' + challenge, content)

if not os.path.isfile('GitHub.html5'):
  os.system('wget https://raw.githubusercontent.com/tajmone/pandoc-goodies/master/templates/html5/github/GitHub.html5')

with tempfile.NamedTemporaryFile(suffix='.md') as f:
  f.write(md.encode('utf-8'))
  os.system('pandoc %s --template=GitHub.html5 --self-contained -o writeup.html' % f.name)
