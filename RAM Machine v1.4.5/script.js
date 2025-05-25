/* ---------------------------------------------------------------------------
Copyright to The Independent and Democratic People of Geremiasz Studio 2025
--------------------------------------------------------------------------- */

let readGlobal = 1;
let writeGlobal = 1;
let currentRowIndex = 1; // aktualny indeks wiersza createProgramTable
let currentNum = 1; // aktualny numer programu
const firstInputs = { //tablica inputów do skrolowania
    read: 1,
    write: 1,
    memory: 10
};

// liczniki funkcji
const liczniki = {
    add: 0,
    sub: 0,
    mult: 0,
    div: 0,
    load: 0,
    store: 0,
    read: 0,
    write: 0,
    jump: 0,
    jgtz: 0,
    jzero: 0
};

// Koszty dla instrukcji
const koszty = {
    LOAD: (a) => t(a),
    STORE: (value, x) => lcost(value) + lcost(x),
    ADD: (value, a) => lcost(value) + t(a),
    SUB: (value, a) => lcost(value) + t(a),
    MULT: (value, a) => lcost(value) + t(a),
    DIV: (value, a) => lcost(value) + t(a),
    READ: (y, x) => lcost(y) + lcost(x),
    WRITE: (a) => t(a),
    JUMP: (e) => 1,
    JGTZ: (e) => lcost(e),
    JZERO: (e) => lcost(e),
    HALT: () => 1
};


// EVENTY WYKONYWANE PO ZAŁADOWANIU SIĘ APLIKACJI
window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
    document.querySelector('#startProgram').addEventListener('click', () => {
        startProgram(currentNum, true); // Rozpocznij program od currentNum
        const resumeProgram = document.getElementById("resumeProgram"); // Przycisk do wznowienia programu
        resumeProgram.style.display = "none";
        document.querySelector('#stopProgram').style.display = "block";
        stopProgram = false;
    });
    
    document.querySelector('#stopProgram').addEventListener('click', function() {
        const resumeProgram = document.getElementById("resumeProgram"); // Przycisk do wznowienia programu
        resumeProgram.style.display = "block";
        document.querySelector('#stopProgram').style.display = "none";
        stopProgram = true;
    });
    
    document.querySelector('#resumeProgram').addEventListener('click', function() {
        document.querySelector('#stopProgram').style.display = "block";
        const resumeProgram = document.getElementById("resumeProgram"); // Przycisk do wznowienia programu
        resumeProgram.style.display = "none";
        stopProgram = false;
        startProgram(currentNum, false); // Wznów program od currentNum
    });

    document.querySelector('#step').addEventListener('click', function() { //funkcja kroku
        currentNum++;
        startProgram(currentNum, false);
    });
});

// Sprawdzanie czy plik został wczytany i funlcja do wczytywania pliku
document.addEventListener('DOMContentLoaded', function() {
    function loadFile(event) {
        var modal = document.getElementById('closeButton');
        modal.click();
        const file = event.target.files[0];
        if (file && file.type === "text/plain") {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const content = e.target.result;
                const lines = content.split('\n'); // Dzielenie na linie
                const firstLine = lines[0]; // Podział na linie i pobranie pierwszej linii
                if (firstLine.trim() === 'Tasma_wejsciowa') { // Użycie trim() aby usunąć białe znaki
                    for(let i = 1; i< (lines.length); i++){ 
                        const input = document.getElementById("input-" + i);
                        const line = lines[i];
                        if(line == '?'){
                            input.value = '';
                        }else{
                            input.value = line;
                        }
                    }
                } else {
                    alert("Możesz wczytywać tylko pliki do taśmy wejściowej")
                }
            };
            
            reader.readAsText(file);
        } else {
            alert("Proszę wybrać plik tekstowy (.txt)");
        }
    }

    document.getElementById('fileInput').addEventListener('change', loadFile);
});

