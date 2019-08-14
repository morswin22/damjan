const dom = {
    attack: document.querySelector('#attack'),
    target: document.querySelector('#target'),
    result: document.querySelector('#result'),
    calc: document.querySelector('#calc')
};

dom.calc.addEventListener('click',e=>{
    if (dom.attack.value.trim() != '' && dom.attack.value.trim() != '') {
        calculate();
    }
});

function calculate() {
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
        
    }

    let usedTargets = [];
    let len = (attackers.length >= targets.length) ? targets.length : attackers.length;

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
            usedTargets.push(closest);
        }
    }

    let str = `Atakujący -> Cel`;
    for (let attacker of attackers) {
        if (attacker.found !== undefined) {
            str += `\n${attacker.x}|${attacker.y} -> ${attacker.found.x}|${attacker.found.y} (${Math.round(attacker.foundDist*100)/100})`;
        }
    }
    dom.result.innerHTML = str;
}