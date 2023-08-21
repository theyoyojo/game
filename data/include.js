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
		await sleep(10/amphetamines)
	}

	e = document.getElementById("saved")
	e.innerHTML = ""
}

function save() {
	document.cookie = "save=" + JSON.stringify(Game)
	saved_animation("saved!")
	stdout("Game Saved At: " + Date())

	update_screen()
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
var LOC_CRIME = 0 // crime
var LOC_GAMBL = 1 // gambling
var LOC_USURY = 2 // Usury
var LOC_BHCKG = 3 // Biohacking

Rooms = {
	crime: {name: "Crime", 		id: LOC_CRIME,	go: "goto_crime()"},
	gambl: {name: "Gambling", 	id: LOC_GAMBL,	go: "goto_gambling()"},
	usury: {name: "Usury", 		id: LOC_USURY,	go: "goto_usury()"},
	bhckg: {name: "Biohacking",	id: LOC_BHCKG,	go: "goto_biohacking()"},
}

rooms = ['crime', 'gambl', 'usury', 'bhckg']

function get_room_by_id(id) {
	for (key of rooms) {
		if (Rooms[key].id === id)
			return key
	}

	return null
}

// The Game structure is the state of the game at any given time.
// This initial state is the state of a new game.
// rate := per-tick dollar earnings
// bcost := base cost, price of first item
// scheme: from level n to n+1, rate goes up by 5 as bcost goes up by 10
// TODO: versioning of saves
Game = {
	progress: {gambling: 0, biohacking: 0, usury: 0},
	location_: LOC_GAMBL,
	coins: {name: "Coins",		value:0.0, 	id: "tab_coins"},
	chips: {name: "Chips",		value:0.0, 	id: "tab_chips"},
	// need extra space to get cut off since Luck is already plural for Luck (not quantifiable)
	luck: {name: "Luck ",		value:1.0, 	id: "tab_luck",		rate: 0.001, 	bcost: 50, 	curr: "chips"},
	blessing: {name: "Blessing",	value:1, 	id: "tab_blessing"},
	income:{name :"Income/Tick",	value:0.0,	id: "tab_income"},
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

function crime_table() {
	content = "<table>\n"
	content += tr("Key", "Value", attrs="", h=true)
	content += tr(Game.coins.name, 	Game.coins.value, 	attrs=' id="' + Game.coins.id + '" ')
	content += tr(Game.chips.name, 	Game.chips.value, 	attrs=' id="' + Game.chips.id + '" ')
	content += tr(Game.income.name, Game.income.value, 	attrs=' id="' + Game.income.id + '" ')
	content += tr(Game.ticks.name, 	Game.ticks.value, 	attrs=' id="' + Game.ticks.id + '" ')
	for (key of producers) {
		content += tr(Game[key].name, "BEEF" + Game[key].value, attrs=" id=\"" + Game[key].id + "\" ")
	}
	content += "</table>\n"
	return content
}


function biohacking_table() {
	content = "<table>\n"
	content += tr("Key", "Value", attrs="", h=true)

	content += tr(Game.coins.name, 	Game.coins.value, 	attrs=' id="' + Game.coins.id + '" ')
	content += tr(Game.chips.name, 	Game.chips.value, 	attrs=' id="' + Game.chips.id + '" ')
	content += tr(Game.income.name, Game.income.value, 	attrs=' id="' + Game.income.id + '" ')
	content += tr(Game.ticks.name, 	Game.ticks.value, 	attrs=' id="' + Game.ticks.id + '" ')
	content += tr(Game.luck.name, 	Game.luck.value, 	attrs=' id="' + Game.luck.id + '" ')
	content += tr(Game.blessing.name, Game.blessing.value, 	attrs=' id="' + Game.blessing.id + '" ')

	content += "</table>\n"
	return content
}

function room_goto_button(loc) {
	return '<a href="#" onclick="' + Rooms[get_room_by_id(loc)].go + ';">' + Rooms[get_room_by_id(loc)].name + '</a>'
}

function make_nav() {
	if (Game.progress.gambling <= 0)
		return ""

	nav = '<p>Rooms: ' + room_goto_button(LOC_CRIME) + ' | ' + room_goto_button(LOC_GAMBL)

	if (Game.progress.biohacking)
		nav += ' | ' + room_goto_button(LOC_BHCKG)

	if (Game.progress.usury)
		nav += ' | ' + room_goto_button(LOC_USURY)

	return nav + '</p><hr /><br />'

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

function get_slot_frame(n, a, b, c) {

	msg = "SLOTS:\n"
	// + 2 for newlines
	for (i = 0; i < 25 * 3 + 2; i++) {
		if (i < 25) {
			if (i === n || i - 2 % 25 == n)
				msg += 'O'
			else
				msg += 'o'
		} else if (i > 51) {
			// -2 for each newline
			if (i == n || i - 2 % 25 === n)
				msg +=  'O'
			else
				msg += 'o'
		} else if (i === 25 || i === 51) {
			msg += '\n'
		} else if (i > 25 && i < 31) {
			msg += '>'
		} else if ((i > 30 && i < 36) || (i > 40 && i < 46) || (i === 37) || (i === 39)) {
			msg += ' '
		} else if (i > 45 && i < 51) {
			msg += '<'
		} else if (i === 36) { // frame a
			if (n > 24)
				msg += a
			else
				msg += '_'
		} else if (i === 38) { // frame b
			if (n > 49)
				msg += b
			else
				msg += '_'
		} else if (i === 40) { // frame c
			if (n > 74)
				msg += c
			else
				msg += '_'
		} else {
			stdout("ERROR!!!! i = " + i)
		}

	}

	return msg + "\n"
}


async function slots(cheat=false) {
	if (!modify_chips(-1)) {
		stdout("failed to spend a chip.")
		return
	}

	stdout("You play slots...")

	update_screen()

	a = Math.floor(Math.random() * 10)
	b = Math.floor(Math.random() * 10)
	c = Math.floor(Math.random() * 10)

	if (cheat)
		a = b = c = 7

	// dubs: +2
	// trips +100
	// any 7:+ 20
	dub = false
	trip = false
	sevens = 0
	if (a === b) {
		dub = true
		if (b == c) {
			trip = true
		}
	} else  {
		if (a === c || a === b || b == c)
			dub = true
	}

	if (a === 7)
		sevens++
	if (b === 7)
		sevens++
	if (c === 7)
		sevens++

	winnings = (dub ? (trip ? 100 : 2) + 20 * sevens : 0)
	if (trip)
		stdout("JACKPOT! You win 100 chips")
	else if (dub)
		stdout("Doubles! You win 2 chips")

	if (sevens > 0)
		stdout("Wow! " + sevens + " sevens! You win " + 20 * sevens + " chips")

	Game.chips.value += winnings

	for (f = 0; f < 25 * 3 + 2 + 1; f++) {
		output = document.getElementById("gambling_outcomes")
		output.innerHTML = get_slot_frame(f, a, b, c)

		await sleep(30)
	}
}

// dice game :)
// sum is 7: 10 chips, else none
function dice() {
	if (!modify_coins(-1e6)) {
		stdout("failed to spend 1e6 coins.")
		return
	}

	stdout("You roll the dice...")

	update_screen()

	d6_1 = Math.floor(Math.random() * 6) + 1
	d6_2 = Math.floor(Math.random() * 6) + 1
	msg  = "ROLL:\n=====\n"
	msg += "d6_1: " + d6_1 + "\n"
	msg += "d6_2: " + d6_2 + "\n"
	win = d6_1 + d6_2 === 7
	msg += d6_1 + " + " + d6_2 + (win ? " =" : " !=") + " 7 " + (win ? ":)" : ":(") + "\n"

	if (win) {
		Game.chips.value += 10
		stdout("You win 10 chips!")
	}

	output = document.getElementById("gambling_outcomes")
	output.innerHTML += msg

	update_screen()
}

function gambling_buttons() {
	content = ""

	content += '<textarea id="gambling_outcomes" readonly></textarea>\n'
	content += button("dice()", "bt_dice", "Roll dice for 1e6 coins")
	// at level 2 we get slot
	if (Game.progress.gambling >= 2)
		content += button("slots()", "bt_slots", "Play slots for 1 chip")


	return content
}

function usury_left() {
	return '<p>(empty left)</p>'
}

function usury_right() {
	return '<p>(empty right)</p>'
}

function try_buy_luck() {
	if (!modify_chips(-1 * price_check("luck"))) {
		stdout("failed to spend " + price_check("luck") + " chips.")
		return
	}

	Game.luck.value += Game.luck.rate
	stdout("increase luck by " + fixnumber(Game.luck.rate, prec=3) + " to " + fixnumber(Game.luck.value, prec=3))

	update_screen()
}

function biohacking_right() {
	content = ""
	content += button("try_buy_luck();", "bt_luck", "DEAD" + Game["luck"].name)

	return content
}

function fixnumber(n, prec=2) {
	// get rid of extra bits after 2nd decimal place (by default 2 but  use prec=n to change to nth)
	if (n % 1)
		n = Math.round(n * (10 ** prec))/(10 ** prec)

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


function rate_check(item, prec=2) {
	return fixnumber(Game[item].rate, prec=prec)
}

function rate_check_str(item, prec=2) {
	if (Game[item].curr)
		return "(increase by " + rate_check(item, prec=prec) + ")"
	else
		return "(" + rate_check(item, prec=prec) + " coins/t)"
}

function singular(item) {
	return Game[item].name.slice(0, Game[item].name.length-1)
}

function try_buy(item) {
	if (modify_coins(-1 * price_check(item)))
		Game[item].value++
	stdout("Bought one " + singular(item))
	update_screen()
}

function button_text(item, prec=2) {
	curr = 'coins'

	if (Game[item].curr)
		curr = Game[item].curr

	return "Buy " + singular(item)+ " " + rate_check_str(item, prec=prec) + " for " + price_check(item) + " " + curr
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
	textarea = document.getElementById("gambling_outcomes")
	textarea.scrollTop = textarea.scrollHeight;

}
function update_screen_biohacking() {
	btname = "bt_luck"
	bt = document.getElementById(btname)
	bt.innerHTML = button_text("luck", prec=3)
	if (price_check("luck") > Game.chips.value)
		bt.disabled = "true"
	else
		bt.disabled = ""
}

function update_screen_usury() {

}

function update_screen() {

	// update values of main Game items
	for (const item in Game) {
		target = document.getElementById(Game[item].id)
		if (target)
			target.innerHTML = fixnumber(Game[item].value, prec=3)
	}

	if (Game.location_ === LOC_CRIME)
		update_screen_crime()
	else if (Game.location_ === LOC_GAMBL)
		update_screen_gambling()
	else if (Game.location_ === LOC_BHCKG)
		update_screen_biohacking()
	else if (Game.location_ === LOC_USURY)
		update_screen_sury()

	boost_info = document.getElementById("boost_info")
	boost_info.innerHTML = get_tick_duration() + " ms"

	textarea = document.getElementById("msgs")
	textarea.scrollTop = textarea.scrollHeight;
}

// don't allow coins to fall below 0
function modify_coins(x) {
	if (Game.coins.value + x < 0)
		return false

	Game.coins.value += x
	return true
}

function modify_chips(x) {
	if (Game.chips.value + x < 0)
		return false

	Game.chips.value += x
	return true
}


// rob from the poor and give to the rich
function steal() {
	modify_coins(1)
	update_screen()
	stdout("You steal a coin.")
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

function accumulate_blessing() {
	Game.blessing.value *= Game.luck.value
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
	if (amphetamines > 99)
		return

	if (boost > 0) {
		boost -= boost_decay
		boost_decay++
	}

	if (boost < 0)
		boost = 0

	bar = document.getElementById("boost_bar")
	bar.value = boost
}

function get_tick_duration() {
	return fixnumber(1000 - (900 * (boost/100)))/amphetamines
}

function check_progress() {
	// Unlock gambling at 1 million coins
	if (Game.coins.value > 1e6 && Game.progress.gambling < 1) {
		Game.progress.gambling = 1
		nav = document.getElementById("nav")
		nav.innerHTML = make_nav()
		stdout("UNLOCKED: The Gambling Room -- Dice Game")
	}
	
	// Unlock slots at 100 chips
	if (Game.chips.value > 100 && Game.progress.gambling < 2) {
		Game.progress.gambling = 2
		nav = document.getElementById("nav")
		nav.innerHTML = make_nav()
		stdout("UNLOCKED: The Gambling Room -- Slot Machine")
		// if we are already in gambling, we need to reload to get the button
		if (Game.location_ === LOC_GAMBL)
			goto_gambling()
		// however, we we are somewhere else, wait to load when we go to the room
	}
	// Unlock biohacking at 200 chips
	if (Game.chips.value > 200 && Game.progress.biohacking < 1) {
		Game.progress.biohacking = 1
		nav = document.getElementById("nav")
		nav.innerHTML = make_nav()
		stdout("UNLOCKED: Biohacking")
	}

	// Unlock usury at 1000 chips
	if (Game.chips.value > 1000 && Game.progress.usury < 1) {
		Game.progress.usury = 1
		nav = document.getElementById("nav")
		nav.innerHTML = make_nav()
		stdout("UNLOCKED: Usury")
	}
}

// This main game loop runs forever on page load.
async function tick_loop() {
	for (;;) {
		Game.ticks.value++
		earn_coins_for_tick()
		accumulate_blessing()
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
	table.innerHTML = crime_table()

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
	table.innerHTML = crime_table()

	buttons = document.getElementById("actions")
	buttons.innerHTML = gambling_buttons()

	update_screen()
}

function goto_usury() {
	Game.location_ = LOC_USURY

	nav = document.getElementById("nav")
	nav.innerHTML = make_nav()

	// put the main game data table in the numbers section on the left
	table = document.getElementById("numbers")
	table.innerHTML = usury_left()

	buttons = document.getElementById("actions")
	buttons.innerHTML = usury_right()

	update_screen()
}

function goto_biohacking() {
	Game.location_ = LOC_BHCKG

	nav = document.getElementById("nav")
	nav.innerHTML = make_nav()

	// put the main game data table in the numbers section on the left
	table = document.getElementById("numbers")
	table.innerHTML = biohacking_table()

	buttons = document.getElementById("actions")
	buttons.innerHTML = biohacking_right()

	update_screen()
}
function init() {
	// initially, no other rooms are visible besides crime
	load()
	goto_crime()
	update_screen()
	tick_loop()
}

amphetamines = 1
function hack() {
	// hack yourself some money and stimulants
	amphetamines = 100
	Game.coins.value = 1e20
	Game.chips.value = 199
}

init()
