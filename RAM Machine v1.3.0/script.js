let readGlobal = 1;
let writeGlobal = 1;

// EVENTY WYKONYWANE PO ZAŁADOWANIU SIĘ APLIKACJI
window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
    document.querySelector('#startProgram').addEventListener('click', () => {
        startProgram(1, true)
    })
});

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createMemoryTable() {
    for(let i = 0; i < 100; i++){
        const row = document.createElement('tr');
        row.id = "memoryRow-" + i;

        const rowAddress = document.createElement('td');
        rowAddress.textContent = i;
        rowAddress.style.backgroundColor = "#b5d4ff";
        rowAddress.className = "memoryTable-rowId";

        const rowValue = document.createElement('td');
        rowValue.textContent = "?";
        rowValue.className = "memoryTable-valueRow"
        rowValue.id ="memoryTable-row-" + i;

        if(i == 0){
            row.style.backgroundColor = "#fff9a8";
            rowAddress.style.backgroundColor = "#fff9a8";
        }
        else{
            row.style.backgroundColor = "#dddddd";
        }

        row.appendChild(rowAddress);
        row.appendChild(rowValue);

        const memoryTable = document.getElementById('memoryTable');
        memoryTable.appendChild(row);
    }
}

function createReadTable(){
    for(let i = 1; i < 100; i++){
        const cellNum = document.createElement('th');
        cellNum.textContent = i;
        cellNum.className = "readTable-cellNum";

        const table = document.getElementById('readTable-id');
        table.appendChild(cellNum);
    }

    for(let i = 1; i < 100; i++){
        const inputCell = document.createElement('td');
        inputCell.id = "inputCell-" + i;
        inputCell.className = "readTable-cell";

        const input = document.createElement('input');
        input.type = 'number';
        input.id = "input-" + i;
        input.className = "readTable-input";
 
        inputCell.appendChild(input);
        const table = document.getElementById('readTable-input');
        table.appendChild(inputCell);
    }
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

function scrollHori(px, name){
    const div = document.getElementById(name + 'Table-scroll');
    div.scrollLeft += px;
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

function createProgramTable(){
    for(let i = 1; i < 17; i++){
        const row = document.createElement('tr');
        row.id = "programRow-" + i;

        const id = document.createElement('td');
        id.textContent = i;
        id.id = "programID-" + i;

        const label = document.createElement('input');
        label.type = 'text';
        const labelWrap = document.createElement('td');
        labelWrap.appendChild(label);

        const instruction = document.createElement('select');
        instruction.id = "select-" + i;

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
        })
        const selectWrap = document.createElement('td');
        selectWrap.appendChild(instruction);

        const argument = document.createElement('input');
        argument.type = 'text';
        argument.id = 'argument-' + i;
        const argumentWrap = document.createElement('td');
        argumentWrap.appendChild(argument);

        const comment = document.createElement('input');
        comment.type = 'text';
        const commentWrap = document.createElement('td');
        commentWrap.appendChild(comment);
            
        row.appendChild(id);
        row.appendChild(labelWrap);
        row.appendChild(selectWrap);
        row.appendChild(argumentWrap);
        row.appendChild(commentWrap);

        const table = document.getElementById('programTable');
        table.appendChild(row);
    }
}

async function startProgram(num, firstTime){
    if(firstTime){
        readGlobal = 1;
        writeGlobal = 1;
        resetTable();
    }
    while(num < 17){
        let option = document.getElementById("select-" + num).value;
        let argument = document.getElementById("argument-" + num).value;
        
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
    let value = document.getElementById("input-" + argument).value;
    document.getElementById("memoryTable-row-0").textContent = value;
}

function store(argument){
    let value = document.getElementById("memoryTable-row-0").textContent;
    document.getElementById("memoryTable-row-" + argument).textContent = value;
}

function add(argument){
    let value = parseFloat(document.getElementById("memoryTable-row-0").textContent) || 0;
    value += parseFloat(document.getElementById("memoryTable-row-" + argument).textContent) || 0;

    document.getElementById("memoryTable-row-0").textContent = value;
}

function sub(argument){
    let value = parseFloat(document.getElementById("memoryTable-row-0").textContent) || 0;
    value -= parseFloat(document.getElementById("memoryTable-row-" + argument).textContent) || 0;

    document.getElementById("memoryTable-row-0").textContent = value;
}

function mult(argument){
    let value = parseFloat(document.getElementById("memoryTable-row-0").textContent) || 0;
    value *= parseFloat(document.getElementById("memoryTable-row-" + argument).textContent) || 0;

    document.getElementById("memoryTable-row-0").textContent = value;
}

function div(argument){
    let value = parseFloat(document.getElementById("memoryTable-row-0").textContent) || 0;
    value /= parseFloat(document.getElementById("memoryTable-row-" + argument).textContent) || 0;

    document.getElementById("memoryTable-row-0").textContent = value;
}

function read(argument){
    let value = document.getElementById("input-" + readGlobal).value;
    document.getElementById("memoryTable-row-" + argument).textContent = value;
    readGlobal++;
}

function write(argument){
    let value = document.getElementById("memoryTable-row-" + argument).textContent;
    document.getElementById("output-" + writeGlobal).value = value;
    writeGlobal++;
}

function jump(option, argument, currentID){
    switch(option){
        case "jump":
            startProgram(argument, false);
        break;
        case "jgtz":
            if(document.getElementById("memoryTable-row-0").textContent > 0){
                jump("jump", argument, 0);
            }
            else{
                jump("jump", currentID+1, 0);
            }
        break;
        case "jzero":
            if(document.getElementById("memoryTable-row-0").textContent == 0){
                jump("jump", argument, 0);
            }
            else{
                jump("jump", currentID+1, 0);
            }
        break;
    }
}

function resetTable(){
    for(let i = 0; i < 100; i++){
        document.getElementById("memoryTable-row-" + i).textContent = "?";
        if(i > 0){document.getElementById("output-" + i).value = "&nbsp;";}
    }
}
