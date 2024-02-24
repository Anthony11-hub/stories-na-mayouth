fetch("/json/events.json")
  .then((response) => response.json())
  .then((events) => {
    const eventCard = document.querySelector(".js-event-card");

    function showevent(eventToDisplay) {
      const eventHTML = eventToDisplay
        .map(
          (event) => `
            <li>
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

                    <p class="card-text">
                    ${event.eventDescription}
                    </p>

                    <a href="event-description?event=${event.eventTitle}" class="card-link">
                      <span class="span">Read More</span>

                      <ion-icon name="caret-forward"></ion-icon>
                    </a>
                  </div>
                </div>
              </li>
                    `
        )
        .join("");

      eventCard.innerHTML = eventHTML;
    }
    showevent(events);
  })
  .catch((err) => {
    console.error("Error fetching member: ", err);
  });
