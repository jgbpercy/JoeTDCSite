export class Color {
    public r : number;
    public g : number;
    public b : number;
    public a : number;

    constructor(r : number, g : number, b : number, a : number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public toContextStyleString() : string {
        return `rgba(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)}, ${Math.round(this.a)}`;
    }
}
