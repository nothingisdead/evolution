evolution = function(c) {

canvas = c.get(0);
canvas.width = c.width();
canvas.height = c.height();

traits = {
	size: new trait("size", 5, 1000, 5, 90),
	color: new trait("color", 0x0, 0xFFFFFF, 90)
};

sim_interval = 50;
thinking_difficulty = 50;
pool_density = 10;

this.center = new point(c.width() / 2, c.height() / 2);
this.topleft = new point(0, 0);
this.topright = new point(c.width(), 0);
this.bottomleft = new point(0, c.height());
this.bottomright = new point(c.width(), c.height());

objects = {
	cell1: new cell(vary_trait(traits.size, 0), 0x00FF00, this.center),
	cell2: new cell(vary_trait(traits.size, 0), 0x00FF00, this.center)
};

this.start = function() {
	this.clock = window.setInterval(this.simulate, sim_interval);
}

this.stop = function() {
	window.clearInterval(this.clock);
}

this.simulate = function() {
	move_objects(objects);
	draw_objects(objects);
}

move_objects = function(objects) {
	for(i in objects) {
		objects[i].move(1);
	}
}

draw_objects = function(objects) {
	for(i in objects) {
		objects[i].draw();
	}
}

}

cell = function(s, c, p) {
	this.id = Math.floor(Math.random() * 1000000000);
	this.size = s;
	this.location = p;
	this.area = s * s * Math.PI;
	this.diameter = 2 * s;
	this.circumference = this.diameter * Math.pi;
	this.color = c;
	this.direction = 0;
	this.velocity = 0;
	this.context = canvas.getContext("2d");
	this.burst_speed = 10;
	this.smoothness = 5;

	this.move = function(steps) {
		if(Math.random() * thinking_difficulty < 1) this.think();
		vx = Math.cos(this.direction) * this.velocity;
		vy = Math.sin(this.direction) * this.velocity;
		this.location.x += vx * steps;
		this.location.y += vy * steps;
		if(this.velocity > 0) {
			slowdown = (pool_density + this.size) / this.smoothness;
			this.velocity -= slowdown * (this.velocity / this.burst_speed);
		}
	}

	this.think = function() {
		cases = ["change_direction", "find_buddy", "find_food"];
		this_case = Math.floor(Math.random() * cases.length);
		switch(this_case) {
			case "find_food":
			case "find_buddy":
			default: //change_direction
				this.direction = Math.random() * 2 * Math.PI;
				this.velocity = this.burst_speed;
		}
	}

	this.draw = function() {
		this.context.clearRect(0, 0, canvas.width, canvas.height);
		this.context.beginPath();
		this.context.arc(this.location.x, this.location.y, this.size, 0, 2 * Math.PI, false);
		this.context.fillStyle = 'green';
		this.context.fill();
	}
}

trait = function(t_title, t_min, t_max, t_variance, t_strength) {
	this.title = t_title;
	this.min = t_min;
	this.max = t_max;
	this.variance = t_variance;
	this.strength = t_strength;
}

vary_trait = function(trait, val) {
	start = Math.max(val, trait.min);
	r = Math.random() * trait.variance - trait.variance / 2;
	offset = Math.random() * r * trait.strength / 100;
	end = start + (r - offset);
	return Math.min(trait.max, end);
}



point = function(px, py) {
	this.x = px;
	this.y = py;
}

debug = function(msg) {
	$("#bug").html(msg);
}
