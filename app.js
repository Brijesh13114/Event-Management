"use strict";

/* =========================================================
   CAMPUSLY
   Complete Event + Calendar + Club Management
========================================================= */


/* =========================
   DATA
========================= */

const initialEvents = [
  {
    id: "open-mic",
    title: "Open Mic After Hours",
    category: "Arts",
    date: "2026-10-04",
    time: "19:30",
    location: "The Green Room",
    description: "Poetry, half-finished songs, and the best kind of stage fright.",
    attendees: 38,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85",
    alt: "Live music performance under warm lights"
  },
  {
    id: "career-coffee",
    title: "Coffee With Creatives",
    category: "Career",
    date: "2026-10-05",
    time: "10:00",
    location: "Morrow Hall · 204",
    description: "Real talk with alumni who turned a side project into a career.",
    attendees: 24,
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
    alt: "Team brainstorming around a table"
  },
  {
    id: "film-lawn",
    title: "Movies on the Lawn",
    category: "Social",
    date: "2026-10-05",
    time: "20:00",
    location: "South Quad",
    description: "Bring a blanket. We’ll bring the big screen and the popcorn.",
    attendees: 116,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85",
    alt: "Cinema"
  },
  {
    id: "photo-walk",
    title: "The Analog Photo Walk",
    category: "Arts",
    date: "2026-10-06",
    time: "14:00",
    location: "Meet at the Bell Tower",
    description: "A slow wander around campus. Cameras optional, curiosity not.",
    attendees: 19,
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=85",
    alt: "Camera"
  },
  {
    id: "pickup-soccer",
    title: "Sunday Pickup Soccer",
    category: "Sports",
    date: "2026-10-06",
    time: "16:30",
    location: "Riverside Field",
    description: "No tryouts, no pressure. Just bring a light and a dark shirt.",
    attendees: 31,
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=85",
    alt: "Soccer game"
  },
  {
    id: "swap-meet",
    title: "Swap, Don't Shop",
    category: "Social",
    date: "2026-10-08",
    time: "12:00",
    location: "Student Union · Patio",
    description: "Trade that book, plant, or jacket you keep meaning to pass on.",
    attendees: 52,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
    alt: "Clothing swap"
  }
];


const clubs = [
  {
    id: "film-society",
    name: "Midnight Film Society",
    category: "Arts",
    members: 84,
    meeting: "Thursdays · 7:00 PM",
    location: "Media Lab",
    description: "For the films that stay with you after the credits roll.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85",
    alt: "Movie theater"
  },
  {
    id: "makers",
    name: "The Makers Table",
    category: "Academic",
    members: 62,
    meeting: "Wednesdays · 5:30 PM",
    location: "Engineering Workshop",
    description: "Make something with your hands. Figure out the rest together.",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85",
    alt: "Creative workshop"
  },
  {
    id: "garden",
    name: "Campus Garden Crew",
    category: "Service",
    members: 47,
    meeting: "Saturdays · 9:00 AM",
    location: "East Garden",
    description: "Grow food, learn as you go, and get your hands in the soil.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85",
    alt: "Community garden"
  },
  {
    id: "radio",
    name: "WCRU Student Radio",
    category: "Arts",
    members: 39,
    meeting: "Tuesdays · 6:00 PM",
    location: "Union · Studio B",
    description: "Find your voice, share your playlists, keep campus curious.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=85",
    alt: "Recording studio"
  },
  {
    id: "run-club",
    name: "Easy Miles Run Club",
    category: "Sports",
    members: 103,
    meeting: "Mondays · 4:30 PM",
    location: "Meet at the Bell Tower",
    description: "All paces welcome. We always wait for the last person.",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=85",
    alt: "Runners"
  },
  {
    id: "tabletop",
    name: "Tabletop & Tea",
    category: "Social",
    members: 58,
    meeting: "Fridays · 6:30 PM",
    location: "Student Union · Lounge",
    description: "Good games, warm tea, and very questionable strategies.",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=900&q=85",
    alt: "Board game"
  }
];


