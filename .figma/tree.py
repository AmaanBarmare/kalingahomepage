import re,sys
lines=open('.figma/home-metadata.xml').read().split('\n')
def sub(nid, maxdepth=99):
    out=[];base=None
    for ln in lines:
        ind=(len(ln)-len(ln.lstrip()))//2
        if base is None:
            if f'id="{nid}"' in ln: base=ind; out.append(ln)
            continue
        if ind<=base and ln.strip().startswith('<') and not ln.strip().startswith('</'): break
        if ind<=base and ln.strip().startswith('</') and ind==base: out.append(ln); break
        if ind-base<=maxdepth: out.append(ln)
    return '\n'.join(out)
for nid in sys.argv[1:]:
    print(f"===== {nid} =====")
    print(sub(nid))
