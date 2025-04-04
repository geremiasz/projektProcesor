let readGlobal = 1;
let writeGlobal = 1;
let currentRowIndex = 1; // aktualny indeks wiersza createProgramTable
const firstInputs = { //tablica inputów do skrolowania
    read: 1,
    write: 1
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


// EVENTY WYKONYWANE PO ZAŁADOWANIU SIĘ APLIKACJI
window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
    document.querySelector('#startProgram').addEventListener('click', () => {
        startProgram(1, true)
    })
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

        if(i === 0){
            row.style.backgroundColor = "#cc8029";
            rowAddress.style.backgroundColor = "#cc8029";

        }else{
            row.style.backgroundColor = "#525252";
            rowAddress.style.backgroundColor = "#3f84a3";
        }

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

function scrollVert(px) {
    const div = document.getElementById('memoryTable-scroll');
    div.scrollTop += px;
    if(div.scrollTop > 2240){
        div.scrollTop = 2240;
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
    let address = prompt("Wpisz adres komórki (max. 80)");

    if(address < 0 || address > 80){
        alert("Niepoprawna cyfra");
        return;
    }

    const div = document.getElementById('memoryTable-scroll');
    div.scrollTop = address*28;
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
            if (event.key === 'Enter') {
                createProgramTable(2, 3);
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
    while(num < currentRowIndex){
        let option = document.getElementById("select-" + num).value;
        let argument = document.getElementById("argument-" + num).value;

        const isChecked = isCheckboxChecked(num);
        if(isChecked){
            break;
        }

        processorMessage(option, argument);
        switch(option){
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
    alert("W trakcie budowy");
}
