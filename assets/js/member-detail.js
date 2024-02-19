const urlParams = new URLSearchParams(window.location.search);
const memberName = urlParams.get("member");

/**
 * Fetches the JSON data from the given URL and returns a Promise that resolves to the parsed JSON data.
 *
 * @param {string} url - The URL of the resource to fetch
 * @returns {Promise<any>} A Promise that resolves to the parsed JSON data
 */
fetch("/json/members.json")
  .then((response) => response.json())
  .then((members) => {
    const selectedMember = members.find((member) => member.name === memberName);
    if (selectedMember) {
      document.querySelector(".sec-title .name").textContent =
        selectedMember.name;
      document.querySelector(".hero-title .span").textContent =
        selectedMember.name;
      document.querySelector(".image-column .image img").src =
        selectedMember.image;
      document.querySelector(".inner-column .text").textContent =
        selectedMember.bio;
    } else {
      console.error("Member not found");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
