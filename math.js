function Vector3(x,y,w)
{
    this.x = x;
    this.y = y;
    this.w = w;
}

Vector3.prototype.Minus = function(v)
{
    return new Vector3(this.x - v.x, this.y - v.y, this.w - v.w);
}

Vector3.prototype.Add = function(v)
{
    return new Vector3(this.x + v.x, this.y + v.y, this.w + v.w);
}

Vector3.prototype.Scale = function(k)
{
    return new Vector3(this.x*k, this.y*k, this.w*k);
}

Vector3.prototype.Dot = function(v)
{
    return this.x * v.x + this.y * v.y + this.w * v.w;
}

Vector3.prototype.Normalize = function()
{
    var l = Math.sqrt(this.Dot(this));
    if(Math.abs(l) < 0.0001) return new Vector3 (0,0,0);
    return new Vector3(this.x / l, this.y / l, this.w / l);
}

Vector3.prototype.Cross = function(v)
{
    var i = this.y*v.w - this.w * v.y;
    var j = this.w*v.x - this.x * v.w;
    var k = this.x*v.y - this.y * v.x;

    return new Vector3(i,j,k);
}

function Point2(x,y)
{
    return new Vector3(x,y,1);
}

function Matrix33(data)
{
    this.data = data;
}

function MakeTransform(x,y,angle)
{
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var data =  [c, -s, x,
                  s, c, y,
                  0, 0, 1];

    return new Matrix33(data);
}


Matrix33.prototype.MatrixMultiply= function(tr)
{
    var out = [0,0,0, 0,0,0, 0,0,0];
    for(var i=0; i<3; i++)
    {
        out[i*3]   = this.data[i*3] * tr.data[0] + this.data[i*3+1] * tr.data[3] + this.data[i*3+2] * tr.data[6];
        out[i*3+1] = this.data[i*3] * tr.data[1] + this.data[i*3+1] * tr.data[4] + this.data[i*3+2] * tr.data[7];
        out[i*3+2] = this.data[i*3] * tr.data[2] + this.data[i*3+1] * tr.data[5] + this.data[i*3+2] * tr.data[8];
    }

    return new Matrix33(out);
}

Matrix33.prototype.Transform= function(v)
{
    var x = this.data[0] * v.x + this.data[1] * v.y + this.data[2] * v.w;
    var y = this.data[3] * v.x + this.data[4] * v.y + this.data[5] * v.w;
    var w = this.data[6] * v.x + this.data[7] * v.y + this.data[8] * v.w;

    return new Vector3(x,y,w);
}

Matrix33.prototype.GetOrigin = function(tr)
{
    return Point2(this.data[2], this.data[5]);
}

Matrix33.prototype.SetOrigin = function(v)
{
    this.data[2] = v.x;
    this.data[5] = v.y;
    this.data[8] = v.w;
}
