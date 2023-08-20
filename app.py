import markdown

VERSION = "v0.1.1"

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
    <a href="/info">info</a> | <a href="https://github.com/theyoyojo/game">source</a> <p id="version">%(version)s</p>
    <hr />
    %(content)s
  </body>
</html>
""".strip()

GAME_HTML="""
    <div id="game">
      <div id="numbers">
        <table>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Coins</td>
            <td id="tab_coins">DEADBEEF</td>
          </tr>
          <tr>
            <td>Ticks</td>
            <td id="tab_ticks">DEADBEEF</td>
          </tr>
          <tr>
            <td>Pickpockets</td>
            <td id="tab_ppkts">DEADBEEF</td>
          </tr>
          <tr>
            <td>Muggers</td>
            <td id="tab_mugrs">DEADBEEF</td>
          </tr>
          <tr>
            <td>Home Invaders</td>
            <td id="tab_hinvs">DEADBEEF</td>
          </tr>
          <tr>
            <td>Carjackers</td>
            <td id="tab_cjcks">DEADBEEF</td>
          </tr>
          <tr>
            <td>Bank Robbers</td>
            <td id="tab_robrs">DEADBEEF</td>
          </tr>
          <tr>
            <td>Mail Fraudsters</td>
            <td id="tab_mafrs">DEADBEEF</td>
          </tr>
          <tr>
            <td>Crypto Scammers</td>
            <td id="tab_cscms">DEADBEEF</td>
          </tr>
          <tr>
            <td>Darknet Moguls</td>
            <td id="tab_dmogs">DEADBEEF</td>
          </tr>
          <tr>
            <td>High Seas Pirates</td>
            <td id="tab_hisps">DEADBEEF</td>
          </tr>
          <tr>
            <td>Investment Bankers</td>
            <td id="tab_ibers">DEADBEEF</td>
          </tr>
        </table>
      </div>
      <div id="actions">
        <button onclick="steal()"               id="bt_steal">Steal</button>
        <button onclick="buy_pickpocket()"      id="bt_ppkts">PICKPOCKET</button>
        <button onclick="buy_mugger()"          id="bt_mugrs">MUGGER</button>
        <button onclick="buy_home_invader()"    id="bt_hinvs">HOME INVADER</button>
        <button onclick="buy_carjacker()"       id="bt_cjcks">CARJACKER</button>
        <button onclick="buy_bank_robber()"     id="bt_robrs">BANK ROBBERS</button>
        <button onclick="buy_mail_fraudster()"  id="bt_mafrs">MAIL FRAUDSTERS</button>
        <button onclick="buy_crypto_scammer()"  id="bt_cscms">CRYPTO SCAMMERS</button>
        <button onclick="buy_darknet_mogul()"  id="bt_dmogs">DARKNET MOGULS</button>
        <button onclick="buy_high_seas_pirate()" id="bt_hisps">HIGH SEAS PIRATES</button>
        <button onclick="buy_investment_banker()" id="bt_ibers">INVESTMENT BANKERS</button>
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
