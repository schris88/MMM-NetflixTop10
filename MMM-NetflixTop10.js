/* Magic Mirror
 * Module: MMM-NetflixTop10
 *
 * By Christian Stengel
 * MIT Licensed.
 */

Module.register("MMM-NetflixTop10", {
    defaults: {
        updateInterval: 24 * 60 * 60 * 1000, // Update every 24 hours
        maxItems: 10,
        itemHeight: "250px",
        maxWidth: "360px",
        columns: 2
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
        this.netflix = null;
        this.isFlipped = false;

        // Schedule the first update
        this.scheduleUpdate();

        // Staggered flip timer: toggle flip every 60 seconds
        var self = this;
        setInterval(function () {
            if (self.loaded && self.netflix && self.netflix.length > 5) {
                self.isFlipped = !self.isFlipped;
                var wrapper = document.querySelector(".MMM-NetflixTop10 .netflix-wrapper");
                if (wrapper) {
                    if (self.isFlipped) {
                        wrapper.classList.add("is-flipped");
                    } else {
                        wrapper.classList.remove("is-flipped");
                    }
                }
            }
        }, 60000);
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "netflix-wrapper" + (this.isFlipped ? " is-flipped" : "");
        var maxWidth = this.config.maxWidth;
        if (typeof maxWidth === "number") maxWidth += "px";
        wrapper.style.width = maxWidth;

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

        // We only show 5 cards (which reveal 10 items)
        var cardCount = Math.min(5, this.netflix.length);

        for (var i = 0; i < cardCount; i++) {
            var itemDiv = document.createElement("div");
            itemDiv.className = "netflix-item-container";

            var cardInner = document.createElement("div");
            cardInner.className = "netflix-card-inner";

            // Front side (Items 1-5)
            var frontFace = this.createFace(this.netflix[i], "front");
            cardInner.appendChild(frontFace);

            // Back side (Items 6-10)
            if (this.netflix.length > i + 5) {
                var backFace = this.createFace(this.netflix[i + 5], "back");
                cardInner.appendChild(backFace);
            }

            itemDiv.appendChild(cardInner);
            itemsContainer.appendChild(itemDiv);
        }

        table.appendChild(itemsContainer);
        wrapper.appendChild(table);

        return wrapper;
    },

    createFace: function (item, type) {
        var face = document.createElement("div");
        face.className = "netflix-card-face netflix-card-" + type;

        var imgDiv = document.createElement("div");
        imgDiv.className = "netflix-item-image";

        var img = document.createElement("img");
        img.src = item.image;
        img.alt = item.title;
        imgDiv.appendChild(img);

        var rankDiv = document.createElement("div");
        rankDiv.className = "netflix-item-rank";
        rankDiv.innerHTML = item.rank;

        face.appendChild(imgDiv);
        face.appendChild(rankDiv);

        return face;
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
            this.sendSocketNotification("FETCH_NETFLIX");
        }

        // Using setInterval as per your original logic, but setTimeout is often safer
        setInterval(function () {
            self.sendSocketNotification("FETCH_NETFLIX");
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