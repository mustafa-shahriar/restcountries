let array = [];
let sx = 0;
let sy = 0;
const countries = document.querySelector(".countries");


fetch("https://restcountries.com/v3.1/all")
.then(Blob => Blob.json())
.then(data => {
    array = data;
    render(array);
});


function render(arr) {
    arr.sort((a, b) => a.name.common.localeCompare(b.name.common));
    let html = ``;

    arr.forEach(element => {
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
    document.querySelector("main").style.display = "block";
}

const search = document.querySelector(".search input");

search.addEventListener("keyup", displayChanges);

function displayChanges() {
    const regex = new RegExp(this.value, "gi");
    const filterArr = array.filter(element => {
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
        .then(blob => blob.json())
        .then(data => {
            changeDomForBB(data);
        });
}

function changeDomForBB(arr) {
    let region = arr[0].region;
    let border = arr[0].borders
        ? arr[0].borders
              .map(
                  ele =>
                      `<div class="border" onclick="chaFromList('${ele}','${region}')">${ele}</div>`
              )
              .join("")
        : `<div class="mt">${arr[0].name.common} don't share border with any other country</div>`;

    let lang = arr[0].languages
        ? Object.values(arr[0].languages).join(", ")
        : "undefined";
    const html = `
            <div class="container">
                <button class="back" onclick="back()">
                <svg class="arrow" fill="#000000" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 476.213 476.213" xml:space="preserve">
           <polygon points="476.213,223.107 57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 
               57.427,253.107 476.213,253.107 "/>
           </svg>Back
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
                                arr[0].tld?.[0]
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

function chaFromList(name,region) {
    document.querySelector(".details").style.display = "none";
    fetch(`https://restcountries.com/v3.1/alpha/${name}`)
        .then(blob => blob.json())
        .then(data => {
            let arr = data.lenght > 1 ? data.filter((ele)=>ele.region == region) : data;
            changeDomForBB(arr);
        });
}


const mode = document.querySelector(".mode");
mode.addEventListener("click",changeMode);

function changeMode(){
    const root = document.querySelector(":root");
    const modeImg = document.querySelector(".mode img");
    if(modeImg.src.includes("light.svg")){
        localStorage.setItem("lightMode","dark");
        modeImg.src = "images/dark.svg";
        root.style.setProperty("--bg-color", "hsl(207, 26%, 17%)");
        root.style.setProperty("--h-bg", "hsl(209, 23%, 22%)");
        root.style.setProperty("--text", "hsl(0, 0%, 100%)");
    }else {
        localStorage.setItem("lightMode","light");
        modeImg.src = "images/light.svg";
        root.style.setProperty("--bg-color", "hsl(0, 0%, 98%)");
        root.style.setProperty("--h-bg", "hsl(0, 0%, 100%)");
        root.style.setProperty("--text", "hsl(200, 15%, 8%)");
    }
}

if(!localStorage.getItem("lightMode")){
    if(window.matchMedia('(prefers-color-scheme: dark)')){
        document.querySelector(".mode img").src = "images/light.svg";
        changeMode();
    }else{
        document.querySelector(".mode img").src = "images/dark.svg";
        changeMode();
    }
}else{
    if(localStorage.getItem("lightMode") == "dark"){
        document.querySelector(".mode img").src = "images/light.svg";
        changeMode();
    }else{
        document.querySelector(".mode img").src = "images/dark.svg";
        changeMode();
    }
}

const selectedItem = document.querySelector("#region");
selectedItem.addEventListener("change", ()=>{
    if(selectedItem.value != "select"){
        document.querySelector("main").style.display = "none";
        fetch(`https://restcountries.com/v3.1/region/${selectedItem.value}`)
            .then( blob => blob.json() )
            .then( data => render(data));
    }else{
        render(array);
    }
});