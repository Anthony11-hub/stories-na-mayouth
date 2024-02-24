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
    const searchBar = document.querySelector(".first-search");
    const searchBar2 = document.querySelector(".second-search");
    const minPriceInput = document.querySelector("#min-price");
    const maxPriceInput = document.querySelector("#max-price");
    const categoryFilterDropdowns = document.querySelectorAll(".dropdown");
    const prevButton = document.querySelector(".prev-btn");
    const nextButton = document.querySelector(".next-btn");
    // const pageCount = document.querySelector(".page-count");

    // function to create a slug --- basically creating a URL friendly version of a string for SEO purposes
    function createSlug(productTitle) {
      return productTitle.toLowerCase().replace(/\s+/g, "-");
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
    function filterProducts() {
      const searchText = searchBar.value;
      const searchText2 = searchBar2.value;
      const minPrice = minPriceInput.value;
      const maxPrice = maxPriceInput.value;

      const queryParams = [`page=${currentPage}`];

      let selectedCategory;

      // categoryFilterDropdowns.forEach((dropdown) => {
      //   selectedCategory = dropdown.querySelector(".selected").textContent;
      //   if (
      //     selectedCategory !== "Choose Category" &&
      //     selectedCategory !== "All Products"
      //   ) {
      //     queryParams.push(`category=${encodeURIComponent(selectedCategory)}`);
      //   }
      // });

      categoryFilterDropdowns.forEach((dropdown) => {
        const selectedCategories = dropdown.querySelectorAll(".selected");

        selectedCategories.forEach((selectedCategory) => {
          const categoryText = selectedCategory.textContent;

          if (
            categoryText !== "Choose Category" &&
            categoryText !== "All Products"
          ) {
            queryParams.push(`category=${encodeURIComponent(categoryText)}`);
          }
        });
      });

      // Include price filter
      if (minPrice || maxPrice) {
        let priceFilter = "";

        if (minPrice) {
          priceFilter += `productPrice>=${minPrice}`;
        }

        if (maxPrice) {
          if (priceFilter !== "") {
            priceFilter += ",";
          }
          priceFilter += `productPrice<=${maxPrice}`;
        }

        queryParams.push(`numericFilters=${priceFilter}`);
      }

      // Check if searchText is not empty before adding to queryParams
      if (searchText.trim() !== "") {
        queryParams.push(`name=${encodeURIComponent(searchText)}`);
      }
      if (searchText2.trim() !== "") {
        queryParams.push(`name=${encodeURIComponent(searchText2)}`);
      }

      const queryString = queryParams.join("&");

      console.log("Search Text:", searchText);
      console.log("Min Price:", minPrice);
      console.log("Max Price:", maxPrice);
      console.log("Selected Category:", selectedCategory);
      console.log("Query Params:", queryParams.join("&"));

      console.log("Query String:", queryString);

      /**
       * Fetch products only if search text, minPrice, maxPrice is not empty
       * and selectedCategory !== 'All Products', otherwise, use the existing products
       * **/
      if (
        searchText.trim() !== "" ||
        searchText2.trim() !== "" ||
        selectedCategory !== "All Products" ||
        minPrice ||
        maxPrice
      ) {
        fetch(`/api/v1/post?${queryString}`)
          .then((response) => response.json())
          .then((filteredProducts) => {
            console.log("Filtered Products:", filteredProducts);
            showproduct(filteredProducts.data);
          })
          .catch((err) => {
            console.error("Error fetching filtered products: ", err);
          });
      } else {
        // Apply pagination logic in the else block
        const indexOfLastPage = currentPage * productsPerPage;
        const indexOfFirstPage = indexOfLastPage - productsPerPage;
        const currentItems = products.data.slice(
          indexOfFirstPage,
          indexOfLastPage
        );
        showproduct({ data: currentItems });
      }
    }

    // server
    searchBar.addEventListener("input", filterProducts);
    searchBar2.addEventListener("input", filterProducts);
    minPriceInput.addEventListener("input", filterProducts);
    maxPriceInput.addEventListener("input", filterProducts);
    categoryFilterDropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", filterProducts);
    });

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
