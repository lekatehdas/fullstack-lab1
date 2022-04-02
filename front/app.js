const createUserForm = document.getElementById('create-user-form')
const infoDisplay = document.getElementById('user-creation-error');
const userNameInput = document.getElementById('user-name');
const userAgeInput = document.getElementById('user-age');
const editUserDiv = document.getElementById('edit-user-div');

window.onload = generateUserTable;

async function generateUserTable() {
    let myTable = document.getElementById('user-table');
    myTable.innerHTML = `
        <tr><th colspan="6">Users</th></tr>
        <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Details</th>
            <th>Edit</th>
            <th>Delete</th>

        </tr>
`;

    const data = await getUsers()

    data.forEach(element => {
        let newRow = document.createElement("tr");
        Object.values(element).forEach((value) => {
           let cell = document.createElement("td");
           cell.innerText = String(value);
           newRow.appendChild(cell);
        });
        const showUserDetails = document.createElement("td")
        showUserDetails.innerHTML = `<button type="button" onclick="showUserDetails(this)">Details</button>`;
        newRow.appendChild(showUserDetails);

        const editUser = document.createElement("td")
        editUser.innerHTML = `<button type="button" onclick="generateEditUserField(this)">Edit</button>`;
        newRow.appendChild(editUser);

        const deleteUser = document.createElement("td")
        deleteUser.innerHTML = `<button type="button" onclick="deleteUser(this)">Delete</button>`;
        newRow.appendChild(deleteUser);

        myTable.appendChild(newRow);
    });
}

async function generateEditUserField(ele) {
    const userId = ele.parentElement.parentElement.firstChild.textContent;

    const user = await getUser(userId)

    editUserDiv.innerHTML =
        `
        <div id="user-id-edit" style="visibility: hidden">${userId}</div>
        <form id="edit-user-form">
            <h3>Edit User</h3>
            <label for="user-name"></label>
            <input type="text" id="user-name-edit" placeholder="${user.name}">
            <label for="user-age"></label>
            <input type="number" id="user-age-edit" placeholder="${user.age}">
            <button type="button" onclick="editUser()">Edit User</button>
        </form>
        `;
}

async function editUser() {
    const userId = document.getElementById('user-id-edit').textContent;
    const userDetails = {
        name: document.getElementById('user-name-edit').value,
        age: parseInt(document.getElementById('user-age-edit').value)
    }

    const response = await editData(userDetails, userId);
    const data = await response.json();

    infoDisplay.innerHTML = (response.status !== 200) ? data.error : '';

    editUserDiv.innerHTML = '';
    await generateUserTable();
}

async function showUserDetails(ele) {
    let userDetailsTable = document.getElementById('details-table');
    userDetailsTable.innerHTML = `
        <tr><th colspan="4">User Details</th></tr>
        <tr>
            <th>_id</th>
            <th>name</th>
            <th>age</th>
            <th>__v</th>
        </tr>
`;
    const userId = ele.parentElement.parentElement.firstChild.textContent;
    const data = await getUser(userId);

    let keysRow = document.createElement("tr");
    Object.values(data).forEach((values) => {
        let cell = document.createElement("td");
        cell.innerText = String(values);
        keysRow.appendChild(cell)
    })

    userDetailsTable.appendChild(keysRow);
}

async function deleteUser(ele) {
    const userId = ele.parentElement.parentElement.firstChild.textContent;

    const response = await deleteData(userId);
    const data = await response.json()

    infoDisplay.innerHTML = (response.status !== 200) ? data.error : '';

    await generateUserTable();
}

createUserForm.addEventListener('submit', e => {
    e.preventDefault();
    createUser()
    userNameInput.value = '';
    userAgeInput.value = '';
});

async function createUser() {
    const userDetails = {
        name: userNameInput.value,
        age: parseInt(userAgeInput.value)
    }

    const response = await postData(userDetails);
    const data = await response.json();

    infoDisplay.innerHTML = (response.status !== 200) ? data.error : '';

    await generateUserTable();
}

async function getUser(userId) {
    return await fetch(`api/users/${userId}`)
        .then(response => response.json());
}

async function getUsers() {
    return await fetch('api/users/')
        .then(response => response.json());
}

async function postData(userDetails) {
    return await fetch('api/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails)
    });
}

async function deleteData(userId) {
    return await fetch(`api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function editData(userDetails, userId) {
    return await fetch(`api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails)
    });
}
