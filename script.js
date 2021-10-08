const submitBtn = document.getElementById("submitSearch");
const resultTableBody = document.getElementsByTagName("tbody")[0];
const resultTable = document.getElementsByTagName("table")[0];
const domainInput = document.getElementById("domainInput");
let resultDiv = document.getElementById("result-div");
const tldArray = ["pl", "com", "org", "net"];
const tldInput = document.getElementById("tldInput");

const rapidapi_key = "f98adf96cemshbe896a33f184b86p110783jsn573f47c5fc69";

let params = new Map();
params.set("mashape-key", rapidapi_key);

showTldOptions();

const validateInput = (text) => {
  // Usuwam "www" oraz "http//" z lewej strony.
  text = text.split("//");
  text = text[text.length - 1];
  if (/www/g.test(text)) {
    text = text.split("www.");
    text.shift();
    text = text[text.length - 1];
  }

  let domainName = "";
  let subDomainName = "";
  let tld = tldInput.value;

  // Dziele text na części oddzielone znakiem . - domena, subdomena oraz tld (top-level domain)
  text = text.split(".");
  if (text.length === 1) {
    // Pierwszy przypadek: użytkownik wprowadził sam adres domeny
    domainName = text[0];
  } else if (text.length === 2) {
    // Drugi przypadek: mamy domenę oraz subdomenę lub domenę oraz tld
    if (tldArray.includes(text[1]) && !tld) {
      tld = text[1];
      domainName = text[0];
    } else {
      domainName = text[1];
      subDomainName = text[0];
    }
  } else if (text.length === 3) {
    // Użytkownik wprowadził domenę, subdomenę oraz tld
    tld = text[2];
    domainName = text[1];
    subDomainName = text[0];
  } else {
    alert("Wprowadź prawidłowy adres domeny, np. domena.pl");
  }

  return new Map([
    ["subdomain", subDomainName],
    ["domain", domainName],
    ["tld", tld],
  ]);
};

async function getDomainSearchResults(query) {
  let url = `https://domainr.p.rapidapi.com/v2/search?query=${query}`;
  params.forEach((value, key) => {
    url += `&${key}=${value}`;
  });
  console.log("url", url);
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "domainr.p.rapidapi.com",
      "x-rapidapi-key": "f98adf96cemshbe896a33f184b86p110783jsn573f47c5fc69",
    },
  });
  let json = await response.json();
  return json.results;
}

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let query = domainInput.value;
  query = validateInput(query);

  const resultDomain = await getDomainSearchResults(query.get("domain"));
  const resultDomainAndSub = await getDomainSearchResults(
    `${query.get("subdomain")}.${query.get("domain")}`
  );
  const resultDomainTld = await getDomainSearchResults(
    `${query.get("subdomain")}.${query.get("domain")}.${query.get("tld")}`
  );

  let result = resultDomain.concat(resultDomainTld);
  result = result.concat(resultDomainAndSub);

  //remove domainDuplicates
  uniqueDomainArray = removeDuplicates(result, "domain");
  console.log("uniqueDomainArray", uniqueDomainArray);

  resultDiv.classList.remove("hidden");
  resultTableBody.innerHTML = "";

  let i = 1;
  uniqueDomainArray.forEach((element) => {
    resultTableBody.innerHTML += `<tr>
    <th scope="row">${i}</th>
    <td>${element.domain}</td>
    <td><a href='${element.registerURL}' target='blank' type="button" class="btn btn-success">Register</a>
    </td>
  </tr>`;
    i++;
  });
});

removeDuplicates = (array, key) => {
  let uniqueArray = [];
  let uniqueObjectsArray = [];
  array.forEach((element) => {
    if (!uniqueArray.includes(element.domain)) {
      uniqueArray.push(element.domain);
      uniqueObjectsArray.push(element);
    }
  });
  return uniqueObjectsArray;
};

//Scroll
document.addEventListener("scroll", function (e) {
  let lastKnownScrollPosition = window.scrollY;
  if (lastKnownScrollPosition > 120) {
    document.getElementById("header").classList.add("header-scroll");
    submitBtn.classList.remove("btn-primary");
    submitBtn.classList.add("btn-warning");
  } else {
    document.getElementById("header").classList.remove("header-scroll");
    submitBtn.classList.remove("btn-warning");
    submitBtn.classList.add("btn-primary");
  }
});

addHeaderBackground = () => {
  document.getElementById("header").style.background = "white";
};

function showTldOptions() {
  tldArray.forEach((element) => {
    tldInput.innerHTML += `<option value="${element}">${element}</option>`;
  });
}
