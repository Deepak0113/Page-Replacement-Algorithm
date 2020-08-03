//get button
const fifoBtn = document.getElementById('fifo');
const lruBtn = document.getElementById('lru');
const optBtn = document.getElementById('optimal');
const remBtn = document.getElementById('remove');

//get span element
const refspan = document.getElementById('refspan');
const frmspan = document.getElementById('frmspan');
const hitValue = document.getElementById('hit');
const pgFaultValue = document.getElementById("pgfault");

const tr = document.querySelector('.tr');

//creating table
const table = document.getElementById("frame");

//to store and execute value
var trarray = [];
var frame = [];
var hit = 0;
var pgFault = 0;

var frameNo;

//create button inst.
fifoBtn.addEventListener('click', function(){
    var fNo = document.getElementById('frm').value;
    var pgRef = document.getElementById('pageref').value;
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');

    if(fNo!="" && pgRef!=""){
        //check table existence
        if(tableHead != null){
            tableHead.remove();
            tableBody.remove();
        }

        //span
        refspan.innerText = "Page Reference : "+pgRef;
        frmspan.innerText = "Frames : "+fNo;

        //create an arrays
        pgRef = pgRef.split(",");
        frameNo = fNo;

        //calling all functions to create table and value
        createHead(pgRef,frameNo);
        fifo(pgRef,frameNo);
        createBody(trarray);

        //span
        hitValue.innerText = "Hit : "+hit;
        pgFaultValue.innerText = "Page Fault :"+pgFault;    
    }else{
        alert("Frame Number or Page Reference is not given");
    }

});

lruBtn.addEventListener('click', function(){
    var fNo = document.getElementById('frm').value;
    var pgRef = document.getElementById('pageref').value;
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');

    if(fNo!="" && pgRef!=""){
        //check table existence
        if(tableHead != null){
            tableHead.remove();
            tableBody.remove();
        }

        //span
        refspan.innerText = "Page Reference : "+pgRef;
        frmspan.innerText = "Frames : "+fNo;

        //create an arrays
        pgRef = pgRef.split(",");
        frameNo = fNo;

        //calling all functions to create table and value
        createHead(pgRef,frameNo);
        lru(pgRef);
        createBody(trarray);

        //span
        hitValue.innerText = "Hit : "+hit;
        pgFaultValue.innerText = "Page Fault :"+pgFault;
    }else{
        alert("Frame Number or Page Reference is not given");
    }
});

optBtn.addEventListener('click', function(){
    var fNo = document.getElementById('frm').value;
    var pgRef = document.getElementById('pageref').value;
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');

    if(fNo!="" && pgRef!=""){
        //check table existence
        if(tableHead != null){
            tableHead.remove();
            tableBody.remove();
        }
        
        //span
        refspan.innerText = "Page Reference : "+pgRef;
        frmspan.innerText = "Frames : "+fNo;

        //create an arrays
        pgRef = pgRef.split(",");
        frameNo = fNo;

        //calling all functions to create table and value
        createHead(pgRef,frameNo);
        optimal(pgRef,frameNo);
        createBody(trarray);

        //span
        hitValue.innerText = "Hit : "+hit;
        pgFaultValue.innerText = "Page Fault :"+pgFault;
    }else{
        alert("Frame Number or Page Reference is not given");
    }
});

/*sample input value
const pgRef = [7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1];
const frameNo = 3;*/

//function to create head in table
function createHead(pgRef,frameNo){
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    thead.id = "tableHead"
    tr.id = "removeValue";
    for(i=0; i<pgRef.length; i++){
        const th = document.createElement('th');
        th.innerText = pgRef[i];
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.appendChild(thead);

    for(i=0; i<frameNo; i++){
        frame[i] = '#';
        const td = document.createElement('tr');
        td.id = 'tr '+'t'+i;
        trarray[i] = td;
    }
}

//function to insert row value
function createRow(frame){
    for(x=0; x<frameNo; x++){
        const td = document.createElement('td');
        const tr = trarray[x];

        td.innerText = frame[x];
        tr.appendChild(td);
        //console.log(frame[x]);
    }
    
}

//function to append all the elements to table
function createBody(trarray){
    const tbody = document.createElement('tbody');

    tbody.id = "tableBody";
    for(i=0; i<frameNo; i++){
        tbody.appendChild(trarray[i]);
    }
    table.appendChild(tbody);
}

//first in first out (fifo) page replacement algorithm
function fifo(pgRef, frameNo){
    var index = 0;
    for(i=0; i<pgRef.length; i++){
        if(frame.indexOf(pgRef[i]) == -1){
            frame[index] = pgRef[i];
            pgFault++;
            index++;
        }else{
            hit++;
        }

        if(index == frameNo){
            index = 0;
        }
        createRow(frame);
    }
}

//least reacently used (lru) page replacement algorithm
function lru(pgRef){
    var index = 0;
    var i = 0;
    var ref = [];

    while(frame.indexOf('#') != -1){
        if(frame.indexOf(pgRef[i]) == -1){
            frame[index] = pgRef[i];
            ref[index] = pgRef[i];
            index++;
            pgFault++
        }else{
            hit++;
        }
        i++;
        createRow(frame);
    }

    for(j=i; j<pgRef.length; j++){
        if(frame.indexOf(pgRef[j]) == -1){
            const x = frame.indexOf(ref[0]);
            frame[x] = pgRef[j];
            ref.shift();
            ref.push(pgRef[j]);
            pgFault++;
        }else{
            const x = ref.indexOf(pgRef[j]);
            ref.splice(x,1);
            ref.push(pgRef[j]);
            hit++;
        }
        createRow(frame);
    }
}

//optimal page replacement algorithm
function optimal(pgRef, frameNo){
    var index = 0;
    
    while(frame.indexOf('#') != -1){
        if(frame.indexOf(pgRef[0]) == -1){
            frame[index] = pgRef[0];
            index+=1
            pgFault++;
        }else{
            hit++;
        }
        pgRef.shift();
        createRow(frame);
    }

    while(pgRef.length != 0){
        if(frame.indexOf(pgRef[0]) == -1){
            const y = pgRef[0];
            pgRef.shift();
            const x = getLast(pgRef,frame,frameNo);
            frame[x] = y
            pgFault++;
        }else{
            hit++;
            pgRef.shift();
        }
        createRow(frame);
    }
}

function getLast(pgRef, frame, frameNo){
    var max = 0;
    for(i=0;i<frameNo;i++){
        if(pgRef.indexOf(frame[i]) == -1){
            return i;
        }else{
            const x = pgRef.indexOf(frame[i]);
            if(x > max){
                max = x;
            }
        }
    }
    return frame.indexOf(pgRef[max]);
}