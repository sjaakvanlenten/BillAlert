class Bill {
    constructor(id, title, receiver, dateCreated, dateExpiry, billAmount, IBANo, reference, status,) {
      this.id = id;
      this.title = title;
      this.receiver = receiver
      this.dateCreated = dateCreated;
      this.dateExpiry = dateExpiry;
      this.billAmount = billAmount;
      this.IBANo = IBANo;
      this.reference = reference;
      this.status = status;
    }
  }
  
  export default Bill;
  