export class Agendamento {
  public id: string;
  public usuarioId: string;
  public quadraId: string;
  public date: string;
  public startTime: string;
  public endTime: string;
  public status: string;

  constructor(obj?: Partial<Agendamento>) {
    if (obj) {
      this.id = obj.id;
      this.usuarioId = obj.usuarioId;
      this.quadraId = obj.quadraId;
      this.date = obj.date;
      this.startTime = obj.startTime;
      this.endTime = obj.endTime;
      this.status = obj.status;
    }
  }

  toString() {
    const agendamento = `{
          "id": "${this.id}",
          "usuarioId": "${this.usuarioId}",
          "quadraId": "${this.quadraId}",
          "date": "${this.date}",
          "startTime": "${this.startTime}",
          "endTime": "${this.endTime}",
          "status": "${this.status}"
      }`;
    return agendamento;
  }

  toFirestore() {
    const agendamento = {
      id: this.id,
      usuarioId: this.usuarioId,
      quadraId: this.quadraId,
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
    };
    return agendamento;
  }
}
