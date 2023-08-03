const array = [];
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
        html += `
                    <div class="country">
                        <img
                            src="${element.flags.png}"
                            alt="${element.flags.alt}"
                        />
                        <div class="country-text">
                            <h3>${element.name.common}</h3>
                            <p>Population: <span>${element.population}</span></p>
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
