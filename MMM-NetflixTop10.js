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
        maxItems: 10,
        itemHeight: 120 // px - approximate height per item when displayed vertically
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
        this.netflix = null;
        this.displayedCount = this.config.maxItems;
        this._lastMeasuredHeight = 0;

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

        // Add items
        var itemsContainer = document.createElement("div");
        itemsContainer.className = "netflix-items";

        var items = (this.netflix || []).slice(0, this.displayedCount || this.config.maxItems);

        var self = this;

        items.forEach(function (item) {
            var itemDiv = document.createElement("div");
            itemDiv.className = "netflix-item";

            var imgDiv = document.createElement("div");
            imgDiv.className = "netflix-item-image";
            var img = document.createElement("img");
            img.src = item.image;
            img.alt = item.title;
            // enforce height to keep layout predictable
            var itemHeight = (self.config && self.config.itemHeight) ? self.config.itemHeight : 120;
            imgDiv.style.height = itemHeight + "px";
            img.style.height = "100%";
            img.style.width = "100%";
            img.style.objectFit = "cover";
            imgDiv.appendChild(img);

            var rankDiv = document.createElement("div");
            rankDiv.className = "netflix-item-rank";
            rankDiv.innerHTML = item.rank;

            // Only show the image and rank overlay to save space.
            itemDiv.appendChild(imgDiv);
            itemDiv.appendChild(rankDiv);

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
