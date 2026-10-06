let matches = JSON.parse(localStorage.getItem("matches")) || [];
let editingMatchIndex = null;
let currentFilter = "all";
let currentSort = "newest";

function openMatchForm() {
    editingMatchIndex = null;

    document.querySelector(".welcome").style.display = "none";
    document.getElementById("matchList").style.display = "none";
    document.getElementById("matchForm").style.display = "block";
}

function closeMatchForm() {
    document.getElementById("matchForm").style.display = "none";
    document.querySelector(".welcome").style.display = "flex";
}

function saveMatch() {

    const match = {
        date: document.getElementById("matchDate").value,
        location: document.getElementById("location").value,
        team: document.getElementById("team").value,
        opponent: document.getElementById("opponent").value,
        score: document.getElementById("score").value,
        goals: document.getElementById("goals").value,
        assists: document.getElementById("assists").value,
        saves: document.getElementById("saves").value,
        hatTricks: Number(document.getElementById("goals").value) >= 3,
        rating: document.getElementById("rating").value,
        notes: document.getElementById("notes").value
    };

    if (
        match.date === "" ||
        match.team === "" ||
        match.opponent === "" ||
        match.score === ""
    ) {
        alert("Please fill in the date, team, opponent, and score.");
        return;
    }

    if (editingMatchIndex !== null) {
        matches[editingMatchIndex] = match;
        editingMatchIndex = null;
    } else {
        matches.push(match);
    }

    localStorage.setItem("matches", JSON.stringify(matches));

    displayMatches();

    clearForm();

    closeMatchForm();
}

function displayMatches() {

    const matchList = document.getElementById("matchList");

    matchList.innerHTML = `
    <button class="back-menu-button" onclick="backToMainMenu()">
        ↩️ Back to Main Menu
    </button>

    ${displayOverallRecord()}

    ${displayStatistics()}

    ${displayStreaks()}


    <select class="match-filter" onchange="filterMatches(this.value)">
        <option value="all" ${currentFilter === "all" ? "selected" : ""}>
            📊 All Matches
        </option>

        <option value="win" ${currentFilter === "win" ? "selected" : ""}>
            🟢 Wins
        </option>

        <option value="draw" ${currentFilter === "draw" ? "selected" : ""}>
            🟡 Draws
        </option>

        <option value="loss" ${currentFilter === "loss" ? "selected" : ""}>
            🔴 Losses
        </option>
    </select>

    <select class="match-sort" onchange="sortMatches(this.value)">
        <option value="newest" ${currentSort === "newest" ? "selected" : ""}>
            🆕 Newest First
        </option>

        <option value="oldest" ${currentSort === "oldest" ? "selected" : ""}>
            🕐 Oldest First
        </option>

        <option value="rating" ${currentSort === "rating" ? "selected" : ""}>
            ⭐ Highest Rating
        </option>

        <option value="goals" ${currentSort === "goals" ? "selected" : ""}>
            ⚽ Most Goals
        </option>

        <option value="assists" ${currentSort === "assists" ? "selected" : ""}>
            🎯 Most Assists
        </option>
    </select>
`;

    const filteredMatches = matches
        .map((match, index) => ({ match, index }))
        .filter(({ match }) => {

            if (currentFilter === "all") {
                return true;
            }

            const scores = match.score.split("-");

            if (scores.length !== 2) {
                return false;
            }

            const yourScore = Number(scores[0]);
            const opponentScore = Number(scores[1]);

            if (currentFilter === "win") {
                return yourScore > opponentScore;
            }

            if (currentFilter === "draw") {
                return yourScore === opponentScore;
            }

            if (currentFilter === "loss") {
                return yourScore < opponentScore;
            }

            return true;
        });

    // SORT MATCHES
    filteredMatches.sort((a, b) => {

        if (currentSort === "newest") {
            return new Date(b.match.date) - new Date(a.match.date);
        }

        if (currentSort === "oldest") {
            return new Date(a.match.date) - new Date(b.match.date);
        }

        if (currentSort === "rating") {
            return Number(b.match.rating || 0) -
                   Number(a.match.rating || 0);
        }

        if (currentSort === "goals") {
            return Number(b.match.goals || 0) -
                   Number(a.match.goals || 0);
        }

        if (currentSort === "assists") {
            return Number(b.match.assists || 0) -
                   Number(a.match.assists || 0);
        }

    });

    // DISPLAY MATCHES
    filteredMatches.forEach(({ match, index }) => {

        const card = document.createElement("div");

        card.className = "match-card";

        card.innerHTML = `
            <div class="match-header">
                <h2>${match.team} vs ${match.opponent}</h2>
                <span>${match.score}</span>
            </div>

            <p>📅 ${match.date}</p>
            <p>📍 ${match.location || "No location"}</p>

            <div>⚽ Goals: ${match.goals}</div>
<div>👟 Assists: ${match.assists}</div>
<div>🧤 Saves: ${match.saves}</div>
<div>🎩 Hat-Trick: ${Number(match.goals) >= 3 ? "Yes" : "No"}</div>
<div>⭐ Rating: ${match.rating}</div>

            <p class="match-notes">
                ${match.notes || "No performance notes."}
            </p>

            <button class="edit-match-button"
                onclick="editMatch(${index})">
                ✏️ Edit Match
            </button>

            <button class="details-match-button"
                onclick="viewMatchDetails(${index})">
                📋 View Details
            </button>

            <button class="delete-match-button"
                onclick="deleteMatch(${index})">
                🗑️ Delete Match
            </button>
        `;

        matchList.appendChild(card);
    });
}

