"""Convert the Medium RSS feed into src/data/articles.js + local images.

usage: curl -sL https://medium.com/feed/@hippogriff -o feed.xml
       python -I scripts/import-medium.py feed.xml .
New posts need an entry in POSTS (slug, type, description).
"""
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser

feed_path, repo = sys.argv[1], sys.argv[2]

# Medium post id -> (slug, type, description). Clean slugs, no typos from the Medium URLs.
POSTS = {
    "a84ce1583288": ("klu-public-address-system", "UX Case Study",
        "Designing a centralized public address system for K L University's hostels that wardens — many not tech-savvy, some over 60 — could run confidently without help."),
    "4e24a593950f": ("redantio", "Brand Design Case Study",
        "Six hours, one designer: building a complete brand identity and web presence for a cybersecurity startup in a single sprint."),
    "73cd1f6aecda": ("pseudo-fullstack-portfolio", "Article",
        "How I designed and built a portfolio that feels dynamic on a lean static architecture — the \"pseudo fullstack\" approach."),
    "a7489d544deb": ("design-to-code", "Article",
        "Turning a design into code feels overwhelming until you stop looking at the content and start with the skeleton."),
    "30cfddc87853": ("ats-vs-custom-resume", "Article",
        "ATS-friendly or custom-designed? Navigating which resume to send in modern job applications."),
    "8e33237083f0": ("why-i-choose-minimal-design", "Article",
        "Why I keep coming back to minimal design — and what restraint does for the people using what I make."),
    "2f3975501255": ("from-doodles-to-design", "Article",
        "My unconventional journey from sketching doodles into the creative world of design."),
}


# Medium truncated or misspelled these titles.
TITLES = {
    "klu-public-address-system": "UX Case Study: Public Address System for KL University Hostels",
    "pseudo-fullstack-portfolio": "How I Built My Pseudo Fullstack Portfolio",
}


