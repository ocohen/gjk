function Spring(a0, a1, k, b)
{
    this.a0 = a0;
    this.a1 = a0;
    this.box1 = new Square(10,10, MakeTransform(a0.x, a0.y, 0) );
    this.box2 = new Square(10,10, MakeTransform(a0.x, a0.y, 0) );
    this.e = a1.Minus(a0);
    this.k = k;
    this.b = b;
    this.v = Point2(0,0);
}

Spring.prototype.Update = function()
{
   var x = this.a1.Minus(this.a0).Minus(this.e);
   var F = x.Scale(-this.k).Minus( this.v.Scale(this.b) );
   this.v = this.v.Add(F);
   this.a1 = this.v.Add(this.a1);
   this.box2.SetOrigin(this.a1);
}

Spring.prototype.Draw = function(context, tr)
{
    this.box1.Draw(context, tr);
    this.box2.Draw(context, tr);

    context.beginPath();
    context.strokeStyle= "#ffffff";
    context.moveTo(this.a0.x+5, this.a0.y + 5);
    context.lineTo(this.a1.x+5, this.a1.y + 5);
    context.stroke();
    
}
