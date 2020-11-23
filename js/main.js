

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

function refreshPage() {
    let indices = getCurrentIndices();
    const active = document.querySelector('.active');
    default_media = "twitter_global";
    if (active) {
        default_media = active.id;
    }
    createPage(default_media, indices[0], indices[1]);
}


document.addEventListener('DOMContentLoaded', () => {

    // Initialize the navbar.
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
    
            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);
    
            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
    
            });
        });
    }

    // Initialize twitter_global as the default
    let indices = getCurrentIndices();
    createPage("twitter_global", indices[0], indices[1]);

    // Rerun above every 15 minutes
    setInterval(refreshPage, 1000 * 60 * 15);

    // Onclick for .clickable-filter handling.
    document.addEventListener('click', function (event) {

        // If the clicked element doesn't have the right selector, bail
        if (!event.target.matches('.clickable-filter')) return;
    
        // Don't follow the link
        event.preventDefault();
    
        // remove all other elements tagged with active class
        const active = document.querySelector('.active');
        if (active) {
            active.classList.remove('active');
        }
        // add active to the clicked filter
        event.target.classList.toggle('active');
        createPage(event.target.id, indices[0], indices[1]);

    }, false);


});