function deleteMatch(index) {

    const confirmDelete =
        confirm("Are you sure you want to delete this match?");

    if (confirmDelete) {

        matches.splice(index, 1);

        localStorage.setItem("matches", JSON.stringify(matches));

        displayMatches();
    }
}

function clearForm() {

    document.getElementById("matchDate").value = "";
    document.getElementById("location").value = "";
    document.getElementById("team").value = "";
    document.getElementById("opponent").value = "";
    document.getElementById("score").value = "";
    document.getElementById("goals").value = "";
    document.getElementById("assists").value = "";
    document.getElementById("saves").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("notes").value = "";
}

function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const isDarkMode =
        document.body.classList.contains("dark-mode");

    document.getElementById("themeButton").textContent =
        isDarkMode ? "☀️" : "🌙";
}

displayMatches();

function viewMatches() {
    document.querySelector(".welcome").style.display = "none";
    document.getElementById("matchList").style.display = "block";
}

function backToMainMenu() {

    document.querySelector(".welcome").style.display = "flex";
    document.getElementById("matchList").style.display = "none";
    document.getElementById("matchDetails").style.display = "none";
}

function editMatch(index) {

    const match = matches[index];

    editingMatchIndex = index;

    document.getElementById("matchDate").value = match.date;
    document.getElementById("location").value = match.location;
    document.getElementById("team").value = match.team;
    document.getElementById("opponent").value = match.opponent;
    document.getElementById("score").value = match.score;
    document.getElementById("goals").value = match.goals;
    document.getElementById("assists").value = match.assists;
    document.getElementById("saves").value = match.saves;
    document.getElementById("rating").value = match.rating;
    document.getElementById("notes").value = match.notes;

    document.getElementById("matchList").style.display = "none";
    document.getElementById("matchForm").style.display = "block";
}

function filterMatches(filter) {
    currentFilter = filter;
    displayMatches();
}

function sortMatches(sort) {
    currentSort = sort;
    displayMatches();
}

