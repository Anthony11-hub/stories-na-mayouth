fetch("/json/members.json")
  .then((response) => response.json())
  .then((members) => {
    const memberCard = document.querySelector(".js-member-card");

    function showMember(memberToDisplay) {
      const memberHTML = memberToDisplay
        .map(
          (member) => `
          <div class="t-card swiper-slide">
            <img
                src="/images/bg-top-3.jpg"
                alt=""
                class="bg-image" />
            <div class="image-content">
                <span class="overlay"></span>
                <div class="card-image">
                <img
                    src="${member.image}"
                    alt="${member.name}"
                    class="card-img" />
                </div>
            </div>

            <div class="card-content">
                <h2 class="name">${member.name}</h2>
                <p class="description">${member.title}</p>

                <a href="profile?member=${member.name}" class="btn">View Profile</a>
            </div>
            </div>
                    `
        )
        .join("");

      memberCard.innerHTML = memberHTML;
    }
    showMember(members);
  })
  .catch((err) => {
    console.error("Error fetching member: ", err);
  });
