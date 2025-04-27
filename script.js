const inputFields = document.querySelectorAll(".input-field");
const tipInputs = document.querySelectorAll(".tip");
const outputPane = document.querySelector(".tip-results");
const tipAmount  = outputPane.querySelector("#tip-amount strong");
const totalAmount = outputPane.querySelector("#total strong");
const resetButtonContainer = outputPane.querySelector(".reset-button");
const resetButton = outputPane.querySelector("button");
const form = document.querySelector("form");



let customTipField;
let billAmount = null, peoples = null, tip = null;
let resetEnabled = false;

inputFields.forEach(elem => {
    const input = elem.querySelector("input");

    input.addEventListener("focus", () => elem.classList.add("active"))
    input.addEventListener("blur", () => elem.classList.remove("active"))

    input.addEventListener("input", (event) => { handleInput(event, elem, input) });
})

tipInputs.forEach(tip => {
    const input = tip.querySelector("input");

    input.addEventListener("focus", () => {
        tip.classList.add("active")
    })
    input.addEventListener("blur", () => tip.classList.remove("active"));
    input.addEventListener("input" , (e)=>handleInput(e , tip , input))


    if(input.type == "text")
        customTipField = input
})

resetButton.addEventListener("click" , (e)=>{
    if(!resetEnabled) return;
    form.reset();
    billAmount = null;
    peoples = null;
    tip = null;

    tipInputs.forEach(tip => tip.classList.remove("active"));

    resetButton.disabled = true;
    resetEnabled = false;
    resetButtonContainer.classList.add("disable");

    tipAmount.textContent = "0.00";
    totalAmount.textContent = "0.00";
})

function handleInput(event, elem, input) {

    if (elem.classList.contains("bill-field")) {
        handleBillInput(event, input);
    }
    else if (elem.classList.contains("peoples-field")) {
        handlePeopleInput(event, input);
    }
    else if(elem.classList.contains("tip") && input.type === "radio"){
        handleRadioInput(elem ,input);
    }
    else if(elem.classList.contains("tip") && input.type === 'text'){
        handleCustomTip(event, elem, input)
    }

    if (input.value == 0) {
        elem.classList.add("error")
    } else {
        elem.classList.remove("error")
    }

    if(!resetEnabled){
        enableReset();
    }

    updateOutput();
}

function handleBillInput(event, input) {

    let key = event.data;
    const isDigit = /[0-9]/.test(key);


    if (event.inputType === "deleteContentBackward") {
        billAmount /= 10;
        billAmount = Math.floor(billAmount * 100) / 100;
    }

    if (!isDigit) {
        input.value = billAmount.toFixed(2);
        return
    }


    if (isDigit) {
        billAmount = billAmount * 10 + Number(key) * 0.01;
        billAmount = Math.round(billAmount * 100) / 100;
    }


    input.value = billAmount.toFixed(2);
}

function handlePeopleInput(event, input) {
    let key = event.data;
    const isDigit = /[0-9]/.test(key);


    if (event.inputType === "deleteContentBackward") {
        peoples = Math.floor(peoples / 10);
    }

    if (!isDigit) {
        input.value = peoples;
        return
    }

    peoples = Number(input.value);
    input.value = peoples;
}

function handleRadioInput(elem, input) {
    tipInputs.forEach((tip)=>{
        tip.classList.remove("active");
    })

    customTipField.value = null;
    elem.classList.toggle("active");
    tip = Number(input.value);
}

function handleCustomTip(event, elem, input){
    tipInputs.forEach(tip => {
        const radio = tip.querySelector("input")
        tip.classList.remove("active")
        radio.checked = false;

    });
    const isDigit = /[0-9.]/.test(event.data);

    if(!isDigit)
        input.value = input.value.slice(0,-1);

    tip = Number(input.value);
}

function enableReset(){
    if(!billAmount || !peoples || !tip){
        return;
    }

    resetButton.disabled = false;
    resetEnabled = true;
    resetButtonContainer.classList.remove("disable");
}

function updateOutput(){
    tipAmount.textContent = (billAmount * tip / 100).toFixed(2);
    totalAmount.textContent = (peoples * billAmount * tip / 100).toFixed(2);
}
