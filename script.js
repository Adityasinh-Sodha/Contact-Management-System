// Define default template contacts
const defaultContacts = [
    {
        name: "Template Contact 1",
        email: "template1@example.com",
        phone: "123-456-7890",
        photoUrl: "https://api.dicebear.com/6.x/micah/png?seed=template1",
        notes: "This is a template contact. Feel free to edit or delete it.",
        gender: "Male",
    },
    {
        name: "Template Contact 2",
        email: "template2@example.com",
        phone: "987-654-3210",
        photoUrl: "https://api.dicebear.com/6.x/avataaars/png?seed=template2",
        notes: "This is another template contact. Customize or remove it as needed.",
        gender: "Female",
    },
];

// Load contacts from localStorage or initialize with default template contacts
let contacts = JSON.parse(localStorage.getItem("contacts")) || [...defaultContacts];
let editingIndex = -1;

// Add event listeners for UI interactions
document.getElementById("addContactBtn").addEventListener("click", () => openModal());
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("contactForm").addEventListener("submit", saveContact);
document.getElementById("searchInput").addEventListener("input", filterContacts);

// Handle delete zone interactions
const deleteZone = document.getElementById("deleteZone");
deleteZone.addEventListener("dragover", (e) => e.preventDefault());
deleteZone.addEventListener("dragenter", () => deleteZone.classList.add("over"));
deleteZone.addEventListener("dragleave", () => deleteZone.classList.remove("over"));
deleteZone.addEventListener("drop", handleDelete);

function fetchAvatarUrl(gender) {
    const seed = Math.random().toString(36).substring(2);
    let style = gender === "Male" ? "micah" : "avataaars";
    return `https://api.dicebear.com/6.x/${style}/png?seed=${seed}`;
}

function saveContact(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const gender = document.getElementById("gender").value;

    if (!validateContact(name, email, phone)) return;

    const photoUrl = document.getElementById("photoUrl").value || fetchAvatarUrl(gender);
    const notes = document.getElementById("notes").value.trim();
    const contact = { name, email, phone, photoUrl, notes, gender };

    if (editingIndex >= 0) {
        contacts[editingIndex] = contact;
    } else {
        contacts.push(contact);
    }

    localStorage.setItem("contacts", JSON.stringify(contacts));
    displayContacts();
    closeModal();
}

function validateContact(name, email, phone) {
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");

    nameError.textContent = name ? "" : "Name is required.";
    emailError.textContent = email ? "" : "Email is required.";
    phoneError.textContent = phone ? "" : "Phone is required.";

    return name && email && phone;
}

function displayContacts(filteredContacts = contacts) {
    const contactList = document.getElementById("contactList");
    contactList.innerHTML = "";

    filteredContacts.forEach((contact, index) => {
        const card = document.createElement("div");
        card.className = "contact-card";

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="${contact.photoUrl}" class="card-photo" alt="Contact Photo">
                    <h3 class="card-name">${contact.name}</h3>
                    <p class="card-phone">${contact.phone}</p>
                </div>
                <div class="card-back">
                    <h3>${contact.name}</h3>
                    <p>Email: ${contact.email}</p>
                    <p>Notes: ${contact.notes}</p>
                </div>
            </div>
        `;

        const cardInner = card.querySelector(".card-inner");
        cardInner.addEventListener("click", () => openModal(contact, index));

        card.draggable = true;
        card.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", index);
        });

        contactList.appendChild(card);
    });
}

function filterContacts() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.phone.includes(query)
    );
    displayContacts(filteredContacts);
}

function openModal(contact = null, index = -1) {
    editingIndex = index;
    document.getElementById("modalTitle").innerText = contact ? "Edit Contact" : "Add Contact";
    document.getElementById("name").value = contact?.name || "";
    document.getElementById("email").value = contact?.email || "";
    document.getElementById("phone").value = contact?.phone || "";
    document.getElementById("notes").value = contact?.notes || "";
    document.getElementById("photoUrl").value = contact?.photoUrl || "";
    document.getElementById("gender").value = contact?.gender || "Neutral";
    document.getElementById("contactModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("contactModal").style.display = "none";
    document.getElementById("contactForm").reset();
    editingIndex = -1;
}

function handleDelete(e) {
    const index = e.dataTransfer.getData("text/plain");
    if (index !== undefined) {
        contacts.splice(index, 1);
        localStorage.setItem("contacts", JSON.stringify(contacts));
        displayContacts();
    }
    deleteZone.classList.remove("over");
}

// Initial Display
displayContacts();
