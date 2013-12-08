function Poly(vertices, tr)
{
    this.vertices = vertices;
    this.trans = tr;
    this.selected = false;
    this.collide = false;
}

Poly.prototype.GetOrigin = function()
{
    return this.trans.GetOrigin();
}

Poly.prototype.SetOrigin = function(v)
{
    this.trans.SetOrigin(v);
}

Poly.prototype.ApplyTransform = function(tr)
{
    this.verticesGlobal = [];
    for(var i=0; i<this.vertices.length; i++)
    {
        this.verticesGlobal.push( tr.Transform( this.vertices[i] ) );
    }
}

Poly.prototype.ContainsPoint = function(pt)
{
    var z = new Vector3(0,0,1);
    var n = this.verticesGlobal.length;
    var ab = this.verticesGlobal[0].Minus(this.verticesGlobal[n-1]);
    var aPt = pt.Minus(this.verticesGlobal[n-1])
    var side = ab.Cross(aPt).Dot(z);
    for(var i = 1; i< this.verticesGlobal.length; i++)
    {
        var ab = this.verticesGlobal[i].Minus(this.verticesGlobal[i-1]);
        var aPt = pt.Minus(this.verticesGlobal[i-1]);
        var s = ab.Cross(aPt).Dot(z);
        if(s * side < 0) return false;
    }

    return true;
}

Poly.prototype.Draw = function(context, tr)
{
    var newTr = tr.MatrixMultiply(this.trans);
    this.ApplyTransform(newTr);

    if(this.verticesGlobal.length >= 2)
    {
        context.beginPath();
        if(this.selected)
        {
            if(this.collide)
            {
                context.strokeStyle= "#ffaa00";
            }else
            {
                context.strokeStyle= "#ffff00";
            }
        }else
        {
            if(this.collide)
            {
                context.strokeStyle= "#ff0000";
            }else
            {
                context.strokeStyle= "#ffffff";
            }
        }
        context.moveTo(this.verticesGlobal[0].x, this.verticesGlobal[0].y);
        for(var i=0; i<this.verticesGlobal.length; i++)
        {
            context.lineTo(this.verticesGlobal[i].x, this.verticesGlobal[i].y);
            context.moveTo(this.verticesGlobal[i].x, this.verticesGlobal[i].y);
        }
        context.lineTo(this.verticesGlobal[0].x, this.verticesGlobal[0].y);
        context.stroke();
    }
}
