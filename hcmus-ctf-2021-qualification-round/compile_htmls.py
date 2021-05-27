import os
import re
import tempfile

if not os.path.isfile('GitHub.html5'):
  os.system('wget https://raw.githubusercontent.com/tajmone/pandoc-goodies/master/templates/html5/github/GitHub.html5')

os.system('rm -rf html_output && mkdir html_output')
challenges = [f for f in os.listdir('.') if f != 'html_output' and os.path.isdir(f)]

for challenge in challenges:
  if not os.path.isfile(challenge + '/README.md'):
    continue

  with open(challenge + '/README.md', 'r') as f:
    content = f.read()
    content = re.sub(r'## (.*)\n', "---\ntitle: '" + r'\g<1>' + "'\n---\n", content, 1)

  with tempfile.NamedTemporaryFile('w', suffix='.md') as f:
    f.write(content)
    f.flush()
    os.system('pandoc %s --resource-path=%s --template=GitHub.html5 --self-contained -o html_output/%s.html' %
              (f.name, challenge, challenge))