/* =========================
   STORAGE
========================= */

const storage = {

  read(key, fallback) {
    try {
      const value = localStorage.getItem(key);

      if (value === null) {
        return fallback;
      }

      const parsed = JSON.parse(value);

      return parsed ?? fallback;

    } catch (error) {
      return fallback;
    }
  },

  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      showToast("Could not save changes.");
    }
  }

};


/* =========================
   STATE
========================= */

let events = storage.read(
  "campusly-events",
  initialEvents
);

let saved = storage.read(
  "campusly-saved",
  []
);

let rsvps = storage.read(
  "campusly-rsvps",
  []
);

let joinedClubs = storage.read(
  "campusly-joined-clubs",
  []
);

let activeCategory = "All";
let savedOnly = false;

const now = new Date();

let calendarMonth = new Date(
  now.getFullYear(),
  now.getMonth(),
  1
);

let selectedCalendarDate = formatDateKey(
  now
);


/* =========================
   DOM
========================= */

const grid = document.querySelector("#event-grid");
const emptyState = document.querySelector("#empty-state");
const toast = document.querySelector("#toast");

const eventDialog = document.querySelector("#event-dialog");
const detailsDialog = document.querySelector("#details-dialog");

let toastTimer;


/* =========================
   HELPERS
========================= */

function escapeHtml(value) {

  return String(value ?? "").replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]
  );

}


function escapeAttribute(value) {
  return escapeHtml(value);
}


function formatDateKey(date) {

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function formatDateLabel(dateString) {

  if (!dateString) return "";

  const date = new Date(
    `${dateString}T12:00:00`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }
  );
}


function formatShortDate(dateString) {

  const date = new Date(
    `${dateString}T12:00:00`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit"
    }
  ).toUpperCase();
}


function formatTime(time) {

  if (!time) return "Time TBD";

  const parts = time.split(":");

  const hour = Number(parts[0]);
  const minute = Number(parts[1] || 0);

  const suffix = hour >= 12 ? "PM" : "AM";

  const displayHour =
    hour % 12 || 12;

  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}


function showToast(message) {

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("visible");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("visible");

  }, 2600);

}


/* =========================
   IMAGE BY CATEGORY
========================= */

function getCategoryImage(category) {

  const images = {

    Arts:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85",

    Career:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",

    Social:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",

    Sports:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=85",

    Academic:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85",

    Service:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85"

  };

  return images[category] || images.Social;
}


/* =========================
   EVENT RENDER
========================= */

