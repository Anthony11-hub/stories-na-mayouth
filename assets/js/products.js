// Variables for pagination
let currentPage = 1;
let totalProducts = 0; // Initialize totalProducts to 0
let productsPerPage = 0;

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
    // const pageCount = document.querySelector(".page-count");

    // function to create a slug --- basically creating a URL friendly version of a string for SEO purposes
    function createSlug(title) {
      return title.toLowerCase().replace(/\s+/g, "-");
    }

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

    // Variables for pagination
    totalProducts = products.data.length; // Update totalProducts
    productsPerPage = 15; // Update productsPerPage

    // console.log(products.data.length);

    const indexOfLastPage = currentPage * productsPerPage;
    const indexOfFirstPage = indexOfLastPage - productsPerPage;
    const currentItems = products.data.slice(indexOfFirstPage, indexOfLastPage);

    /**
     * @param {Object} productToDisplay - The products to display.
     */
    function showproduct(productToDisplay) {
      const productsArray = Array.isArray(productToDisplay)
        ? productToDisplay
        : [productToDisplay]; // Convert to an array if it's not already

      const productHTML = productsArray
        .map(
          (product) => `
          <li>
            <a href="product-detail?${createSlug(
              product.productTitle
            )}" onclick="setProductId('${product._id}')">
            <div class="product-card">
              <figure
                class="card-banner img-holder"
                style="--width: 400; --height: 340">
                <img
                  src="${product.productImage[0]}"
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
        </li>`
        )
        .join("");

      productCard.innerHTML = productHTML;

      // pageCount.textContent = currentPage;
    }

    /**
     * Filters the products based on user input.
     */
    function filterProducts() {
      const searchText = firstSearchBarUsingServer.value;
      const minPrice = minPriceInput.value;
      const maxPrice = maxPriceInput.value;

      const queryParams = [`page=${currentPage}`];

      // console.log(queryParams);

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
          showproduct(filteredProducts.data);
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

    // showproduct(products);

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

    // ...

    function fetchAndDisplayProducts() {
      const indexOfLastPage = currentPage * productsPerPage;
      const indexOfFirstPage = indexOfLastPage - productsPerPage;
      const currentItems = products.data.slice(
        indexOfFirstPage,
        indexOfLastPage
      );
      showproduct(currentItems);
      // updatePageCount();
    }

    // ...

    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchAndDisplayProducts();
      }
    });

    nextButton.addEventListener("click", () => {
      const totalPages = Math.ceil(totalProducts / productsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        fetchAndDisplayProducts();
      }
    });

    // Function to set product ID in local storage
    window.setProductId = function (productId) {
      localStorage.setItem("productId", productId);
    };

    // ...

    // Call fetchAndDisplayProducts initially to set the initial page
    fetchAndDisplayProducts();

    // function updatePageCount() {
    //   const totalPages = Math.ceil(totalProducts / productsPerPage);
    //   const pageContainer = document.querySelector(".page-count");
    //   pageContainer.innerHTML = "";

    //   for (let i = 1; i <= totalPages; i++) {
    //     const pageElement = document.createElement("li");
    //     pageElement.textContent = i;
    //     pageElement.classList.add("page-number");

    //     if (i === currentPage) {
    //       pageElement.classList.add("active");
    //     }
    //     pageElement.addEventListener("click", () => {
    //       currentPage = i;
    //       filterProducts();
    //       updatePageCount();
    //     });

    //     pageContainer.appendChild(pageElement);
    //   }
    // }

    // Call updatePageCount initially to set the initial page count
    // updatePageCount();
    showproduct(products);
  })
  .catch((err) => {
    console.error("Error fetching product: ", err);
  });
