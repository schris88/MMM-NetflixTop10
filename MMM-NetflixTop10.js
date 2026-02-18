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
        itemHeight: "250px",
        maxWidth: "450px",
        columns: 2
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
        this.netflix = null;
        this.displayedCount = this.config.maxItems;

        // Schedule the first update
        this.scheduleUpdate();
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "netflix-wrapper";
        var maxWidth = this.config.maxWidth;
        if (typeof maxWidth === "number") maxWidth += "px";
        wrapper.style.maxWidth = maxWidth;

        var itemHeight = this.config.itemHeight;
        if (typeof itemHeight === "number") itemHeight += "px";
        wrapper.style.setProperty("--item-height", itemHeight);

        wrapper.style.setProperty("--columns", this.config.columns);

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

        var itemsContainer = document.createElement("div");
        itemsContainer.className = "netflix-items";

        var items = (this.netflix || []).slice(0, this.displayedCount || this.config.maxItems);
        var self = this;

        items.forEach(function (item) {
            // FIX: You must create the item container div!
            var itemDiv = document.createElement("div");
            itemDiv.className = "netflix-item";

            var imgDiv = document.createElement("div");
            imgDiv.className = "netflix-item-image";
            imgDiv.style.height = "100%";

            var img = document.createElement("img");
            img.src = item.image;
            img.alt = item.title;

            // Clean styling for grid layout
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.display = "block";
            imgDiv.appendChild(img);

            var rankDiv = document.createElement("div");
            rankDiv.className = "netflix-item-rank";
            rankDiv.innerHTML = item.rank;

            // Append children to the newly created itemDiv
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
        var self = this;
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        // Initial data request
        if (delay === undefined) {
            this.sendSocketNotification("FETCH_NETFLIX", { region: this.config.region });
        }

        // Using setInterval as per your original logic, but setTimeout is often safer
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