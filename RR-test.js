const deepCopy = (inObject) => {
  let outObject, value, key

  if (typeof inObject !== "object" || inObject === null) {
    return inObject // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = deepCopy(value)
  }

  return outObject
}

let totalProcess = 5;
let process = [];
let quantum = 3;

arrivaltime = [0,5,1,6,8];
bursttime = [8,2,7,3,5];

for(let i = 0; i < totalProcess; i++){
    var l = [];
    for(let j = 0; j < 3; j++){
        l.push(0);
    }
    process.push(l);
}
 
for(let i = 0; i < totalProcess; i++){
    process[i][0] = arrivaltime[i];
    process[i][1] = bursttime[i];
    process[i][3] = "P"+ Number(i + 1);
}

let order = [];
let totalBurstTimeAfterEachProces = [];

// Sort by arrival time
process.sort((a,b) => a[0] - b[0]);

//console.log(process)

let firstProcess = process[0]

order.push(deepCopy(firstProcess));

let readyQueue = [];
let time = 0;

let check = true;
let index = 0;

if(firstProcess[1] >= quantum){
  firstProcess[1] = firstProcess[1] - quantum;
  time = quantum;
  
}else{
  time = firstProcess[1];
  firstProcess[1] = 0;
}

totalBurstTimeAfterEachProces.push(time);

for(let i = 0; i < process.length; i++){
    if(process[i] != firstProcess && process[i][1] != 0 && process[i][0] <= time && (!readyQueue.includes(process[i]) && !order.includes(process[i])) ){
        readyQueue.push(process[i]);
    }
}

if(check){
  readyQueue.push(process[0]);
}

function isComplete(){
  let complete = true;
  for(let i = 0; i < process.length; i++){
      if(process[i][1] > 0){
          complete = false;
          break;
      }
  }
  return complete;
}

function getReadyQueue(){
  //console.log(readyQueue);
  let count = 0;
  let bruk = false;
  while(readyQueue.length<1 && !isComplete()){
    count++;
    for(let i = 0; i < process.length; i++){
      if(process[i][1] != 0 && time+count == process[0]){
          let empty_space = ['Idle Time','',count,0];
          order.push(empty_space);
          readyQueue.push(process[i]);
          bruk = true;
      }
    }
    if(bruk){
      break;
    }
  }

  index = process.indexOf(readyQueue[0]);

  if(process[index][1] >= quantum){
    process[index][1] = process[index][1] - quantum;
    time += quantum;
    
  }else{
    time += process[index][1];
    process[index][1] = 0;
  }

  totalBurstTimeAfterEachProces.push(time);

  for(let i = 0; i < process.length; i++){
      if(process[i] != process[index] && process[i][1] != 0 && process[i][0] <= time && (!readyQueue.includes(process[i]) && !order.includes(process[i])) ){
          readyQueue.push(process[i]);
      }
  }

  firstProcess = readyQueue.shift();
  //console.log("First Process: ",firstProcess)
  if(firstProcess[1] > 0){
    readyQueue.push(firstProcess);
  }
  order.push(deepCopy(firstProcess));
  index = process.indexOf(readyQueue[0]);
}

complete = isComplete();

while(!complete){
getReadyQueue();
complete = isComplete();
}
// //       //Sort Ready Queue by priority
// //       readyQueue.sort((a,b) => a[2] - b[2]);
// //       let nextProcess = readyQueue.shift();
// //       time += nextProcess[1];
// //       order.push(nextProcess);
// //       totalBurstTimeAfterEachProces.push(time);
// //   }


//console.log(readyQueue);
console.log(order);
console.log(totalBurstTimeAfterEachProces);
//   console.log(totalBurstTimeAfterEachProces);