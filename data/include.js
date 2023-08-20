/*
 * Underground Software Clicker
 *
 * (C) 2023 Joel Savitz <joelsavitz@gmail.com>
 *
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// The Game structure is the state of the game at any given time.
// This initial state is the state of a new game.
// rate := per-tick dollar earnings
// bcost := base cost, price of first item
// scheme: from level n to n+1, rate goes up by 5 as bcost goes up by 10
Game = {
	coins: {name: "Coins",		value:0.0, 	id: "tab_coins"},
	ticks: {name: "Ticks",		value:0, 	id: "tab_ticks"},
	// ppkts := pickpockets
	ppkts: {name: "Pickpockets",	value:0, 	id: "tab_ppkts", 	rate: 5 ** 0,	bcost: 10 ** 1},
	// mugs := muggers
	mugrs: {name: "Muggers",	value:0, 	id: "tab_mugrs",	rate: 5 ** 1,	bcost: 10 ** 2},
	// hinvs := home invaders
	hinvs: {name: "Home Invaders",	value:0, 	id: "tab_hinvs",	rate: 5 ** 2,	bcost: 10 ** 3},
	// cjcks := car jackers
	cjcks: {name: "Car Jackers",	value:0,	id: "tab_cjcks",	rate: 5 ** 3,	bcost: 10 ** 4},
	// robrs := bank robbers
	robrs: {name: "Bank Robbers", 	value:0,	id: "tab_robrs",	rate: 5 ** 4,	bcost: 10 ** 5},
	// mafrs := mail fraudsters
	mafrs: {name: "Mail Fraudsters",value:0, 	id: "tab_mafrs",	rate: 5 ** 5, 	bcost: 10 ** 6},
	// cscms := crypto scammers
	cscms: {name: "Crypto Scammers",value:0,	id: "tab_cscms",	rate: 5 ** 6,	bcost: 10 ** 7},
	// dmogs := darknet moguls
	dmogs: {name: "Darknet Moguls",	value:0,	id: "tab_dmogs",	rate: 5 ** 7,	bcost: 10 ** 8},
	// hisps := high seas pirates
	hisps: {name: "High Seas Pirates",value:0,	id: "tab_hisps",	rate: 5 ** 8,	bcost: 10 ** 9},
	// ibers := investment bankers
	ibers: {name: "Investment Bankers",value:0, 	id: "tab_ibers",	rate: 5 ** 9,	bcost: 10 ** 10},
}

// producers array is used to determine where to apply actions on all money-producing entities,
// e.g. updating buttons, earning coins
producers = ["ppkts", "mugrs", "hinvs", "cjcks", "robrs", "mafrs", "cscms", "dmogs", "hisps", "ibers"]

function fixnumber(n) {
	// get rid of extra bits after second decimal place
	if (n % 1)
		n = Math.round(n * 100)/100

	// no really big numbers, where really big means log10(x) > 5
	if (Math.log10(n) > 5)
		n = n.toExponential(3)

	return n
}

function price_check(item) {
	entry = Game[item]
	if (entry === null)
		return -1.0

	// for now we just scale cost by 2.5 per item purchased
	res = fixnumber(entry.bcost * (2.5 ** entry.value))

	return res
}


function rate_check(item) {
	return fixnumber(Game[item].rate)
}

function try_buy(item) {
	if (modify_coins(-1 * price_check(item)))
		Game[item].value++
	update_screen()
}

function buy_pickpocket() 	{try_buy("ppkts")}
function buy_mugger() 		{try_buy("mugrs")}
function buy_home_invader() 	{try_buy("hinvs")}
function buy_carjacker() 	{try_buy("cjcks")}
function buy_bank_robber() 	{try_buy("robrs")}
function buy_mail_fraudster() 	{try_buy("mafrs")}
function buy_crypto_scammer() 	{try_buy("cscms")}
function buy_darknet_mogul() 	{try_buy("dmogs")}
function buy_high_seas_pirate() {try_buy("hisps")}
function buy_investment_banker(){try_buy("ibers")}

function button_text(item) {
	e = Game[item]
	return "Buy " + e.name + " (" + rate_check(item) + " coin/s) for " + price_check(item) + " coins"
}

function update_screen() {
	// update values of main Game items
	for (const item in Game) {
		target = document.getElementById(Game[item].id)
		target.innerHTML = fixnumber(Game[item].value)
	}

	for (key of producers) {
		btname = "bt_" + key
		bt = document.getElementById(btname)
		bt.innerHTML = button_text(key)
		if (price_check(key) > Game.coins.value)
			bt.disabled = "true"
		else
			bt.disabled = ""
	}
}

// don't allow coins to fall below 0
function modify_coins(x) {
	if (Game.coins.value + x < 0)
		return false

	Game.coins.value += x
	return true
}


// rob from the poor and give to the rich
function steal() {
	modify_coins(1)
	update_screen()
}

function earn_coins_for_tick() {
	earned = 0

	// earn the per-tick rate of each producer for each tier
	for (key of producers)
		earned += Game[key].value * Game[key].rate

	Game.coins.value += earned
}

// This main game loop runs forever on page load.
async function tick_loop() {
	for (;;) {
		Game.ticks.value++
		earn_coins_for_tick()
		update_screen()
		await sleep(1000)
	}
}

function init() {
	update_screen()
	tick_loop()
}

init()
