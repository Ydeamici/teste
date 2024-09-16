export class Quadra {
  public id: string;
  public name: string;
  public location: string;
  public type: string; // e.g., Indoor, Outdoor
  public operatingHours: {
    day: string;
    hours: { hour: string; status: boolean }[];
  }[];
  public photo: string;

  constructor(obj?: Partial<Quadra>) {
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.location = obj.location;
      this.type = obj.type;
      this.operatingHours = obj.operatingHours || [];
      this.photo = obj.photo;
    }
  }

  toString() {
    const quadra = `{
            "id": "${this.id}",
            "name": "${this.name}",
            "location": "${this.location}",
            "type": "${this.type}",
            "operatingHours": ${JSON.stringify(this.operatingHours)},
            "photo": "${this.photo}",
        }`;
    return quadra;
  }

  toFirestore() {
    const quadra = {
      id: this.id,
      name: this.name,
      location: this.location,
      type: this.type,
      operatingHours: this.operatingHours,
      photo: this.photo,
    };
    return quadra;
  }
}
