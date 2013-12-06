function Poly(vertices, tr)
{
    this.vertices = vertices;
    this.trans = tr;
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

Poly.prototype.Draw = function(context, tr)
{
    var newTr = tr.MatrixMultiply(this.trans);
    this.ApplyTransform(newTr);

    if(this.verticesGlobal.length >= 2)
    {
        context.beginPath();
        context.strokeStyle= "#ffffff";
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
