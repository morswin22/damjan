function deepCopy(array) {
    return JSON.parse(JSON.stringify(array));
}

function ns(num, length) {
    return Math.round(num*Math.pow(10,length))/Math.pow(10,length);
}

const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

class Algorithms {
    data = {
        attackers: [],
        targets: []
    };
    
    dists = {
        first: [],
        second: []
    };
    
    results = {
        alg1: '',
        alg1Raw: [],
        alg1NotUsedA: [],
        alg1NotUsedB: [],
        alg1Extra: [],
        alg2: '',
        alg2Raw: [],
        alg2NotUsedA: [],
        alg2NotUsedB: [],
        alg2Extra: [],
    };

    calculate(attackers, targets) {
        this.data = {
            attackers: deepCopy(attackers),
            targets: deepCopy(targets)
        };

        this.calculate1st();
        this.calculate2st();
        this.calculate3st();

        const cfChartLabels = [];
        const cfChartData = [];
        for (let elt of this.results.alg1Raw) {
            cfChartLabels.push(`${elt.x}|${elt.y}`);
            cfChartData.push(elt.foundDist || 0);
        }

        const ffChartLabels = [];
        const ffChartData = [];
        for (let elt of this.results.alg2Raw) {
            ffChartLabels.push(`${elt.x}|${elt.y}`);
            ffChartData.push(elt.foundDist || 0);
        }

        const max = Math.max(...cfChartData,...ffChartData);

        return {
            cf: this.results.alg1,
            cfExtra: this.results.alg1Extra,
            cfChart: {
                labels: cfChartLabels,
                data: cfChartData
            },
            ff: this.results.alg2,
            ffExtra: this.results.alg2Extra,
            ffChart: {
                labels: ffChartLabels,
                data: ffChartData
            },
            max,
        };
    }

    calculate1st() {
        let attackers = this.data.attackers;
        let targets = this.data.targets;

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
    }

    calculate2st() {
        let attackers = deepCopy(this.data.attackers);
        let targets = this.data.targets;
    
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
                    if (usedTargets.indexOf(attacker.dsOrder[i]) === -1) {
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
        this.dists.first = [];
        let notUsed = [];
        let str = `Atakujący -> Cel (dystans)`;
        for (let attacker of attackers) {
            if (attacker.found !== undefined) {
                str += `\n${attacker.x}|${attacker.y} -> ${attacker.found.x}|${attacker.found.y} (${ns(attacker.foundDist,2)})`;
                this.dists.first.push(ns(attacker.foundDist,2))
            } else {
                notUsed.push(attacker);
                this.dists.first.push(0)
            }
        }
        this.results.alg1Extra = [ns(Math.min(...distances),2), ns(average(distances),2), ns(Math.max(...distances),2)];
        this.results.alg1NotUsedA = [];
        if (notUsed.length > 0) {
            str += `\n\nNiewykorzystane wioski atakujące:`
            for (let attacker of notUsed) {
                str += `\n${attacker.x}|${attacker.y}`;
                this.results.alg1NotUsedA.push(attacker);
            }
        }
        this.results.alg1NotUsedB = [];
        if (targets.length - usedTargets.length > 0) {
            str += `\n\nNiewykorzystane cele:`
            for (let i in targets) {
                if (usedTargets.indexOf(i) < 0) {
                    this.results.alg1NotUsedB.push(targets[i]);
                    str += `\n${targets[i].x}|${targets[i].y}`;
                }
            }
        }
        this.results.alg1Raw = attackers;
        this.results.alg1 = str;
    }

    calculate3st () {
        let attackers = deepCopy(this.data.attackers);
        let targets = this.data.targets;
    
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
                    if (usedTargets.indexOf(attacker.dsOrder[i]) !== -1) continue;
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
        this.dists.second = [];
        let notUsed = [];
        let str = `Atakujący -> Cel (dystans)`;
        for (let attacker of attackers) {
            if (attacker.found !== undefined) {
                str += `\n${attacker.x}|${attacker.y} -> ${attacker.found.x}|${attacker.found.y} (${ns(attacker.foundDist,2)})`;
                this.dists.second.push(ns(attacker.foundDist,2))
            } else {
                notUsed.push(attacker);
                this.dists.second.push(0)
            }
        }
        this.results.alg2Extra = [ns(Math.min(...distances),2), ns(average(distances),2), ns(Math.max(...distances),2)];
        this.results.alg2NotUsedA = [];
        if (notUsed.length > 0) {
            str += `\n\nNiewykorzystane wioski atakujące:`
            for (let attacker of notUsed) {
                str += `\n${attacker.x}|${attacker.y}`;
                this.results.alg2NotUsedA.push(attacker);
            }
        }
        this.results.alg2NotUsedB = [];
        if (targets.length - usedTargets.length > 0) {
            str += `\n\nNiewykorzystane cele:`
            for (let i in targets) {
                if (usedTargets.indexOf(i) < 0) {
                    this.results.alg2NotUsedB.push(targets[i]);
                    str += `\n${targets[i].x}|${targets[i].y}`;
                }
            }
        }
        this.results.alg2Raw = attackers;
        this.results.alg2 = str;
    }
}

export default Algorithms;