function renderEvents() {

  const searchInput =
    document.querySelector("#search");

  const query =
    searchInput?.value.trim().toLowerCase() || "";


  const filtered = events
    .filter(event => {

      const categoryMatch =
        activeCategory === "All" ||
        event.category === activeCategory;

      const searchMatch =
        `${event.title}
        ${event.description}
        ${event.location}
        ${event.category}`
          .toLowerCase()
          .includes(query);

      const savedMatch =
        !savedOnly ||
        saved.includes(event.id);

      return (
        categoryMatch &&
        searchMatch &&
        savedMatch
      );

    })
    .sort((a, b) => {

      const first =
        `${a.date} ${a.time}`;

      const second =
        `${b.date} ${b.time}`;

      return first.localeCompare(second);

    });


  grid.innerHTML = filtered
    .map((event, index) => {

      const isSaved =
        saved.includes(event.id);

      const hasRsvp =
        rsvps.includes(event.id);

      return `

        <article
          class="event-card"
          style="animation-delay:${index * 45}ms"
        >

          <div class="event-image">

            <img
              src="${escapeAttribute(event.image)}"
              alt="${escapeAttribute(event.alt || event.title)}"
              loading="lazy"
            >

            <span class="event-category">
              ${escapeHtml(event.category)}
            </span>

            <button
              class="save-button ${isSaved ? "saved" : ""}"
              data-save="${escapeAttribute(event.id)}"
              aria-label="Save event"
              aria-pressed="${isSaved}"
            >
              ${isSaved ? "♥" : "♡"}
            </button>

          </div>


          <div class="card-meta">

            <span class="date">
              ${escapeHtml(formatShortDate(event.date))}
            </span>

            <span>
              ${escapeHtml(formatTime(event.time))}
            </span>

            <span>·</span>

            <span>
              ${escapeHtml(event.location)}
            </span>

          </div>


          <h3>
            ${escapeHtml(event.title)}
          </h3>


          <p class="event-description">
            ${escapeHtml(event.description)}
          </p>


          <div class="card-bottom">

            <span class="attendees">
              ${event.attendees + (hasRsvp ? 1 : 0)} going
            </span>

            <button
              class="rsvp-button"
              data-rsvp="${escapeAttribute(event.id)}"
            >
              ${
                hasRsvp
                  ? "You're going ✓"
                  : "Count me in ↗"
              }
            </button>

          </div>

        </article>

      `;

    })
    .join("");


  emptyState.hidden =
    filtered.length > 0;

  grid.hidden =
    filtered.length === 0;


  document.querySelector("#event-count")
    .textContent =
      String(filtered.length).padStart(2, "0");


  document.querySelector("#hero-event-count")
    .textContent =
      String(events.length).padStart(2, "0");


  document.querySelector("#show-saved")
    .innerHTML =
      savedOnly
        ? "← All events"
        : `♡ <span>Saved</span>`;


  updateCommunityCount();

}


/* =========================
   COMMUNITY COUNT
========================= */

function updateCommunityCount() {

  const eventPeople =
    events.reduce(
      (sum, event) =>
        sum + Number(event.attendees || 0),
      0
    );

  const clubPeople =
    clubs.reduce(
      (sum, club) =>
        sum + Number(club.members || 0),
      0
    );

  const total =
    Math.round(
      (eventPeople + clubPeople) / 2
    );

  document.querySelector(
    "#hero-community-count"
  ).textContent = `${total}+`;

}


/* =========================
   CALENDAR
========================= */

function renderCalendar() {

  const year =
    calendarMonth.getFullYear();

  const month =
    calendarMonth.getMonth();

  const firstWeekday =
    new Date(
      year,
      month,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  const eventMap = new Map();


  events.forEach(event => {

    if (!event.date) return;

    const existing =
      eventMap.get(event.date) || [];

    existing.push(event);

    eventMap.set(
      event.date,
      existing
    );

  });


  document.querySelector(
    "#calendar-month-label"
  ).textContent =
    calendarMonth.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric"
      }
    );


  const weekdays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];


  const cells =
    weekdays.map(
      day =>
        `<div class="calendar-weekday">${day}</div>`
    );


  for (
    let i = 0;
    i < firstWeekday;
    i++
  ) {

    cells.push(
      `<div class="calendar-date outside-month"></div>`
    );

  }


  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const key =
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


    const dayEvents =
      eventMap.get(key) || [];


    const selected =
      key === selectedCalendarDate;


    cells.push(`

      <button
        class="calendar-date
          ${dayEvents.length ? "has-events" : ""}
          ${selected ? "selected" : ""}"
        data-date="${key}"
        aria-pressed="${selected}"
      >

        <span class="calendar-day-number">
          ${day}
        </span>

        ${
          dayEvents.length
            ? `
              <span
                class="calendar-event-dots"
                aria-hidden="true"
              >
                ${dayEvents
                  .slice(0, 3)
                  .map(() => "<i></i>")
                  .join("")}
              </span>

              <span class="calendar-event-count">
                ${dayEvents.length}
                event${dayEvents.length === 1 ? "" : "s"}
              </span>
            `
            : ""
        }

      </button>

    `);

  }


  document.querySelector(
    "#calendar-grid"
  ).innerHTML =
    cells.join("");


  renderCalendarDay(
    eventMap.get(selectedCalendarDate) || []
  );

}


