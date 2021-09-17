const submitBtn = document.getElementById("submitSearch");
const resultTableBody = document.getElementsByTagName("tbody")[0];
const resultTable = document.getElementsByTagName("table")[0];
const domainInput = document.getElementById("domainInput");
let result;

const rapidapi_key = "f98adf96cemshbe896a33f184b86p110783jsn573f47c5fc69";

async function getDomainSearchResults(query) {
  let response = await fetch(
    `https://domainr.p.rapidapi.com/v2/search?mashape-key=f98adf96cemshbe896a33f184b86p110783jsn573f47c5fc69&query=${query}&registrar=dnsimple.com`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "domainr.p.rapidapi.com",
        "x-rapidapi-key": "f98adf96cemshbe896a33f184b86p110783jsn573f47c5fc69",
      },
    }
  );
  let json = await response.json();
  console.log(response);
  console.log(json);
  return json.results;
}

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const query = domainInput.value;
  result = await getDomainSearchResults(query);
  resultTable.classList.remove("hidden");
  resultTableBody.innerHTML = "";
  result.forEach((element, index) => {
    resultTableBody.innerHTML += `<tr>
    <th scope="row">${index + 1}</th>
    <td>${element.domain}</td>
    <td><button type="button" class="btn btn-success">Buy</button>
    </td>
  </tr>`;
  });
});
