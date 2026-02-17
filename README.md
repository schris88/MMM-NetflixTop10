# MMM-NetflixTop10

A MagicMirror module that displays Netflix Top 10 shows and movies for a specific region.

## Features

- Displays Netflix Top 10 TV shows in a grid layout
- Shows ranking, poster image, title, and weeks in top 10
- Supports multiple regions (germany, us, etc.)
- Auto-refresh capability with configurable interval
- Responsive design that adapts to different screen sizes

## Installation

1. Clone or download this module into your `MagicMirror/modules` folder
2. Install dependencies:
   ```bash
   cd MagicMirror/modules/MMM-NetflixTop10
   npm install
   ```

## Configuration

Add this to your MagicMirror `config/config.js`:

```javascript
{
    module: "MMM-NetflixTop10",
    position: "bottom_bar",
    config: {
        updateInterval: 24 * 60 * 60 * 1000,  // Update every 24 hours
        region: "germany",                     // Change to your region (us, uk, etc.)
        maxItems: 10,
        itemHeight: 120 // height in pixels for each list item (optional)
    }
}
```

## Config Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `updateInterval` | Number | 24h | How often to fetch new data (in milliseconds) |
| `region` | String | "germany" | Netflix region code (germany, us, uk, etc.) |
| `maxItems` | Number | 10 | Maximum number of items to display |
| `itemHeight` | Number | 120 | Approximate height in pixels for each item when displayed vertically |

## How it Works

1. Uses Playwright to browse Netflix's Tudum top 10 page for your region
2. Extracts ranking, image, title, and weeks in top 10 from the table
3. Displays the data in a responsive grid with Netflix-style styling
4. Auto-updates based on your configured interval

## Requirements

- Node.js with npm
- Playwright browser dependencies

## Notes

- Netflix may change their page structure, which could break the scraper
- The module respects Netflix's terms of service by only displaying publicly available data
- Images are loaded directly from Netflix's CDN

## License

MIT
