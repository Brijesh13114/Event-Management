const initialEvents = [
  { id: "open-mic", title: "Open Mic After Hours", category: "Arts", day: "OCT 04", date: "2026-10-04", time: "7:30 PM", location: "The Green Room", description: "Poetry, half-finished songs, and the best kind of stage fright.", attendees: 38, image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80", alt: "Live music performance under warm lights" },
  { id: "career-coffee", title: "Coffee With Creatives", category: "Career", day: "OCT 05", date: "2026-10-05", time: "10:00 AM", location: "Morrow Hall · 204", description: "Real talk with alumni who turned a side project into a career.", attendees: 24, image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80", alt: "Team brainstorming around a table" },
  { id: "film-lawn", title: "Movies on the Lawn", category: "Social", day: "OCT 05", date: "2026-10-05", time: "8:00 PM", location: "South Quad", description: "Bring a blanket. We’ll bring the big screen and the popcorn.", attendees: 116, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80", alt: "Rows of cinema seats" },
  { id: "photo-walk", title: "The Analog Photo Walk", category: "Arts", day: "OCT 06", date: "2026-10-06", time: "2:00 PM", location: "Meet at the Bell Tower", description: "A slow wander around campus. Cameras optional, curiosity not.", attendees: 19, image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80", alt: "Camera ready for an afternoon photo walk" },
  { id: "pickup-soccer", title: "Sunday Pickup Soccer", category: "Sports", day: "OCT 06", date: "2026-10-06", time: "4:30 PM", location: "Riverside Field", description: "No tryouts, no pressure. Just bring a light and a dark shirt.", attendees: 31, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80", alt: "Soccer game on a grassy field" },
  { id: "swap-meet", title: "Swap, Don't Shop", category: "Social", day: "OCT 08", date: "2026-10-08", time: "12:00 PM", location: "Student Union · Patio", description: "Trade that book, plant, or jacket you keep meaning to pass on.", attendees: 52, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80", alt: "Colorful clothing at a campus swap meet" }
];

const clubs = [
  { id: "film-society", name: "Midnight Film Society", category: "Arts", members: 84, meeting: "Thursdays · 7:00 PM", location: "Media Lab", description: "For the films that stay with you after the credits roll.", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80", alt: "Movie theater seats" },
  { id: "makers", name: "The Makers Table", category: "Academic", members: 62, meeting: "Wednesdays · 5:30 PM", location: "Engineering Workshop", description: "Make something with your hands. Figure out the rest together.", image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80", alt: "Creative workshop gathering" },
  { id: "garden", name: "Campus Garden Crew", category: "Service", members: 47, meeting: "Saturdays · 9:00 AM", location: "East Garden", description: "Grow food, learn as you go, and get your hands in the soil.", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80", alt: "Green plants growing in a community garden" },
  { id: "radio", name: "WCRU Student Radio", category: "Arts", members: 39, meeting: "Tuesdays · 6:00 PM", location: "Union · Studio B", description: "Find your voice, share your playlists, keep campus curious.", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80", alt: "Microphone in a recording studio" },
  { id: "run-club", name: "Easy Miles Run Club", category: "Sports", members: 103, meeting: "Mondays · 4:30 PM", location: "Meet at the Bell Tower", description: "All paces welcome. We always wait for the last person.", image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80", alt: "Runners on a campus path" },
  { id: "tabletop", name: "Tabletop & Tea", category: "Social", members: 58, meeting: "Fridays · 6:30 PM", location: "Student Union · Lounge", description: "Good games, warm tea, and very questionable strategies.", image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80", alt: "Board game laid out on a table" }
];

const storage = {
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { showToast("Changes couldn't be saved in this browser."); }
  }
};

let events = storage.read("campusly-events", initialEvents);
let saved = storage.read("campusly-saved", []);
let rsvps = storage.read("campusly-rsvps", []);
let joinedClubs = storage.read("campusly-joined-clubs", []);
let activeCategory = "All";
let savedOnly = false;
const grid = document.querySelector("#event-grid");
const emptyState = document.querySelector("#empty-state");
const toast = document.querySelector("#toast");
let toastTimer;
let calendarMonth = new Date(2026, 9, 1);
let selectedCalendarDate = "2026-10-04";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2400);
}

function renderEvents() {
  const query = document.querySelector("#search").value.trim().toLowerCase();
  const filtered = events.filter(event => {
    const matchesCategory = activeCategory === "All" || event.category === activeCategory;
    const matchesQuery = `${event.title} ${event.description} ${event.location} ${event.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery && (!savedOnly || saved.includes(event.id));
  });
  grid.innerHTML = filtered.map((event, index) => {
    const isSaved = saved.includes(event.id);
    const hasRsvp = rsvps.includes(event.id);
    return `<article class="event-card" style="animation-delay:${index * 55}ms">
      <div class="event-image"><img src="${escapeAttribute(event.image)}" alt="${escapeAttribute(event.alt || event.title)}" loading="lazy" /><span class="event-category">${escapeHtml(event.category)}</span><button class="save-button${isSaved ? " saved" : ""}" data-save="${escapeAttribute(event.id)}" aria-label="${isSaved ? "Remove saved event" : "Save event"}" aria-pressed="${isSaved}">${isSaved ? "♥" : "♡"}</button></div>
      <div class="card-meta"><span class="date">${escapeHtml(event.day)}</span><span>${escapeHtml(event.time)}</span><span>·</span><span>${escapeHtml(event.location)}</span></div>
      <h3>${escapeHtml(event.title)}</h3><p class="event-description">${escapeHtml(event.description)}</p>
      <div class="card-bottom"><span class="attendees">${event.attendees + (hasRsvp ? 1 : 0)} going</span><button class="rsvp-button" data-rsvp="${escapeAttribute(event.id)}">${hasRsvp ? "You're going ✓" : "Count me in ↗"}</button></div>
    </article>`;
  }).join("");
  emptyState.hidden = filtered.length > 0;
  grid.hidden = filtered.length === 0;
  document.querySelector("#event-count").textContent = String(events.length).padStart(2, "0");
  document.querySelector("#show-saved").innerHTML = savedOnly ? "← Back to all events" : "<span>♡</span> View your saved events <span aria-hidden=\"true\">↗</span>";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function escapeAttribute(value) { return escapeHtml(value); }

function eventDateKey(event) {
  if (event.date) return event.date;
  const match = event.day.match(/^([A-Z]{3})\s+(\d{1,2})$/i);
  if (!match) return "";
  const month = new Date(`${match[1]} 1, 2000`).getMonth();
  return `${calendarMonth.getFullYear()}-${String(month + 1).padStart(2, "0")}-${match[2].padStart(2, "0")}`;
}

function renderCalendar() {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const eventMap = new Map();
  events.forEach(event => {
    const key = eventDateKey(event);
    if (key) eventMap.set(key, [...(eventMap.get(key) || []), event]);
  });

  document.querySelector("#calendar-month-label").textContent = calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const cells = weekdayLabels.map(day => `<div class="calendar-weekday" aria-hidden="true">${day}</div>`);
  for (let empty = 0; empty < firstWeekday; empty += 1) cells.push('<div class="calendar-date outside-month" aria-hidden="true"></div>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEvents = eventMap.get(key) || [];
    const selected = key === selectedCalendarDate;
    cells.push(`<button class="calendar-date${dayEvents.length ? " has-events" : ""}${selected ? " selected" : ""}" data-date="${key}" aria-label="${calendarMonth.toLocaleDateString("en-US", { month: "long" })} ${day}${dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}` : ""}" aria-pressed="${selected}"><span class="calendar-day-number">${day}</span>${dayEvents.length ? `<span class="calendar-event-dots" aria-hidden="true">${dayEvents.slice(0, 3).map(() => "<i></i>").join("")}</span><span class="calendar-event-count">${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}</span>` : ""}</button>`);
  }
  document.querySelector("#calendar-grid").innerHTML = cells.join("");
  renderCalendarDay(eventMap.get(selectedCalendarDate) || []);
}

function renderCalendarDay(dayEvents) {
  const date = new Date(`${selectedCalendarDate}T12:00:00`);
  const label = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const panel = document.querySelector("#calendar-day-events");
  panel.innerHTML = `<div class="calendar-day-heading"><div><span class="eyebrow">ON THE LINEUP</span><h3>${escapeHtml(label)}</h3></div><span class="calendar-day-total">${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}</span></div>${dayEvents.length ? `<div class="calendar-event-list">${dayEvents.map(event => `<button class="calendar-event-item" data-open-event="${escapeAttribute(event.id)}"><span class="calendar-event-time">${escapeHtml(event.time)}</span><span class="calendar-event-title">${escapeHtml(event.title)}</span><span class="calendar-event-location">${escapeHtml(event.location)}</span><span class="calendar-event-arrow" aria-hidden="true">↗</span></button>`).join("")}</div>` : '<p class="calendar-empty">Nothing on this day. A little breathing room.</p>'}`;
}

function changeCalendarMonth(offset) {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + offset, 1);
  const prefix = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-`;
  const firstEventDate = events.map(eventDateKey).filter(key => key.startsWith(prefix)).sort()[0];
  selectedCalendarDate = firstEventDate || `${prefix}01`;
  renderCalendar();
}

function renderClubs() {
  const query = document.querySelector("#club-search").value.trim().toLowerCase();
  const selectedCategory = document.querySelector(".club-filter.selected").dataset.clubCategory;
  const filteredClubs = clubs.filter(club => {
    const matchesCategory = selectedCategory === "All" || club.category === selectedCategory;
    const matchesQuery = `${club.name} ${club.category} ${club.description} ${club.location}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
  document.querySelector("#club-grid").innerHTML = filteredClubs.map((club, index) => {
    const isJoined = joinedClubs.includes(club.id);
    const initials = club.name.split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase();
    return `<article class="club-card" style="animation-delay:${index * 55}ms"><div class="club-cover"><img src="${escapeAttribute(club.image)}" alt="${escapeAttribute(club.alt)}" loading="lazy"><span class="club-category">${escapeHtml(club.category)}</span><span class="club-monogram" aria-hidden="true">${escapeHtml(initials)}</span></div><div class="club-card-content"><div class="club-members"><span class="club-member-mark">●</span> ${club.members + (isJoined ? 1 : 0)} MEMBERS</div><h3>${escapeHtml(club.name)}</h3><p class="club-description">${escapeHtml(club.description)}</p><div class="club-meeting"><span aria-hidden="true">◷</span><span>${escapeHtml(club.meeting)}<small>${escapeHtml(club.location)}</small></span></div><button class="club-join${isJoined ? " joined" : ""}" data-join-club="${escapeAttribute(club.id)}" aria-pressed="${isJoined}">${isJoined ? "Joined ✓" : "Join the club ↗"}</button></div></article>`;
  }).join("");
  document.querySelector("#club-empty").hidden = filteredClubs.length > 0;
  document.querySelector("#club-grid").hidden = filteredClubs.length === 0;
  document.querySelector("#clubs-total").textContent = `${filteredClubs.length} CLUB${filteredClubs.length === 1 ? "" : "S"}`;
}

document.querySelector(".club-filters").addEventListener("click", event => {
  const filter = event.target.closest("[data-club-category]");
  if (!filter) return;
  document.querySelectorAll(".club-filter").forEach(button => button.classList.toggle("selected", button === filter));
  renderClubs();
});
document.querySelector("#club-search").addEventListener("input", renderClubs);
document.querySelector("#clear-club-search").addEventListener("click", () => {
  document.querySelector("#club-search").value = "";
  document.querySelectorAll(".club-filter").forEach(button => button.classList.toggle("selected", button.dataset.clubCategory === "All"));
  renderClubs();
});
document.querySelector("#club-grid").addEventListener("click", event => {
  const joinButton = event.target.closest("[data-join-club]");
  if (!joinButton) return;
  const id = joinButton.dataset.joinClub;
  joinedClubs = joinedClubs.includes(id) ? joinedClubs.filter(clubId => clubId !== id) : [...joinedClubs, id];
  storage.write("campusly-joined-clubs", joinedClubs);
  renderClubs();
  showToast(joinedClubs.includes(id) ? "You're in. Welcome to the club!" : "You left the club.");
});

document.querySelector("#calendar-grid").addEventListener("click", event => {
  const dateButton = event.target.closest("[data-date]");
  if (!dateButton) return;
  selectedCalendarDate = dateButton.dataset.date;
  renderCalendar();
});

document.querySelector("#calendar-prev").addEventListener("click", () => {
  changeCalendarMonth(-1);
});
document.querySelector("#calendar-next").addEventListener("click", () => {
  changeCalendarMonth(1);
});
document.querySelector("#calendar-today").addEventListener("click", () => {
  const today = new Date();
  calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  selectedCalendarDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  renderCalendar();
});

document.querySelector("#calendar-day-events").addEventListener("click", event => {
  const eventButton = event.target.closest("[data-open-event]");
  if (!eventButton) return;
  const selectedEvent = events.find(item => item.id === eventButton.dataset.openEvent);
  if (!selectedEvent) return;
  activeCategory = "All";
  savedOnly = false;
  document.querySelector("#search").value = selectedEvent.title;
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("selected", chip.dataset.category === "All"));
  renderEvents();
  location.hash = "events";
});

document.querySelector(".filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  savedOnly = false;
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("selected", chip === button));
  renderEvents();
});

document.querySelector("#search").addEventListener("input", renderEvents);
document.querySelector("#show-saved").addEventListener("click", () => {
  savedOnly = !savedOnly;
  activeCategory = "All";
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("selected", chip.dataset.category === "All"));
  renderEvents();
  if (savedOnly && saved.length === 0) showToast("Save an event first with the heart button.");
});
document.querySelector("#clear-filters").addEventListener("click", () => {
  activeCategory = "All";
  savedOnly = false;
  document.querySelector("#search").value = "";
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("selected", chip.dataset.category === "All"));
  renderEvents();
});

grid.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    const id = saveButton.dataset.save;
    saved = saved.includes(id) ? saved.filter(savedId => savedId !== id) : [...saved, id];
    storage.write("campusly-saved", saved);
    renderEvents();
    showToast(saved.includes(id) ? "Saved for later." : "Removed from your saved events.");
    return;
  }
  const rsvpButton = event.target.closest("[data-rsvp]");
  if (rsvpButton) {
    const id = rsvpButton.dataset.rsvp;
    rsvps = rsvps.includes(id) ? rsvps.filter(rsvpId => rsvpId !== id) : [...rsvps, id];
    storage.write("campusly-rsvps", rsvps);
    renderEvents();
    showToast(rsvps.includes(id) ? "You're on the list. See you there!" : "Your RSVP was removed.");
  }
});

const eventDialog = document.querySelector("#event-dialog");
document.querySelector("#create-event").addEventListener("click", () => eventDialog.showModal());
document.querySelector(".close-dialog").addEventListener("click", () => eventDialog.close());
eventDialog.addEventListener("click", event => { if (event.target === eventDialog) eventDialog.close(); });

document.querySelector("#event-form").addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const date = new Date(`${formData.get("date")}T12:00:00`);
  const day = date.toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase();
  const categoryImages = {
    Arts: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
    Social: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    Career: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
    Sports: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80"
  };
  const newEvent = {
    id: `event-${Date.now()}`,
    title: formData.get("title"),
    category: formData.get("category"),
    date: formData.get("date"),
    day,
    time: "TIME TBD",
    location: formData.get("location"),
    description: formData.get("description"),
    attendees: 1,
    image: categoryImages[formData.get("category")],
    alt: `${formData.get("category")} event on campus`
  };
  events = [newEvent, ...events];
  storage.write("campusly-events", events);
  event.currentTarget.reset();
  eventDialog.close();
  activeCategory = "All";
  savedOnly = false;
  document.querySelector("#search").value = "";
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("selected", chip.dataset.category === "All"));
  renderEvents();
  showToast("Your event is on the lineup!");
  renderCalendar();
});

renderEvents();
renderCalendar();
renderClubs();