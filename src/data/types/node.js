/**
 * Represents a node. It can either be standalone or part of a way. By default,
 * it is not draw. To force it to be draw, manually add it to the geohash index.
 * @class
 * @augments Feature
 */
var Node = Class.create(Feature, 
/**
 * @lends Node#
 */
{
	__type__: 'Node',
	/**
	 * Sets the default radius and invokes Feature#initialize
	 * @constructs
	 */
	initialize: function($super, node) {
		$super()
		Object.extend(this, node)
		this.tags = new Hash()
		if (node.tag){
			if (node.tag instanceof Array) {
				for(var i=0;i<node.tag.length;i++) {
					this.tags.set(node.tag[i].k, node.tag[i].v)
				}
			} else {
				this.tags.set(node.tag.k, node.tag.v)
			}
		}
		this.h = 10
		this.w = 10
		this.x = Projection.lon_to_x(this.lon)
		this.y = Projection.lat_to_y(this.lat)
		this.color = Glop.random_color()
		this.text = this.tags.get("name")
		if (node.display) {
			this.display = true
			Geohash.put(this.lat, this.lon, this, 1)
		}
	},
	/**
	 * invokes Feature#draw
	 */
	draw: function($super) {
		if (this.img && typeof this.img == 'string') {
			$l('loading image '+this.img)
			var img = this.img
			this.img = new Image
			this.img.src = img
		}
		$super()
	},
	/**
	 * Applies hover and mouseDown styles
	 */
	style: function() {

	},
	/**
	 * Draws this node
	 */
	shape: function() {
		$C.save()
		if (this.img && this.img.width) {
			$C.translate(this.x,this.y)
			$C.scale(2,2)
			$C.draw_image(this.img,this.img.width/-2,this.img.height/-2)
		}
		else {
			$C.begin_path()
			$C.translate(this.x, this.y-this.radius)
			$C.fill_style('red')
			this.radius = 10
			$C.arc(0, this.radius, this.radius, 0, Math.PI*2, true)
			$C.fill()
			$C.stroke()
		}
		//Label.prototype.draw.apply(this,0,0)
		$C.restore()
	},
	apply_default_styles: function($super) {
		$super()
		/**
		 * The radius, in pixels, of this node.
		 * @type Number
		 */
		this.radius = 6
	},
	refresh_styles: function() {
		this.apply_default_styles()
		Style.parse_styles(this, Style.styles.node)
	}
})
