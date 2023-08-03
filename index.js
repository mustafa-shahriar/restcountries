const array = [];
let sx = 0;
let sy = 0;
const countries = document.querySelector(".countries");
fetch("https://restcountries.com/v3.1/all")
    .then((Blob) => Blob.json())
    .then((data) => {
        array.push(...data);
        render(array);
    });

function render(arr) {
    arr.sort((a, b) => a.name.common.localeCompare(b.name.common));
    let html = ``;

    arr.forEach((element) => {
        let value = element.name.official.includes("'")
            ? element.name.common
            : element.name.official;
        html += `
                    <div class="country" onclick="
                        changeBigBanner('${value}')
                        ">
                        <img
                            src="${element.flags.svg}"
                            alt="${element.flags.alt}"
                        />
                        <div class="country-text">
                            <h3>${element.name.common}</h3>
                            <p>Population: <span>${numberWithCommas(
                                element.population
                            )}</span></p>
                            <p>Region: <span>${element.region}</span></p>
                            <p>Capital: <span>${element.capital?.[0]}</span></p>
                        </div>
                    </div>
                    `;
    });
    countries.innerHTML = html;
}

const search = document.querySelector(".search input");

search.addEventListener("keyup", displayChanges);

function displayChanges() {
    const regex = new RegExp(this.value, "gi");
    const filterArr = array.filter((element) => {
        const name = element.name.common;
        return name.match(regex);
    });
    render(filterArr);
}

/* document.querySelector("main").style.display = "block"; */

function changeBigBanner(name) {
    sx =
        window.pageXOffset ||
        document.documentElement.scrollLeft ||
        document.body.scrollLeft ||
        0;
    sy =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
    document.querySelector("main").style.display = "none";
    fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
        .then((blob) => blob.json())
        .then((data) => {
            changeDomForBB(data);
        });
}

function changeDomForBB(arr) {
    let border = arr[0].borders
        ? arr[0].borders
              .map((ele) => `<div class="border">${ele}</div>`)
              .join("")
        : `<div class="mt">${arr[0].name.common} don't share border with any other country</div>`;

    let lang = arr[0].languages
        ? Object.values(arr[0].languages).join(", ")
        : "undefined";
    const html = `
            <div class="container">
                <button class="back" onclick="back()">
                    <img src="images/dark-arrow.svg" alt="" />Back
                </button>
            </div>
            <div class="info">
                <img
                    src="${arr[0].flags.svg}"
                    alt="${arr[0].flags.alt}"
                />
                <div class="details-info">
                    <div class="details-text">
                        <div class="one">
                            <h2>${arr[0].name.common}</h2>
                            <p>Population: <span>${numberWithCommas(
                                arr[0].population
                            )}</span></p>
                            <p>Region: <span>${arr[0].region}</span></p>
                            <p>Sub Region: <span>${arr[0].subregion}</span></p>
                            <p>Capital: <span>${arr[0].capital?.[0]}</span></p>
                        </div>
                        <div class="two">
                            <p>Top Level Domain: <span>${
                                arr[0].tld[0]
                            }</span></p>
                            <p>Currencies: <span>${
                                arr[0].currencies?.[
                                    Object.keys(arr[0].currencies)[0]
                                ].name
                            }</span></p>
                            <p>
                                Languages:
                                <span>${lang}</span>
                            </p>
                        </div>
                    </div>
                    <div class="borders">
                        <h4>Border Countries:</h4>
                        <div class="border-countries">
                            ${border}
                        </div>
                    </div>
                </div>
            </div>
            `;

    document.querySelector("head title").innerHTML = arr[0].name.common;
    const details = document.querySelector(".details");
    details.innerHTML = html;
    details.style.display = "block";
    window.scrollTo(0, 0);
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
    return x;
}

function back() {
    document.querySelector("main").style.display = "block";
    document.querySelector(".details").style.display = "none";
    window.scrollTo(sx, sy);
    document.querySelector("head title").innerHTML = "Country";
}
