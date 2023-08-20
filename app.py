HTML="""
<!DOCTYPE html />
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="/data/style.css" />
  </head>
  <body>
    <div id="header">
      <img src="/data/US.png" />
      <h1>Underground Software Clicker</h1>
      <br />
    </div>
    <hr />
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
        </table>
      </div>
      <div id="actions">
        <button onclick="increment_coins()" id="bt_gutter">Search Gutter</button>
        <button onclick="buy_pickpocket()" id="bt_ppkt">Buy Pickpocket for 10 coins</button>
      </div>
    </div>
  <script src="/data/include.js" /></script>
  </body>
</html>
""".strip()

def application(env, SR):
    game = bytes(HTML, "UTF-8")
    SR('200 OK', [('Content-Type', 'text/html')])
    return game
