 var chart;
    var graph;

    // note, some of tada points don't have value field
  	 var chartData = [
		{
			date: new Date(2012, 3, 1),
         value: 5,
		    excercised: 6,
			 atewell: 8,
			 productivity: 7
        }, {
            date: new Date(2012, 3, 2),
             excercised: 6,
			 atewell: 8,
			 productivity: 7	

        }, {
            date: new Date(2012, 3, 3),
             excercised: 6,
		   	 atewell: 8,
			 productivity: 8
        }, {
            date: new Date(2012, 3, 4),
           
        }, {
            date: new Date(2012, 3, 5),
             excercised: 7,
			atewell: 8,
			 productivity: 7
        }, {
            date: new Date(2012, 3, 6),
             excercised: 8,
			atewell: 7,
			 productivity: 8
        }, {
            date: new Date(2012, 3, 7),
             excercised: 7,
			atewell: 8,
			 productivity: 7
        }, {
            date: new Date(2012, 3, 8),
             excercised: 7,
			atewell: 6,
			 productivity: 7
        }, {
            date: new Date(2012, 3, 9),
             excercised: 6,
			atewell: 2,
			 productivity: 2
        }, {
            date: new Date(2012, 3, 10),
             excercised: 8,
			atewell: 3,
			 productivity: 4
        }, {
            date: new Date(2012, 3, 11),
             excercised: 7,
			atewell: 2,
			 productivity: 3
        }, {
            date: new Date(2012, 3, 12),
             excercised: 5,
			atewell: 8,
			 productivity: 8
        }, {
            date: new Date(2012, 3, 13),
            excercised: 5,
			atewell: 8,
			 productivity: 8
        }, {
            date: new Date(2012, 3, 14),
           
        }, {
            date: new Date(2012, 3, 15),
            excercised: 8,
			atewell: 8,
			 productivity: 8
        }, 
	        {
	            date: new Date(2012, 3, 16),
	             excercised: 6,
				atewell: 7,
				 productivity: 6
	        }, {
	            date: new Date(2012, 3, 17),
	             excercised: 7,
				atewell: 7,
				 productivity: 7
	        }, {
	            date: new Date(2012, 3, 18),
	             excercised: 8,
				atewell: 7,
				 productivity: 6
	        }, {
	            date: new Date(2012, 3, 19),
	             excercised: 3,
				atewell: 3,
				 productivity: 3
	        }, {
	            date: new Date(2012, 3, 20),
	             excercised: 4,
				atewell: 3,
				 productivity: 5
	        }, {
	            date: new Date(2012, 3, 21),
	             excercised: 4,
				atewell: 5,
				 productivity: 7
	        }, {
	            date: new Date(2012, 3, 22),
	             excercised: 8,
				atewell: 5,
				 productivity: 6
	        }, {
	            date: new Date(2012, 3, 23),
	             excercised: 7,
				atewell: 6,
				 productivity: 9
	        }, {
	            date: new Date(2012, 3, 24),
	            excercised: 8,
				atewell: 7,
				 productivity: 8
	        }, {
	            date: new Date(2012, 3, 25),
				 excercised: 8,
					atewell: 8,
					 productivity: 8
	        }, {
	            date: new Date(2012, 3, 26),
	            excercised: 8,
				atewell: 8,
				 productivity: 8
	        }, 
		{
            date: new Date(2012, 3, 27),
            excercised: 5,
			atewell: 8,
			 productivity: 8
        }, {
            date: new Date(2012, 3, 28),

        }, {
            date: new Date(2012, 3, 29),
            excercised: 8,
			atewell: 8,
			 productivity: 8
        }, 

			{
	            date: new Date(2012, 3, 30),
	          	 excercised: 6,
					atewell: 7,
					 productivity: 6
	        }



];


    AmCharts.ready(function () {
        // SERIAL CHART
        chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "../amcharts/images/";
        chart.marginTop = 0;
        chart.marginRight = 0;
        chart.dataProvider = chartData;
        chart.categoryField = "date";
        chart.zoomOutButton = {
            backgroundColor: '#000000',
            backgroundAlpha: 0.15
        };

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis.minPeriod = "DD";
        categoryAxis.axisColor = "#DADADA";
		categoryAxis.equalSpacing = true;
        categoryAxis.autoGridCount = false;

		categoryAxis.gridCount = 10;
        
		
		

        // value
        var valueAxis = new AmCharts.ValueAxis();
        valueAxis.axisAlpha = 0;
        valueAxis.dashLength = 3;
        valueAxis.inside = true;
        chart.addValueAxis(valueAxis);

        // exercised
        graph = new AmCharts.AmGraph();
        graph.bullet = "round";
       graph.title = "Excercised";

        graph.connect = false; // this makes the graph not to connect data points if data is missing
        graph.type = "smoothedLine";
        graph.lineThickness = 2;


        graph.valueField = "excercised";
       graph.balloonText = "Excercised: [[value]]";

        chart.addGraph(graph);


	// Ate well
       var graph = new AmCharts.AmGraph();
       graph.title = "Ate Well";
       graph.connect = false; // this makes the graph not to connect data points if data is missing
	   graph.type = "smoothedLine";
	   graph.lineThickness = 2;
    
    
       graph.valueField = "atewell";
       graph.balloonText = "Ate Well: [[value]]";
       graph.bullet = "round";
       chart.addGraph(graph);


		// Productivity
           var graph = new AmCharts.AmGraph();
           graph.title = "Productivity";
        graph.connect = false; // this makes the graph not to connect data points if data is missing
        graph.type = "smoothedLine";
        graph.lineThickness = 2;
           graph.valueField = "productivity";
           graph.balloonText = "Productivity: [[value]]";
           graph.bullet = "round";
           chart.addGraph(graph);


		  // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.spacing = 50;
        legend.valueWidth = 10;
        legend.color = '#555';
		legend.rollOverGraphAlpha = 60;


        legend.markerType = "circle";

        chart.addLegend(legend);
		

        // CURSOR  
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorAlpha = 0;
        chartCursor.cursorPosition = "mouse";
        chart.addChartCursor(chartCursor);




        // WRITE
        chart.write("chartdiv");
    });