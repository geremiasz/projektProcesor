for(let i = 0; i < 100; i++){
    const row = document.createElement('tr');
    row.id = "row-" + i;

    const rowAddress = document.createElement('td');
    rowAddress.textContent = i;
    const label = document.createElement('td')
    if(i= 0){
        label.textContent = "Początek";
    }else{
        label.textContent = "Nic"
    }
    const rowValue = document.createElement('td');
    const select = document.createElement('select');

    var load = document.createElement("option");
        load.value = "load";
        load.textContent = "load";
    var store = document.createElement("option");
        store.value = "store";
        store.textContent = "store";
    var sub = document.createElement("option");
        sub.value = "sub";
        sub.textContent = "sub";
    var mult = document.createElement("option");
        mult.value = "mult";
        mult.textContent = "mult";
    var div = document.createElement("option");
        div.value = "div";
        div.textContent = "div";
    var read = document.createElement("option");
        read.value = "read";
        read.textContent = "read";
    var write = document.createElement("option");
        write.value = "write";
        write.textContent = "write";
    var jump = document.createElement("option");
        jump.value = "jump";
        jump.textContent = "jump";
    var jgtz = document.createElement("option");
        jgtz.value = "jgtz";
        jgtz.textContent = "jgtz";
    var jzero = document.createElement("option");
        jzero.value = "jzero";
        jzero.textContent = "jzero";
    var halt = document.createElement("option");
        halt.value = "halt";
        halt.textContent = "halt";

    let opcje = [load, store, sub, mult, div, read, write, jump, jgtz, jzero, halt];
    opcje.forEach(element => {
        select.appendChild(element);
    });
    rowValue.appendChild(select);
    rowValue.className = "memoryTable-valueRow"

    row.appendChild(rowAddress);
    row.appendChild(rowValue);
    
    

    const memoryTable = document.getElementById('');
    memoryTable.appendChild(row);
}