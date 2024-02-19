/**
 * Fetches the response as JSON.
 *
 * @param {Response} response - The response to parse as JSON.
 * @returns {Promise<Object>} The parsed JSON response.
 */
fetch("/api/v1/post")
  .then((response) => response.json())
  .then((products) => {
    const productCard = document.querySelector(".js-products-list");
    const firstSearchBarUsingServer = document.querySelector(".first-search");
    const secondSearchBarUsingClient = document.querySelector(".second-search");
    const minPriceInput = document.querySelector("#min-price");
    const maxPriceInput = document.querySelector("#max-price");
    const categoryFilterDropdowns = document.querySelectorAll(".dropdown");
    const prevButton = document.querySelector(".prev-btn");
    const nextButton = document.querySelector(".next-btn");
    const pageCount = document.querySelector(".page-count");

    // Variables for pagination
    let currentPage = 1;

    // function to create a slug --- basically creating a URL friendly version of a string for SEO purposes
    function createSlug(title) {
      return title.toLowerCase().replace(/\s+/g, "-");
    }

    /**
     * @param {Object} productToDisplay - The products to display.
     */
    function showproduct(productToDisplay) {
      const productHTML = productToDisplay.data
        .map(
          (product) => `
          <li>
            <a href="product-detail?${createSlug(
              product.productTitle
            )}" onclick="setProductId('${product._id}')">
            <div class="product-card">
              <figure
                class="card-banner img-holder"
                style="--width: 400; --height: 290">
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

                <p class="product-price">${product.productPrice}</p>
              </div>
            </div>
            </a>
        </li>`
        )
        .join("");

      productCard.innerHTML = productHTML;
      pageCount.textContent = currentPage;
    }

    /**
     * Filters the products based on user input.
     */
    function filterProducts() {
      const searchText = firstSearchBarUsingServer.value;
      const minPrice = minPriceInput.value;
      const maxPrice = maxPriceInput.value;

      const queryParams = [`page=${currentPage}`];

      if (searchText) {
        queryParams.push(`name=${encodeURIComponent(searchText)}`);
      }

      categoryFilterDropdowns.forEach((dropdown) => {
        const selectedCategory =
          dropdown.querySelector(".selected").textContent;
        if (
          selectedCategory !== "Choose Category" &&
          selectedCategory !== "All Products"
        ) {
          queryParams.push(`category=${encodeURIComponent(selectedCategory)}`);
        }
      });

      // Include price filter
      if (minPrice) {
        queryParams.push(`numericFilters=productPrice>=${minPrice}`);
      }
      if (maxPrice) {
        queryParams.push(`numericFilters=productPrice<=${maxPrice}`);
      }

      const queryString = queryParams.join("&");

      fetch(`/api/v1/post?${queryString}`)
        .then((response) => response.json())
        .then((filteredProducts) => {
          showproduct(filteredProducts);
        })
        .catch((err) => {
          console.error("Error fetching filtered products: ", err);
        });
    }

    // client
    /**
     * Filters the products based on the input in the second search bar.
     *
     * @param {string} secondSearchText - The text to search for.
     */
    function secondSearchFilter(secondSearchText) {
      const secondSearchFilter = products.data.filter((product) =>
        product.productTitle
          .toLowerCase()
          .includes(secondSearchText.toLowerCase())
      );

      showproduct({ data: secondSearchFilter });
    }

    showproduct(products);

    // server
    firstSearchBarUsingServer.addEventListener("input", filterProducts);
    minPriceInput.addEventListener("input", filterProducts);
    maxPriceInput.addEventListener("input", filterProducts);
    categoryFilterDropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", filterProducts);
    });

    // client
    secondSearchBarUsingClient.addEventListener("input", (event) => {
      const secondSearchText = event.target.value;
      secondSearchFilter(secondSearchText);
    });

    // Pagination buttons
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        filterProducts();
      }
    });

    nextButton.addEventListener("click", () => {
      currentPage++;
      filterProducts();
    });

    // Function to set product ID in local storage
    window.setProductId = function (productId) {
      localStorage.setItem("productId", productId);
    };
  })
  .catch((err) => {
    console.error("Error fetching product: ", err);
  });
