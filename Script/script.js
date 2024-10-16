// ------------------------STARTS : Common Functions-------------------------
// ------------ Handle Undefined or null data --------------
const handleMissingData = (data) =>
  data === undefined || data === null ? "Not Available" : data;

// -------------- Remove Modal ------------
const removeModal = (modalID) => {
  document.getElementById(modalID).style.display = "none";
};
// ------------------------ENDS : Common Functions-------------------------

// ------------ STARTS : Handle Active Category ---------------
const markAsActive = (ID) => {
  document.getElementById(ID).classList.add("category-active");
};
const removeActive = () => {
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("category-active");
  });
};
// ------------ ENDS : Handle Active Category ---------------

// ------------------------STARTS-------------------------
// ------------ All API --------------
const getPetCategory =
  "https://openapi.programming-hero.com/api/peddy/categories";
const getPetDetailsByID = "https://openapi.programming-hero.com/api/peddy/pet/";
const getAllPets = "https://openapi.programming-hero.com/api/peddy/pets";
const getPetsByCategory =
  "https://openapi.programming-hero.com/api/peddy/category/";
// ------------------------ENDS-------------------------

// ------------------------STARTS-------------------------
// --------------- Global Dom Variable for uses ---------
const categorySection = document.getElementById("category-section");
const petsListSection = document.getElementById("pets-list");
const likedPetsSection = document.getElementById("liked-pets");
const sortBtn = document.getElementById("sort-btn");
let lastCalledAPI = getAllPets;
// ------------------------ENDS-------------------------

// ------------------------STARTS-------------------------
// ------------ Sort API Data --------------
const sortAPIData = () => {
  // console.log("Hey");

  lastCalledAPI.sort((a, b) => b.price - a.price);
  showPetsFromAPI(lastCalledAPI);
};
// ------------------------ENDS-------------------------

// ------------------------STARTS-------------------------
// ------------ Fetch & show Pets Category --------------
const petsCategories = async () => {
  const res = await fetch(getPetCategory);
  const data = await res.json();
  const categories = data.categories;
  categories.forEach((petCategory) => {
    const { category, category_icon } = petCategory;
    categorySection.innerHTML += `
        <button class="category-btn flex items-center justify-center gap-2 border border-[#0e7a813a] p-2 rounded-md" onclick="getAPIForFetch(
          '${category}'
        )" id='${category}'>
            <img src="${category_icon}" class="w-8" alt="">
            <h6 class="text-lg font-bold"> ${category} </h6>
        </button>
   `;
  });
};
petsCategories();
// ------------------------ENDS-------------------------

// ------------------------STARTS-------------------------
// --------------- Show Pets Details (Modal) By id ------------
const showPetDetailsById = async (ID) => {
  const detailsSection = document.getElementById("details-section");

  const res = await fetch(`${getPetDetailsByID + ID}`);
  const data = await res.json();
  const {
    breed,
    date_of_birth,
    price,
    image,
    gender,
    pet_details,
    vaccinated_status,
    pet_name,
  } = data.petData;
  detailsSection.innerHTML = `
     <div class="w-11/12 max-w-md p-6 bg-white rounded-md flex flex-col gap-3">
        <img src="${image}" alt="" class="w-full aspect-[2/1] object-cover rounded-md">
        <h2 class="font-bold text-xl">${handleMissingData(pet_name)}</h2>
        <div class="flex gap-1 md:gap-5 flex-col md:flex-row">
            <div class="space-y-1">
                <div class="flex gap-1 items-center ">
                    <img src="./images/icons/Breed icon.png" alt="">
                    <p>Breed: <span>${handleMissingData(breed)}</span></p>
                </div>
                <div class="flex gap-1 items-center">
                    <img src="./images/icons/gender.png" alt="">
                    <p>Gender: <span>${handleMissingData(gender)}</span></p>
                </div>
                <div class="flex gap-1 items-center">
                    <img src="./images/icons/gender.png" alt="">
                    <p>Vaccinated status: <span>${handleMissingData(
                      vaccinated_status
                    )}</span></p>
                </div>
            </div>
            <div class="space-y-1">
                <div class="flex gap-1 items-center">
                    <img src="./images/icons/calander.png" alt="">
                    <p>Birth: <span>${handleMissingData(
                      date_of_birth
                    )}</span></p>
                </div>
                <div class="flex gap-1 items-center">
                    <img src="./images/icons/dollar sign.png" alt="">
                    <p>Price: <span>${
                      price === undefined || price === null
                        ? "Not Available"
                        : price + "$"
                    }</span></p>
                </div>
            </div>
        </div>
        <hr class="my-3"/>
        <h4 class="font-bold text-base">Details Information</h4>
        <p class="text-sm">${pet_details}</p>
        <button class="bg-[#0e7a811a] border border-[#0e7a813a] w-full rounded-md py-2 font-bold text-lg mt-3" onclick="removeModal('details-section')">
            Cancel
        </button>
    </div>
  `;
  detailsSection.style.display = "grid";
};
// ------------------------ENDS-------------------------