/* =========================
   CALENDAR DAY
========================= */

function renderCalendarDay(dayEvents) {

  const date =
    new Date(
      `${selectedCalendarDate}T12:00:00`
    );


  const label =
    date.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric"
      }
    );


  const panel =
    document.querySelector(
      "#calendar-day-events"
    );


  panel.innerHTML = `

    <div class="calendar-day-heading">

      <div>

        <span class="eyebrow">
          ON THE LINEUP
        </span>

        <h3>
          ${escapeHtml(label)}
        </h3>

      </div>

      <span class="calendar-day-total">
        ${dayEvents.length}
        event${dayEvents.length === 1 ? "" : "s"}
      </span>

    </div>


    ${
      dayEvents.length
        ? `

          <div class="calendar-event-list">

            ${dayEvents.map(event => `

              <button
                class="calendar-event-item"
                data-open-event="${escapeAttribute(event.id)}"
              >

                <span class="calendar-event-time">
                  ${escapeHtml(formatTime(event.time))}
                </span>

                <span class="calendar-event-title">
                  ${escapeHtml(event.title)}
                </span>

                <span class="calendar-event-location">
                  ${escapeHtml(event.location)}
                </span>

                <span class="calendar-event-arrow">
                  ↗
                </span>

              </button>

            `).join("")}

          </div>

        `
        : `
          <p class="calendar-empty">
            Nothing on this day.
            A little breathing room.
          </p>
        `
    }

  `;

}


/* =========================
   CHANGE MONTH
========================= */

function changeCalendarMonth(offset) {

  calendarMonth =
    new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + offset,
      1
    );


  const prefix =
    `${calendarMonth.getFullYear()}-${String(
      calendarMonth.getMonth() + 1
    ).padStart(2, "0")}-`;


  const firstEvent =
    events
      .map(event => event.date)
      .filter(date =>
        date?.startsWith(prefix)
      )
      .sort()[0];


  selectedCalendarDate =
    firstEvent ||
    `${prefix}01`;


  renderCalendar();

}


/* =========================
   CLUBS
========================= */

function renderClubs() {

  const query =
    document.querySelector(
      "#club-search"
    ).value.trim().toLowerCase();


  const selectedButton =
    document.querySelector(
      ".club-filter.selected"
    );


  const category =
    selectedButton?.dataset.clubCategory ||
    "All";


  const filtered =
    clubs.filter(club => {

      const categoryMatch =
        category === "All" ||
        club.category === category;


      const queryMatch =
        `${club.name}
        ${club.category}
        ${club.description}
        ${club.location}`
          .toLowerCase()
          .includes(query);


      return (
        categoryMatch &&
        queryMatch
      );

    });


  document.querySelector(
    "#club-grid"
  ).innerHTML = filtered
    .map((club, index) => {

      const joined =
        joinedClubs.includes(club.id);


      const initials =
        club.name
          .split(/\s+/)
          .slice(0, 2)
          .map(word => word[0])
          .join("")
          .toUpperCase();


      return `

        <article
          class="club-card"
          style="animation:rise .45s ${index * 45}ms both"
        >

          <div class="club-cover">

            <img
              src="${escapeAttribute(club.image)}"
              alt="${escapeAttribute(club.alt)}"
              loading="lazy"
            >

            <span class="club-category">
              ${escapeHtml(club.category)}
            </span>

            <span class="club-monogram">
              ${escapeHtml(initials)}
            </span>

          </div>


          <div class="club-card-content">

            <div class="club-members">
              <span class="club-member-mark">●</span>
              ${club.members + (joined ? 1 : 0)} MEMBERS
            </div>

            <h3>
              ${escapeHtml(club.name)}
            </h3>

            <p class="club-description">
              ${escapeHtml(club.description)}
            </p>


            <div class="club-meeting">

              <span>◷</span>

              <span>
                ${escapeHtml(club.meeting)}

                <small>
                  ${escapeHtml(club.location)}
                </small>
              </span>

            </div>


            <button
              class="club-join ${joined ? "joined" : ""}"
              data-join-club="${escapeAttribute(club.id)}"
              aria-pressed="${joined}"
            >
              ${
                joined
                  ? "Joined ✓"
                  : "Join the club ↗"
              }
            </button>

          </div>

        </article>

      `;

    })
    .join("");


  document.querySelector(
    "#club-empty"
  ).hidden =
    filtered.length > 0;


  document.querySelector(
    "#club-grid"
  ).hidden =
    filtered.length === 0;


  document.querySelector(
    "#clubs-total"
  ).textContent =
    `${filtered.length} CLUB${filtered.length === 1 ? "" : "S"}`;


  document.querySelector(
    "#hero-club-count"
  ).textContent =
    String(clubs.length).padStart(2, "0");

}


