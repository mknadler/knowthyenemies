# Know Thy Enemies

A tool for pinball players to see how well different players did on certain machines during a series (group of tournaments) run through MatchPlay. Uses the MatchPlay and OPDB APIs for their copious data.

## Developing

Install dependencies with `pnpm install`

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

You will need a `.env` file with the following to run this locally:
```
VITE_MATCHPLAY_APIKEY="YOURKEYHERE"
VITE_OPDB_APIKEY="YOURKEYHERE"
```

## Building

To create a production version:

```bash
npm run build
```

You can then preview the production build with `npm run preview`.