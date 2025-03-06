function createMemoryTable(){        
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

function scrollVert(px) {
    const div = document.getElementById('memoryTable-scroll');
    div.scrollTop += px;
    if(div.scrollTop > 2240){
        div.scrollTop = 2240;
    }
}

function scrollHori(px){
    const div = document.getElementById('readTable-scroll');
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

        const label = document.createElement('input');
        label.type = 'text';

        const instruction = document.createElement('select');
        instruction.id = "select-" + i;

        const load = document.createElement("option");
            load.value = "load";
            load.textContent = "load";
        const store = document.createElement("option");
            store.value = "store";
            store.textContent = "store";
        const sub = document.createElement("option");
            sub.value = "sub";
            sub.textContent = "sub";
        const mult = document.createElement("option");
            mult.value = "mult";
            mult.textContent = "mult";
        const div = document.createElement("option");
            div.value = "div";
            div.textContent = "div";
        const read = document.createElement("option");
            read.value = "read";
            read.textContent = "read";
        const write = document.createElement("option");
            write.value = "write";
            write.textContent = "write";
        const jump = document.createElement("option");
            jump.value = "jump";
            jump.textContent = "jump";
        const jgtz = document.createElement("option");
            jgtz.value = "jgtz";
            jgtz.textContent = "jgtz";
        const jzero = document.createElement("option");
            jzero.value = "jzero";
            jzero.textContent = "jzero";
        const halt = document.createElement("option");
            halt.value = "halt";
            halt.textContent = "halt";

        const table = document.getElementById('programTable');
        table.appendChild(row);
    }
}