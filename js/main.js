const dom = {
    attack: document.querySelector('#attack'),
    target: document.querySelector('#target'),
    result1st: document.querySelector('#result1st'),
    result2st: document.querySelector('#result2st'),
    result3st: document.querySelector('#result3st'),
    show: document.querySelector('#show-chart'),
    close: document.querySelector('#chart span')
};

const update = e => {
    if (dom.attack.value.trim() != '' && dom.target.value.trim() != '') {
        swapDOM(1);
        getData();
        calculate1st(); // Info
        calculate2st(); // Old
        calculate3st(); // Reversed
        dom.show.classList.add('activated');
    }
}
dom.attack.addEventListener('change',update);
dom.target.addEventListener('change',update);
dom.show.addEventListener('click', e=>{
    let elt = document.querySelector('.shown');
    if (elt === null) {
        document.querySelector('#chart').classList.add('shown');
        drawChart();
    } else {
        elt.classList.remove('shown');
    }
});
dom.close.addEventListener('click', e=>{
    document.querySelector('#chart').classList.remove('shown');
})

const data = {
    attackers: [],
    targets: []
};

const dists = {
    first: [],
    second: []
}

function getData() {
    let targets = [];
    let m, r = /^(\d+)\|(\d+).*$/gm;
    while((m = r.exec(dom.target.value)) !== null) {
        targets.push({
            x: Number(m[1]),
            y: Number(m[2])
        });
    }

    let attackers = [];
    m = null; r = /^(\d+)\|(\d+).*$/gm;
    while((m = r.exec(dom.attack.value)) !== null) {
        attackers.push({
            x: Number(m[1]),
            y: Number(m[2])
        });
    }

    data.targets = targets;
    data.attackers = attackers;
}

function deepCopy(array) {
    return JSON.parse(JSON.stringify(array));
}

function ns(num, length) {
    return Math.round(num*Math.pow(10,length))/Math.pow(10,length);
}

const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

function calculate1st() {
    let attackers = data.attackers;
    let targets = data.targets;

    let mins = [];
    let avgs = [];
    let maxs = [];

    let str = `Atakujący - Min / Śre / Max`;
    for(let attacker of attackers) {
        attacker.ds = [];
        for(let target of targets) {
            attacker.ds.push(Math.sqrt(Math.pow(attacker.x - target.x,2)+Math.pow(attacker.y - target.y,2)));
        }
        
        if (typeof Object.keys === 'function') {
            attacker.dsOrder = Object.keys(attacker.ds);
        } else {
            for (var key in attacker.ds) {
                attacker.dsOrder.push(key);
            }
        }
        attacker.dsOrder.sort(function(a, b){
            return attacker.ds[a] - attacker.ds[b];
        });
        
        attacker.ds.sort((a,b)=>a-b);

        const min = attacker.ds[0];
        const max = attacker.ds[attacker.ds.length-1];
        const avg = average(attacker.ds);

        str += `\n${attacker.x}|${attacker.y} - ${ns(min,2)} / ${ns(avg,2)} / ${ns(max,2)}`;

        mins.push(min);
        maxs.push(max);
        avgs.push(avg)
    }

    str += `\n\nŚrednia najmniejszych: ${ns(average(mins),2)}`;
    str += `\nŚrednia średnich: ${ns(average(avgs),2)}`;
    str += `\nŚrednia największych: ${ns(average(maxs),2)}`;

    dom.result1st.value = str;
}

