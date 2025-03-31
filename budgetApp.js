//Get income elements by their IDs
let list = document.getElementById("main");// income items container
let old_income = document.getElementsByClassName("incomeA"); //current  display income elements
let new_income = document.getElementById("incomeB");// new income display element
let income_item = document.getElementById("makeup");
let item_price = document.getElementById("prices");
const income_list = new Map([]); // a map array to store the income items and their price value

//Get income elements by their IDs
let cur_sav_percent = document.getElementById("currentS");
let sav_input= document.getElementById("savings");
let sav_amount = document.getElementById("savingsA");
let sav_time = document.getElementById("time");
const no_of_years = document.getElementsByName("years");

//Get budget and expense elements by their IDs
let budget = document.getElementById("budget-total");
const amount = document.getElementById("currentA");
const expenditureValue = document.getElementById('costA');
const balanceValue = document.getElementById('balA');
let userAmount = document.getElementById("expenseA");
const checkButton = document.getElementById("button");
let itemInput = document.getElementById('expense');
const list2 = document.getElementById("list");
let tempAmount = 0;

// the popular items list
const list3 = document.getElementById("main2");
let limit = 5;
let rent = document.getElementById("rent").innerHTML;
let rent_cost = 5000;
let food = document.getElementById("food").innerHTML;
let food_cost = 2000;
let data = document.getElementById("data").innerHTML;
let data_cost = 1000;
const item_list = new Map(
  [
    [rent, rent_cost],
    [food, food_cost],
    [data, data_cost],
  ]
);
let pop_input = document.getElementById("pop-item").innerHTML;
let pop_price_input = document.getElementById("pop-item-price").innerHTML;

// Get the debt elements by IDs
let current_debt = document.getElementById("debtAmount");
// simple intrest
let principleInput = document.getElementById("principalInput");
let rateInput= document.getElementById("rateInput");
let timeInput=document.getElementById("timeInput");
let knew = document.getElementById("change");
let intrestAmount = document.getElementById("Intrest");
let totalAmount = document.getElementById("Total");
let test = document.getElementById("Sntrest");


// loading things already saved in local storage
window.onload = () => {
  cur_sav_percent.innerHTML = localStorage.getItem("savePercent") || "0";
  sav_time.innerHTML = localStorage.getItem("choiceVal") || "0";
  new_income.innerHTML = localStorage.getItem("storedincome") || "0";
  // display of the stored income as the current income
  Array.from(old_income).forEach((element) => {
    element.innerHTML = new_income.innerHTML;
  });
  getItemsFromLocalStorage();
  setbudget();
  getExpenseFromLocalStorage();
  storedExpenseCalc();
};

// Function to calculate total income
const calculateTotalIncome = () => {
  let totalIncome = 0;
  for (const x of income_list.values()) {
    totalIncome += x;
  }
  return totalIncome;
};

// Function to calculate percent
function calculatePercent(total, prices) {
  if (total === 0) return "0.0"; // Prevent NaN
  return ((prices / total) * 100).toFixed(1);
}

// Adjust all percentages
function percentadjust() {
  let prices = document.querySelectorAll(".priced");
  let percents = document.querySelectorAll(".per");
  let total = calculateTotalIncome();

  prices.forEach((priceElement, index) => {
    let price = parseFloat(priceElement.innerHTML);
    let percent = calculatePercent(total, price);
    percents[index].innerHTML = `${percent}%`;
  });
}

// Function to save all income items in localStorage
const saveItemsToLocalStorage = () => {
  let itemsArray = [];
  document.querySelectorAll(".sub").forEach((item) => {
    const Ename = item.querySelector(".name").innerText.trim();
    const Eprice = parseFloat(item.querySelector(".priced").innerText.trim());
    itemsArray.push({ Ename, Eprice });
  });
  localStorage.setItem("itemsList", JSON.stringify(itemsArray));
};