/* =========================
   EVENT DETAILS
========================= */

function openEventDetails(id) {

  const event =
    events.find(item =>
      item.id === id
    );


  if (!event) return;


  const isSaved =
    saved.includes(event.id);


  const going =
    rsvps.includes(event.id);


  document.querySelector(
    "#details-content"
  ).innerHTML = `

    <img
      class="details-image"
      src="${escapeAttribute(event.image)}"
      alt="${escapeAttribute(event.alt || event.title)}"
    >


    <div class="details-body">

      <button
        class="details-close"
        data-close-details
        aria-label="Close"
      >
        ×
      </button>


      <span class="details-category">
        ${escapeHtml(event.category)}
      </span>


      <h2>
        ${escapeHtml(event.title)}
      </h2>


      <p class="details-description">
        ${escapeHtml(event.description)}
      </p>


      <div class="details-info">

        <div>
          <strong>Date</strong>
          <span>
            ${escapeHtml(formatDateLabel(event.date))}
          </span>
        </div>

        <div>
          <strong>Time</strong>
          <span>
            ${escapeHtml(formatTime(event.time))}
          </span>
        </div>

        <div>
          <strong>Location</strong>
          <span>
            ${escapeHtml(event.location)}
          </span>
        </div>

      </div>


      <div class="details-actions">

        <button
          class="primary-button"
          data-detail-rsvp="${escapeAttribute(event.id)}"
        >
          ${
            going
              ? "You're going ✓"
              : "Count me in ↗"
          }
        </button>


        <button
          class="secondary-button"
          data-detail-save="${escapeAttribute(event.id)}"
        >
          ${
            isSaved
              ? "♥ Saved"
              : "♡ Save event"
          }
        </button>


        <button
          class="secondary-button"
          data-edit-event="${escapeAttribute(event.id)}"
        >
          ✎ Edit
        </button>


        <button
          class="danger-button"
          data-delete-event="${escapeAttribute(event.id)}"
        >
          Delete
        </button>

      </div>

    </div>

  `;


  detailsDialog.showModal();

}


/* =========================
   CREATE / EDIT MODAL
========================= */

function openCreateModal() {

  document.querySelector(
    "#event-form"
  ).reset();


  document.querySelector(
    "#edit-event-id"
  ).value = "";


  document.querySelector(
    "#form-submit-text"
  ).textContent =
    "Publish event ↗";


  document.querySelector(
    "#event-date"
  ).value =
    formatDateKey(
      new Date()
    );


  eventDialog.showModal();

}


function openEditModal(id) {

  const event =
    events.find(item =>
      item.id === id
    );


  if (!event) return;


  document.querySelector(
    "#edit-event-id"
  ).value = event.id;


  document.querySelector(
    "#event-title"
  ).value = event.title;


  document.querySelector(
    "#event-category"
  ).value = event.category;


  document.querySelector(
    "#event-date"
  ).value = event.date;


  document.querySelector(
    "#event-time"
  ).value = event.time;


  document.querySelector(
    "#event-location"
  ).value = event.location;


  document.querySelector(
    "#event-description"
  ).value = event.description;


  document.querySelector(
    "#form-submit-text"
  ).textContent =
    "Save changes ✓";


  eventDialog.showModal();

}


