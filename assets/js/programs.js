fetch("/json/programs.json")
  .then((response) => response.json())
  .then((programs) => {
    const programCard = document.querySelector(".js-program-card");

    function showProgram(programToDisplay) {
      const programHTML = programToDisplay
        .map(
          (program) => `
          <li>
                <div class="card">
                  <figure
                    class="card-banner img-holder"
                    style="--width: 400; --height: 470">
                    <img
                      src="${program.image}"
                      alt="${program.name}"
                      width="400"
                      height="470"
                      loading="lazy"
                      class="img-cover" />
                  </figure>

                  <div class="card-content">
                    <h3 class="h3">
                      <a href="program-description?program=${program.name}" class="card-title"
                        >${program.name}</a
                      >
                    </h3>

                    <a href="program-description?program=${program.name}" class="btn">Read More</a>
                  </div>
                </div>
              </li>
                    `
        )
        .join("");

      programCard.innerHTML = programHTML;
    }
    showProgram(programs);
  })
  .catch((err) => {
    console.error("Error fetching member: ", err);
  });