// Function to display all income items in localStorage
const getItemsFromLocalStorage = () => {
  list.innerHTML = ""; // Clear previous content
  income_list.clear(); // Clear Map before loading new data
  let storedItems = JSON.parse(localStorage.getItem("itemsList")) || [];

  // First, add all items to income_list
  storedItems.forEach((item) => {
    income_list.set(item.Ename, item.Eprice);
  });

  let totalIncome = calculateTotalIncome(); // Get total income after updating income_list

  // Now display them with correct percentages
  storedItems.forEach((item) => {
    let sub = document.createElement("div");
    sub.classList.add("sub");

    let percent = calculatePercent(totalIncome, item.Eprice); // Now the total is correct
    sub.innerHTML = `
      <span class="name">${item.Ename}</span>
      <span class="priced">${item.Eprice}</span>
      <span class="per">${percent}%</span>
      <span class="fa-solid fa-pen-to-square edit-icon"></span>
      <span class="fa-solid fa-trash delete-icon"></span>`;

    list.appendChild(sub);
  });

  new_income.innerHTML = totalIncome; // Update total income after setting all items
  percentadjust(); // Adjust percentages for all items
};

//A function to add new income items
function addinclist() {
  let name = income_item.value.trim();
  let price = parseFloat(item_price.value);

  if (name !== "" && price > 0) {
    let oldName = income_item.getAttribute("data-old-name");

    if (oldName && income_list.has(oldName)) {
      // If editing, remove the old entry before adding the new one
      income_list.delete(oldName);
    }

    income_list.set(name, price);
    
    new_income.innerHTML = calculateTotalIncome();
    
    let sub = document.createElement("div");
    sub.classList.add("sub");

    let percent = calculatePercent(calculateTotalIncome(), price);
    sub.innerHTML = `
      <span class="name">${name}</span>
      <span class="priced">${price}</span>
      <span class="per">${percent}%</span>
      <span class="fa-solid fa-pen-to-square edit-icon"></span>
      <span class="fa-solid fa-trash delete-icon"></span>`;

    list.appendChild(sub);

    // Clear temporary attribute after editing
    income_item.removeAttribute("data-old-name");
    saveItemsToLocalStorage();
    percentadjust();
  } else {
    document.getElementById("textI").innerHTML = "Invalid input!";
  }

  income_item.value = "";
  item_price.value = "";
}


// Function to handle editing of income items
function editlist(event) {
  let parentDiv = event.target.parentElement;
  let name = parentDiv.querySelector(".name").innerText;
  let price = parentDiv.querySelector(".priced").innerText;

  // Fill input fields with existing values for editing
  income_item.value = name;
  item_price.value = price;

  // Store old name in a temporary attribute
  income_item.setAttribute("data-old-name", name);

  parentDiv.remove();
  income_list.delete(name);
  new_income.innerHTML = calculateTotalIncome();
  percentadjust();
}

// Function to delete income items from the list
function deletelist(event) {
  let parentDiv = event.target.parentElement;
  let name = parentDiv.querySelector(".name").innerText;

  parentDiv.remove();
  income_list.delete(name);
  saveItemsToLocalStorage();
  new_income.innerHTML = calculateTotalIncome(); // Update total income
  percentadjust();
}

// adding event listner to the add income button
document.getElementById("incbtn").addEventListener("click", addinclist);
// Event delegation for dynamic buttons
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-icon")) {
    editlist(event);
  } else if (event.target.classList.contains("delete-icon")) {
    deletelist(event);
  }
});

// function to save the Savings adjustments
function set_savpercent(){ 
  cur_sav_percent.innerHTML = sav_input.value;
  localStorage.setItem("savePercent", cur_sav_percent.innerHTML);
  sav_input.value = "";

    for(const choice of no_of_years){
      if(choice.checked){
        sav_time.innerHTML = choice.value;
        localStorage.setItem("choiceVal", choice.value);
         break;
      }
    }
    
  };


document.getElementById("savebtn").addEventListener("click",set_savpercent);

// function to set the budget
function setbudget(){
  let saved = document.getElementById("saveD");
  saved.innerHTML = (parseFloat(cur_sav_percent.innerHTML) / 100) * parseFloat(new_income.innerHTML || 0);
  budget.innerHTML = parseFloat(new_income.innerHTML || 0) - parseFloat(saved.innerHTML || 0);
  tempAmount = parseFloat(budget.innerHTML) || 0;

   if (tempAmount >= 0) {
    amount.innerHTML = tempAmount;
    balanceValue.innerText = tempAmount - parseInt(expenditureValue.innerText || 0);
  } else {
    window.alert("You are over budget!");
  }
};

// function to set the budget and income
function setIncome() {
  Array.from(old_income).forEach((element) => {
    element.innerHTML = new_income.innerHTML;
    localStorage.setItem("storedincome", new_income.innerHTML);
  });
  setbudget();
}


