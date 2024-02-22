const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");
const firstSearchBarUsingServer = document.querySelector(".first-search");
const secondSearchBarUsingClient = document.querySelector(".second-search");
const minPriceInput = document.querySelector("#min-price");
const maxPriceInput = document.querySelector("#max-price");
const categoryFilterDropdowns = document.querySelectorAll(".dropdown");

let apiUrl = "/api/v1/post";
let productsData = [];
let currentPage = 1;
let productsPerPage = 15;

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

async function dataTable() {
  await productTable();
  //   console.log(productsData);

  const pages = [];

  for (let i = 0; i < productsData.length / productsPerPage; i++) {
    pages.push(i);
  }

  const indexOfLastPage = currentPage * productsPerPage;
  const indexOfFirstPage = indexOfLastPage - productsPerPage;
  const currentItems = productsData.slice(indexOfFirstPage, indexOfLastPage);

  //   console.log(currentItems);

  document.querySelector(".js-products-list").innerHTML = currentItems
    .map(
      (product) =>
        `
      <li>
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
            )}" onclick="setProductId('${product._id}')" class="card-title"
              >${product.productTitle}</a
            >
          </h3>

          <p class="product-price">${formatPrice(product.productPrice)}</p>
        </div>
      </div>
      </a>
  </li>`
    )
    .join("");
}

/**
 * Filters the products based on user input.
 */

dataTable();

// pagination buttons
prevButton.addEventListener("click", () => {
  if ((currentPage - 1) * productsPerPage) {
    currentPage--;
    dataTable();
  }
});

nextButton.addEventListener("click", () => {
  const totalPages = Math.ceil(productsData.length / productsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    dataTable();
  }
});

async function productTable() {
  const data = await fetch(apiUrl);
  const res = await data.json();
  productsData = res.data;
}

window.setProductId = function (productId) {
  localStorage.setItem("productId", productId);
};
