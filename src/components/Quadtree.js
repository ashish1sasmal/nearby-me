export default class Quadtree {
    constructor (boundary, capacity=4) {
        this.boundary = boundary
        this.capacity = capacity
        this.points = []
        this.divided = false
    }

    insert (x, y=null) {
        if (this.boundary.contains(x, y)) {
            if (this.points.length < this.capacity) {
                let p = new Point(x, y);
                this.points.push(p);
            }
            else {
                if (!this.divided) {
                    this.subdivide();
                }
                // console.log(x,y, "hi",this)
                this.northEast.insert(x, y)
                this.northWest.insert(x, y)
                this.southEast.insert(x, y)
                this.southWest.insert(x, y)
            }
        }
    }

    subdivide () {
        let x=this.boundary.point.x, y=this.boundary.point.y, w=this.boundary.w, h = this.boundary.h;
        // console.log(this.boundary.point.x, this.boundary.point.y, this.boundary.w, this.boundary.h)
        // console.log(x, y, w, h, "here")
        let ne = new Rectangle(x + w / 2, y + h / 2, w - w / 2, h - h / 2)
        let nw = new Rectangle(x, y + h / 2, w / 2, h - h / 2)
        let sw = new Rectangle(x, y, w / 2, h / 2)
        let se = new Rectangle(x + w / 2, y, (w - w / 2), h / 2)

        this.northEast = new Quadtree(ne)
        this.northWest = new Quadtree(nw)
        this.southEast = new Quadtree(se)
        this.southWest = new Quadtree(sw)
        this.divided = true
    }

    nearby (range, points) {
        if (this.boundary.isIntersect(range)) {
            this.points.forEach((pts) => {
                if (range.contains(pts.x, pts.y)) 
                    points.push(pts)
            })

            if (this.divided){
                this.northEast.nearby(range, points)
                this.northWest.nearby(range, points)
                this.southEast.nearby(range, points)
                this.southWest.nearby(range, points)
            }
        }
    }
}

export class Point {
    constructor (x, y) {
        this.x = x
        this.y = y
    }
}
    
export class Rectangle {
    constructor (x, y, w, h) {
        this.point = new Point(x, y)
        this.w = w
        this.h = h
    }
        

    contains(x, y) {
        let f = (
            x >= (this.point.x)
            && x <= (this.point.x + this.w)
            && y >= (this.point.y)
            && y <= (this.point.y + this.h)
        )
        // console.log(x,y, this, f)
        return f
    }
        

    isIntersect (rect) {
        let f = (
            ((this.point.x + this.w) <= rect.point.x)
            || ((rect.point.x + rect.w) <= this.point.x)
            || ((this.point.y + this.h) <= rect.point.y)
            || ((rect.point.y + rect.h) <= this.point.y)
        )
        // console.log(this.point, !f)
        return !f
    }
        
}
    