// Wczytywanie Programu
document.addEventListener('DOMContentLoaded', function () {
    function loadProgramFile(event) {
        var modal = document.getElementById('closeButton');
        modal.click();
        const file = event.target.files[0];

        if (file && file.type === "text/plain") {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const lines = content.split('\n'); // Dzielenie na linie
                console.log(lines.length);
                let lineIndex = 1; // Indeks linii do dodawania nowych wierszy
                    for(let i = 0; i< (lines.length-1); i+= 4){ 
                        const row = document.getElementById("programRow-" + lineIndex);
                        const etykieta = document.getElementById("etykieta-" + lineIndex);
                        const instruction = document.getElementById("select-" + lineIndex);
                        const argument = document.getElementById("argument-" + lineIndex);
                        const comment = document.getElementById("comment-" + lineIndex);
                        etykieta.value = lines[i] || " ";
                        instruction.value = lines[i+1] || " ";
                        argument.value = lines[i+2] || " ";
                        comment.value = lines[i+3] || " ";
                        row.dispatchEvent(new KeyboardEvent("keydown", { // Dodanie nowego wiersza
                            bubbles: true,
                            cancelable: true,
                            key: "Enter",
                            code: "Enter",
                            keyCode: 13
                        }));
                        lineIndex++;
                    }
            };
            
            reader.readAsText(file);
        } else {
            alert("Proszę wybrać plik tekstowy (.txt)");
        }
    }

    document.getElementById('fileProgramInput').addEventListener('change', loadProgramFile);
});

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createMemoryTable() {
    const memoryTable = document.getElementById('memoryTable');
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 100; i++) {
        const row = document.createElement('tr');
        row.id = "memoryRow-" + i;

        const rowAddress = document.createElement('td');
        rowAddress.textContent = i;
        rowAddress.className = "memoryTable-rowId";

        const rowValue = document.createElement('td');
        rowValue.textContent = "?";
        rowValue.className = "memoryTable-valueRow";
        rowValue.id = "memoryTable-row-" + i;

        /*
        if(i === 0){
            row.style.backgroundColor = "#cc8029";
            rowAddress.style.backgroundColor = "#cc8029";

        }else{
            row.style.backgroundColor = "#525252";
            rowAddress.style.backgroundColor = "#3f84a3";
        }
        */

        row.appendChild(rowAddress);
        row.appendChild(rowValue);
        fragment.appendChild(row);
    }

    memoryTable.appendChild(fragment);
}


function createReadTable() {
    const headerTable = document.getElementById('readTable-id');
    const inputTable = document.getElementById('readTable-input');
    const headerFragment = document.createDocumentFragment();
    const inputFragment = document.createDocumentFragment();

    for (let i = 1; i < 100; i++) {
        const cellNum = document.createElement('th');
        cellNum.textContent = i;
        cellNum.className = "readTable-cellNum";
        headerFragment.appendChild(cellNum);

        const inputCell = document.createElement('td');
        inputCell.id = "inputCell-" + i;
        inputCell.className = "readTable-cell";

        const input = document.createElement('input');
        input.type = 'number';
        input.id = "input-" + i;
        input.className = "readTable-input";

        const upArrow = document.createElement('i');
        upArrow.className = "fas fa-arrow-up arrow-icon";
        upArrow.id = "arrow-Read-" + i;

        if(i === 1){
            upArrow.style.visibility = 'visible';
        }else{
            upArrow.style.visibility = 'hidden';
        }

        inputCell.appendChild(input);
        inputCell.appendChild(upArrow);
        inputFragment.appendChild(inputCell);
    }

    headerTable.appendChild(headerFragment);
    inputTable.appendChild(inputFragment);
}

