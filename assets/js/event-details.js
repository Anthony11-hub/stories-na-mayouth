const urlParams = new URLSearchParams(window.location.search);
const eventName = urlParams.get("event");

fetch("/json/events.json")
  .then((response) => response.json())
  .then((events) => {
    const selectedevent = events.find(
      (event) => event.eventTitle === eventName
    );

    console.log("eventName:", eventName);
    console.log("events:", events);
    if (selectedevent) {
      document.querySelector(".blog .h2").textContent =
        selectedevent.eventTitle;
      document.querySelector(".blog-image img").src = selectedevent.eventImage;
      document.querySelector(".blog-text-content").textContent =
        selectedevent.eventContent;
      document.querySelector(".text-sm time").textContent = selectedevent.date;

      // Filter out the selected event from the list of events
      const otherevents = events.filter(
        (event) => event.eventTitle !== eventName
      );

      const eventCardsContainer = document.querySelector(".js-event-card");

      otherevents.slice(0, 3).forEach((event) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
                  <div class="blog-card">
                    <figure
                      class="card-banner img-holder"
                      style="--width: 400; --height: 290">
                      <img
                        src="${event.eventImage}"
                        width="400"
                        height="290"
                        loading="lazy"
                        alt="${event.eventTitle}"
                        class="img-cover" />
                    </figure>
                    <div class="card-content">
                      <ul class="card-meta-list">
                        <li class="card-meta-item">
                          <ion-icon name="calendar-outline"></ion-icon>

                          <time datetime="2022-09-19" class="item-text"
                            >${event.date}</time
                          >
                        </li>
                      </ul>

                      <h3>
                        <a href="event-description?event=${event.eventTitle}" class="card-title">${event.eventTitle}</a>
                      </h3>

                      <a href="event-description?event=${event.eventTitle}" class="card-link">
                        <span class="span">Read More</span>

                        <ion-icon name="caret-forward"></ion-icon>
                      </a>
                    </div>
                  </div>
            `;
        eventCardsContainer.appendChild(listItem);
      });
    } else {
      console.error("event not found");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
