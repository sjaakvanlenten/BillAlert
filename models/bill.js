class Bill {
    constructor(id, title, receiver, dateCreated, dateExpiry, billAmount, IBANo, reference, paymentDate, deletionDate) {
      this.id = id;
      this.title = title;
      this.receiver = receiver
      this.dateCreated = dateCreated;
      this.dateExpiry = dateExpiry;
      this.billAmount = billAmount;
      this.IBANo = IBANo;
      this.reference = reference;
      this.paymentDate = paymentDate;
      this.deletionDate = deletionDate
    }
  }
  
  export default Bill;
  