// ------------------------STARTS-------------------------
// --------------- Show Adopt countdown (Modal) ------------
const handleCountDownModal = (e) => {
  const adoptSection = document.getElementById("adopt-section");
  const countDownElement = document.getElementById("count-down");
  let count = 3;
  adoptSection.style.display = "grid";
  countDownElement.innerText = count;
  const countDown = setInterval(() => {
    if (count === 0) {
      clearInterval(countDown);
      adoptSection.style.display = "none";
      const targetedBtn = e.target;
      targetedBtn.setAttribute("disabled", true);
      targetedBtn.innerText = "Adopted";
      targetedBtn.classList.add("btn-disabled");
      countDownElement.innerText = "";
    }
    countDownElement.innerText = count--;
  }, 1000);
};
// ------------------------ENDS-------------------------

// ------------------------STARTS-------------------------
// ------------ Fetch & show Pets --------------
const showPets = (fetchedPets) => {
  const loadingElement = document.getElementById("loading");
  petsListSection.innerHTML = "";
  if (!fetchedPets.length) {
    setTimeout(() => {
      loadingElement.style.display = "none";
      petsListSection.innerHTML = `
      <div class="text-center bg-red-100 col-span-full rounded-md p-10 space-y-3">
      <img src="../images/error.webp" alt="" class="mx-auto">
        <h2 class="text-2xl font-bold"> No Information Available </h2>
        <p class="text-sm"> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a. </p>
      </div>
    `;
      return;
    }, 2000);
  }
  loadingElement.style.display = "block";
  setTimeout(() => {
    loadingElement.style.display = "none";
    fetchedPets.forEach((pet) => {
      const { petId, breed, date_of_birth, gender, price, pet_name, image } =
        pet;
      petsListSection.innerHTML += `
        <div class="p-3 border rounded-md flex flex-col gap-2">
          <img src="${image}" alt="" class="rounded-md w-full aspect-[4/3] object-cover">
          <h3 class="text-xl font-bold">${handleMissingData(pet_name)}</h3>
          <div class="flex gap-1 items-center ">
              <img src="./images/icons/Breed icon.png" alt="">
              <p>Breed: <span>${handleMissingData(breed)}</span></p>
          </div>
          <div class="flex gap-1 items-center">
              <img src="./images/icons/calander.png" alt="">
              <p>Birth: <span>${handleMissingData(date_of_birth)}</span></p>
          </div>
          <div class="flex gap-1 items-center">
              <img src="./images/icons/gender.png" alt="">
              <p>Gender: <span>${handleMissingData(gender)}</span></p>
          </div>
          <div class="flex gap-1 items-center">
              <img src="./images/icons/dollar sign.png" alt="">
              <p>Price: <span>${
                price === undefined || price === null
                  ? "Not Available"
                  : price + "$"
              }</span></p>
          </div>
          <hr/ class="my-2">
          <div class="flex flex-wrap gap-1">
              <button class="border px-4 py-2 rounded-md" onclick="
                showLikedPets('${image}')">
                  <img src="./images/icons/thumb.png" alt="">
              </button>
              <button class="border px-4 py-2 rounded-md text-primary font-bold" onclick="handleCountDownModal(event)">
                  Adopt
              </button>
              <button class="border px-4 py-2 rounded-md text-primary font-bold" onclick="showPetDetailsById('${petId}')">
                  Detailts
              </button>
          </div>
        </div>
      `;
    });
  }, 2000);
};

const showPetsFromAPI = async (ctg) => {
  const res = await fetch(lastCalledAPI);
  const data = await res.json();
  let fetchedPets = ctg === "all-pets" ? data.pets : data.data;
  sortBtn.onclick = () => {
    fetchedPets.sort((a, b) => b.price - a.price);
    showPets(fetchedPets);
  };
  removeActive();
  if (ctg !== "all-pets") markAsActive(ctg);

  showPets(fetchedPets);
};

const getAPIForFetch = (ctg) => {
  lastCalledAPI =
    ctg === "all-pets" ? getAllPets : `${getPetsByCategory + ctg}`;
  showPetsFromAPI(ctg);
};
getAPIForFetch("all-pets");
// ------------------ENDS----------------------

// ------------------------STARTS-------------------------
// ----------------- Show liked pets --------------------
const showLikedPets = (img) => {
  likedPetsSection.classList.add("p-3", "border");
  likedPetsSection.innerHTML += `
    <div>
      <img src="${img}" alt="" class="aspect-square object-cover rounded-md">
    </div>
  `;
};
// ------------------ENDS----------------------
