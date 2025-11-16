// Select form inputs
const titleInput = document.getElementById("titleInput");
const authorInput = document.getElementById("authorInput");
const reviewInput = document.getElementById("reviewInput");
const tableBody = document.getElementById("reviewTableBody");

// Add Review
function addReview() {
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const review = reviewInput.value.trim();

    if (title === "" || author === "" || review === "") {
        alert("Please fill in all fields.");
        return;
    }

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${title}</td>
        <td>${author}</td>
        <td>${review}</td>
        <td>
            <button onclick="editReview(this)">Edit</button>
            <button onclick="deleteReview(this)">Delete</button>
        </td>
    `;

    tableBody.appendChild(row);

    // Clear inputs
    titleInput.value = "";
    authorInput.value = "";
    reviewInput.value = "";
}

// Delete review
function deleteReview(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

// Edit review
function editReview(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll("td");

    titleInput.value = cells[0].innerText;
    authorInput.value = cells[1].innerText;
    reviewInput.value = cells[2].innerText;

    row.remove();
}

