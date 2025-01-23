const form = document.getElementById("transactionForm");
const tableBody = document.getElementById("transactionsTableBody");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${date}</td>
    <td>${description}</td>
    <td>${amount}</td>
    <td>${category}</td>
  `;

  tableBody.appendChild(row);

  // Reset the form after submission
  form.reset();
});
