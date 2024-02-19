document.addEventListener("DOMContentLoaded", function () {
  // Retrieve product ID from local storage
  const productId = localStorage.getItem("productId");

  fetch("/api/v1/post")
    .then((response) => response.json())
    .then((responseData) => {
      const products = responseData.data;

      /**
       * Format the product price in Kenyan Shillings.
       * @param {number} price - The product price.
       * @returns {string} The formatted price with KSH symbol.
       */
      function formatPrice(price) {
        const roundedPrice = Math.round(price); // Round to the nearest whole number

        const formattedPrice = new Intl.NumberFormat("en-KE", {
          style: "currency",
          currency: "KES", // Kenyan Shilling currency code
          minimumFractionDigits: 0, // Set the minimum fraction digits to 0
          maximumFractionDigits: 0, // Set the maximum fraction digits to 0
        }).format(roundedPrice);

        return formattedPrice;
      }

      const selectedproduct = products.find(
        (product) => product._id === productId
      );

      if (selectedproduct) {
        const selectedImageContainer = document.querySelector(
          ".selected-image figure img"
        );
        selectedImageContainer.src = `/posts/${selectedproduct.productImage[0]}`;

        const productImageSelectContainer = document.querySelector(
          ".product-image-select"
        );

        // Clear existing images in the productImageSelectContainer
        productImageSelectContainer.innerHTML = "";

        // Loop through product images and create image elements for each
        selectedproduct.productImage.forEach((image, index) => {
          const imageElement = document.createElement("img");
          imageElement.src = `/posts/${image}`;
          imageElement.width = 400;
          imageElement.height = 290;
          imageElement.loading = "lazy";
          imageElement.alt = "";
          imageElement.className = "img-cover";
          imageElement.id = `img-${index + 1}`;

          // Append the image element to the productImageSelectContainer
          productImageSelectContainer.appendChild(imageElement);
        });

        const createdAtDate = new Date(selectedproduct.createdAt);
        const formattedDate = createdAtDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        document.querySelector(".item-text").textContent = formattedDate;

        document.querySelector(
          ".product-details .product-content p"
        ).textContent = selectedproduct.productDescription;
        document.querySelector(
          ".product-details .product-category p"
        ).textContent = selectedproduct.productCategory;
        document.querySelector(
          ".product-details .product-name .h2"
        ).textContent = selectedproduct.productTitle;
        document.querySelector(
          ".product-details .product-price .h2"
        ).textContent = formatPrice(selectedproduct.productPrice);
        document.querySelector(
          ".product-details .product-specifics .availability"
        ).textContent = selectedproduct.productAvailability;
        document.querySelector(
          ".product-details .product-specifics .brand"
        ).textContent = selectedproduct.productBrand;
        document.querySelector(
          ".product-details .product-specifics .condition"
        ).textContent = selectedproduct.productCondition;

        // function to create a slug --- basically creating a URL friendly version of a string for SEO purposes
        function createSlug(title) {
          return title.toLowerCase().replace(/\s+/g, "-");
        }

        // Filter out the selected product from the list of products
        const otherproducts = products.filter(
          (product) => product._id !== productId
        );

        const productCardsContainer = document.querySelector(
          ".js-related-products"
        );

        otherproducts.slice(0, 4).forEach((product) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
          <a href="product-detail?${createSlug(
            product.productTitle
          )}" onclick="setProductId('${product._id}')">
            <div class="product-card">
              <figure
                class="card-banner img-holder"
                style="--width: 400; --height: 340">
                <img
                  src="../posts/${product.productImage[0]}"
                  width="400"
                  height="290"
                  loading="lazy"
                  alt="${product.productTitle}"
                  class="img-cover" />
              </figure>

              <div class="product-description">
                <h3>
                  <a href="product-detail?${createSlug(
                    product.productTitle
                  )}" onclick="setProductId('${
            product._id
          }')" class="card-title"
                    >${product.productTitle}</a
                  >
                </h3>

                <p class="product-price">${formatPrice(
                  product.productPrice
                )}</p>
              </div>
            </div>
          </a>
                `;
          productCardsContainer.appendChild(listItem);
        });

        // Function to set product ID in local storage
        window.setProductId = function (productId) {
          localStorage.setItem("productId", productId);
        };
      } else {
        console.error("product not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
