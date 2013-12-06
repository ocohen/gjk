function Square(w, h, tr)
{
    this.trans = tr;
    this.width = w;
    this.height = h;
}

Square.prototype.GetOrigin = function()
{
    return this.trans.GetOrigin();
}

Square.prototype.SetOrigin = function(v)
{
    this.trans.SetOrigin(v);
}

Square.prototype.ApplyTransform = function(tr)
{
    this.tl = tr.Transform(new Point2(0,0));
    this.tr = tr.Transform(new Point2(this.width,0));
    this.bl = tr.Transform(new Point2(0,this.height));
    this.br = tr.Transform(new Point2(this.width,this.height));
}

Square.prototype.Draw = function(context, tr)
{
    var newTr = tr.MatrixMultiply(this.trans);
    this.ApplyTransform(newTr);

    context.beginPath();
    context.strokeStyle= "#ffffff";
    context.moveTo(this.tl.x, this.tl.y);
    context.lineTo(this.tr.x, this.tr.y);
    context.lineTo(this.br.x, this.br.y);
    context.lineTo(this.bl.x, this.bl.y);
    context.lineTo(this.tl.x,this.tl.y);
    context.stroke();
}
