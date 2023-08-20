
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Game = {
	coins: {value:0.0, id:"tab_coins"},
	ticks: {value:0, id:"tab_ticks"},
	// ppkts := pickpockets
	ppkts: {value:0, id:"tab_ppkts"},
}



function update_ticks() {
	number = document.getElementById("tab_ticks")
	number.innerHTML = Game.tick.value
}

function update_coins() {
	number = document.getElementById("tab_coins")
	number.innerHTML = Game.coins
}

function update_pickpockets() {
	number = document.getElementById("tab_pickpockets")
	number.innerHTML = Game.ppkts
}

function price_pickpockets() {
	return 10 * (2.5 ** Game.ppkts.value)
}

function button_text_pickpockets() {
	return "Buy pickpocket (1 coin/s) for " + price_pickpockets() + " coins"
}

function update_screen() {
	// update values of main Game items
	for (const item in Game) {
		target = document.getElementById(Game[item].id)
		target.innerHTML = Game[item].value
	}

	bt = document.getElementById("bt_ppkt")
	i = 10
	// while (bt.innerHTML[i] != '>' && i < 100)
	// 	i++;
	bt.innerHTML = button_text_pickpockets()

	//update text box
	//target = document.t
}

// don't allow coins to fall below 0
function modify_coins(x) {
	if (get_coins() + x < 0)
		return false

	Game.coins.value += x
	return true
}

function get_coins() {
	return Game.coins.value
}


function increment_coins() {
	modify_coins(1)
	update_screen()
}

function increment_pickpockets() {
	Game.ppkts.value++
}

function buy_pickpocket() {
	if (modify_coins(-1 * price_pickpockets())) {
		increment_pickpockets()
	}
	update_screen()
}

function earn_coins_for_tick() {
	// for now, ppkts give you 1 coin
	earned = Game.ppkts.value

	Game.coins.value += earned
}

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
