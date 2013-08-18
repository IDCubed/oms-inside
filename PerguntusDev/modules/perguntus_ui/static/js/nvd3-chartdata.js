var chart;


setTimeout(function() {
          $('#chart1 .nv-lineChart circle.nv-point').attr("r", "4");
      }, 500);


// Bullet charts-----------------------------


nv.addGraph(function() {  
   var bulletchart = nv.models.bulletChart();
 
   d3.select('#bulletchart-1 svg')
       .datum(bulletchart_1())
     .transition().duration(1000)
       .call(bulletchart);
 
   return bulletchart;
});


nv.addGraph(function() {  
   var bulletchart = nv.models.bulletChart();
 
   d3.select('#bulletchart-2 svg')
       .datum(bulletchart_2())
     .transition().duration(1000)
       .call(bulletchart);
 
   return bulletchart;
});

nv.addGraph(function() {  
   var bulletchart = nv.models.bulletChart();
 
   d3.select('#bulletchart-3 svg')
       .datum(bulletchart_3())
     .transition().duration(1000)
       .call(bulletchart);
 
   return bulletchart;
});




function bulletchart_1() {
  return {
	"title":"Stress",
	"ranges":[1,2.3,4],
	"measures":[10],
	"markers":[2.3]}; 
	}
	
	function bulletchart_2() {
	  return {
		"title":"Productivity",
		"ranges":[2,7,9],
		"measures":[10],
		"markers":[7]}; 
		}


function bulletchart_3() {
  return {
	"title":"Time with friends",
	"ranges":[3,4.4,8],
	"measures":[10],
	"markers":[4.4]}; 
	}






