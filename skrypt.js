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

    const opcje = ["load", "store", "sub", "mult", "div", "read", "write", "jump", "jgtz", "jzero", "halt"];
    opcje.forEach(opcja => {
        const element = document.createElement("option");
        element.value = opcja;
        element.textContent = opcja;
        select.appendChild(element);
    });
    rowValue.appendChild(select);
    rowValue.className = "memoryTable-valueRow"

    row.appendChild(rowAddress);
    row.appendChild(rowValue);
    
    

    const memoryTable = document.getElementById('program');
    memoryTable.appendChild(row);
}
