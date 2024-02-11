export class Player {
	constructor(name = '', id = '', standing = 0) {
		this.name = name;
		this.id = id;
		// Stores all results
		this.results = [];
		// Stores averages for each game
		this.standing = standing;
	}

	get result() {
		return this.results;
	}

	set result(gameObj) {
		this.results.push(gameObj);
		//let thisResultArena = this.gameResults.find()
	}

	reset() {
		this.results = [];
		this.standing = 0;
		this.name = 'Test';
		this.id = 0;

	}
}

// Add fetch to opdb to
// get the standardized shortname
// It will need to be delayed b/c
// OPDB has pretty tight rate limiting
export class Arena {
	constructor(name, opdbId, shortname, arenaId = null) {
		this.name = name;
		this.opdbId = opdbId
		this.shortname = shortname;
		this.arenaId = arenaId;
	}
}
