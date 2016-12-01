'use strict';

let fs = require('fs');

fs.readFile('./access.log', 'utf8', (err, data) => {
    if (err) {
        return console.log(err);
    }

    let ipList = findAllIP(data);
    let ipSet = getUniqueIPSet(ipList);
    let subnetsMap = getOrganizedSubnets(ipSet);

    print(subnetsMap);
});


function findAllIP(data) {
    let ipRegEx = new RegExp('(?:(?:25[0-5]|[0-2]?\\d\\d?|2[0-4]\\d)\\.){3}(?:25[0-5]|[012]?\\d\\d?)', 'g');

    return data.match(ipRegEx);
}

function getUniqueIPSet(ipList) {
    let ipSet = new Set();

    for (const address in ipList) {
        ipSet.add(ipList[address]);
    }

    return ipSet;
}

function getOrganizedSubnets(ipSet) {
    let map = new Map();

    ipSet.forEach((address) => {
        let subnet = getSubnets(address);
        if (map.has(subnet)) {
            let arr = map.get(subnet);
            arr.push(address);
        } else {
            map.set(subnet, [address]);
        }
    });

    return map;
}

function getSubnets(address) {
    let index = address.lastIndexOf('.');
    return address.slice(0, index);
}

function print(subnetsMap) {
    console.log('List of subnets with their IP adresses\n');

    for (const subnet of subnetsMap) {
        let subnetIP = subnet[0];
        let ipArr = subnet[1];
        console.log(subnetIP);
        for (const ip of ipArr) {
            console.log('\t' + ip);
        }

        console.log('');
    }
}