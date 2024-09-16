export class Usuario{
    public id: string;
    public name: string;
    public email: string;
    public password: string;
    public phone: string;
    public isAdmin: boolean;

    constructor(obj?: Partial<Usuario>){
        if (obj){
            this.id =       obj.id
            this.name =     obj.name
            this.email =    obj.email
            this.password =    obj.password
            this.phone = obj.phone
            this.isAdmin = obj.isAdmin;
        }
    }

    toString(){
        const user=`{
            "id":       "${this.id}",
            "name":     "${this.name}",
            "email":    "${this.email}",
            "password":    "${this.password}",
            "phone":    "${this.phone}",
            "isAdmin": "${this.isAdmin}",
        }`
        return user
    }

    toFirestore(){
        const user={
            id:       this.id,
            name:     this.name,
            email:    this.email,
            password:    this.password,
            phone: this.phone,
            isAdmin: this.isAdmin,
        }
        return user
    }


}