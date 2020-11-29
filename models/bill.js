class Bill {
    constructor(id, title, dateCreated, dateExpiry, billAmount, IBANo, reference, status, urgency) {
      this.id = id;
      this.title = title;
      this.dateCreated = dateCreated;
      this.dateExpiry = dateExpiry;
      this.billAmount = billAmount;
      this.IBANo = IBANo;
      this.reference = reference;
      this.status = status;
      this.urgency = urgency;
    }
  }
  
  export default Bill;
  