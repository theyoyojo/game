#!/usr/bin/env python

import markdown

from orbit import appver, messageblock, ROOT, VERSION

VERSION = "v0.2.3"

FRAME="""
<!DOCTYPE html />
<html>

  %(header)s

  <head>
    <link rel="stylesheet" type="text/css" href="/data/style.css" />
  </head>
  <body>
    <div id="header">
      <a href="/"><img id="logo" src="/data/US.png" /></a>
      <h1 id="title">Underground Software Clicker</h1>
      <br />
    </div>
    <hr />
      <a href="/info">info</a> |
      <a href="https://github.com/theyoyojo/game">source</a> |
      <p id="reset"><a href="#" onclick="reset()">reset</a></p> |
      <p id="save"><a href="#" onclick="save()">save</a></p>
      <p id="saved"></p>
    <p id="version">%(version)s</p>
    <hr />
    %(content)s
  </body>
</html>
""".strip()

GAME_HTML="""
    <div id="game">
      <div id="nav">
      </div>
      <div id="panels">
        <div id="numbers">
          (empty)
        </div>
        <div id="actions">
          (empty)
        </div>
      </div>
    </div>
    <div id="bonus">
      <div id="boost">
        <button onclick="do_boost()">Boost tick speed</button>
        <progress id="boost_bar" value="0" max="100" title="boost"/></progress>
        <p id="boost_info">BOOSTINFO</p>
      </div>
    </div>
    <div id="footer">
      <textarea id="msgs" readonly>WELCOME TO UNDERGROUND SOFTWARE\n</textarea>
    </div>
  <script src="/data/include.js" /></script>

  %(footer)s
""".strip()

def application(env, SR):
    path_info = env.get("PATH_INFO", "/")
    SR('200 OK', [('Content-Type', 'text/html')])

    page_parts = {
        "version":  VERSION,
        "content":  GAME_HTML,
        "header":   ROOT + '/data/header',
        "footer":   messageblock([('appver', appver())])
    }

    if path_info == "/info":
        with open("README.md", "r") as f:
            page_parts['content'] = markdown.markdown(f.read())
        return bytes(FRAME % page_parts, "UTF-8")
    return bytes(FRAME % page_parts, "UTF-8")
