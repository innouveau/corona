const chapters = [
    {
        id: 1,
        title: "A little bit overwhelmed by all the possible settings?",
        description: "<p>Just follow this quick guide.</p><p>First let's pick some countries. For this guide we'll use Belgium and UK.</p>",
        actionLabel() {
            return 'Pick Belgium and UK';
        },
        action(store) {
            let countriesToDelete, countries;
            countriesToDelete = store.state.countries.all.filter(c => c.active);
            for (let country of countriesToDelete) {
                store.commit('countries/updatePropertyOfItem', {item: country, property: 'active', value: false})
            }
            countries =  [
                {
                    title: 'Belgium',
                    color: 'red'
                }, {
                    title: 'United Kingdom',
                    color: 'blue'
                }];
            for (let country of countries) {
                let item = store.getters['countries/getItemByProperty']('title', country.title);
                if (item) {
                    store.commit('countries/updatePropertyOfItem', {
                        item,
                        property: 'active',
                        value: true
                    });
                    store.commit('countries/updatePropertyOfItem', {
                        item,
                        property: 'color',
                        value: country.color
                    });
                }
            }
            store.commit('settings/updateProperty', {key: 'mappingType', value: 'date'});
            store.commit('settings/updateProperty', {key: 'mappingDate', value: new Date('2020-02-15')});
            store.commit('settings/updateProperty', {key: 'mappingMaxDays', value: 100});
            store.commit('settings/updateProperty', {key: 'perCapita', value: false});
            store.commit('settings/updateProperty', {key: 'logScale', value: false});
        }
    }, {
        id: 2,
        title: "How to compare the countries?",
        description: `<p>So how do we want to compare those countries? 
            We could place them on a regular timeline to see when Corona 
            arrived in the country and how fast it spread around. This is the current setting.
            You'll see that Belgium was confronted by the virus about a week before the UK was.
            </p>
            <p>But what if we want to make a comparison on how adequate the countries reacted? 
            We could then pick the first case for each country as the starting point.
            </p>
            `,
        actionLabel() {
            return 'Pick first case';
        },
        action(store) {
            store.commit('settings/updateProperty', {key: 'mappingType', value: 'cases'});
            store.commit('settings/updateProperty', {key: 'mappingStartNumber', value: 1});
        }
    }, {
        id: 3,
        title: "But is that a solid comparison?",
        description: `<p>You'll see that the week 'head start' that Belgium had, 
            is now out of the equitian. But for each choice  you make here, there are arguments against.</p>
            <p>Maybe it is better to look at fatalities (deaths), because countries have different
            policies concerning testing.</p><p>And the comparison becomes more reliable if we map the
            two graphs at a bigger number</p>.
            `,
        actionLabel() {
            return 'Map the graphs on the 100th fatality';
        },
        action(store) {
            store.commit('settings/updateProperty', {key: 'mappingType', value: 'fatalities'});
            store.commit('settings/updateProperty', {key: 'mappingStartNumber', value: 100});
        }
    }, {
        id: 4,
        title: "This looks interesting",
        description: `<p>Can we say now that the UK handled it really bad, compared to Belgium?</p>
            <p>But wait, the UK has much more inhabitants. Maybe it is fair to recalculate the numbers
            based on the country population.</p>
            `,
        actionLabel() {
            return 'See the graphs based on country population';
        },
        action(store) {
            store.commit('settings/updateProperty', {key: 'perCapita', value: true});
        }
    }, {
        id: 5,
        title: "Now its reversed",
        description: `<p>Now it is Belgium that looks bad... Anyway, we don't want to draw conclusions here. 
            Just give you the tools to look at the use cases from different perspectives.</p>
            <p>Another intersting point is the deflecting of the 2 curves. Belgiums deflection looks
            stronger than Uks. They both had a lockdown, apparently the effects differed.</p>
            `,
        actionLabel() {
            return 'Lets use the lockdown as startingpoint';
        },
        action(store) {
            store.commit('settings/updateProperty', {key: 'mappingType', value: 'event'});
            store.commit('settings/updateProperty', {key: 'mappingEventType', value: 'lockdown'});
        }
    }, {
        id: 6,
        title: "Some conclusions?",
        description: `<p>As you look at the growth rate, you'll see that Belgium came much deeper, 
        which caused the fatalities to plummet way more.</p><p>
            The lockdown of the UK had less effect, but what the graph of Belgium is also telling:
            the effect didn't last: maybe people got tired of the lockdown and become less strict 
            in their actions?</p>
            Anyway, hopefully this little guide gives you understanding of the tools. Enjoy!
        </p>
            `,
        actionLabel() {
            return '';
        },
        action(store) {

        }
    }
];

export default chapters;