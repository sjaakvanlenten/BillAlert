class Bill {
    constructor(id, title, dateCreated, dateExpiry, billAmount, IBANo, reference, status,) {
      this.id = id;
      this.title = title;
      this.dateCreated = dateCreated;
      this.dateExpiry = dateExpiry;
      this.billAmount = billAmount;
      this.IBANo = IBANo;
      this.reference = reference;
      this.status = status;
    }
  }
  
  export default Bill;
  