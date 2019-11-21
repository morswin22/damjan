const dom = {
    setA: document.querySelector('#setA'),
    setB: document.querySelector('#setB'),
    output: document.querySelector('.output'),
    chart1: document.querySelector('#alg1'),
    chart2: document.querySelector('#alg2'),
};

const update = e => {
    if (dom.setA.value.trim() != '' && dom.setB.value.trim() != '') {
        getData(dom.setA, 'attackers');
        getData(dom.setB, 'targets');
        calculate1st(); // Info
        calculate2st(); // Old
        calculate3st(); // Reversed
        drawResult();
        drawChart();
    } else {
        getData(e.target, (e.target.id == 'setA') ? 'attackers' : 'targets');
    }
}
dom.setA.addEventListener('change',update);
dom.setB.addEventListener('change',update);

const data = {
    attackers: [],
    targets: []
};

const dists = {
    first: [],
    second: []
};

const results = {
    alg1: '',
    alg1Raw: [],
    alg1NotUsedB: [],
    alg2: '',
    alg2Raw: [],
    alg2NotUsedB: [],
};

function drawResult() {
    dom.output.value = results[selectedOutput];
}

function getData(textarea, output) {
    let elements = [];
    let m, r = /(\d+)\|(\d+)/gm;
    let str = '';
    while((m = r.exec(textarea.value)) !== null) {
        let obj = {
            x: Number(m[1]),
            y: Number(m[2])
        };
        elements.push(obj);
        str += `${obj.x}|${obj.y}\n`;
    }
    textarea.value = str; // TODO: Ask if this is desired
    data[output] = elements;
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

    // let mins = [];
    // let avgs = [];
    // let maxs = [];

    // let str = `Atakujący - Min / Śre / Max`;
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

        // const min = attacker.ds[0];
        // const max = attacker.ds[attacker.ds.length-1];
        // const avg = average(attacker.ds);

        // str += `\n${attacker.x}|${attacker.y} - ${ns(min,2)} / ${ns(avg,2)} / ${ns(max,2)}`;

        // mins.push(min);
        // maxs.push(max);
        // avgs.push(avg)
    }

    // str += `\n\nŚrednia najmniejszych: ${ns(average(mins),2)}`;
    // str += `\nŚrednia średnich: ${ns(average(avgs),2)}`;
    // str += `\nŚrednia największych: ${ns(average(maxs),2)}`;

    // dom.result1st.value = str;
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
    dists.first = [];
    let notUsed = [];
    let str = `Atakujący -> Cel (dystans)`;
    for (let attacker of attackers) {
        if (attacker.found !== undefined) {
            str += `\n${attacker.x}|${attacker.y} -> ${attacker.found.x}|${attacker.found.y} (${ns(attacker.foundDist,2)})`;
            dists.first.push(ns(attacker.foundDist,2))
        } else {
            notUsed.push(attacker);
            dists.first.push(0)
        }
    }
    str += `\n\nNajmniejszy dystans: ${ns(Math.min(...distances),2)}`;
    str += `\nŚredni dystans: ${ns(average(distances),2)}`;
    str += `\nNajwiększy dystans: ${ns(Math.max(...distances),2)}`;
    if (notUsed.length > 0) {
        str += `\n\nNiewykorzystane wioski atakujące:`
        for (let attacker of notUsed) {
            str += `\n${attacker.x}|${attacker.y}`;
        }
    }
    results.alg1NotUsedB = [];
    if (targets.length - usedTargets.length > 0) {
        str += `\n\nNiewykorzystane cele:`
        for (let i in targets) {
            if (usedTargets.indexOf(i) < 0) {
                results.alg1NotUsedB.push(targets[i]);
                str += `\n${targets[i].x}|${targets[i].y}`;
            }
        }
    }
    results.alg1Raw = attackers;
    results.alg1 = str;
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
    dists.second = [];
    let notUsed = [];
    let str = `Atakujący -> Cel (dystans)`;
    for (let attacker of attackers) {
        if (attacker.found !== undefined) {
            str += `\n${attacker.x}|${attacker.y} -> ${attacker.found.x}|${attacker.found.y} (${ns(attacker.foundDist,2)})`;
            dists.second.push(ns(attacker.foundDist,2))
        } else {
            notUsed.push(attacker);
            dists.second.push(0)
        }
    }
    str += `\n\nNajmniejszy dystans: ${ns(Math.min(...distances),2)}`;
    str += `\nŚredni dystans: ${ns(average(distances),2)}`;
    str += `\nNajwiększy dystans: ${ns(Math.max(...distances),2)}`;
    if (notUsed.length > 0) {
        str += `\n\nNiewykorzystane wioski atakujące:`
        for (let attacker of notUsed) {
            str += `\n${attacker.x}|${attacker.y}`;
        }
    }
    results.alg1NotUsedB = [];
    if (targets.length - usedTargets.length > 0) {
        str += `\n\nNiewykorzystane cele:`
        for (let i in targets) {
            if (usedTargets.indexOf(i) < 0) {
                results.alg2NotUsedB.push(targets[i]);
                str += `\n${targets[i].x}|${targets[i].y}`;
            }
        }
    }
    results.alg2Raw = attackers;
    results.alg2 = str;
}

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
    let options = {
        responsive:true,
        maintainAspectRatio:false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: (maxY == -Infinity) ? 1 : maxY
                }
            }]
        }
    }

    if (chart1) chart1.destroy();
    chart1 = new Chart(document.querySelector('canvas#alg1').getContext('2d'), {
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
        options
    });

    if (chart2) chart2.destroy();
    chart2 = new Chart(document.querySelector('canvas#alg2').getContext('2d'), {
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
        options
    });
}

drawChart();
