# Play the Market: Test Table

A browser version of **Play the Market**, a stock market card game. You trade against 2 to 5 computer
traders over 8 trading days, using the tabletop rules. Switches on the setup screen turn on proposed
rule fixes, so you can compare how they change the game.

It is plain HTML, CSS and JavaScript with no build step and no dependencies (fonts load from Google Fonts).

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page |
| `css/style.css` | All styles |
| `js/game.js` | Game data, rules engine, computer traders and rendering |
| `favicon.svg` | Browser tab icon |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

## Run it locally

Open `index.html` in a browser. Or serve the folder:

```
python3 -m http.server 8000
```

then go to http://localhost:8000.

## Put it on GitHub Pages

1. Create a new repository on GitHub, for example `play-the-market`.
2. Upload these files to the root of the repository (keep the `css` and `js` folders), or push them:

   ```
   git init
   git add .
   git commit -m "Play the Market test table"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/play-the-market.git
   git push -u origin main
   ```

3. In the repository, go to **Settings > Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, pick **main** and **/ (root)**, then **Save**.
5. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/play-the-market/`.

## How the code is organised (`js/game.js`)

- **Game data**: sectors, starting prices, the Market deck (as written and rebalanced) and the Action cards.
- **Price changes**: percentage moves, rounding, bankruptcy and splits.
- **Market cards** and **Action cards**: one function each for cards played at once and cards resolved at the bell.
- **Computer traders**: casual traders buy and hold; sharp traders buy ahead of moves they know about.
- **The day**: the seven steps of a trading day, written as an `async` flow that waits for your clicks.
- **Rendering**: the board, your seat, rival sheets, the log and the results screen.

## Not included

The optional Volatility Meter, trades between players and the 90-second trading timer.