/* =========================
   EVENT FORM
========================= */

document.querySelector(
  "#event-form"
).addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const formData =
      new FormData(
        event.currentTarget
      );


    const editId =
      formData.get("editId");


    const title =
      String(formData.get("title")).trim();


    const category =
      String(formData.get("category"));


    const date =
      String(formData.get("date"));


    const time =
      String(formData.get("time"));


    const location =
      String(formData.get("location")).trim();


    const description =
      String(formData.get("description")).trim();


    if (
      !title ||
      !category ||
      !date ||
      !time ||
      !location ||
      !description
    ) {

      showToast(
        "Please complete all fields."
      );

      return;

    }


    if (editId) {

      const existing =
        events.find(
          item =>
            item.id === editId
        );


      if (!existing) return;


      events =
        events.map(item => {

          if (item.id !== editId) {
            return item;
          }


          return {

            ...item,

            title,
            category,
            date,
            time,
            location,
            description,

            image:
              item.image ||
              getCategoryImage(category),

            alt:
              `${category} event on campus`

          };

        });


      storage.write(
        "campusly-events",
        events
      );


      showToast(
        "Event updated successfully."
      );

    } else {

      const newEvent = {

        id:
          `event-${Date.now()}`,

        title,

        category,

        date,

        time,

        location,

        description,

        attendees: 0,

        image:
          getCategoryImage(category),

        alt:
          `${category} event on campus`

      };


      events = [
        newEvent,
        ...events
      ];


      storage.write(
        "campusly-events",
        events
      );


      showToast(
        "Your event is on the lineup!"
      );

    }


    event.currentTarget.reset();

    eventDialog.close();

    activeCategory = "All";
    savedOnly = false;

    document.querySelector(
      "#search"
    ).value = "";


    document.querySelectorAll(
      ".filter-chip"
    ).forEach(button => {

      button.classList.toggle(
        "selected",
        button.dataset.category === "All"
      );

    });


    renderEvents();
    renderCalendar();

  }
);


/* =========================
   EVENT GRID ACTIONS
========================= */

grid.addEventListener(
  "click",
  event => {

    const saveButton =
      event.target.closest(
        "[data-save]"
      );


    if (saveButton) {

      const id =
        saveButton.dataset.save;


      if (saved.includes(id)) {

        saved =
          saved.filter(
            savedId =>
              savedId !== id
          );

        showToast(
          "Removed from saved events."
        );

      } else {

        saved = [
          ...saved,
          id
        ];

        showToast(
          "Event saved for later."
        );

      }


      storage.write(
        "campusly-saved",
        saved
      );


      renderEvents();

      return;

    }


    const rsvpButton =
      event.target.closest(
        "[data-rsvp]"
      );


    if (rsvpButton) {

      const id =
        rsvpButton.dataset.rsvp;


      toggleRsvp(id);

      return;

    }


    const card =
      event.target.closest(
        ".event-card"
      );


    if (card) {

      const save =
        card.querySelector(
          "[data-save]"
        );


      if (save) {
        openEventDetails(
          save.dataset.save
        );
      }

    }

  }
);


/* =========================
   RSVP
========================= */

function toggleRsvp(id) {

  if (rsvps.includes(id)) {

    rsvps =
      rsvps.filter(
        item => item !== id
      );

    showToast(
      "Your RSVP was removed."
    );

  } else {

    rsvps = [
      ...rsvps,
      id
    ];

    showToast(
      "You're on the list. See you there!"
    );

  }


  storage.write(
    "campusly-rsvps",
    rsvps
  );


  renderEvents();

  renderCalendar();

}


/* =========================
   FILTERS
========================= */