function calculate2st() {
    let attackers = deepCopy(data.attackers);
    let targets = data.targets;

    let usedTargets = [];
    let len = (attackers.length >= targets.length) ? targets.length : attackers.length;

    let distances = [];

    while(usedTargets.length < len) {
        let dist = Infinity;
        let closest = null;
        let finder = null;
        for (let attacker of attackers) {
            if (attacker.found !== undefined) continue;
            for (let i in attacker.dsOrder) {
                if (usedTargets.indexOf(attacker.dsOrder[i]) == -1) {
                    if (attacker.ds[i] < dist) {
                        dist = attacker.ds[i];
                        closest = attacker.dsOrder[i];
                        finder = attacker;
                    }
                }
            }
        }
        if (closest) {
            finder.found = targets[closest];
            finder.foundDist = dist;
            distances.push(dist);
            usedTargets.push(closest);
        }
    }
    let str = `Atakujący -> Cel (dystans)`;
    for (let attacker of attackers) {
        if (attacker.found !== undefined) {
            str += `\n${attacker.x}|${attacker.y} -> ${attacker.found.x}|${attacker.found.y} (${ns(attacker.foundDist,2)})`;
            dists.first.push(attacker.foundDist)
        }
    }
    str += `\n\nNajmniejszy dystans: ${ns(Math.min(...distances),2)}`;
    str += `\nŚredni dystans: ${ns(average(distances),2)}`;
    str += `\nNajwiększy dystans: ${ns(Math.max(...distances),2)}`;
    dom.result2st.value = str;
}

function calculate3st () {
    let attackers = deepCopy(data.attackers);
    let targets = data.targets;

    let usedTargets = [];
    let len = (attackers.length >= targets.length) ? targets.length : attackers.length;

    let distances = [];

    while(usedTargets.length < len) {
        let dist = -1;
        let farthest = null;
        let finder = null;
        for (let attacker of attackers) {                                 
            if (attacker.found !== undefined) continue;
            for (let i in attacker.dsOrder) {
                if (usedTargets.indexOf(attacker.dsOrder[i]) != -1) continue;
                if (attacker.ds[i] > dist) {
                    dist = attacker.ds[i];
                    farthest = attacker.dsOrder[i];
                    finder = attacker;
                }
                break;
            }
        }
        if (farthest) {
            finder.found = targets[farthest];
            finder.foundDist = dist;
            distances.push(dist);
            usedTargets.push(farthest);
        }
    }
    let str = `Atakujący -> Cel (dystans)`;
    for (let attacker of attackers) {
        if (attacker.found !== undefined) {
            str += `\n${attacker.x}|${attacker.y} -> ${attacker.found.x}|${attacker.found.y} (${ns(attacker.foundDist,2)})`;
            dists.second.push(attacker.foundDist)
        }
    }
    str += `\n\nNajmniejszy dystans: ${ns(Math.min(...distances),2)}`;
    str += `\nŚredni dystans: ${ns(average(distances),2)}`;
    str += `\nNajwiększy dystans: ${ns(Math.max(...distances),2)}`;
    dom.result3st.value = str;
}

