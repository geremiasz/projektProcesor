let readGlobal = 0;
let writeGlobal = 0;

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
        const labelWrap = document.createElement('td');
        labelWrap.appendChild(label);

        const instruction = document.createElement('select');
        instruction.id = "select-" + i;

        const options = ["load", "store", "sub", "mult", "div", "read", "write", "jump", "jgtz", "jzero", "halt"];

        options.forEach(option => {
            const element = document.createElement("option");
            element.value = option;
            element.textContent = option;
            instruction.appendChild(element);
        })
        const selectWrap = document.createElement('td');
        selectWrap.appendChild(instruction);

        const argument = document.createElement('td');
        argument.id = "argument-" + i;

        const comment = document.createElement('input');
        comment.type = 'text';
        const commentWrap = document.createElement('td');
        commentWrap.appendChild(comment);
            
        row.appendChild(id);
        row.appendChild(labelWrap);
        row.appendChild(selectWrap);
        row.appendChild(argument);
        row.appendChild(commentWrap);

        const table = document.getElementById('programTable');
        table.appendChild(row);
    }
}

function startProgram(){
    while(num < 17){
        let option = document.getElementById("select-" + num).value;
        let argument = document.getElementById("argument-" + num).value;
        console.log(option);

        switch(option){
            case "":
            case "halt":
                return;
            case "jump":
            case "jgtz":
            case "jzero":
                useFunction(option, argument);
                return;  
        }

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
        case "jump":
            jump(argument);
        break;
        case "jgtz":
            if(document.getElementById("memoryTable-row-0").textContent > 0){
                jump(argument);
            }
        break;
        case "jzero":
            if(document.getElementById("memoryTable-row-0").textContent == 0){
                jump(argument);
            }
        break;
        case "halt":
            return;
    }
}

function load(argument){

}

function store(argument){

}

function sub(argument){

}

function mult(argument){

}

function div(argument){

}

function read(argument){

}

function write(argument){
    
}

function jump(argument){
    startProgram(argument);
    return;
}
