class Email {
    constructor(purchase) {
        this.id = purchase.id;
        this.first = purchase.first;
        this.phoneNumber = purchase.phoneNumber;
        this.items = purchase.items;
    }
}

module.exports = Email;