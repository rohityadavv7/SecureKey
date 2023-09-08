const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numberCheck = document.querySelector('#numbers');
const symbolCheck = document.querySelector('#symbols');
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector('.generateButton');

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '!@#$%^&*()_+-=;,.<>{/:}"<[]>]?';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();

//indicator k lie default color
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    //extra part
    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize =((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateNumber(){
    return getRandomInteger(0,9);
}

function generateSymbol(){
    const randNum = getRandomInteger(symbols.length);
    return symbols.charAt(randNum);
}

//CALCULATE STRENGTH

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

//COPY CONTENT
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    //to make copy wala text visible
    copyMsg.classList.add("active");

    setTimeout (() => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


//EVENTLISTENER
inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value){
        copyContent();
    }
})

//PASSWORD GENERATOR
generateBtn.addEventListener('click',() => {

    //none of the checkbox are selected
    if(checkCount == 0){
        return;
    }

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

  
    // if(uppercaseCheck.checked){
    //     password += generateuppercase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowercase;
    // }

    // if(numberCheck.checked){
    //     password += generateNumber();
    // }

    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }
    if(numberCheck.checked){
        funcArr.push(generateNumber);
    }

    //compulsory addition
    for(let i = 0;i < funcArr.length;i++){
        password += funcArr[i]();
    }

    //remaining addition
    for(let i = 0;i < passwordLength - funcArr.length;i++){
        let randIdx = getRandomInteger(0,funcArr.length);
        password += funcArr[randIdx]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));
    
    //show in UI
    passwordDisplay.value = password;
    
    //calculate strength
    calcStrength();
})

  