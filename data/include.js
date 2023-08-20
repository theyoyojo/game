/*
 * Underground Software Clicker
 *
 * (C) 2023 Joel Savitz <joelsavitz@gmail.com>
 *
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function saved_animation(msg) {
	e = document.getElementById("saved")
	e.innerHTML = msg
	e.style.color = "black"
	for (i = 0; i < 2560; i++) {
		e = document.getElementById("saved")
		e.style.color = "rgb(" + i + "," + i + "," + i + ")"
		await sleep(10)
	}

	e = document.getElementById("saved")
	e.innerHTML = ""
}

function save() {
	document.cookie = "save=" + JSON.stringify(Game)
	saved_animation("saved!")
	stdout("Game Saved At: " + Date())
}

var cookie_regex = new RegExp('(?:^|; )save=([^;]*)(?:$|; )');
function load() {
	match = document.cookie.match(cookie_regex)
	if (!match)
		return
	raw = decodeURIComponent(match[1])

	Game = JSON.parse(raw)
	saved_animation("loaded!")
}

// write to the output area in the footer
function stdout(msg) {
	out = document.getElementById("msgs")
	out.innerHTML += msg + "\n"
}

function reset() {
	for (item in Game)
		Game[item].value = 0.0
	saved = document.getElementById("saved")
	saved.innerHTML = ""
	update_screen()
}

function tr(first, second, attrs="", h=false) {
	tag = "td"
	if (h)
		tag = "th"
	o = "<" + tag + ">"
	// only the second gets attrs
	oa = "<" + tag + " " + attrs + ">"
	c = "</" + tag + ">\n"
	res = "<tr>\n" + o + first + c + oa + second + c + "</tr>\n"
	return res
}

// locations
var LOC_CRIME = 0
var LOC_GAMBL = 1

// The Game structure is the state of the game at any given time.
// This initial state is the state of a new game.
// rate := per-tick dollar earnings
// bcost := base cost, price of first item
// scheme: from level n to n+1, rate goes up by 5 as bcost goes up by 10
Game = {
	progress: {gambling: 0},
	location_: LOC_CRIME,
	coins: {name: "Coins",		value:0.0, 	id: "tab_coins"},
	chips: {name: "Chips",		value:0.0, 	id: "tab_chips"},
	income:{name :"Income/Tick",value:0.0,	id: "tab_income"},
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

function game_table() {
	content = "<table>\n"
	content += tr("Key", "Value", attrs="", h=true)
	content += tr(Game.coins.name, Game.coins.value, attrs=' id="' + Game.coins.id + '" ')
	content += tr(Game.chips.name, Game.chips.value, attrs=' id="' + Game.chips.id + '" ')
	content += tr(Game.income.name, Game.income.value, attrs=' id="' + Game.income.id + '" ')
	content += tr(Game.ticks.name, Game.ticks.value, attrs=' id="' + Game.ticks.id + '" ')
	for (key of producers) {
		content += tr(Game[key].name, "BEEF" + Game[key].value, attrs=" id=\"" + Game[key].id + "\" ")
	}
	content += "</table>\n"
	return content
}

function make_nav() {
	if (Game.progress.gambling <= 0)
		return ""

	return '<p>Rooms: <a href="#" onclick="goto_crime()">Crime</a> | <a href="#" onclick="goto_gambling()">Gambling</a></p><hr /><br />'
}

function button(action, id, text) {
	return '<button onclick="' + action + ';" id="' + id + '">' + text + '</button>\n'
}

function crime_buttons() {
	content = ""
	content += button("steal()", "bt_steal", "Steal")

	for (key of producers)
		content += button("try_buy('" + Game[key].id.slice(4) + "')", "bt_" + key, "DEAD" + Game[key].name)

	return content
}

// dice game :)
// sum is 7: 10 chips, else none
function dice() {
	if (!modify_coins(-1e6)) {
		stdout("failed to spend " + x + " coins.")
		return
	}

	update_screen()

	d6_1 = Math.floor(Math.random() * 6)
	d6_2 = Math.floor(Math.random() * 6)
	msg  = "ROLL:\n=====\n"
	msg += "d6_1: " + d6_1 + "\n"
	msg += "d6_2: " + d6_2 + "\n"
	win = d6_1 + d6_2 === 7
	msg += d6_1 + " + " + d6_2 + (win ? "=" : "!=") + " 7 " + (win ? ":)" : ":(") + "\n"

	if (win) {
		Game.chips.value += 10
		update_screen()
	}

	output = document.getElementById("gambling_outcomes")
	output.innerHTML += msg
}

function gambling_buttons() {
	content = ""

	content += '<textarea id="gambling_outcomes" readonly></textarea>\n'
	content += button("dice()", "bt_dice", "Roll for 1e6 coins")

	return content
}

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

function button_text(item) {
	e = Game[item]
	return "Buy " + e.name + " (" + rate_check(item) + " coin/t) for " + price_check(item) + " coins"
}

function update_screen_crime() {
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

function update_screen_gambling() {
	// no-op for now
}

function update_screen() {

	// update values of main Game items
	for (const item in Game) {
		target = document.getElementById(Game[item].id)
		if (target)
			target.innerHTML = fixnumber(Game[item].value)
	}

	if (Game.location_ === LOC_CRIME)
		update_screen_crime()
	else if (Game.location_ === LOC_GAMBL)
		update_screen_gambling()

	boost_info = document.getElementById("boost_info")
	boost_info.innerHTML = get_tick_duration() + " ms"
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

	// income reflects this calculation
	Game.income.value = earned
	Game.coins.value += earned
}

boost = 0
boost_decay = 0
function do_boost() {
	if (boost < 100)
		boost++

	boost_decay = 0

	bar = document.getElementById("boost_bar")
	bar.value = boost

	update_screen()
}

function decay_boost() {
	if (boost > 0)
		boost -= boost_decay
		boost_decay++

	if (boost < 0)
		boost = 0

	bar = document.getElementById("boost_bar")
	bar.value = boost
}

function get_tick_duration() {
	return fixnumber(1000 - (900 * (boost/100)))

}

function check_progress() {
	if (Game.coins.value > 10 ** 6 && Game.progress.gambling < 1) {
		Game.progress.gambling = 1
		nav = document.getElementById("nav")
		nav.innerHTML = make_nav()
	}
}

// This main game loop runs forever on page load.
async function tick_loop() {
	for (;;) {
		Game.ticks.value++
		earn_coins_for_tick()
		update_screen()
		decay_boost()
		check_progress()
		await sleep(get_tick_duration())
	}
}

function goto_crime() {
	Game.location_ = LOC_CRIME

	nav = document.getElementById("nav")
	nav.innerHTML = make_nav()

	// put the main game data table in the numbers section on the left
	table = document.getElementById("numbers")
	table.innerHTML = game_table()

	buttons = document.getElementById("actions")
	buttons.innerHTML = crime_buttons()

	update_screen()
}

function goto_gambling() {
	Game.location_ = LOC_GAMBL

	nav = document.getElementById("nav")
	nav.innerHTML = make_nav()

	// put the main game data table in the numbers section on the left
	table = document.getElementById("numbers")
	table.innerHTML = game_table()

	buttons = document.getElementById("actions")
	buttons.innerHTML = gambling_buttons()

	update_screen()
}

function init() {
	// initially, no other rooms are visible besides crime
	load()
	goto_crime()
	update_screen()
	tick_loop()
}

init()
