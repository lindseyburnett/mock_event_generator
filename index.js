const path = require("path");
const handlebars = require('handlebars');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

let accountNumber = 'account123';
let serviceType = 'OPENSHIFT_CLUSTER';
let initialEventTime = '2017-02-20T00:00:00.000Z';

let events = [];
let start = new Date(initialEventTime);
for (let i = 0; i < 25; i++) {

    let offsetStart = new Date(start.getTime());
    offsetStart.setHours(start.getHours() + i);

    events.push({
        timestamp: offsetStart.toISOString(),
        accountNumber: accountNumber,
        eventId: uuidv4(),
        serviceType: serviceType,
        instanceId: uuidv4(),
        coresValue: "4.0"
    });
}

let fileTemplate = fs.readFileSync(path.join(__dirname, 'insert_events.sql.hbs'));

let results = renderToString(fileTemplate.toString(), {events})

fs.writeFile(`insert_events_${Date.now()}.sql`, results, function (err) {
    if (err) return console.log(err);
});

function renderToString(source, data) {
    let template = handlebars.compile(source);
    let outputString = template(data);
    return outputString;
}