// fetch('plemsy.pl/planer-atakow?swiat=pl143', {
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     mode: 'cors', // no-cors, cors, *same-origin
//     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: 'same-origin', // include, *same-origin, omit
//     headers: {
// //             'Content-Type': 'application/json',
//         'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     redirect: 'follow', // manual, *follow, error
//     referrer: 'no-referrer', // no-referrer, *client
//     body: 'acf_nonce=750cc0f153&post_id=20&return=https%3A%2F%2Fplemsy.pl%2Fplaner-atakow%3Fupdated%3Dtrue&acf_settings=&fields%5Bfield_58237d76c6f81%5D=pl143&fields%5Bfield_58264030598d3%5D=583%7C476%0D%0A536%7C485%0D%0A559%7C478%0D%0A547%7C487%0D%0A526%7C440%0D%0A532%7C489%0D%0A524%7C496%0D%0A556%7C465%0D%0A511%7C473%0D%0A512%7C438%0D%0A501%7C456%0D%0A545%7C499%0D%0A514%7C476%0D%0A535%7C490%0D%0A524%7C434%09%09%0D%0A512%7C455%0D%0A576%7C510%0D%0A510%7C452%0D%0A561%7C434%0D%0A498%7C436%0D%0A494%7C429%0D%0A562%7C486%0D%0A576%7C514%09%0D%0A504%7C449%0D%0A556%7C479%0D%0A526%7C484%0D%0A559%7C468%0D%0A573%7C491%0D%0A557%7C502%0D%0A533%7C455&fields%5Bfield_582a6e94f2379%5D=last&fields%5Bfield_5827d1cb7b36b%5D=off&fields%5Bfield_5827d1f27b36c%5D=&fields%5Bfield_582e0f95959e5%5D=nearest&fields%5Bfield_583854e42ace9%5D=1&fields%5Bfield_583855572acea%5D=fakes&fields%5Bfield_5827d1b97b36a%5D=%5Bb%5DCele+burzenia%3A%5B%2Fb%5D%0D%0A%5Bspoiler%3D29%5D%0D%0APO%C5%81UDNIE-12%3A%0D%0A576%7C488%3A+Atak%0D%0A566%7C486%3A+Atak%0D%0A575%7C488%3A+Atak%0D%0A579%7C491%3A+Atak%0D%0A564%7C495%3A+Atak%0D%0A563%7C482%3A+Atak%0D%0A567%7C503%3A+Atak%0D%0A568%7C497%3A+Atak%0D%0A578%7C490%3A+Atak%0D%0A557%7C486%3A+Atak%0D%0A569%7C504%3A+Atak%0D%0A578%7C493%3A+Atak%0D%0A%0D%0ACENTRUM-9%3A%0D%0A517%7C471%3A+Atak%0D%0A521%7C453%3A+Atak%0D%0A540%7C455%3A+Atak%0D%0A529%7C451%3A+Atak%0D%0A522%7C453%3A+Atak%0D%0A521%7C466%3A+Atak%0D%0A539%7C457%3A+Atak%0D%0A534%7C459%3A+Atak%0D%0A541%7C437%3A+Atak%0D%0A%0D%0AP%C3%93%C5%81NOC-8%3A+%0D%0A533%7C447%3A+Atak%0D%0A514%7C446%3A+Atak%0D%0A517%7C444%3A+Atak%0D%0A536%7C435%3A+Atak%0D%0A525%7C437%3A+Atak%0D%0A513%7C444%3A+Atak%0D%0A537%7C435%3A+Atak%0D%0A518%7C445%3A+Atak%0D%0A%5B%2Fspoiler%5D&fields%5Bfield_582a7395b7de1%5D=last&fields%5Bfield_582df5eaba194%5D=list&fields%5Bfield_582e0ccb93d3d%5D=&fields%5Bfield_582e178e3b928%5D=ram&fields%5Bfield_582b54dbcd4a5%5D=1&fields%5Bfield_58445d8c63f37%5D=1&fields%5Bfield_58437b98ece16%5D=1&fields%5Bfield_587125692feea%5D=yes&fields%5Bfield_58553d97f9b1f%5D=date&fields%5Bfield_5855410445dbc%5D=31.08.2019+00%3A00%3A00&fields%5Bfield_5855410745dbd%5D=&fields%5Bfield_5855410d45dbe%5D=&fields%5Bfield_5855410f45dbf%5D=&fields%5Bfield_5909e062f75f1%5D=all&fields%5Bfield_5871264e9830e%5D=no&fields%5Bfield_59088bd8947a0%5D=no&plan_attacks=Wykonaj+rozpisk%C4%99', // body data type //must match "Content-Type" header
// }).then(res=>res.text())

// /^(\d+)\. Wyślij atak \(Taran\) z wioski (\d\d\d)\|(\d\d\d) na wioskę (\d\d\d)\|(\d\d\d)/gm

let chart1 = undefined,
    chart2 = undefined;

function drawChart() {
    let labels = [];
    let data1st = [];
    let data2nd = [];
    for (let i in data.attackers) {
        labels.push(`${data.attackers[i].x}|${data.attackers[i].y}`);
        data1st.push(dists.first[i]);
        data2nd.push(dists.second[i]);
    }

    let maxY = Math.max(...data1st.concat(data2nd));

    if (chart1) chart1.destroy();
    chart1 = new Chart(document.querySelector('#chart canvas.first').getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Dystans',
                data: data1st,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {responsive:true,maintainAspectRatio:false,scales: {yAxes: [{ticks: {beginAtZero: true,max: maxY}}]}}
    });

    if (chart2) chart2.destroy();
    chart2 = new Chart(document.querySelector('#chart canvas.second').getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Dystans',
                data: data2nd,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {responsive:true,maintainAspectRatio:false,scales: {yAxes: [{ticks: {beginAtZero: true,max: maxY}}]}}
    });
}