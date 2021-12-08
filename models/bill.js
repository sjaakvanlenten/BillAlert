class Bill {
    constructor(id, title, receiver, dateCreated, dateExpiry, billAmount, IBANo, reference, paymentDate,) {
      this.id = id;
      this.title = title;
      this.receiver = receiver
      this.dateCreated = dateCreated;
      this.dateExpiry = dateExpiry;
      this.billAmount = billAmount;
      this.IBANo = IBANo;
      this.reference = reference;
      this.paymentDate = paymentDate;
    }
  }
  
  export default Bill;
  