function viewMatchDetails(index) {

    const match = matches[index];

    document.querySelector(".welcome").style.display = "none";
    document.getElementById("matchList").style.display = "none";
    document.getElementById("matchDetails").style.display = "block";

    document.getElementById("matchDetails").innerHTML = `
        <div class="details-card">

            <h2>
                ${match.team} vs ${match.opponent}
            </h2>

            <div class="details-score">
                ${match.score}
            </div>

            <div class="details-info">
                <p>📅 <strong>Date:</strong> ${match.date}</p>
                <p>📍 <strong>Location:</strong> ${match.location || "No location"}</p>
            </div>

            <div class="details-stats">

    <div class="stat-item">
        <span>⚽</span>
        <strong>${match.goals || 0}</strong>
        <p>Goals</p>
    </div>

    <div class="stat-item">
        <span>🎯</span>
        <strong>${match.assists || 0}</strong>
        <p>Assists</p>
    </div>

    <div class="stat-item">
        <span>🧤</span>
        <strong>${match.saves || 0}</strong>
        <p>Saves</p>
    </div>

    <div class="stat-item">
        <span>⭐</span>
        <strong>${match.rating || "N/A"}</strong>
        <p>Rating</p>
    </div>

    <div class="stat-item hat-trick-stat">
        <span>🎩</span>
        <strong>${Number(match.goals || 0) >= 3 ? "YES" : "NO"}</strong>
        <p>Hat-Trick</p>
    </div>

</div>

            <p>
                📝 <strong>Performance Notes:</strong>
            </p>

            <p class="match-notes">
                ${match.notes || "No performance notes."}
            </p>

            <br>

            <button class="share-match-button"
                onclick="shareMatchCard(${index})">
                📤 Share Match Card
            </button>

            <button class="details-back-button"
                onclick="closeMatchDetails()">
                ↩️ Back to Matches
            </button>

        </div>
    `;
}

function closeMatchDetails() {

    document.getElementById("matchDetails").style.display = "none";
    document.getElementById("matchList").style.display = "block";
}

function displayOverallRecord() {

    let wins = 0;
    let draws = 0;
    let losses = 0;

    matches.forEach(match => {

        const scores = match.score.split("-");

        if (scores.length !== 2) return;

        const yourScore = Number(scores[0]);
        const opponentScore = Number(scores[1]);

        if (yourScore > opponentScore) {
            wins++;
        } else if (yourScore === opponentScore) {
            draws++;
        } else {
            losses++;
        }
    });

    return `
        <div class="overall-record">
            <h2>📊 Overall Record</h2>

            <div class="record-stats">
                <div>
                    <span>🟢</span>
                    <strong>${wins}</strong>
                    <p>Wins</p>
                </div>

                <div>
                    <span>🟡</span>
                    <strong>${draws}</strong>
                    <p>Draws</p>
                </div>

                <div>
                    <span>🔴</span>
                    <strong>${losses}</strong>
                    <p>Losses</p>
                </div>
            </div>
        </div>
    `;
}

