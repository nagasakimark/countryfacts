#!/usr/bin/env python3
"""Flag kanji above school grade 5 (needs: pip install jamdict jamdict-data).
Usage: python3 tools/kcheck.py data/atlas.js [more files]"""
import re, sys
from jamdict import Jamdict
j = Jamdict()
cache = {}
def grade(ch):
    if ch not in cache:
        r = j.lookup(ch)
        g = r.chars[0].grade if r.chars else None
        cache[ch] = int(g) if g not in (None, '') else None
    return cache[ch]
bad = {}
for f in sys.argv[1:]:
    for n, line in enumerate(open(f, encoding='utf8'), 1):
        for ch in set(re.findall(r'[\u4e00-\u9fff]', re.sub(r'\{[^{}|]*\|[^{}]*\}', '', line))):
            g = grade(ch)
            if g is None or g > 5:
                bad.setdefault(ch, []).append((f, n, g))
for ch, v in sorted(bad.items(), key=lambda x: -len(x[1])):
    print(ch, 'grade', v[0][2], 'x%d' % len(v), 'lines', [x[1] for x in v][:6])
print('TOTAL distinct risky kanji:', len(bad))
