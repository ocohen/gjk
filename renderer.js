function Renderer(c)
{
    this.canvas = c;
    this.shapes = [];
}

function Clear(canvas)
{
    var context = canvas.getContext("2d");
    context.clearRect(0,0,canvas.width, canvas.height);
    context.fillStyle = "#443333";
    context.fillRect(0,0, canvas.width, canvas.height);
}

function Draw(context, shapes)
{
    var tr = MakeTransform(0,0,0);
    for(var i=0; i<shapes.length; i++)
    {
        shapes[i].Draw(context, tr);
    }
}

Renderer.prototype.Update = function()
{
    var context = this.canvas.getContext("2d");
    Clear(this.canvas);
    Draw(context, this.shapes);
}

Renderer.prototype.AddShape = function(s)
{
    this.shapes.push(s);
}
