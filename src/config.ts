let process: any;

const p = process?.env ? process.env : import.meta.env;

export const matchplay_config = {
	"apiKey": p.VITE_MATCHPLAY_APIKEY || p.MAATCHPLAY_KEY
}

export const opdb_config = {
	"apiKey": p.VITE_OPDB_APIKEY || p.OPDB_KEY
}