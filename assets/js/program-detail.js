const urlParams = new URLSearchParams(window.location.search);
const programName = urlParams.get("program");

fetch("/json/programs.json")
  .then((response) => response.json())
  .then((programs) => {
    const selectedProgram = programs.find(
      (program) => program.name === programName
    );
    if (selectedProgram) {
      document.querySelector(".sec-title").textContent = selectedProgram.name;
      document.querySelector(".hero-title").textContent = selectedProgram.name;
      document.querySelector(".image-column .image img").src =
        selectedProgram.image;
      document.querySelector(".inner-column .text").textContent =
        selectedProgram.description;

      // Filter out the selected program from the list of programs
      const otherPrograms = programs.filter(
        (program) => program.name !== programName
      );

      const programCardsContainer = document.querySelector(".js-program-card");

      otherPrograms.slice(0, 3).forEach((program) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
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
            `;
        programCardsContainer.appendChild(listItem);
      });
    } else {
      console.error("Program not found");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
