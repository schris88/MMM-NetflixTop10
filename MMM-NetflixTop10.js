/* Magic Mirror
 * Module: MMM-NetflixTop10
 *
 * By Christian Stengel
 * MIT Licensed.
 */

Module.register("MMM-NetflixTop10", {
    defaults: {
        updateInterval: 24 * 60 * 60 * 1000, // Update every 24 hours
        region: "germany",
        maxItems: 10
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
        this.netflix = null;

        // Schedule the first update
        this.scheduleUpdate();
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "netflix-wrapper";

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("LOADING");
            return wrapper;
        }

        if (!this.netflix || this.netflix.length === 0) {
            wrapper.innerHTML = "No data available";
            return wrapper;
        }

        var table = document.createElement("div");
        table.className = "netflix-table";

        // Add header
        var header = document.createElement("div");
        header.className = "netflix-header";
        header.innerHTML = "<h2>Netflix Top 10</h2>";
        table.appendChild(header);

        // Add items
        var itemsContainer = document.createElement("div");
        itemsContainer.className = "netflix-items";

        this.netflix.forEach(function (item) {
            var itemDiv = document.createElement("div");
            itemDiv.className = "netflix-item";

            var imgDiv = document.createElement("div");
            imgDiv.className = "netflix-item-image";
            var img = document.createElement("img");
            img.src = item.image;
            img.alt = item.title;
            imgDiv.appendChild(img);

            var rankDiv = document.createElement("div");
            rankDiv.className = "netflix-item-rank";
            rankDiv.innerHTML = item.rank;

            var titleDiv = document.createElement("div");
            titleDiv.className = "netflix-item-title";
            titleDiv.innerHTML = item.title;

            var weeksDiv = document.createElement("div");
            weeksDiv.className = "netflix-item-weeks";
            weeksDiv.innerHTML = item.weeks + " week" + (item.weeks !== 1 ? "s" : "");

            itemDiv.appendChild(imgDiv);
            itemDiv.appendChild(rankDiv);
            itemDiv.appendChild(titleDiv);
            itemDiv.appendChild(weeksDiv);

            itemsContainer.appendChild(itemDiv);
        });

        table.appendChild(itemsContainer);
        wrapper.appendChild(table);

        return wrapper;
    },

    getStyles: function () {
        return ["MMM-NetflixTop10.css"];
    },

    scheduleUpdate: function (delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        // Initial data request
        if (delay === undefined) {
            this.sendSocketNotification("FETCH_NETFLIX", { region: this.config.region });
        }

        // Set recurrent update
        setInterval(function () {
            self.sendSocketNotification("FETCH_NETFLIX", { region: self.config.region });
        }, nextLoad);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "NETFLIX_DATA") {
            this.netflix = payload;
            this.loaded = true;
            this.updateDom();
        }
    }
});
