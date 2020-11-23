/**
 * main.js
 * Implements all javascript-based page interations.
 */

/* Starting posting media to display */
const DEFAULT_MEDIA = "twitter_global";

/**
 * Gets the HTML for the engagement across days and hours table.
 * @param {obj} current_media Object representing current media to render table from.
 * @param {int} day_index The current day of the week as an integer index.
 * @param {int} hour_index The current hour (in CST) as an integer index.
 * @return {string} innerHTML of the <table> returned as a string.
 */
function getChartTableHTML(current_media, day_index, hour_index) {
    let htmlstring = "";
    let daystrings = ["M", "T", "W", "T", "F", "S", "S"];
    for (let i=0; i<current_media.length; i++) {
        htmlstring += `<tr><td class='dayOfTheWeek'>${daystrings[i]}</td>`;
        for (let j=0; j<current_media[i].length; j++) {
            if ((i == day_index) && (j == hour_index)) {
                htmlstring += `<td class='currentTime color${current_media[i][j]}'>&nbsp;&nbsp;</td>`;
            } else {
                htmlstring += `<td class='color${current_media[i][j]}'>&nbsp;&nbsp;</td>`;
            }
        }
        htmlstring += "</tr>";
    }
    return htmlstring;
}

/**
 * Main function called for stitching together the data results with the page UI.
 * @param {string} current_media_string String name of current_media to lookup in all_categories.
 * @param {int} day_index The current day of the week as an integer index.
 * @param {int} hour_index The current hour (in CST) as an integer index.
 */
function createPage(current_media_string, day_index, hour_index) {
    current_media = all_categories[current_media_string]["data"];
    current_num = current_media[day_index][hour_index];

    document.getElementById("hero").removeAttribute("class");
    let classes = ["hero", "is-fullheight", `color${current_num}`];
    for (let i=0; i<classes.length; i++) {
        document.getElementById("hero").classList.add(classes[i]);
    }

    document.getElementById("charttable").innerHTML = getChartTableHTML(current_media, day_index, hour_index);

    document.getElementById("center_title").innerHTML = all_categories[current_media_string]["title"] + " Engagement";

    let phrases = [
        "Lowest",
        "Near-lowest",
        "Low",
        "Slightly-lower",
        "Neutral",
        "Slightly-higher",
        "High",
        "Near-highest",
        "Highest"
    ];
    document.getElementById("center_subtitle").innerHTML = `${phrases[current_num]} engagement expected if posting at this time.`;
}

/**
 * Return the current day of the week and the current hour, both as integer indices and in the CST timezone.
 * @return {Array.<int>} An array of size 2 containing the day_index and the hour_index.
 */
function getCurrentIndices() {
    var todayCST = new Date().toLocaleString("en-US", {
        timeZone: "America/Chicago"
    });
    todayCST = new Date(todayCST);
    day_index = todayCST.getDay();
    // This behavior is due to the reference chart showing Sunday as the last day of the week and not the first.
    if (day_index == 0) {
        // Sunday gets changed to 6
        day_index = 6
    } else {
        // All other days need to have their index decreased by 1;
        day_index -= 1;
    }
    hour_index = todayCST.getHours();
    return [day_index, hour_index];
}

/**
 * Calls createPage() with media set to what is currently active, otherwise DEFAULT_MEDIA. Used
 *     as the refresh call on the page every 15 minutes.
 */
function refreshPage() {
    let indices = getCurrentIndices();
    const active = document.querySelector('.active');
    if (active) {
        createPage(active.id, indices[0], indices[1]);
    } else {
        createPage(DEFAULT_MEDIA, indices[0], indices[1]);
    }
}

/**
 * Initialize page.
 */
document.addEventListener('DOMContentLoaded', () => {

    // Initialize the Bulma navbar.
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }

    // Initialize DEFAULT_MEDIA as the default current_media to display.
    let indices = getCurrentIndices();
    createPage(DEFAULT_MEDIA, indices[0], indices[1]);

    // Refresh the page every 15 minutes.
    setInterval(refreshPage, 1000 * 60 * 15);

    // Initialize on-click for .clickable-filter handling.
    document.addEventListener('click', function (event) {
        if (!event.target.matches('.clickable-filter')) return;
        event.preventDefault();

        // Remove all other elements tagged with active class.
        const active = document.querySelector('.active');
        if (active) {
            active.classList.remove('active');
        }

        // Add active to the clicked filter.
        event.target.classList.toggle('active');
        createPage(event.target.id, indices[0], indices[1]);
    }, false);

});