function displayStatistics() {

    if (matches.length === 0) {
        return `
            <div class="statistics-box">
                <h2>📊 Statistics</h2>
                <p class="no-stats">No statistics yet.</p>
            </div>
        `;
    }

    let totalGoals = 0;
    let totalAssists = 0;
    let totalSaves = 0;
    let totalHatTricks = 0;
    let totalRating = 0;
    let ratedMatches = 0;

    let wins = 0;

    let bestPerformance = null;
    let bestScoringMatch = null;

    matches.forEach(match => {

        totalGoals += Number(match.goals || 0);
        totalAssists += Number(match.assists || 0);
        totalSaves += Number(match.saves || 0);
        if (Number(match.goals) >= 3) {
    totalHatTricks++;
}

        if (match.rating !== "" && match.rating != null) {
            const rating = Number(match.rating);

            totalRating += rating;
            ratedMatches++;

            if (
                bestPerformance === null ||
                rating > Number(bestPerformance.rating)
            ) {
                bestPerformance = match;
            }
        }

        const scores = match.score.split("-");

        if (scores.length === 2) {
            const yourScore = Number(scores[0]);
            const opponentScore = Number(scores[1]);

            if (yourScore > opponentScore) {
                wins++;
            }
        }

        if (
            bestScoringMatch === null ||
            Number(match.goals || 0) >
            Number(bestScoringMatch.goals || 0)
        ) {
            bestScoringMatch = match;
        }
    });

    const averageRating =
        ratedMatches > 0
            ? (totalRating / ratedMatches).toFixed(1)
            : "N/A";

    const goalsPerMatch =
        (totalGoals / matches.length).toFixed(1);

    const assistsPerMatch =
        (totalAssists / matches.length).toFixed(1);

    const winPercentage =
        ((wins / matches.length) * 100).toFixed(1);

    return `
        <div class="statistics-box">

            <h2>📊 Statistics</h2>

            <div class="statistics-grid">

                <div class="stat-item">
                    <span>⚽</span>
                    <strong>${totalGoals}</strong>
                    <p>Total Goals</p>
                </div>

                <div class="stat-item">
                    <span>🎯</span>
                    <strong>${totalAssists}</strong>
                    <p>Total Assists</p>
                </div>

                <div class="stat-item">
                    <span>🎩</span>
                    <strong>${totalHatTricks}</strong>
                    <p>Total Hat-Tricks</p>
                </div>

                <div class="stat-item">
                    <span>🧤</span>
                    <strong>${totalSaves}</strong>
                    <p>Total Saves</p>
                </div>

                <div class="stat-item">
                    <span>⭐</span>
                    <strong>${averageRating}</strong>
                    <p>Average Rating</p>
                </div>

                <div class="stat-item">
                    <span>⚽</span>
                    <strong>${goalsPerMatch}</strong>
                    <p>Goals / Match</p>
                </div>

                <div class="stat-item">
                    <span>🎯</span>
                    <strong>${assistsPerMatch}</strong>
                    <p>Assists / Match</p>
                </div>

                <div class="stat-item">
                    <span>📈</span>
                    <strong>${winPercentage}%</strong>
                    <p>Win Percentage</p>
                </div>

            </div>

            <div class="record-highlights">

                <div class="highlight">
                    <span>🏆</span>
                    <div>
                        <strong>Best Performance</strong>
                        <p>
                            ${
                                bestPerformance
                                    ? `${bestPerformance.team} vs ${bestPerformance.opponent} — ${bestPerformance.rating}/10`
                                    : "N/A"
                            }
                        </p>
                    </div>
                </div>

                <div class="highlight">
                    <span>⚽</span>
                    <div>
                        <strong>Best Scoring Match</strong>
                        <p>
                            ${
                                bestScoringMatch
                                    ? `${bestScoringMatch.team} vs ${bestScoringMatch.opponent} — ${bestScoringMatch.goals || 0} goals`
                                    : "N/A"
                            }
                        </p>
                    </div>
                </div>

            </div>

        </div>
    `;
}

function displayStreaks() {

    let currentWinStreak = 0;
    let longestWinStreak = 0;

    let currentScoringStreak = 0;
    let longestScoringStreak = 0;

    // Matches are sorted newest → oldest in the display,
    // so reverse them to calculate streaks chronologically.
    const chronologicalMatches = [...matches].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    chronologicalMatches.forEach(match => {

        const scores = match.score.split("-");

        if (scores.length !== 2) return;

        const yourScore = Number(scores[0]);
        const opponentScore = Number(scores[1]);

        // WINNING STREAK
        if (yourScore > opponentScore) {

            currentWinStreak++;

            if (currentWinStreak > longestWinStreak) {
                longestWinStreak = currentWinStreak;
            }

        } else {
            currentWinStreak = 0;
        }

        // SCORING STREAK
        if (Number(match.goals || 0) > 0) {

            currentScoringStreak++;

            if (currentScoringStreak > longestScoringStreak) {
                longestScoringStreak = currentScoringStreak;
            }

        } else {
            currentScoringStreak = 0;
        }
    });

    return `
        <div class="streaks-box">

            <h2>🔥 Streaks</h2>

            <div class="streaks-grid">

                <div class="streak-item">
                    <span>🔥</span>
                    <strong>${currentWinStreak}</strong>
                    <p>Current Winning Streak</p>
                </div>

                <div class="streak-item">
                    <span>⚽</span>
                    <strong>${currentScoringStreak}</strong>
                    <p>Current Scoring Streak</p>
                </div>

                <div class="streak-item">
                    <span>🏆</span>
                    <strong>${longestWinStreak}</strong>
                    <p>Longest Winning Streak</p>
                </div>

                <div class="streak-item">
                    <span>⚡</span>
                    <strong>${longestScoringStreak}</strong>
                    <p>Longest Scoring Streak</p>
                </div>

            </div>

        </div>
    `;
}

