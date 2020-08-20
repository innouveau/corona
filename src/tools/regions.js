import store from '@/store/store';
import colorTool from '@/tools/color';
import loader from '@/tools/loader';
import Region from "@/classes/Region";
import Day from "@/classes/Day";

const selectRegion = function(region) {
    if (!region.dataLoaded) {
        loader.loadRegion(region).then(result => {
            store.commit('regions/updatePropertyOfItem', {item: region, property: 'active', value: true});
        })
    } else {
        store.commit('regions/updatePropertyOfItem', {item: region, property: 'active', value: true});
    }
};

const selectRegions = function(regions) {
    let regionsNotLoaded, regionsLoaded;
    regionsNotLoaded = regions.filter(region => !region.dataLoaded);
    regionsLoaded = regions.filter(region => region.dataLoaded);
    for (let region of regionsLoaded) {
        store.commit('regions/updatePropertyOfItem', {item: region, property: 'active', value: true});
    }
    loader.loadRegions(regionsNotLoaded).then(result => {
        for (let region of regionsNotLoaded) {
            store.commit('regions/updatePropertyOfItem', {item: region, property: 'active', value: true});
        }
    });
};

const selectParentAsMerged = function(parent) {
    let data, mergedRegion, regionsNotLoaded, regionIndex = 0;

    data = {
        id: store.state.regions.all.length + 1,
        title: parent.title,
        color: colorTool.getRandom(),
        population: 0,
        entries: []
    };
    mergedRegion = new Region(data);
    mergedRegion.active = true;
    regionIndex = 0;

    regionsNotLoaded = parent.regions.filter(region => !region.dataLoaded);

    loader.loadRegions(regionsNotLoaded).then(result => {
        for (let region of parent.regions) {
            console.log(region);
            //console.log('merging ' + region.title + ' has length ' + region.entries.length);

            mergedRegion.population += region.population;
            let dayIndex = 0;
            for (let day of region.entries) {
                let mergedRegionDay;
                if (regionIndex === 0) {
                    let d = new Day({
                        index: mergedRegion.entries.length,
                        cases: 0,
                        fatalities: 0,
                        date: day.date
                    }, mergedRegion);
                    mergedRegion.entries.push(d);

                }
                mergedRegionDay = mergedRegion.entries[dayIndex];
                mergedRegionDay.cases += day.cases;
                mergedRegionDay.fatalities += day.fatalities;
                dayIndex++;
            }
            regionIndex++;
        }


        store.commit('regions/create', mergedRegion);
        store.commit('regions/updatePropertyOfItem', {item: mergedRegion, property: 'dataLoaded', value: true});
        parent.merged = true;
    });
};

export default {
    selectParentAsMerged,
    selectRegions,
    selectRegion
}