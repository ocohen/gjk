var tollerance = 0.00001;

function GetMaxDirectional(A, v)
{

    var pA;
    var max = -9999999;

    for(var i=0; i<A.verticesGlobal.length; i++)
    {
        var dot = A.verticesGlobal[i].Dot(v);
        if(dot > max)
        {
            max = dot;
            pA = A.verticesGlobal[i];
        }
    }

    return pA;
}


function Mapping(A,B, v)
{
    //alert("v=" + v.x + "," + v.y);
    var pA = GetMaxDirectional(A,v)
    var pB = GetMaxDirectional(B, v.Scale(-1) );
    //alert("pA=" + pA.x + "," + pA.y + "\npB=" + pB.x + "," + pB.y);

    return pA.Minus(pB);
}

function Simplex(a,b,c)
{
    this.a = a;
    this.b = b;
    this.c = c;
    this.s = [a,b,c];
}

function GJK(A,B)
{
    if(A.vertices.length < 2 || B.vertices.length < 2)
    {
        return false;
    }

    var origin = new Vector3(0,0,0);
    var z = new Vector3(0,0,1);
    var a = A.verticesGlobal[0].Minus(B.verticesGlobal[0]);
    var b = Point2(0,0);
    var c = Point2(0,0);
    var v = Point2(0,0);
    var n = 0;

    while(true)
    {
        //alert("n=" + n + "\na=" + a.x + "," + a.y + "\nb=" + b.x + "," + b.y + "\nc=" + c.x + "," + c.y + "\nv=" + v.x + "," + v.y);
        switch(n)
        {
            case 0:
            {
                v = origin.Minus(a);
                var d = v.Dot(v);
                if(v.Dot(v) < tollerance)
                {
                    return new Simplex(a,b,c);
                }

                b = a;
                a = Mapping(A, B, v);
                if(a.Dot(v) < 0)
                {
                    return false;
                }

                n = 1;
                break;
            }
            case 1:
            {
                var a0 = origin.Minus(a);
                var ab = b.Minus(a);
                var dot = ab.Dot(a0);
                if(dot > 0)
                {
                    v =  ab.Cross(z);
                    if(v.Dot(a0) < 0)
                    {
                        v = z.Cross(ab);
                    }

                    c = b;
                    b = a;
                    a = Mapping(A,B, v);
                    n = 2;

                    if(a.Dot(v) < 0)
                    {
                        return false;
                    }
                }else
                {
                    n = 0;
                }

                break;
            }
            case 2:
            {
                var a0 = origin.Minus(a);
                var ac = c.Minus(a);
                var ab = b.Minus(a);

                //need to find handedness of triangle
                var side = 1;
                if(ac.Cross(ab).Dot(z) < 0)
                {
                    side = -1;
                }

                if(a0.Cross(ac).Dot(z) * side > 0)
                {
                    if(a0.Dot(ac) > 0)
                    {
                        v = ac.Cross(z.Scale(side));
                        b = c;
                        n = 1;
                    }else
                    {
                        n = 0;
                    }
                }else if(ab.Cross(a0).Dot(z) * side > 0)
                {
                    if(a0.Dot(ab) > 0)
                    {
                        v = z.Scale(side).Cross(ab);
                        n = 1;
                    }else
                    {
                        n = 0;
                    }
                }else
                {
                    return new Simplex(a,b,c);
                }
                
                break;
            }
        }
    }

    return false;
}

function Edge(index, dist, n)
{
    this.dist = dist;
    this.n = n;
    this.index = index;
}

function GetClosestEdge(simplex)
{
    var minEdge = new Edge(0, 999999999, new Vector3(0,0,0) );
    var origin = new Vector3(0,0,0);
    var z = new Vector3(0,0,1);
    for(var i=0; i<simplex.s.length; i++)
    {
        var j = i-1;
        if(j < 0) j = simplex.s.length-1;
        var a = simplex.s[j];
        var b = simplex.s[i];
        var ab = b.Minus(a);
        var k = a.Cross(ab); 
        var n = ab.Cross(k).Normalize();
        var d = Math.abs(a.Dot(n));
        if(d < minEdge.dist)
        {
            //alert("n=" + n.x + "," + n.y + "\na=" + a.x + "," + a.y + "\nb=" + b.x + ","  + b.y + "\nd=" + d + "\nab=" + ab.x + "," + ab.y + "\nk=" + k.x +"," +k.y + "," + k.w);
            minEdge.dist= d;
            minEdge.index= j;
            minEdge.n = n;
        }
    }

    return minEdge;
}

function InArray(s, a)
{
    for(var i=0; i<s.length; i++)
    {
        if(s[i].x == a.x && s[i].y == a.y) return true;
    }

    return false;
}

function EPA(A,B,simplex)
{
    var f = 0;
    while(f<4)
    {
        //f += 1;
        var e = GetClosestEdge(simplex);    
        var a = Mapping(A,B, e.n);
        
        
        var out = "";
        for(var i=0; i<simplex.s.length; i++)
        {
            out += "\ns" + i + "=" + simplex.s[i].x + "," + simplex.s[i].y;
        }

        //alert("e.index=" + e.index + "\ne.n=" + e.n.x +"," + e.n.y + "\na=" + a.x + "," + a.y + out);
        

        var d = e.n.Dot(a);
        if(d - e.dist < tollerance || InArray(simplex.s, a) )
        {
            //alert("A");
            //alert("e.index=" + e.index + "\ne.n=" + e.n.x +"," + e.n.y + "\na=" + a.x + "," + a.y + out);
            return new Edge(e.index, d, e.n);
        }else
        {
            //alert(e.index);
            simplex.s.splice(e.index, 0, a);        
        }
    }

}