let calendarDate = new Date();

function openCalendar() {

    document.querySelector(".welcome").style.display = "none";
    document.getElementById("matchList").style.display = "none";
    document.getElementById("matchDetails").style.display = "none";
    document.getElementById("calendarView").style.display = "block";

    displayCalendar();
}

function displayCalendar() {

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = calendarDate.toLocaleString("default", {
        month: "long"
    });

    let calendarHTML = `
        <div class="calendar-box">

            <button class="back-menu-button"
                onclick="closeCalendar()">
                ↩️ Back to Main Menu
            </button>

            <div class="calendar-header">

                <button onclick="changeCalendarMonth(-1)">
                    ◀
                </button>

                <h2>${monthName} ${year}</h2>

                <button onclick="changeCalendarMonth(1)">
                    ▶
                </button>

            </div>

            <div class="calendar-weekdays">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
            </div>

            <div class="calendar-days">
    `;

    for (let i = 0; i < firstDay; i++) {
        calendarHTML += `<div class="empty-day"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {

        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const dayMatches = matches.filter(
            match => match.date === dateString
        );

        calendarHTML += `
            <div
                class="calendar-day ${dayMatches.length > 0 ? "has-match" : ""}"
                onclick="showCalendarMatches('${dateString}')"
            >
                <strong>${day}</strong>

                ${
                    dayMatches.length > 0
                        ? `<span>⚽ ${dayMatches.length}</span>`
                        : ""
                }
            </div>
        `;
    }

    calendarHTML += `
            </div>

            <div id="calendarMatches"></div>

        </div>
    `;

    document.getElementById("calendarView").innerHTML = calendarHTML;
}

function changeCalendarMonth(change) {

    calendarDate.setMonth(calendarDate.getMonth() + change);

    displayCalendar();
}

function showCalendarMatches(date) {

    const dayMatches = matches.filter(
        match => match.date === date
    );

    const container = document.getElementById("calendarMatches");

    if (dayMatches.length === 0) {

        container.innerHTML = `
            <div class="calendar-no-match">
                No matches on ${date}.
            </div>
        `;

        return;
    }

    container.innerHTML = `
        <div class="calendar-match-list">

            <h3>⚽ Matches on ${date}</h3>

            ${dayMatches.map((match, index) => `
                <div class="calendar-match">

                    <strong>
                        ${match.team} vs ${match.opponent}
                    </strong>

                    <span>
                        ${match.score}
                    </span>

                </div>
            `).join("")}

        </div>
    `;
}

function closeCalendar() {

    document.getElementById("calendarView").style.display = "none";
    document.querySelector(".welcome").style.display = "flex";
}

async function shareMatchCard(index) {

    const match = matches[index];

    const shareText = `
⚽ MATCHLOG

${match.team} vs ${match.opponent}
Score: ${match.score}

⚽ Goals: ${match.goals || 0}
🎯 Assists: ${match.assists || 0}
🎩 Hat-Trick: ${Number(match.goals) >= 3 ? "Yes" : "No"}
🧤 Saves: ${match.saves || 0}
⭐ Rating: ${match.rating || "N/A"}/10

📅 ${match.date}
    `.trim();

    if (navigator.share) {

        try {

            await navigator.share({
                title: "MATCHLOG Match",
                text: shareText
            });

        } catch (error) {

            if (error.name !== "AbortError") {
                console.error(error);
            }

        }

    } else {

        try {

            await navigator.clipboard.writeText(shareText);

            alert("Match card copied to clipboard! 📋");

        } catch (error) {

            alert("Sharing is not supported on this browser.");
        }
    }
}
