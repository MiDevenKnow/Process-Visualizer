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
    fcfs_array=[];
    for(var i = 0; i < arrival_times.length; i++){
        fcfs_array.push([processes_rows[i].textContent,$(arrival_times[i]).val(),$(burst_times[i]).val()])
    }

    return fcfs_array;
}
//animate divs and append html to existing tag
const animateChart = async()=>{
    val=getValues().sort(function(a,b) {
        return a[1]-b[1];
    });
    AnimationSpace=$("#data");
    AnimationSpaceTime=$("#timeData");
    // AnimationSpace.append(la);
    // console.log(val)
    completion=[];
    first_time=parseInt(val[0][1])
    completion.push(first_time)
    array_test=[]

    for (let i = 0; i < val.length; i++) {
        array_test.push(parseInt(val[i][1])+parseInt(val[i][2]))
    }
    array_test.pop()
    burst_list=[]
    for (let i = 0; i < (val.length)-1; i++) {
        if((val[i+1][1]-array_test[i])>0){
            burst_list.push(["Idle Time",'',val[i+1][1]-array_test[i]])
        }
    }
    let x=0
    for (let i = 0; i < burst_list.length; i++) {
        x+=1
        val.splice(x,0,burst_list[i])
        x+=1
    }

    // console.log(val)
    turnaround_time=[]
    waiting_time=[]
    turnaround_time_vals=[]
    waiting_time_vals=[]
    for (let i = 0; i < val.length; i++) {
        first_time+=parseInt(val[i][2]);
        completion.push(first_time);
        chart='<th class="animation-added" style="display: table-cell; color:black; width:'+((val[i][2]*50)+55)+'px; border: 1px solid black; border-radius: 3px; text-align:center; height: 60px; background: linear-gradient(to right, '+CSS_COLOR_NAMES[Math.floor(Math.random()*CSS_COLOR_NAMES.length)]+' 50%, transparent 0); background-size: 200% 100%; background-position: right; animation: makeItfadeIn '+val[i][2]+'s 1s forwards;">'+val[i][0]+' </th>'
        AnimationSpace.append(chart)
        charttime='<td class="animation-time" style="display: table-cell; width:'+((val[i][2]*50)+55)+'px; border-radius: 3px; text-align:left; height: 20px;">'+completion[i]+' secs</td>'
        AnimationSpaceTime.append(charttime)
        if(val[i][1]!=''){
            turnaround_time_vals.push(completion[i+1]-val[i][1])
            waiting_time_vals.push((completion[i+1]-val[i][1])-val[i][2])
            turnaround_time.push([val[i][0],completion[i+1]-val[i][1]])
            waiting_time.push([val[i][0],(completion[i+1]-val[i][1])-val[i][2]])
            // console.log(completion[i+1]-val[i][1],val[i][2])
        }
        await sleep(val[i][2]*1000)
        // console.log(completion[i],val[])
    }

    var avg_turnaround=turnaround_time_vals.reduce((a, b) => a + b, 0)/turnaround_time_vals.length;
    var avg_waitingtime=waiting_time_vals.reduce((a, b) => a + b, 0)/waiting_time_vals.length
    avgtimes=$('#resultsChart #AvgTimes');
    wavgtimes_html='<h5 style="color:white;">Average Waiting Time: '+avg_waitingtime+' secs</h5>';
    tavgtimes_html='<h5 style="color:white;">Average Turnaround Time: '+avg_turnaround+' secs</h5>';
    avgtimes.append(wavgtimes_html)
    avgtimes.append(tavgtimes_html)
    
    charttime='<td class="animation-time" style="display: table-cell; width:'+100+'px; border-radius: 3px; text-align:left; height: 20px;">'+completion[completion.length-1]+' secs</td>'
    AnimationSpaceTime.append(charttime)


    sortedturnaround_time=turnaround_time.sort((a, b) => a[0].localeCompare(b[0]));
    sortedwaiting_time=waiting_time.sort((a, b) => a[0].localeCompare(b[0]));

    addTurn=$('#table_test thead tr');
    turnaroundcol="<th>Turnaround Time</th>"
    addTurn.append(turnaroundcol)
    addTurnVal=$('#table_test tbody tr');
    // console.log(addTurnVal)
    for (let i = 0; i < sortedturnaround_time.length; i++){
        const tr = document.createElement('td');
        tr.innerHTML=+sortedturnaround_time[i][1];
        addTurnVal[i].append(tr)
    }

    waitingtime="<th>Waiting Time</th>"
    addTurn.append(waitingtime)
    addWaitVal=$('#table_test tbody tr');
    for (let i = 0; i < sortedwaiting_time.length; i++){
        const tr = document.createElement('td');
        tr.innerHTML=+sortedwaiting_time[i][1];
        addWaitVal[i].append(tr)
    }
    // console.log(sortedturnaround_time)
    

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