document.getElementById("income-btn").addEventListener("click",setIncome);

const poplist = () => { 
  let pop_input = document.getElementById("pop-item").value.trim();
  let pop_price_input = parseFloat(document.getElementById("pop-item-price").value);

  if (!pop_input || isNaN(pop_price_input) || pop_price_input <= 0) {
    alert("Invalid input. Please enter a valid item name and price.");
    return;
  }

  if (item_list.size >= limit) {
    alert("Limit reached! Cannot add more items.");
    return;
  }

  let popContent = document.createElement("div");
  popContent.classList.add("sub2");

  popContent.innerHTML = `
    <p class="item">${pop_input}</p>
    <span class="fa-solid fa-circle-check select-icon"></span>
    <span class="fa-solid fa-trash delete-icon2"></span>
  `;

  list3.appendChild(popContent);
  item_list.set(pop_input, pop_price_input);

  document.getElementById("pop-item").value = "";
  document.getElementById("pop-item-price").value = "";
};

document.getElementById("pop-button").addEventListener("click", poplist);

function selectpop(event) {
  let parentPopDiv = event.target.parentElement;
  let popName = parentPopDiv.querySelector(".item").innerText;

  if (item_list.has(popName)) {
    document.getElementById("expense").value = popName;
    document.getElementById("expenseA").value = item_list.get(popName);
    item_list.delete(popName);
  }
}

function deletepop(event) {
  let parentPopDiv = event.target.parentElement;
  let popName = parentPopDiv.querySelector(".item").innerText;

  parentPopDiv.remove();
  item_list.delete(popName);
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("select-icon")) {
    selectpop(event);
  } else if (event.target.classList.contains("delete-icon2")) {
    deletepop(event);
  }
});

const saveExpenseToLocalStorage = () => {
  let itemsArray2 = [];
  document.querySelectorAll(".sublist-content").forEach((item) => {
    const Cname = item.querySelector(".product").innerText.trim();
    const Cprice = parseFloat(item.querySelector(".currentA").innerText.trim());
    itemsArray2.push({ Cname, Cprice });
  });
  localStorage.setItem("ExpenseList", JSON.stringify(itemsArray2));
};

const getExpenseFromLocalStorage = () => {
  list2.innerHTML = ""; // Clear previous content
  let storedExpense = JSON.parse(localStorage.getItem("ExpenseList")) || [];

  storedExpense.forEach((item) => {
    let sublistContent = document.createElement("div");
    sublistContent.classList.add("sublist-content", "flex-space");
    list2.appendChild(sublistContent); 
    sublistContent.innerHTML = `<p class="product">${item.Cname}</p><p class="currentA">${item.Cprice}</p>`;
    let editButton = document.createElement("button");
    editButton.classList.add("fa-solid", "fa-pen-to-square", "edit"); 
    editButton.style.fontSize = "1.2em"; //Set the font size of the button
    editButton.addEventListener("click", () => {  // Add an event listener to the button that triggers the 'modifyElement' function when clicked
      modifyElement(editButton, true); 
    });
    let deleteButton = document.createElement("button");  //Create a new button element for delecting the list item
    deleteButton.classList.add("fa-solid", "fa-trash-can", "delete"); //Add CSS classes ("fa-solid", "fa-trash-can", "delete") to the button for styling this are font awesome icons
    deleteButton.style.fontSize = "1.2em"; //Set the font size of the button
    deleteButton.addEventListener("click", () => { // Add an event listener to the button that triggers the 'modifyElement' function when clicked
      modifyElement(deleteButton);
    });
    // Append both the edit and delete buttons to the 'sublistContent' <div>
    sublistContent.appendChild(editButton);
    sublistContent.appendChild(deleteButton);
    // Finally, append the 'sublistContent' <div> to the main list container
    list2.appendChild(sublistContent);
  });
};

const calculateTotalExpense = () => {
  let totalExpense = 0;
  
  let listvalue = document.querySelectorAll(".currentA"); // Select elements with class "currentA"
  
  listvalue.forEach(item => {
    totalExpense += parseFloat(item.innerText) || 0; // Convert to number, default to 0 if invalid
  });

  return totalExpense;
};