function createWriteTable(){
    for(let i = 1; i < 100; i++){
        const cellNum = document.createElement('th');
        cellNum.textContent = i;
        cellNum.className = "writeTable-cellNum";

        const table = document.getElementById('writeTable-id');
        table.appendChild(cellNum);
    }

    for(let i = 1; i < 100; i++){
        const inputCell = document.createElement('td');
        inputCell.id = "inputCell-" + i;
        inputCell.className = "writeTable-cell";

        const input = document.createElement('input');
        input.type = 'number';
        input.id = "output-" + i;
        input.className = "writeTable-input";
        input.disabled = true;

        const downArrow = document.createElement('i');
        downArrow.className = "fas fa-arrow-down arrow-icon";
        downArrow.id = "arrow-Write-" + i;
        downArrow.style.visibility = 'hidden';
        if(i == 1){
            downArrow.style.visibility = 'visible';
        }

        inputCell.appendChild(downArrow);
        inputCell.appendChild(input);
        const table = document.getElementById('writeTable-input');
        table.appendChild(inputCell);
    }
}

function scrollVert(direction) {
    if (direction === 'up') {
        if (firstInputs.memory > 0) { // Upewnij się, że nie przekroczymy dolnej granicy
            firstInputs.memory-= 10;
            if (firstInputs.memory <= 0) {
                firstInputs.memory = 0; // Ustaw na 0, jeśli przekroczono dolną granicę
                const element = document.getElementById("memoryTable-head");
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            }else{
                const element = document.getElementById("memoryRow-" + (firstInputs.memory - 1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            }           
        }
    } else if (direction === 'down') {
        if (firstInputs.memory < 10){
            firstInputs.memory = 10;
        }
        if (firstInputs.memory < 99) {
            const element = document.getElementById("memoryRow-" + (firstInputs.memory + 1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }
            firstInputs.memory++
        }
        
    }
}

function scrollHoriNext(table) {
    let input = "";
    if(table == 'read'){
        input = "input";
    }else if(table == 'write'){
        input = "output"
    }
    if (firstInputs[table] < 95) {
        const element = document.getElementById(input + "-" + (firstInputs[table] + 1));
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
        firstInputs[table]++;
    }
}

function scrollHoriLast(table) {
    let input = "";
    if(table == 'read'){
        input = "input";
    }else if(table == 'write'){
        input = "output"
    }
    if (firstInputs[table] > 1) {
        const element = document.getElementById(input + "-" + (firstInputs[table] - 1));
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
        firstInputs[table]--;
    }
}

function showNextArrow(whichTable){
    if(writeGlobal !== 99){
        if(whichTable == 'write'){
            const currentArrow = document.getElementById("arrow-Write-" + writeGlobal);
            const nextArrow = document.getElementById("arrow-Write-" + (writeGlobal + 1));
            currentArrow.style.visibility = 'hidden';
            nextArrow.style.visibility = 'visible';
        }else if(whichTable == 'read'){
            const currentArrow = document.getElementById("arrow-Read-" + readGlobal);
            const nextArrow = document.getElementById("arrow-Read-" + (readGlobal + 1));
            currentArrow.style.visibility = 'hidden';
            nextArrow.style.visibility = 'visible';
        }
    }
}

function resetArrows(){
    for(let i = 1; i < 100; i++){
        const arrowWrite = document.getElementById("arrow-Write-" + i);
        const arrowRead = document.getElementById("arrow-Read-" + i);
        if(i==1){
            arrowWrite.style.visibility = 'visible';
            arrowRead.style.visibility = 'visible';
        }else{
            arrowWrite.style.visibility = 'hidden';
            arrowRead.style.visibility = 'hidden';
        }
    }
}

function toAddress(){
    let address = prompt("Wpisz adres komórki (max. 99)");

    if(address < 0 || address > 99){
        alert("Niepoprawna cyfra");
        return;
    }
    firstInputs.memory = parseInt(address);
    console.log(firstInputs.memory);
    const element = document.getElementById("memoryRow-" + (firstInputs.memory ));
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
}

function createProgramTable(ilosc, numer) {
    for (let i = ilosc; i < numer; i++) {
        const row = document.createElement('tr');
        row.id = "programRow-" + currentRowIndex; 

        const id = document.createElement('td');
        id.textContent = currentRowIndex; 
        id.id = "programID-" + currentRowIndex;

        const label2 = document.createElement('label'); // Label checkboxa

        const stop = document.createElement('input'); // Checkbox
        stop.type = 'checkbox';
        stop.id = 'checkbox-' + currentRowIndex;
        
        const circle = document.createElement('span'); // Część okrągła checkboxa
        circle.className = 'checkbox-circle';

        const label = document.createElement('input');
        label.type = 'text';
        label.id = 'etykieta-' + currentRowIndex;

        const labelWrap = document.createElement('td');
        labelWrap.appendChild(label);

        const instruction = document.createElement('select');
        instruction.id = "select-" + currentRowIndex;

        const element = document.createElement("option");
        element.value = "";
        element.textContent = "";
        instruction.appendChild(element);

        const options = ["load", "store", "add", "sub", "mult", "div", "read", "write", "jump", "jgtz", "jzero", "halt"];

        options.forEach(option => {
            const element = document.createElement("option");
            element.value = option;
            element.textContent = option;
            instruction.appendChild(element);
        });

        const selectWrap = document.createElement('td');
        selectWrap.appendChild(instruction);

        const argument = document.createElement('input');
        argument.type = 'text';
        argument.id = 'argument-' + currentRowIndex;
        const argumentWrap = document.createElement('td');
        argumentWrap.appendChild(argument);

        const comment = document.createElement('input');
        comment.type = 'text';
        comment.id = 'comment-' + currentRowIndex;
        const commentWrap = document.createElement('td');
        commentWrap.appendChild(comment);

        label2.appendChild(stop);
        label2.appendChild(circle);

        row.appendChild(label2);
        row.appendChild(id);
        row.appendChild(labelWrap);
        row.appendChild(selectWrap);
        row.appendChild(argumentWrap);
        row.appendChild(commentWrap);

        row.addEventListener('keydown', function(event) { // dodanie eventu do wiersza
            if (event.key === 'Enter' || event.key === 'ArrowUp') {
                createProgramTable(2, 3);
            }
            if (event.key === 'Escape' || event.key === 'ArrowDown'){
                var table = document.querySelector('#programTable');
                if(table.lastElementChild.id != 'programRow-1'){
                var lastRow = table && table.lastElementChild;
                lastRow && lastRow.remove();
                currentRowIndex--;
                }
            }
        });

        const table = document.getElementById('programTable');
        table.appendChild(row);

        currentRowIndex++; 
    }
}

function isCheckboxChecked(index) {
    const checkbox = document.getElementById('checkbox-' + index);
    return checkbox.checked;
}

async function startProgram(num, firstTime){
    if(firstTime){
        readGlobal = 1;
        writeGlobal = 1;
       //resetowanie liczników
        for (let licznik in liczniki) {
            if (liczniki.hasOwnProperty(licznik)) {
                    liczniki[licznik] = 0; // Resetowanie licznika do zera
                }
        }
        resetTable();
        resetArrows();
    }
   while (num < currentRowIndex) {
        let option = document.getElementById("select-" + num).value;
        let argument = document.getElementById("argument-" + num).value;
        const isChecked = isCheckboxChecked(num);
        
        if (stopProgram || isChecked) {
            currentNum = num; // Zapisz aktualny numer przed zatrzymaniem
            break;
        }
        
        processorMessage(option, argument);
        
        switch (option) {
            case "":
            case "halt":
                return;
            case "jump":
            case "jgtz":
            case "jzero":
                await sleep(1000);
                jump(option, argument, num);
                return;  
        }
        
        await sleep(1000);
        useFunction(option, argument);
        num++;
    }
}

function useFunction(option, argument){
    switch(option){
        case "load":
            load(argument);
        break;
        case "store":
            store(argument);
        break;
        case "add":
            add(argument);
        break;
        case "sub":
            sub(argument);
        break;
        case "mult":
            mult(argument);
        break;
        case "div":
            div(argument);
        break;
        case "read":
            read(argument);
        break;
        case "write":
            write(argument);
        break;
        case "halt":
            return;
    }
}

function processorMessage(option, argument){
    document.getElementById("instructionInput").value = option;
    document.getElementById("argumentInput").value = argument;
    setTimeout(() => flashElement('argumentInput'), 100);
    setTimeout(() => flashElement('instructionInput'), 100);
}

function load(argument){
    let input = document.getElementById("load");
    let value = document.getElementById("memoryTable-row-" + argument).textContent;
    document.getElementById("memoryTable-row-0").textContent = value;
    input.value = ++liczniki.load;
}

function store(argument){
    let input = document.getElementById("store");
    let value = document.getElementById("memoryTable-row-0").textContent;
    document.getElementById("memoryTable-row-" + argument).textContent = value;
    input.value = ++liczniki.store;
}

function add(argument){
    let input = document.getElementById("add");
    let value = parseFloat(document.getElementById("memoryTable-row-0").textContent) || 0;
    value += parseFloat(document.getElementById("memoryTable-row-" + argument).textContent) || 0;
    document.getElementById("memoryTable-row-0").textContent = value;
    input.value = ++liczniki.add;
}

function sub(argument){
    let input = document.getElementById("sub");
    let value = parseFloat(document.getElementById("memoryTable-row-0").textContent) || 0;
    value -= parseFloat(document.getElementById("memoryTable-row-" + argument).textContent) || 0;
    document.getElementById("memoryTable-row-0").textContent = value;
    input.value = ++liczniki.sub;
}

function mult(argument){
    let input = document.getElementById("mult");
    let value = parseFloat(document.getElementById("memoryTable-row-0").textContent) || 0;
    value *= parseFloat(document.getElementById("memoryTable-row-" + argument).textContent) || 0;
    document.getElementById("memoryTable-row-0").textContent = value;
    input.value = ++liczniki.mult;
}

function div(argument){
    let input = document.getElementById("div");
    let value = parseFloat(document.getElementById("memoryTable-row-0").textContent) || 0;
    value /= parseFloat(document.getElementById("memoryTable-row-" + argument).textContent) || 0;
    document.getElementById("memoryTable-row-0").textContent = value;
    input.value = ++liczniki.div;
}

function read(argument){
    let input = document.getElementById("read");
    let value = document.getElementById("input-" + readGlobal).value;
    document.getElementById("memoryTable-row-" + argument).textContent = value;
    showNextArrow('read');
    readGlobal++;
    input.value = ++liczniki.read;
}

function write(argument){
    let input = document.getElementById("write");
    let value = document.getElementById("memoryTable-row-" + argument).textContent;
    document.getElementById("output-" + writeGlobal).value = value;
    showNextArrow('write');
    writeGlobal++;
    input.value = ++liczniki.write;
}

function jump(option, argument, currentID){
    let input = document.getElementById(option);
    switch(option){
        case "jump":
            startProgram(argument, false);
            input.value = ++liczniki.jump;
        break;
        case "jgtz":
            if(document.getElementById("memoryTable-row-0").textContent > 0){
                jump("jump", argument, 0);
            }
            else{
                jump("jump", currentID+1, 0);
            }
            input.value = ++liczniki.jgtz;
        break;
        case "jzero":
            if(document.getElementById("memoryTable-row-0").textContent == 0){
                jump("jump", argument, 0);
            }
            else{
                jump("jump", currentID+1, 0);
            }
            input.value = ++liczniki.jzero;
        break;
    }
}

function resetTable(){
    for(let i = 0; i < 100; i++){
        document.getElementById("memoryTable-row-" + i).textContent = "?";
        if(i > 0){document.getElementById("output-" + i).value = "&nbsp;";}
    }
}

// Funkcja obliczająca koszt logarytmiczny
function lcost(x) {
    if (x == 0) {
        return 1; 
    } else if (x < 0) {
        return 0; 
    } else {
        return Math.floor(Math.log10(Math.abs(x))) + 1; 
    }
}

function download(content, name){
    const blob = new Blob([content], { type: 'text/plain' }); //pobieranie pliku
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name+ '.txt';
    document.body.appendChild(link);
    link.click(); 
    document.body.removeChild(link); 
}

function save(table) {
     if (table === 'pamiec') {
        var closeModal = document.getElementById("closeMemoryButton");
        let start = document.getElementById("firstAddress").value;
        let end = document.getElementById("lastAddress").value;
        let content = '';
        let name = 'Pamiec_maszyny'
        if (isNaN(start) || isNaN(end) || start < 0 || end >= 100 || start > end) {
            alert("Nieprawidłowe adresy. Upewnij się, że są to liczby w zakresie 0-99 i że początkowy adres jest mniejszy lub równy końcowemu.");
            return; // Zakończ działanie funkcji, jeśli walidacja nie powiodła się
        }
        for (let i = start; i <= end; i++) { 
            const actualLabel = document.getElementById("memoryTable-row-" + i);
            if (actualLabel) {
                content += "[ "+ i +"] " + actualLabel.innerText + '\n'; 
            }
        }

        download(content, name);
        closeModal.click();
    }else if(table === 'wejscie'){
        id = 'input-';
        name = 'Tasma_wejsciowa';
        saveHori(id, name);
    }else if(table === 'wyjscie'){
        id = 'output-';
        name = 'Tasma_wyjsciowa';
        saveHori(id, name);
    }else if(table === 'raport'){
        saveRaport();
    }else if(table === 'program'){
        saveProgram();
    }
}

function saveHori(id, name){
    let end = false
    let i = 1;
    let content = '';
    if(name === 'Tasma_wejsciowa'){
        content += 'Tasma_wejsciowa\n';
    }
    while(end == false){
        const input = document.getElementById(id + i).value;
        if(input == ''){
           const check = document.getElementById(id + (i+=1)).value;
           if(check == ''){
                end = true;
           }else{
                content += "?\n" + check + "\n";
           }
        }else{
            content += input + "\n";
        }
        i++;
    }
        download(content, name)
}

function saveRaport(){
    let timeLogaritmicCost = document.getElementById("lCost").value
    let timeUniformcCost = document.getElementById("uCost").value
    let spaceLogaritmicReport = document.getElementById("SlCost").value
    let spaceUniformReport = document.getElementById("SuCost").value
    let name = "Raport"
    let content = '';
    content += "- Time Complexity Report\n";
    content += "\tLogarithmic Cost: " + timeLogaritmicCost + "\n";
    content += "\tUniform Cost: " + timeUniformcCost + "\n\n";
    content += '- Space Complexity Report\n';
    content += "\tLogarithmic Cost: " + spaceLogaritmicReport + "\n";
    content += "\tUniform Cost: " + spaceUniformReport + "\n\n";
    content += "- Executed Instructions Count\n";
    for (const key in liczniki) {
        if (liczniki.hasOwnProperty(key)) {
            content += "\t" + `${key.toUpperCase()}: ${liczniki[key]}` + "\n";
        }
    }
    download(content, name);
}


function saveProgram() {
    let content = "";
    let name = "Program";
    for (let i = 1; i < currentRowIndex; i++) {
        let etykieta = document.getElementById("etykieta-" + i);
        let instruction = document.getElementById("select-" + i);
        let argument = document.getElementById("argument-" + i);
        let comment = document.getElementById("comment-" + i);
        if (etykieta && instruction && argument && comment) {
            content += etykieta.value + "\n" + instruction.value + "\n" + argument.value + "\n" + comment.value + "\n";
        }
    }
    download(content, name);
}

// Animacja migania
function flashElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.classList.remove("flash");

    void element.offsetWidth;

    element.classList.remove("bg-dark");
    element.classList.remove("text-light");
    element.classList.remove("text-light");
    element.classList.add("flash");

    setTimeout(() => {
        element.classList.remove("flash");
        element.classList.add("bg-dark");
        element.classList.add("text-light");
        element.classList.remove("text-dark");
    }, 500);
}

/* przydatne ID
instructionInput
argumentInput
*/