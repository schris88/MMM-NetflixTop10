# MMM-NetflixTop10

A premium, responsive MagicMirror² module that brings the official **Netflix Top 10** rankings directly to your mirror. Stay updated with the most popular TV shows and movies in Germany with a sleek, Netflix-inspired design.

![Netflix Top 10](https://img.shields.io/badge/MagicMirror-Module-E50914?style=for-the-badge&logo=netflix)

## ✨ Features

- 🎨 **Netflix Aesthetics**: Clean grid layout with poster art, rankings, and red accents.
- 📱 **Fully Responsive**: Adapts perfectly to vertical (portrait) or horizontal (landscape) mirror orientations.
- ⚙️ **Highly Customizable**: Control item height, module width, column count, and update frequency.
- 🔄 **Automated Sync**: Uses Playwright to fetch live data from Netflix's official Tudum rankings.

## 🚀 Installation

1. Navigate to your MagicMirror `modules` directory:
   ```bash
   cd ~/MagicMirror/modules
   ```
2. Clone this repository:
   ```bash
   git clone https://github.com/schris88/MMM-NetflixTop10.git
   ```
3. Install the required dependencies:
   ```bash
   cd MMM-NetflixTop10
   npm install
   npx playwright install --with-deps chromium
   ```

## 🛠 Configuration

Add the module to your `config/config.js` file.

### Minimal Configuration
```javascript
{
    module: "MMM-NetflixTop10",
    position: "top_right",
}
```

### Advanced Configuration (Horizontal Layout Example)
```javascript
{
    module: "MMM-NetflixTop10",
    position: "bottom_bar",
    config: {
        updateInterval: 12 * 60 * 60 * 1000, // 12 hours
        maxItems: 5,
        columns: 5,         // Show 5 items in a single row
        itemHeight: "280px", // Fixed height for posters
        maxWidth: 320     // Use full width of the position
    }
}
```

## ⚙️ Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `updateInterval` | `Number` | `86400000` | Sync frequency in milliseconds (Default: 24h). |
| `maxItems` | `Number` | `10` | Number of items to fetch and display. |
| `itemHeight` | `String\|Number` | `"250px"` | Height for each item. Supports numbers (px) or strings (e.g., `"200px"`, `"30vh"`, `"150"`). |
| `maxWidth` | `String\|Number` | `"450px"` | Maximum width of the module container. Supports numbers (px) or strings. |
| `columns` | `Number` | `2` | Number of columns in the grid layout. |

## 🧬 How it Works

This module utilizes **Playwright** to headlessly navigate to the official [Netflix Top 10 page](https://www.netflix.com/tudum/top10/). It extracts the latest ranking data, including:
- Current Rank
- Title
- Poster Image URL
- Weeks in Top 10

The data is then cached and displayed in a responsive grid.

## ⚠️ Notes

- **Initial Load**: The first fetch might take a few seconds as the headless browser initializes.
- **Dependencies**: Ensure your system has the necessary libraries for Playwright/Chromium to run.
- **Data Source**: This module relies on the structure of the Netflix Tudum website. Significant changes to their site may require module updates.

## 📄 License

MIT © [Christian Stengel](https://github.com/schris88)
