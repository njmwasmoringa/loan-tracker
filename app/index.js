
const apiHost = "http://192.168.8.5:3000";
// The 20% intereste rate charged for each loan
const interest = 0.2;
let allDebtors = [];
let allRepayments = [];

//Funciton for adding debtors and displaying them in the table
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
    submitBtn.disabled = true;
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

// A function for getting all the loan repayments and returning a filtered array
function getReplayments(debtorId) {
    return fetch(`${apiHost}/repayments`).then(response => response.json())
    .then(repayments=>{
        allRepayments = repayments;
        return repayments;
    })
}

// a function for retrieving all the debtors and displaying them in the table
function getDebtors() {
    fetch(`${apiHost}/debtors`).then(response => response.json()).then(debtors => {
        allDebtors = debtors;
        updateDebtorsTable(debtors);
    });
}

// a function for updating the debtors html table with the updated list
function updateDebtorsTable(debtors) {

    // display the debtors in the table
    const debtorsTable = document.querySelector('table#debtors-list tbody');
    debtorsTable.innerHTML =
        debtors.map(debtor => {
            return `<tr>
        <td>${debtor.debtorName}</td>
        <td>${debtor.debtAmount.toLocaleString()}</td>
        <td>${debtor.balance.toLocaleString()}</td>
        <td>
            <button type="button" class="btn btn-warning repaymentBtn" data-bs-toggle="modal" 
                data-bs-target="#repayment-form" data-id="${debtor.id}">Repayment</button>
            <button type="button" class="btn btn-warning statementBtn" 
                data-bs-toggle="modal" data-bs-target="#statementModal" data-id="${debtor.id}">Statement</button>
        </td>
    </tr>`;
        }).join('');

    // add click event to all the statement and repayment buttons
    debtorsTable.querySelectorAll('.statementBtn, .repaymentBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            //get the debtor id using dataset attribute in statement button as 'data-id="${debtor.id}"'
            const debtorId = btn.dataset.id;
            
            //check if the clicked button is statement button
            if(btn.classList.contains('statementBtn')){
                // Tell the user to be patient while the statement loads
                statementModal.querySelector('#statementModal tbody').innerHTML = `<tr>
                    <td colspan="3">Loading statement....</td>
                </tr>`;

                getReplayments(debtorId).then(statement => {
                    return statement.filter(record => record.debtorId == debtorId);
                })
                .then(statement => {
                    statementModal.querySelector('#statementModal tbody').innerHTML = statement.map(record => `
                    <tr>
                        <td>${record.amount}</td>
                        <td>${record.amount}</td>
                        <td>${(new Date(record.date)).toLocaleString()}</td>
                    </tr>`).join("");
                });
            }

             //check if the clicked button is repayment button
             if(btn.classList.contains('repaymentBtn')){                    
                document.getElementById('debtorId').value = debtorId;
            }
        });
    });

    document.getElementById('totalLoans').innerHTML = totalLoans().toLocaleString();
}

function repayLoan( repayment ){
    return fetch(`${apiHost}/repayments`, {
        method:'POST',
        body:JSON.stringify(repayment),
        headers:{
            "Content-Type":"application/json"
        }
    })
}

// A function for calculating the total loans given out
function totalLoans(){
    //use the reduce array method to get total
    return allDebtors.reduce((total, debtor)=>{
        return total += debtor.debtAmount;
    }, 0);
}

// A function for calculating the total paid loans
function totalRepaidAmount(){
    //use the reduce array method to get total
    return allRepayments.reduce((total, repayment)=>{
        return total += Number(repayment.amount);
    }, 0);
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('Content has loaded');
    getDebtors();
    getReplayments().then(repayments=>{
        const totalRepayments = totalRepaidAmount();
        document.getElementById('totalRepaid').innerHTML = totalRepayments.toLocaleString();
        
        // formular for calculating 20% of amount paid
        // const totalInterest = totalRepayments *  
        // document.getElementById('totalInterest').innerHTML = .toLocaleString();

    });

    const addDebtorForm = document.getElementById('add-debtor-form');
    addDebtorForm.addEventListener('submit', addDebtor);

    document.getElementById('repayment-form').addEventListener('submit', evt=>{
        evt.preventDefault();

        const form = evt.target;

        const repayment = {
            date: document.getElementById('date').value,
            amount: document.getElementById('repaymentAmount').value,
            debtorId: document.getElementById('debtorId').value
        }

        const button = document.getElementById("repayLoanBtn");
        button.disabled = true;
        button.innerHTML = "Repaying...";
        repayLoan(repayment).then(response=>{
            console.log("Repayment done successfully");
            form.reset();
        })
        .catch(error=>{
            console.log(error.message)
            form.reset();
        }).finally(()=>{
            button.disabled = false;
            button.innerHTML = "Repay Loan";
        });
    });
    
    

});