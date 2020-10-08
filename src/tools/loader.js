import * as d3 from "d3";
import store from '@/store/store';
import Day from '@/classes/Day';


const regionNameIndex = 'Land/regio';

const getTimestamp = function() {
    return '?time=' + new Date().getTime();
};

const getRow = function(rows, region) {
    return rows.find(row => row[regionNameIndex] === region.title);
};

const loadRegion = function(region) {
    return new Promise((resolve, reject) => {
        Promise.all([
            d3.csv(window.config.repo + 'cases.csv' + getTimestamp()),
            d3.csv(window.config.repo + 'fatalities.csv' + getTimestamp()),
        ]).then((files) => {
            addEntries(getRow(files[0], region), getRow(files[1], region), region);
            resolve();
        }).catch((err) => {
            console.log(err);
        })
    });
};

const loadRegions = function(regions) {
    return new Promise((resolve, reject) => {
        Promise.all([
            d3.csv(window.config.repo + 'cases.csv' + getTimestamp()),
            d3.csv(window.config.repo + 'fatalities.csv' + getTimestamp()),
        ]).then((files) => {
            for (let region of regions) {
                addEntries(getRow(files[0], region), getRow(files[1], region), region);
            }
            resolve();
        }).catch((err) => {
            console.log(err);
        })
    });
};

const addEntries = function(cases, fatalities, region) {
    let entries = [];

    for (let date in cases) {
        if (date !== regionNameIndex && date !== '') {
            let entry, casesForDate, fatalitiesForDate;
            casesForDate = cases[date] !== '' ? Number(cases[date]) : 0;

            if (fatalities.hasOwnProperty(date)) {
                fatalitiesForDate = fatalities[date] !== '' ? Number(fatalities[date]) : 0;
            } else {
                fatalitiesForDate = 0;
            }

            entry = {
                index: entries.length,
                date: date,
                cases: casesForDate,
                fatalities: fatalitiesForDate
            };
            entries.push(
                new Day(entry, region)
            )
        }
    }
    store.commit('regions/addEntries', {region, entries});
    store.commit('regions/updatePropertyOfItem', {item: region, property: 'dataLoaded', value: true});
};


export default {
    loadRegion,
    loadRegions,
    getTimestamp
}