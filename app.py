import markdown

VERSION = "v0.1.2"

FRAME="""
<!DOCTYPE html />
<html>
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
      <div id="numbers">
      </div>
      <div id="actions">
      </div>
    </div>
    <div id="bonus">
      <div id="boost">
        <button onclick="do_boost()">Boost tick speed</button>
        <progress id="boost_bar" value="0" max="100" title="boost"/></progress>
        <p id="boost_info">BOOSTINFO</p>
      </div>
    </div>
  <script src="/data/include.js" /></script>
""".strip()

def application(env, SR):
    path_info = env.get("PATH_INFO", "/")
    SR('200 OK', [('Content-Type', 'text/html')])
    if path_info == "/info":
        content = ""
        with open("README.md", "r") as f:
            content += markdown.markdown(f.read())
        return bytes(FRAME % {"version": VERSION, "content": content}, "UTF-8")
    return bytes(FRAME % {"version": VERSION, "content": GAME_HTML}, "UTF-8")
