import store from '@/store/store';
import colorTool from '@/tools/color';
import Region from "@/classes/Region";
import Day from "@/classes/Day";

const selectParentAsMerged = function(parent) {
    let data, r;

    data = {
        id: store.state.regions.all.length + 1,
        title: parent.title,
        color: colorTool.getRandom(),
        population: 0,
        entries: []
    };
    r = new Region(data);
    r.active = true;

    let index = 0;
    for (let region of parent.regions) {
        r.population += region.population;
        let dayIndex = 0;
        for (let day of region.entries) {
            if (index === 0) {
                let d = new Day({
                    index: data.entries.length,
                    cases: 0,
                    fatalities: 0,
                    date: day.date
                }, r);
                r.entries.push(d);
            }

            let rd = r.entries[dayIndex];
            rd.cases += day.cases;
            rd.fatalities += day.fatalities;
            dayIndex++;
        }
        index++;
    }

    store.commit('regions/create', r);
    parent.merged = true;
};

export default {
    selectParentAsMerged
}