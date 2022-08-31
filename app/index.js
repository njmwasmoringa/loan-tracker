
const apiHost = "http://192.168.8.5:3000";

const interest = 0.2;

function addDebtor(evt) {
    evt.preventDefault();

    const form = evt.target;

    const debtAmount = parseInt(document.getElementById('debtAmount').value);
    const totalDebtAmount = debtAmount + (debtAmount * interest);

    const debtor = {
        debtorName: document.getElementById('debtorName').value,
        idNumber: document.getElementById('idNumber').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        debtAmount: totalDebtAmount,
        balance: totalDebtAmount
    }

    /* Inform the user to wait */
    const submitBtn = document.getElementById('addDebtorBtn');
    submitBtn.disable = true;
    submitBtn.innerHTML = "Adding Debtor...";

    fetch(`${apiHost}/debtors`, {
        method: 'POST',
        body: JSON.stringify(debtor),
        headers: {
            // Authorization: "Basice: apkey",
            "Content-Type": "application/json"
        }
    }).then(response => {
        // Read the response
        console.log(response)
        if (response.status == 500) {
            alert("There something wrong from our side, please call customer care");
            return;
        }
        if (response.status == 200 || response.status == 201) {
            alert("The debtor was added successully");
        }

        throw new Error(response.statusText);

    })
        .catch(error => {
            alert(error.message);
        })
        .finally(() => {
            submitBtn.disable = false;
            submitBtn.innerHTML = "Add Debtor";

            form.reset();
            getDebtors();
        });

}

function getReplayments( debtorId ) {
    evt.preventDefault();

    fetch(`${apiHost}/repayments`).then(response => response.json())
    .then(statement=>{
        console.log(statement)
    })
        .catch(error => {
            alert(error.message);
        });

}

function getDebtors() {
    fetch(`${apiHost}/debtors`).then(response => response.json()).then(debtors => {
        updateDebtorsTable(debtors);
    });
}

function updateDebtorsTable(debtors) {
    const debtorsTable = document.querySelector('table#debtors-list tbody');
    debtorsTable.innerHTML = 
    debtors.map(debtor => {
        return `<tr>
        <td>${debtor.debtorName}</td>
        <td>${debtor.debtAmount}</td>
        <td>${debtor.balance}</td>
        <td>
            <button type="button" class="btn btn-warning">Repayment</button>
            <button type="button" class="btn btn-warning statementBtn" data-bs-toggle="modal" data-bs-target="#statementModal">Statement</button>
        </td>
    </tr>`;
    }).join('');

    debtorsTable.querySelectorAll('.statementBtn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            console.log("Statement view initated");
        });
    })
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('Content has loaded');
    getDebtors();

    const addDebtorForm = document.getElementById('add-debtor-form');
    addDebtorForm.addEventListener('submit', addDebtor);

});