document.querySelector(
  ".filters"
).addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-category]"
      );


    if (!button) return;


    activeCategory =
      button.dataset.category;


    savedOnly = false;


    document.querySelectorAll(
      ".filter-chip"
    ).forEach(chip => {

      chip.classList.toggle(
        "selected",
        chip === button
      );

    });


    renderEvents();

  }
);


/* =========================
   SEARCH
========================= */

document.querySelector(
  "#search"
).addEventListener(
  "input",
  renderEvents
);


/* =========================
   SAVED EVENTS
========================= */

document.querySelector(
  "#show-saved"
).addEventListener(
  "click",
  () => {

    savedOnly =
      !savedOnly;


    activeCategory =
      "All";


    document.querySelectorAll(
      ".filter-chip"
    ).forEach(chip => {

      chip.classList.toggle(
        "selected",
        chip.dataset.category === "All"
      );

    });


    renderEvents();


    if (
      savedOnly &&
      saved.length === 0
    ) {

      showToast(
        "Save an event first."
      );

    }

  }
);


/* =========================
   CLEAR FILTERS
========================= */

function clearEventFilters() {

  activeCategory = "All";
  savedOnly = false;


  document.querySelector(
    "#search"
  ).value = "";


  document.querySelectorAll(
    ".filter-chip"
  ).forEach(chip => {

    chip.classList.toggle(
      "selected",
      chip.dataset.category === "All"
    );

  });


  renderEvents();

}


document.querySelector(
  "#clear-filters"
).addEventListener(
  "click",
  clearEventFilters
);


document.querySelector(
  "#empty-clear"
).addEventListener(
  "click",
  clearEventFilters
);


/* =========================
   CALENDAR CONTROLS
========================= */

document.querySelector(
  "#calendar-prev"
).addEventListener(
  "click",
  () =>
    changeCalendarMonth(-1)
);


document.querySelector(
  "#calendar-next"
).addEventListener(
  "click",
  () =>
    changeCalendarMonth(1)
);


document.querySelector(
  "#calendar-today"
).addEventListener(
  "click",
  () => {

    const today =
      new Date();


    calendarMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );


    selectedCalendarDate =
      formatDateKey(today);


    renderCalendar();

  }
);


/* =========================
   CALENDAR DATE CLICK
========================= */

document.querySelector(
  "#calendar-grid"
).addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-date]"
      );


    if (!button) return;


    selectedCalendarDate =
      button.dataset.date;


    renderCalendar();

  }
);


/* =========================
   CALENDAR EVENT CLICK
========================= */

document.querySelector(
  "#calendar-day-events"
).addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-open-event]"
      );


    if (!button) return;


    openEventDetails(
      button.dataset.openEvent
    );

  }
);


/* =========================
   CLUB FILTERS
========================= */

document.querySelector(
  ".club-filters"
).addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-club-category]"
      );


    if (!button) return;


    document.querySelectorAll(
      ".club-filter"
    ).forEach(item => {

      item.classList.toggle(
        "selected",
        item === button
      );

    });


    renderClubs();

  }
);


/* =========================
   CLUB SEARCH
========================= */

document.querySelector(
  "#club-search"
).addEventListener(
  "input",
  renderClubs
);


document.querySelector(
  "#clear-club-search"
).addEventListener(
  "click",
  () => {

    document.querySelector(
      "#club-search"
    ).value = "";


    document.querySelectorAll(
      ".club-filter"
    ).forEach(button => {

      button.classList.toggle(
        "selected",
        button.dataset.clubCategory === "All"
      );

    });


    renderClubs();

  }
);


/* =========================
   CLUB JOIN
========================= */

document.querySelector(
  "#club-grid"
).addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-join-club]"
      );


    if (!button) return;


    const id =
      button.dataset.joinClub;


    if (joinedClubs.includes(id)) {

      joinedClubs =
        joinedClubs.filter(
          clubId =>
            clubId !== id
        );

      showToast(
        "You left the club."
      );

    } else {

      joinedClubs = [
        ...joinedClubs,
        id
      ];

      showToast(
        "You're in. Welcome to the club!"
      );

    }


    storage.write(
      "campusly-joined-clubs",
      joinedClubs
    );


    renderClubs();

  }
);


