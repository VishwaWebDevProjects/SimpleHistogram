var studentNames = [];
var values = [];
var studentNamesCopy = [];
var valuesCopy = [];
var bounds = [];

var inputAreas = document.querySelectorAll(".inputGradeRelated");

function init(){
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
    for (let i = 0; i < inputAreas.length; i++) {
        inputAreas[i].addEventListener('change', loadBalancer);
    }
}
  
function handleFileSelect(event) {
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);
}

function handleFileLoad(event) {
    var content = event.target.result;
    var studentValues = [];
    var contentSplit = content.split('\r\n');
    for (let i = 1; i < contentSplit.length; i++) {
        studentValues.push(contentSplit[i].split(','));
    }

    var studentName;
    for (let i = 0; i < studentValues.length; i++) {
        studentName = studentValues[i][0].trim();
        studentNamesCopy.push(studentName);
    }

    var studentVal;
    for (let i = 0; i < studentValues.length; i++) {
        studentVal = studentValues[i][1];
        valuesCopy.push(Number(studentVal));
    }
    loadBalancer();
}

function comp(a,b) {
    return a-b;
}

function findMean() {
    var meanValue = 0;
    for (let i of values) {
        meanValue += i;
    }
    meanValue = meanValue / values.length;
    return meanValue;
}

function findMedian() {
    var arrayCopy = values.slice();
    arrayCopy.sort(comp);
    var midpoint = Math.floor(arrayCopy.length / 2);
    var median = arrayCopy.length % 2 === 1 ? arrayCopy[midpoint] : (arrayCopy[midpoint - 1] + arrayCopy[midpoint]) / 2;
    return median;
}

function findHighest() {
    var stringToReturn = "";
    var arrayCopy = values.slice();
    arrayCopy.sort(comp);
    var highest = arrayCopy[arrayCopy.length-1];
    for (let i in values) {
        if (arrayCopy[arrayCopy.length-1] == values[i]) {
            stringToReturn += studentNames[i] + ", ";
        }
    }
    stringToReturn += highest;
    return stringToReturn;
}

function findLowest() {
    var stringToReturn = "";
    var arrayCopy = values.slice();
    arrayCopy.sort(comp);
    var lowest = arrayCopy[0];
    for (let i in values) {
        if (arrayCopy[0] == values[i]) {
            stringToReturn += studentNames[i] + ", ";
        }
    }
    stringToReturn += lowest;
    return stringToReturn;
}

function loadBalancer() {
    updateBounds();
    var errorsPresent = 0;
    if (values.length) {
        updateArrays();
        if (errorsPresent == 0) {
            updateHistogram();
            updateStats();
        }
    }
}

function updateBounds() {
    for (let i = 0; i < inputAreas.length; i++) {
        if (inputAreas[i].value.length > 0) {
            if (isNaN(Number(inputAreas[i].value))) {
                updateErrorMessage("Please input a number...");
                break;
            } else {
                updateErrorMessage("No errors...");
            }

            if (i != 0 && i != bounds.length-1) {
                if (Number(inputAreas[i].value) < bounds[i+1] || bounds[i-1] < Number(inputAreas[i].value)) {
                    updateErrorMessage("Please check the bounds of your inputs...");
                    break;
                } else {
                    updateErrorMessage("No errors...");
                }
            }

            bounds[i] = Number(inputAreas[i].value);
        }
    }
    updateArrays();
}

function updateArrays() {
    var x = 0;
    var val = [];
    var stds = [];
    for (let i = 0; i < valuesCopy.length; i++) {
        if (valuesCopy[i] <= bounds[0] && valuesCopy[i] >= bounds[bounds.length-1]) {
            val[x] = valuesCopy[i];
            stds[x] = studentNamesCopy[i];
            x++;
        }
    }
    values = val;
    studentNames = stds;
}

function updateHighestInHistogram() {
    var meterValues = document.querySelectorAll(".metVal");
    for (let i = 0; i < meterValues.length; i++) {
        meterValues[i].setAttribute("max", values.length);
    }
}

function countHowManyStudents(upperBound, lowerBound) {
    var count = 0;
    for (let i of values) {
        if (i < upperBound && i >= lowerBound) {
            count = count + 1;
        }
    }
    return count;
}

function updateHistogram() {
    updateHighestInHistogram();
    var numOfStudents = 0;
    var meterValues = document.querySelectorAll(".metVal");
    var numOfStudentsValues = document.querySelectorAll(".numOfStudents");
    for (let i = 0; i < meterValues.length; i++) {
        numOfStudents = countHowManyStudents(bounds[i], bounds[i+1]);
        meterValues[i].setAttribute("value", numOfStudents);
        numOfStudentsValues[i].innerHTML = numOfStudents;
    }
    document.querySelector("#totalNumOfStudents").innerHTML = values.length;
}

function updateStats() {
    var mean = findMean();
    var median = findMedian();
    var highestRated = findHighest();
    var lowestRated = findLowest();

    var statClass = document.querySelectorAll(".statClass");
    statClass[0].innerHTML = highestRated;
    statClass[1].innerHTML = lowestRated;
    statClass[2].innerHTML = mean;
    statClass[3].innerHTML = median;
}

function updateErrorMessage(errorMsg) {
    var errorTag = document.querySelector("#errorMessage");
    errorTag.innerHTML = errorMsg;
}