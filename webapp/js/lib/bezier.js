

(function() {
	
	
	var path = [ 	200,200, 300,100, 350,150,
					350,150, 400,200, 450,150,
					450,150, 500,100, 600,200 ];
	

	var Point = function( x,y )
	{
		this.x = x || 0;
		this.y = y || 0;
	}
	
	//curve descriptors
	var p0 = new Point();
	var p1 = new Point();
	var p2 = new Point();
	
	//temporary control Points
	var c0 = new Point();
	var c1 = new Point();
	
	//position along the curve
	var np = new Point();
	
	// a canvas and a context2d to draw to
	var width = 800;
	var height = 450;
	var canvas, ctx;
	var date = new Date();
	
	window.onload = function()
	{
		
		canvas = document.createElement( 'canvas' );
		canvas.width 	= width;
		canvas.height 	= height;
		document.body.appendChild( canvas );
		
		//ge the context
		ctx = canvas.getContext("2d");
		
		setInterval( update, 10 );
		
	}
	
	function update()
	{
		ctx.clearRect( 0, 0, width, height );
		
			var angle = new Date().getTime() * .0005;
		
			var t = .5 + ( Math.sin( angle ) * .5 );
		
     			var ox = 100;
	 			var oy = 150;
				var r = 45;
				
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.strokeStyle = "rgba(128,128,128,1)";
				ctx.arc( ox,oy, r - 10, 0, Math.PI * 2, false );
				ctx.arc( ox,oy, r + 10, 0, Math.PI * 2, false );
				ctx.stroke();
				
				ctx.font = "12px Verdana";
				ctx.fillStyle = "rgba(128,128,128,1)";
				ctx.fillText( t.toFixed( 2 ), ox - 10,oy + 5 );
				
				
		
				angle = Math.PI * 2 * t;
				
				ctx.beginPath();
				ctx.lineWidth = 5;
				ctx.strokeStyle = "rgb(255,0,0)";
				ctx.arc( ox,oy, r, 0, angle, false );
				ctx.stroke();
				
			
				ctx.beginPath();
				ctx.lineWidth = 5;
				ctx.strokeStyle = "rgb(128,128,128)";
				ctx.arc( ox,oy, r, angle, Math.PI * 2, false );
				ctx.stroke();
				
				
     			ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.strokeStyle = "rgb(255,255,0)";
				ctx.fillStyle = "rgb(255,192,0)";
				ctx.arc( 	ox + Math.cos( angle ) * r,
							oy + Math.sin( angle ) * r, 5, 0, Math.PI * 2, false );
				ctx.fill();
				
		ctx.lineWidth = 1;
		drawPolyLine( ctx, "rgba( 128,128,128,.5 )" );
		var length = path.length / 6;
		
		//find the bounds of T on the curve
		var i0 = Math.floor( length * t );
		i0 = i0 < length - 1 ? i0 : length - 1;
		var i1 = ( i0 + 1 ) < length ? ( i0 + 1 ) : i0;
		
		//the T time on the current curve between the bounds
		var delta = 1 / length;
		
		var nt = ( t - ( i0 * delta ) ) / delta;
		
		
		//and as we know which curves have already been completely drawn 
		//we can stroke them at once using a color for each segment
		
		var colors = [ 	"rgb(255,0,0)",
						"rgb(255,192,0)",
						"rgb(0,0,255)"	];
						
		ctx.lineWidth = 3;
		var i = 0;
		while ( i < i0 )
		{
			
			drawCurveAt( i * 6, ctx, colors[ i ] );
			i++;
			
		}
		
		//now the interesting part: progressively draw the wuadratic Bezier
		
		var id = i0 * 6;
		
		//those are the Points we want to render progressively
		p0.x = path[ id ];
		p0.y = path[ id + 1 ];
		
		p1.x = path[ id + 2 ];
		p1.y = path[ id + 3 ];
		
		p2.x = path[ id + 4 ];
		p2.y = path[ id + 5 ];
		
		//temporary control Points
		c0.x = lrp( nt, p0.x, p1.x );
		c0.y = lrp( nt, p0.y, p1.y );
		
		c1.x = lrp( nt, p1.x, p2.x );
		c1.y = lrp( nt, p1.y, p2.y );
		
		//position along the curve
		np.x = lrp( nt, c0.x, c1.x );
		np.y = lrp( nt, c0.y, c1.y );
		
		
		///*//this is the first part of the curve
		//from the start point to the middle point
		
			ctx.strokeStyle = colors[ i0 ];
			ctx.beginPath();
			ctx.moveTo( p0.x, p0.y );
			ctx.quadraticCurveTo( c0.x, c0.y, np.x, np.y );
			ctx.stroke();
			
		
		ctx.font = "12px Verdana";
		ctx.fillStyle = "#888";
		ctx.fillText( '全局时间: ' + t.toFixed( 2 ), np.x, 50 );
		ctx.fillStyle = colors[ i0 ];
		ctx.fillText( '局部时间: ' + nt.toFixed( 2 ), np.x, 70 );
		
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#888";
		ctx.moveTo( np.x - 10, 45 );
		ctx.lineTo( ox, 45 );
		ctx.lineTo( ox, oy - r - 20 );
		ctx.moveTo( np.x, np.y );
		ctx.lineTo( np.x, 80 );
		ctx.stroke();
		
		
	}
	
	
	//lrp = linear interpolation
	function lrp( value, a, b )
	{
		return a + value * ( b - a );
	}
	
	
	function drawCurveAt( id, ctx, style )
	{
		ctx.beginPath();
		ctx.strokeStyle = style;
		ctx.moveTo( path[ id ],path[ id+1 ] );
		ctx.quadraticCurveTo( path[ id+2 ], path[ id+3 ], path[ id+4 ], path[ id+5 ] );
		ctx.stroke();
	}
	
	function drawPolyLine( ctx, style )
	{
		ctx.strokeStyle = style;
		ctx.beginPath();
		for( var i = 0; i < path.length; i+= 6 )
		{
			ctx.moveTo( path[ i ],		path[ i+1 ] );
			ctx.lineTo( path[ i+2 ], 	path[ i+3 ] );
			ctx.lineTo( path[ i+4 ], 	path[ i+5 ] );
			ctx.stroke();
		}
		for( var i = 0; i < path.length; i+= 6 )
		{
			ctx.beginPath();
			ctx.arc( path[ i ],		path[ i+1 ], 3, 0,Math.PI * 2, true );
			ctx.stroke();
			ctx.beginPath();
			ctx.arc( path[ i+2 ],		path[ i+3 ], 3, 0,Math.PI * 2, true );
			ctx.stroke();
			ctx.beginPath();
			ctx.arc( path[ i+4 ],		path[ i+5 ], 3, 0,Math.PI * 2, true );
			ctx.stroke();
		}
	}
})();