const storedExpenseCalc = () =>{
    expenditureValue.innerText = calculateTotalExpense();
    const totalBalance = tempAmount - calculateTotalExpense() ;
    balanceValue.innerText = totalBalance;
    if (totalBalance < 0) {
      current_debt.innerHTML = -totalBalance;
    }
}
// function to disable buttons
const disableButtons = (bool) => { // with function name disableButtons and parameter bool
   let editButtons = document.getElementsByClassName("edit");
   Array.from(editButtons).forEach(function(element) { 
     //
     element.disabled = bool;
   });
 };
 
 // Arrrow Function To Modify List Elements
 const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement; 
  let currentBalance = balanceValue.innerText; 
  let currentExpense = expenditureValue.innerText;
  let parentAmount = parentDiv.querySelector(".currentA").innerText;
  if (edit) { 
    let parentText = parentDiv.querySelector(".product").innerText; 
    itemInput.value = parentText;
    userAmount.value = parentAmount; 
    disableButtons(true); 
  }
  balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount); // calute the tota expenditure by adding the last total expenditure to the new expenditure
  expenditureValue.innerText = parseInt(currentExpense) - parseInt(parentAmount); // calcute the current blance by subtracting the latest expenditure from the formal current balance
  parentDiv.remove();
  saveExpenseToLocalStorage();
};
 
 // an Arrow Function To Create List
 const listCreator = (expenseName, expenseValue) => { 
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space");
  list2.appendChild(sublistContent); 
  sublistContent.innerHTML = `<p class="product">${expenseName}</p><p class="currentA">${expenseValue}</p>`;
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit"); 
  editButton.style.fontSize = "1.2em"; //Set the font size of the button
  editButton.addEventListener("click", () => {  // Add an event listener to the button that triggers the 'modifyElement' function when clicked
    modifyElement(editButton, true); 
  });
  let deleteButton = document.createElement("button");  //Create a new button element for delecting the list item
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete"); //Add CSS classes ("fa-solid", "fa-trash-can", "delete") to the button for styling this are font awesome icons
  deleteButton.style.fontSize = "1.2em"; //Set the font size of the button
  deleteButton.addEventListener("click", () => { // Add an event listener to the button that triggers the 'modifyElement' function when clicked
    modifyElement(deleteButton);
  });
  // Append both the edit and delete buttons to the 'sublistContent' <div>
  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  // Finally, append the 'sublistContent' <div> to the main list container
  document.getElementById("list").appendChild(sublistContent);
  saveExpenseToLocalStorage();
};
//Function To Add Expenses
function Calculate_Expense() {
  if (!userAmount.value || !itemInput.value) {
      window.alert("Please enter valid expense details.");
      return;
  }

  let expenditure = parseInt(userAmount.value);
  let sum = parseInt(expenditureValue.innerText) + expenditure;
  expenditureValue.innerText = sum;

  const totalBalance = tempAmount - sum;
  balanceValue.innerText = totalBalance;

  listCreator(itemInput.value, userAmount.value);

  itemInput.value = "";
  userAmount.value = "";

  if (totalBalance < 0) {
      current_debt.innerHTML = -totalBalance;
  }
}

checkButton.addEventListener("click", Calculate_Expense);



function calculate() {
  // Convert input values to numbers
  let principle = parseFloat(principleInput.value);
  let rate = parseFloat(rateInput.value);

  let time = parseFloat(timeInput.value)/12;
  

  // Calculate interest
  let intrest = (principle * rate * time) / 100;

  // Calculate total amount
  let totals = principle + intrest;
  // Update the display elements with calculated values
  
  intrestAmount.innerHTML = intrest.toFixed(2);
  totalAmount.innerHTML = totals.toFixed(2);
  test.innerHTML ="i am working";
 
  // Clear the input fields
  principleInput.value = "";
  rateInput.value = "";
  timeInput.value = "";
  
  knew.innerHTML = principle.toFixed(2);
};
const simplebtn = document.getElementById("Calculatebn");
simplebtn.addEventListener("click", calculate);

function set_int_rate(){
  let New_rate_in = document.getElementById("int-rate");
  let New_rate_no = parseInt(New_rate_in.value)
  let current_rate = document.getElementById("current-rate");
if (New_rate_no > 0 &&  New_rate_no < 100){
  current_rate.innerHTML =New_rate_no ;
};
New_rate_in.value ="";
};

const ratebtn = document.getElementById("ratebtn");
ratebtn.addEventListener("click", set_int_rate);
