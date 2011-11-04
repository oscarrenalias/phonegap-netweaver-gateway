Bank = function(data) {
    this.id = data.id;
    this.name = data.name;
    this.city = data.city;
    this.street = data.street;
    this.country = data.region;
    this.postCode = data.postCode;

    // not all data is available for all banks...
    if(this.country == undefined) {
        this.city = "Helsinki";
        this.street = "Itämerenkatu 1";
        this.country = "Finland";
    }
}

Bank.prototype.getFullAddress = function() {
    return(this.street + ", " + this.city + ", " + this.country);
}

Bank.data = [];

Bank.getAll = function(callback) {
    requestUri = "http://gw.esworkplace.sap.com/sap/opu/sdata/sap/DEMO_BANK/z_demo_bankCollection";
    var banks = [];    
    OData.read( requestUri.prx(), function (data) { //Success Callback (received data is a Feed): 
        console.log(data.results.length + " banks loaded");
        for (var i = 0; i < data.results.length; i++) { 
            var bank = new Bank({
                id: data.results[i].value,
                name: data.results[i].bank_name,
                city: data.results[i].city,
                street: data.results[i].street,
                country: data.results[i].region,
                postCode: data.results[i].address_number
            });
            banks.push(bank);

            // keep it memory for later usage
            Bank.data[bank.id] = bank;
        }
        callback(banks);
    });
    return(banks);
}

Bank.getById = function(id) {
    return(Bank.data[id]);
}