class Converter(HTMLParser):
    """Medium post HTML -> list of (heading, body) with the body in the
    case-study page's light markup: blank-line paragraphs, '- ' / '1. ' list
    items, '> ' quotes, '#### ' subheads, '![caption](src)' images,
    **bold**, *italic* and [text](url)."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.sections = [[None, []]]
        self.buf = None          # inline text being collected
        self.block = None        # tag that owns self.buf
        self.list_stack = []     # 'ul' / 'ol' with counters
        self.href = None
        self.img = None          # pending figure image
        self.in_figcaption = False
        self.skip = False

    def blocks(self):
        return self.sections[-1][1]

    def start_text(self, tag):
        self.buf, self.block = [], tag

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("h3", "h4", "p", "blockquote", "li", "figcaption"):
            if tag == "li":
                self.list_stack[-1][1] += 1
            self.start_text(tag)
            self.in_figcaption = tag == "figcaption"
        elif tag in ("ul", "ol"):
            self.list_stack.append([tag, 0])
        elif tag in ("strong", "b", "em") and self.buf is not None:
            # Medium splits one run into <em>a</em><em>b</em>; rejoin it.
            if self.buf and self.buf[-1] == CLOSE[tag]:
                self.buf.pop()
            else:
                self.buf.append(OPEN[tag])
        elif tag == "a" and self.buf is not None:
            self.href = a.get("href")
            self.buf.append("[")
        elif tag == "br" and self.buf is not None:
            self.buf.append("<br>")
        elif tag == "img":
            src = a.get("src", "")
            if "/_/stat" in src or a.get("width") == "1":
                return
            self.img = src
            self.blocks().append(("img", src, ""))

    def handle_endtag(self, tag):
        if tag in ("strong", "b", "em") and self.buf is not None:
            self.buf.append(CLOSE[tag])
        elif tag == "a" and self.buf is not None:
            self.buf.append(f"]({self.href})")
            self.href = None
        elif tag in ("ul", "ol"):
            self.list_stack.pop()
        elif tag == self.block:
            text = tidy("".join(self.buf))
            self.buf, self.block = None, None
            if not text:
                return
            if tag == "h3":
                self.sections.append([strip_marks(text), []])
            elif tag == "h4":
                self.blocks().append(("h4", strip_marks(text)))
            elif tag == "figcaption":
                kind, src, _ = self.blocks()[-1]
                self.blocks()[-1] = (kind, src, strip_marks(re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)))
            elif tag == "li":
                kind, n = self.list_stack[-1]
                self.blocks().append(("li", f"{n}. " if kind == "ol" else "- ", text))
            else:
                self.blocks().append((tag, text))
        if tag == "hr":
            pass

    def handle_data(self, data):
        if self.buf is not None:
            self.buf.append(data)


# Emphasis is collected as sentinels so it can be repaired before it becomes * / **.
OPEN = {"em": "\x01", "strong": "\x03", "b": "\x03"}
CLOSE = {"em": "\x02", "strong": "\x04", "b": "\x04"}
MARK = {"\x01": "*", "\x02": "*", "\x03": "**", "\x04": "**"}


def tidy(s):
    s = s.replace("\u200a", " ").replace("\xa0", " ").replace("<br>", "\n")
    s = re.sub(r"[^\S\n]+", " ", s)
    s = re.sub(r" ?\n ?", "\n", s)
    # Keep spaces outside the marks: "*Dieter Rams *" -> "*Dieter Rams* ".
    for _ in range(3):
        s = re.sub(r"([\x01\x03])([ \n]+)", r"\2\1", s)
        s = re.sub(r"([ \n]+)([\x02\x04])", r"\2\1", s)
    # Emphasis can't span a line break: close it before, reopen after.
    out, open_ = [], []
    for ch in s:
        if ch in "\x01\x03":
            open_.append(ch)
        elif ch in "\x02\x04" and open_:
            open_.pop()
        elif ch == "\n" and open_:
            out.extend(chr(ord(m) + 1) for m in reversed(open_))
            out.append(ch)
            out.extend(open_)
            continue
        out.append(ch)
    s = "".join(out)
    s = re.sub(r"\x01\x02|\x03\x04", "", s)
    s = re.sub(r"[\x01-\x04]", lambda m: MARK[m.group(0)], s)
    return s.strip(" \n")


def strip_marks(s):
    return re.sub(r"\*+", "", s).strip()


def render(blocks):
    out, prev = [], None
    for b in blocks:
        kind = b[0]
        if kind == "li":
            line = b[1] + b[2]
            if prev == "li":
                out[-1] += "\n" + line
            else:
                out.append(line)
        elif kind == "img":
            out.append(f"![{b[2]}]({b[1]})")
        elif kind == "h4":
            out.append("#### " + b[1])
        elif kind == "blockquote":
            out.append("> " + b[1])
        else:
            out.append(b[1])
        prev = kind
    return "\n\n".join(out)


def download(url, dest_dir, n):
    os.makedirs(dest_dir, exist_ok=True)
    # Reuse an earlier download; Medium's CDN rate-limits repeat fetches.
    for f in os.listdir(dest_dir):
        if f.startswith(f"{n:02d}."):
            return f
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data, ctype = r.read(), r.headers.get_content_type()
            break
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 5:
                raise
            time.sleep(5)
    ext = {"image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/webp": "webp"}.get(ctype, "png")
    name = f"{n:02d}.{ext}"
    with open(os.path.join(dest_dir, name), "wb") as f:
        f.write(data)
    return name


feed = open(feed_path, encoding="utf8").read()
articles = []
for item in re.findall(r"<item>(.*?)</item>", feed, re.S):
    title = html.unescape(re.search(r"<title><!\[CDATA\[(.*?)\]\]>", item, re.S).group(1)).strip()
    link = re.search(r"<link>(.*?)</link>", item).group(1).split("?")[0]
    post_id = link.rsplit("-", 1)[1]
    slug, kind, desc = POSTS[post_id]
    date = parsedate_to_datetime(re.search(r"<pubDate>(.*?)</pubDate>", item).group(1))
    body = re.search(r"<content:encoded><!\[CDATA\[(.*?)\]\]>", item, re.S).group(1)
    body = re.split(r"<img src=\"https://medium.com/_/stat", body)[0]  # drop pixel + RSS footer

    conv = Converter()
    conv.feed(body)
    sections = [s for s in conv.sections if s[1] or s[0]]

    # Localise images.
    n = 0
    img_dir = os.path.join(repo, "public", "articles", slug)
    for s in sections:
        for i, b in enumerate(s[1]):
            if b[0] == "img":
                n += 1
                try:
                    name = download(b[1], img_dir, n)
                    s[1][i] = ("img", f"/articles/{slug}/{name}", b[2])
                except urllib.error.HTTPError as e:
                    print("kept remote", b[1], e.code)  # rerun later to localise

    # The post often opens with an h3 that repeats the title; the hero already shows it.
    def words(t):
        return set(re.findall(r"[a-z]+", t.lower()))
    if sections and sections[0][0] is None and not sections[0][1]:
        sections.pop(0)
    if sections and sections[0][0] and len(words(sections[0][0]) & words(title)) >= 0.6 * len(words(title)):
        sections[0][0] = None
    content = []
    for heading, blocks in sections:
        text = render(blocks)
        if heading is None:
            heading = "Introduction"
        if not text:
            continue
        content.append({"section": heading, "body": text})

    articles.append({
        "slug": slug,
        "title": TITLES.get(slug, title.rstrip(". ")),
        "type": kind,
        "heroDescription": desc,
        "meta": [
            {"label": "Published", "value": date.strftime("%B %Y").replace(" 0", " ")},
            {"label": "Originally on", "value": "Medium"},
        ],
        "source": link,
        "content": content,
    })

out = os.path.join(repo, "src", "data", "articles.js")
with open(out, "w", encoding="utf8", newline="\n") as f:
    f.write("// Imported from Medium (RSS feed) so the writing lives on this site.\n")
    f.write("// Images are copied into /public/articles/<slug>/.\n")
    f.write("export const articlesData = ")
    f.write(json.dumps(articles, indent=2, ensure_ascii=False))
    f.write(";\n")
print("wrote", out, len(articles), "articles")