/* =========================
   CREATE BUTTONS
========================= */

document.querySelector(
  "#create-event"
).addEventListener(
  "click",
  openCreateModal
);


document.querySelector(
  "#hero-create"
).addEventListener(
  "click",
  openCreateModal
);


/* =========================
   CLOSE EVENT MODAL
========================= */

document.querySelectorAll(
  ".close-dialog"
).forEach(button => {

  button.addEventListener(
    "click",
    () => {

      eventDialog.close();

    }
  );

});


eventDialog.addEventListener(
  "click",
  event => {

    if (
      event.target === eventDialog
    ) {

      eventDialog.close();

    }

  }
);


/* =========================
   DETAILS ACTIONS
========================= */

detailsDialog.addEventListener(
  "click",
  event => {

    if (
      event.target === detailsDialog
    ) {

      detailsDialog.close();

      return;

    }


    const close =
      event.target.closest(
        "[data-close-details]"
      );


    if (close) {

      detailsDialog.close();

      return;

    }


    const rsvp =
      event.target.closest(
        "[data-detail-rsvp]"
      );


    if (rsvp) {

      toggleRsvp(
        rsvp.dataset.detailRsvp
      );

      openEventDetails(
        rsvp.dataset.detailRsvp
      );

      return;

    }


    const save =
      event.target.closest(
        "[data-detail-save]"
      );


    if (save) {

      const id =
        save.dataset.detailSave;


      if (saved.includes(id)) {

        saved =
          saved.filter(
            item => item !== id
          );

        showToast(
          "Removed from saved events."
        );

      } else {

        saved = [
          ...saved,
          id
        ];

        showToast(
          "Event saved."
        );

      }


      storage.write(
        "campusly-saved",
        saved
      );


      openEventDetails(id);

      renderEvents();

      return;

    }


    const edit =
      event.target.closest(
        "[data-edit-event]"
      );


    if (edit) {

      const id =
        edit.dataset.editEvent;


      detailsDialog.close();

      openEditModal(id);

      return;

    }


    const deleteButton =
      event.target.closest(
        "[data-delete-event]"
      );


    if (deleteButton) {

      const id =
        deleteButton.dataset.deleteEvent;


      deleteEvent(id);

    }

  }
);


/* =========================
   DELETE EVENT
========================= */

function deleteEvent(id) {

  const event =
    events.find(
      item => item.id === id
    );


  if (!event) return;


  const confirmed =
    window.confirm(
      `Delete "${event.title}"?`
    );


  if (!confirmed) return;


  events =
    events.filter(
      item => item.id !== id
    );


  saved =
    saved.filter(
      item => item !== id
    );


  rsvps =
    rsvps.filter(
      item => item !== id
    );


  storage.write(
    "campusly-events",
    events
  );


  storage.write(
    "campusly-saved",
    saved
  );


  storage.write(
    "campusly-rsvps",
    rsvps
  );


  detailsDialog.close();


  renderEvents();

  renderCalendar();


  showToast(
    "Event deleted."
  );

}


/* =========================
   NAVIGATION
========================= */

document.querySelectorAll(
  ".main-nav a, .footer-links a"
).forEach(link => {

  link.addEventListener(
    "click",
    () => {

      document.querySelectorAll(
        ".main-nav a"
      ).forEach(item => {

        item.classList.toggle(
          "active",
          item.getAttribute("href") ===
          link.getAttribute("href")
        );

      });

    }
  );

});


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      if (
        eventDialog.open
      ) {
        eventDialog.close();
      }

      if (
        detailsDialog.open
      ) {
        detailsDialog.close();
      }

    }

  }
);


/* =========================
   INITIALIZE
========================= */

renderEvents();

renderCalendar();

renderClubs();

updateCommunityCount();

console.log(
  "Campusly loaded successfully 🚀"
);