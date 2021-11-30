window.onload = function () {

    // -------------------------------------------------------------------------------
    // color array 
    // -------------------------------------------------------------------------------
    const CSS_COLOR_NAMES = [
        "AliceBlue",
        "AntiqueWhite",
        "Aqua",
        "Aquamarine",
        "Azure",
        "Beige",
        "Bisque",
        "BlanchedAlmond",
        "Blue",
        "BlueViolet",
        "Brown",
        "BurlyWood",
        "CadetBlue",
        "Chartreuse",
        "Chocolate",
        "Coral",
        "CornflowerBlue",
        "Cornsilk",
        "Crimson",
        "Cyan",
        "DarkBlue",
        "DarkCyan",
        "DarkGoldenRod",
        "DarkGray",
        "DarkGrey",
        "DarkGreen",
        "DarkKhaki",
        "DarkMagenta",
        "DarkOliveGreen",
        "DarkOrange",
        "DarkOrchid",
        "DarkRed",
        "DarkSalmon",
        "DarkSeaGreen",
        "DarkSlateBlue",
        "DarkSlateGray",
        "DarkSlateGrey",
        "DarkTurquoise",
        "DarkViolet",
        "DeepPink",
        "DeepSkyBlue",
        "DimGray",
        "DimGrey",
        "DodgerBlue",
        "FireBrick",
        "FloralWhite",
        "ForestGreen",
        "Fuchsia",
        "Gainsboro",
        "GhostWhite",
        "Gold",
        "GoldenRod",
        "Gray",
        "Grey",
        "Green",
        "GreenYellow",
        "HoneyDew",
        "HotPink",
        "IndianRed",
        "Indigo",
        "Ivory",
        "Khaki",
        "Lavender",
        "LavenderBlush",
        "LawnGreen",
        "LemonChiffon",
        "LightBlue",
        "LightCoral",
        "LightCyan",
        "LightGoldenRodYellow",
        "LightGray",
        "LightGrey",
        "LightGreen",
        "LightPink",
        "LightSalmon",
        "LightSeaGreen",
        "LightSkyBlue",
        "LightSlateGray",
        "LightSlateGrey",
        "LightSteelBlue",
        "LightYellow",
        "Lime",
        "LimeGreen",
        "Linen",
        "Magenta",
        "Maroon",
        "MediumAquaMarine",
        "MediumBlue",
        "MediumOrchid",
        "MediumPurple",
        "MediumSeaGreen",
        "MediumSlateBlue",
        "MediumSpringGreen",
        "MediumTurquoise",
        "MediumVioletRed",
        "MidnightBlue",
        "MintCream",
        "MistyRose",
        "Moccasin",
        "NavajoWhite",
        "Navy",
        "OldLace",
        "Olive",
        "OliveDrab",
        "Orange",
        "OrangeRed",
        "Orchid",
        "PaleGoldenRod",
        "PaleGreen",
        "PaleTurquoise",
        "PaleVioletRed",
        "PapayaWhip",
        "PeachPuff",
        "Peru",
        "Pink",
        "Plum",
        "PowderBlue",
        "Purple",
        "RebeccaPurple",
        "Red",
        "RosyBrown",
        "RoyalBlue",
        "SaddleBrown",
        "Salmon",
        "SandyBrown",
        "SeaGreen",
        "SeaShell",
        "Sienna",
        "Silver",
        "SkyBlue",
        "SlateBlue",
        "SlateGray",
        "SlateGrey",
        "Snow",
        "SpringGreen",
        "SteelBlue",
        "Tan",
        "Teal",
        "Thistle",
        "Tomato",
        "Turquoise",
        "Violet",
        "Wheat",
        "White",
        "WhiteSmoke",
        "Yellow",
        "YellowGreen",
      ];
    // ------------------------------------------------------------------------------
    // REG SCRIPT
    // ------------------------------------------------------------------------------
    //Add and remove text fields 
    $("#addfield").click(function(){
        var rows = document.querySelectorAll("#table_test tr");
        var lastRow = rows[rows.length - 1];
        var lastRowNum = parseInt(lastRow.children[0].textContent.split("P")[1]);
        // console.log(lastRowNum);
        inputs = "<tr class='text-center'><th class='processes'>P"+(lastRowNum+1)+"</th><td ><input type='number' class='arrival-time' min='0'></td><td ><input type='number' class='burst-time' min='0'></td>";
        $("#table_test tbody").append(inputs);
    });
    
    $("#removefield").click(function(){
        numRows=$('#table_test tr');
        lastRow=$('#table_test tr:last');
        if (numRows.length==3){
            console.log("Must be >2 rows to delete");
        }else{
            lastRow.remove();
        }
    });
    
    //execute animation one after the other 
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve,milliseconds));
    }
    //get values
    function getValues(){
        var processes_rows = $(".processes");
        var burst_times = $(".burst-time");
        var arrival_times = $(".arrival-time");
        // console.log(arrival_times);
        sjf_array=[];
        for(var i = 0; i < arrival_times.length; i++){
            sjf_array.push([processes_rows[i].textContent,parseInt($(arrival_times[i]).val()),parseInt($(burst_times[i]).val())])
        }
    
        return sjf_array;
    }

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

    //animate divs and append html to existing tag
    const animateChart = async()=>{
        let order=[];
        let totalBurstTimeAfterEachProces = [];
        // Sort by arrival time
        values=getValues().sort((a,b) => a[1] - b[1]);

        let firstProcess = values[0];

        let readyQueue = [];
        let ftime=firstProcess[1];
        let time = ftime;
        totalBurstTimeAfterEachProces.push(ftime);

        let quantum = document.getElementById("quantum");
        quantum = Number(quantum.value);
        if(quantum < 1){
            quantum = 3;
        }
        console.log("quantum: ",quantum);
        let check = true;
        let index = 0;

        // arrivaltime = [0,5,1,6,8];
        // bursttime = [8,2,7,3,5];
        

        if(firstProcess[2] >= quantum){
            firstProcess[2] = firstProcess[2] - quantum;
            time += quantum;
            
        }else{
            time += firstProcess[2];
            firstProcess[2] = 0;
        }

        let pushData =  deepCopy(firstProcess);
        pushData[1] = time;

        order.push(deepCopy(pushData));

        totalBurstTimeAfterEachProces.push(time);
  
        for(let i = 0; i < values.length; i++){
            if(values[i] != firstProcess && values[i][2] != 0 && values[i][1] <= time && (!readyQueue.includes(values[i]) && !order.includes(values[i])) ){
                readyQueue.push(values[i]);
            }
        }

        if(check){
            readyQueue.push(values[0]);
        }
 
        function getReadyQueue(){
            //console.log(readyQueue);

            let count = 0;
            let index = values.indexOf(firstProcess)+1;
            while(readyQueue.length<1 && !isComplete()){
              count++;
          
                if(values[index][2] != 0 && time+count == values[index][1]){
                    let empty_space = ['Idle Time','',count];
                    order.push(empty_space);
                    readyQueue.push(values[index]);
                    time += count;
                    totalBurstTimeAfterEachProces.push(time);
                    break;
                }
            }
            
            index = values.indexOf(readyQueue[0]);
          
            if(values[index][2] >= quantum){
              values[index][2] = values[index][2] - quantum;
              time += quantum;
              
            }else{
              time += values[index][2];
              values[index][2] = 0;
            }
            
            totalBurstTimeAfterEachProces.push(time);
            
            for(let i = 0; i < values.length; i++){
                if(values[i] != values[index] && values[i][2] != 0 && values[i][1] <= time && (!readyQueue.includes(values[i]) && !order.includes(values[i])) ){
                    readyQueue.push(values[i]);
                }
            }
            
            firstProcess = readyQueue.shift();
            let pushData =  deepCopy(firstProcess);
            pushData[1] = time;
            console.log("Data: ",pushData);
            //console.log("First Process: ",firstProcess)
            console.log(totalBurstTimeAfterEachProces);
            if(firstProcess[2] > 0){
              readyQueue.push(firstProcess);
            }
            order.push(pushData);
            index = values.indexOf(readyQueue[0]);
        }

        function isComplete(){
            let complete = true;
            for(let i = 0; i < values.length; i++){
                if(values[i][2] > 0){
                    complete = false;
                    break;
                }
            }
            return complete;
        }

        complete = isComplete();

        while(!complete){
          getReadyQueue();
          complete = isComplete();
        }

        turnaround_time=[]
        waiting_time=[]
        turnaround_time_vals=[]
        waiting_time_vals=[]
        // console.log(order);
        // console.log(totalBurstTimeAfterEachProces);
        AnimationSpaceTime=$("#timeData");
        AnimationSpace=$("#data");
        // AnimationSpace.append(la);
        // console.log(val)

        for(let x = 0; x < order.length; x++){
            order[x][2] = totalBurstTimeAfterEachProces[x+1] - totalBurstTimeAfterEachProces[x];
        }


        console.log("order: ",order);

        for (let i = 0; i < order.length; i++) {
            chart='<th class="animation-added" style="display: table-cell; color:black; width:'+((order[i][2]*50)+55)+'px; border: 1px solid black; border-radius: 3px; text-align:center; height: 60px; background: linear-gradient(to right, '+CSS_COLOR_NAMES[Math.floor(Math.random()*CSS_COLOR_NAMES.length)]+' 50%, transparent 0); background-size: 200% 100%; background-position: right; animation: makeItfadeIn '+order[i][2]+'s 1s forwards;">'+order[i][0]+' </th>'
            AnimationSpace.append(chart)
            charttime='<td class="animation-time" style="display: table-cell; width:'+((order[i][2]*50)+55)+'px; border-radius: 3px; text-align:left; height: 20px;">'+totalBurstTimeAfterEachProces[i]+' secs</td>'
            AnimationSpaceTime.append(charttime)
            // if(order[i][1]!=null){
            //     turnaround_time_vals.push(totalBurstTimeAfterEachProces[i+1]-order[i][1])
            //     waiting_time_vals.push((totalBurstTimeAfterEachProces[i+1]-order[i][1])-order[i][2])
            //     turnaround_time.push([order[i][0],totalBurstTimeAfterEachProces[i+1]-order[i][1]])
            //     waiting_time.push([order[i][0],(totalBurstTimeAfterEachProces[i+1]-order[i][1])-order[i][2]])
            //     //console.log(totalBurstTimeAfterEachProces[i+1]-order[i][1],totalBurstTimeAfterEachProces[i],order[i][2])
            // }
            await sleep(order[i][2]*1000)
        }
        // console.log(order)
        
        // console.log(turnaround_time)
        // console.log(waiting_time)

        // var avg_turnaround=turnaround_time_vals.reduce((a, b) => a + b, 0)/turnaround_time_vals.length;
        // var avg_waitingtime=waiting_time_vals.reduce((a, b) => a + b, 0)/waiting_time_vals.length
        // avgtimes=$('#resultsChart #AvgTimes');
        // wavgtimes_html='<h5 style="color:white;">Average Waiting Time: '+avg_waitingtime+' secs</h5>';
        // tavgtimes_html='<h5 style="color:white;">Average Turnaround Time: '+avg_turnaround+' secs</h5>';
        // avgtimes.append(wavgtimes_html)
        // avgtimes.append(tavgtimes_html)
        
        charttime='<td class="animation-time" style="display: table-cell; width:'+100+'px; border-radius: 3px; text-align:left; height: 20px;">'+totalBurstTimeAfterEachProces[totalBurstTimeAfterEachProces.length-1]+' secs</td>'
        AnimationSpaceTime.append(charttime)
    
    
        // sortedturnaround_time=turnaround_time.sort((a, b) => a[0].localeCompare(b[0]));
        // sortedwaiting_time=waiting_time.sort((a, b) => a[0].localeCompare(b[0]));
    
        // addTurn=$('#table_test thead tr');
        // turnaroundcol="<th>Turnaround Time</th>"
        // addTurn.append(turnaroundcol)
        // addTurnVal=$('#table_test tbody tr');
        // // console.log(addTurnVal)
        // for (let i = 0; i < sortedturnaround_time.length; i++){
        //     const tr = document.createElement('td');
        //     tr.innerHTML=+sortedturnaround_time[i][1];
        //     addTurnVal[i].append(tr)
        // }
    
        // waitingtime="<th>Waiting Time</th>"
        // addTurn.append(waitingtime)
        // addWaitVal=$('#table_test tbody tr');
        // console.log("sortedwaiting_time: ",sortedwaiting_time);
        // for (let i = 0; i < sortedwaiting_time.length; i++){
        //     const tr = document.createElement('td');
        //     tr.innerHTML=+sortedwaiting_time[i][1];
        //     addWaitVal[i].append(tr)
        // }
    
    }

    //validation for inputs
    animation_button.onclick=function(){
        var checkAnimationExists = document.getElementsByClassName("animation-added");
        if(checkAnimationExists.length==0){
            if(checkArrivals() && checkBurst()){
                $("#Gnattchart").show();
                animateChart();  
            }else{
                alert("Invalid Input!");
            }
        }else{
            alert("Reset Animation!");
        }
    
        // console.log(value2.length)
    
    }
    //reset animation
    reset_button.onclick=function(){
        $("#Gnattchart").hide();
        arrivals = document.getElementsByClassName("arrival-time");
        bursts = document.getElementsByClassName("burst-time");
    
        for(let i = 0; i < arrivals.length; i++){
            if(arrivals[i].value != "" || bursts[i].value != "" ){
                arrivals[i].value="";
                bursts[i].value="";
            }
        }
        $("#table_test tbody tr:gt(1)").remove();
        $(".DisplayAnimation tbody th").remove();
        $(".DisplayAnimation tbody td").remove();
        $('#table_test thead tr th:gt(2)').remove();
        // $('#table_test tbody tr td:nth-last-child(1)').remove()
        if  ($('#table_test tbody tr td').length==4){
            console.log("Must be >4");
        }else{
            $('#table_test tbody tr td:nth-last-child(1)').remove()
            $('#table_test tbody tr td:nth-last-child(1)').remove()
        }
        $('#resultsChart #AvgTimes h5').remove();
        // $('#table_test tbody tr td:nth-last-child(2)').remove()
        // $('#table_test tbody tr').deleteCell(-2);
    }
    
    //validation checks
    function checkArrivals(){
        arrivals = document.getElementsByClassName("arrival-time");
    
        for(let i = 0; i < arrivals.length; i++){
            if(arrivals[i].value == "" || arrivals[i].value<0){
                return false;
            }
        }
        return true;
    }
    
    function checkBurst(){
        bursts = document.getElementsByClassName("burst-time");
    
        for(let i = 0; i < bursts.length; i++){
            if(bursts[i].value == "" || bursts[i].value<0){
                return false;
            }
        }
        return true;
    }
    // ---------------------------------------------------------------------------
    // BACKGROUND
    // ---------------------------------------------------------------------------
    window.requestAnimFrame = function()
        {
            return (
                window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function(/* function */ callback){
                    window.setTimeout(callback, 1000 / 60);
                }
            );
    }();
    
    var canvas = document.getElementById('canvas'); 
    var context = canvas.getContext('2d');
    
    //get DPI
    let dpi = window.devicePixelRatio || 1;
    context.scale(dpi, dpi);
    // console.log(dpi);
    
    function fix_dpi() {
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    
    //scale the canvas
    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
    }
    
        var particle_count = 70,
            particles = [],
            couleurs   = ["#3a0088", "#930077", "#e61c5d","#ffbd39"];
        function Particle()
        {
    
            this.radius = Math.round((Math.random()*3)+5);
            this.x = Math.floor((Math.random() * ((+getComputedStyle(canvas).getPropertyValue("width").slice(0, -2) * dpi) - this.radius + 1) + this.radius));
            this.y = Math.floor((Math.random() * ((+getComputedStyle(canvas).getPropertyValue("height").slice(0, -2) * dpi) - this.radius + 1) + this.radius));
            this.color = couleurs[Math.floor(Math.random()*couleurs.length)];
            this.speedx = Math.round((Math.random()*201)+0)/100;
            this.speedy = Math.round((Math.random()*201)+0)/100;
    
            switch (Math.round(Math.random()*couleurs.length))
            {
                case 1:
                this.speedx *= 1;
                this.speedy *= 1;
                break;
                case 2:
                this.speedx *= -1;
                this.speedy *= 1;
                break;
                case 3:
                this.speedx *= 1;
                this.speedy *= -1;
                break;
                case 4:
                this.speedx *= -1;
                this.speedy *= -1;
                break;
            }
                
            this.move = function()
            {
                
                context.beginPath();
                context.globalCompositeOperation = 'source-over';
                context.fillStyle   = this.color;
                context.globalAlpha = 1;
                context.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
                context.fill();
                context.closePath();
    
                this.x = this.x + this.speedx;
                this.y = this.y + this.speedy;
                
                if(this.x <= 0+this.radius)
                {
                    this.speedx *= -1;
                }
                if(this.x >= canvas.width-this.radius)
                {
                    this.speedx *= -1;
                }
                if(this.y <= 0+this.radius)
                {
                    this.speedy *= -1;
                }
                if(this.y >= canvas.height-this.radius)
                {
                    this.speedy *= -1;
                }
    
                for (var j = 0; j < particle_count; j++)
                {
                    var particleActuelle = particles[j],
                        yd = particleActuelle.y - this.y,
                        xd = particleActuelle.x - this.x,
                        d  = Math.sqrt(xd * xd + yd * yd);
    
                    if ( d < 200 )
                    {
                        context.beginPath();
                        context.globalAlpha = (200 - d) / (200 - 0);
                        context.globalCompositeOperation = 'destination-over';
                        context.lineWidth = 1;
                        context.moveTo(this.x, this.y);
                        context.lineTo(particleActuelle.x, particleActuelle.y);
                        context.strokeStyle = this.color;
                        context.lineCap = "round";
                        context.stroke();
                        context.closePath();
                    }
                }
            };
        };
        for (var i = 0; i < particle_count; i++)
        {
            fix_dpi();
            var particle = new Particle();
            particles.push(particle);
        }
    
    
        function animate()
        {
            fix_dpi();
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < particle_count; i++)
            {
                particles[i].move();
            }
            requestAnimFrame(animate);
        }
        
        animate(); 
    };