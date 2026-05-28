// HyCoffee – Bean Sample Data
// Pre-filled product sheets for existing beans. New beans get added at runtime.

const DEFAULT_BEANS = [
    {
        id: 'ambe-anaerobic',
        name: 'Ambe Anaerobic',
        species: 'Arabica',
        country: 'Uganda',
        score: '—',
        process: '36h Anaerobic',
        variety: 'SL14/Bourbon',
        harvest: '2025/2026',
        region: 'West Nile, Uganda',
        altitude: '1.480 m',
        flavour: 'Fizzy, Pfirsichschnaps, leicht kräuterig, schwarze Johannisbeere',
        intro: 'Ambe Anaerobic ist ein Specialty Arabica einer bäuerlich geführten Kooperative in Ugandas West-Nil-Region, nahe der Grenze zur Demokratischen Republik Kongo. Oft als der Pet-Nat unserer Kaffees beschrieben, durchläuft Ambe eine 36-stündige anaerobe Fermentation, bevor er auf Raised Beds natürlich getrocknet und sorgfältig handsortiert wird. Das Ergebnis ist ein unverkennbar wildes, funky Natural-Profil – weinige Aromen treffen auf regionaltypische Noten von dunklem Kakao und Steinobst.',
        climate: 'Klimaprojektionen zeigen, dass die Kaffeeproduktion in Ugandas West-Nil-Region besonders stark vom Klimawandel betroffen sein wird. Damit Kaffee eine Einkommensquelle für ländliche Haushalte bleibt, werden Landwirt:innen beim Aufbau regenerativer Anbausysteme unterstützt – für besseren Boden, höhere Wasserretention und mehr Schatten. In einer der heissesten Regionen Ugandas ist regenerative Landwirtschaft eine kritische Anpassungsstrategie und reduziert gleichzeitig die Abhängigkeit von teuren synthetischen Düngemitteln.',
        social: 'Die West-Nil-Region ist historisch stark unterinvestiert. Das Mikrostationssystem hält die Wertschöpfung bei den Bäuerinnen und Bauern – jede Station wird von einem gewählten Komitee betrieben. Die Landwirt:innen verkaufen ihre Kirschen zwei Drittel über dem Living-Income-Referenzpreis für Ugandan Arabica. So entstehen stabile, bezahlte Arbeitsplätze in ländlichen Dörfern, in denen Erwerbsmöglichkeiten rar sind.'
    },
    {
        id: 'amizi-rock',
        name: 'Amizi Rock',
        species: 'Arabica',
        country: 'Uganda',
        score: '—',
        process: 'Fully Washed',
        variety: 'SL14/Bourbon',
        harvest: '2025/2026',
        region: 'West Nile, Uganda',
        altitude: '1.495 m',
        flavour: 'kräftig, nussig, Lakritze, Limette, Zuckersirup',
        intro: 'Amizi Rock – benannt nach einem markanten Felsen neben der Mikrostation – ist ein Specialty Arabica aus Ugandas West-Nil-Region. Kleinbäuerlich in regenerativen Anbausystemen nahe der Grenze zur Demokratischen Republik Kongo kultiviert, wird der Kaffee auf der Gonyobendo Mikrostation verarbeitet, einer von Bäuerinnen und Bauern geführten Station, die konsistente Qualität und lokale Wertschöpfung sichert. Die Bohnen werden auf Raised Beds getrocknet und sorgfältig handsortiert. Das Ergebnis ist eine klare, lebendige Tasse mit kräftig-nussigen Noten, Lakritze, frischer Limette und einer feinen Süsse nach Zuckersirup.',
        climate: 'Klimaprojektionen zeigen, dass die Kaffeeproduktion in Ugandas West-Nil-Region besonders stark vom Klimawandel betroffen sein wird. Damit Kaffee eine Einkommensquelle für ländliche Haushalte bleibt, werden Landwirt:innen beim Aufbau regenerativer Anbausysteme unterstützt – für besseren Boden, höhere Wasserretention und mehr Schatten. In einer der heissesten Regionen Ugandas ist regenerative Landwirtschaft eine kritische Anpassungsstrategie und reduziert gleichzeitig die Abhängigkeit von teuren synthetischen Düngemitteln.',
        social: 'Die West-Nil-Region ist historisch stark unterinvestiert. Das Mikrostationssystem hält die Wertschöpfung bei den Bäuerinnen und Bauern – jede Station wird von einem gewählten Komitee betrieben. Die Landwirt:innen verkaufen ihre Kirschen zwei Drittel über dem Living-Income-Referenzpreis für Ugandan Arabica. So entstehen stabile, bezahlte Arbeitsplätze in ländlichen Dörfern, in denen Erwerbsmöglichkeiten rar sind.'
    },
    {
        id: 'disco-3',
        name: 'Disco 3',
        species: 'Arabica',
        country: 'Uganda',
        score: '—',
        process: '72h Anaerobic',
        variety: 'SL14/Bourbon',
        harvest: '2025/2026',
        region: 'West Nile, Uganda',
        altitude: '1.400–1.600 m',
        flavour: 'Kakao, Gewürze, prickelnde Cola, Pfirsich',
        intro: 'Disco 3 ist ein Specialty Arabica aus Ugandas West-Nil-Region, gewachsen auf hochgelegenen Hängen nahe der Grenze zur Demokratischen Republik Kongo. Verarbeitet auf der Jukia Mikrostation, wo experimentelle anaerobe Fermentationen die Grenzen des Aromas verschieben, durchläuft Disco 3 eine 72-stündige anaerobe Fermentation. Anschliessend trocknen die Bohnen natürlich auf Raised Beds und werden sorgfältig handsortiert. Das Ergebnis: eine lebendige, expressive Tasse mit sprudelnder Säure und vielschichtiger Komplexität – reicher Kakao, warme Gewürznoten, prickelnde Cola und saftiger Pfirsich.',
        climate: 'Klimaprojektionen zeigen, dass die Kaffeeproduktion in Ugandas West-Nil-Region besonders stark vom Klimawandel betroffen sein wird. Damit Kaffee eine Einkommensquelle für ländliche Haushalte bleibt, werden Landwirt:innen beim Aufbau regenerativer Anbausysteme unterstützt – für besseren Boden, höhere Wasserretention und mehr Schatten. In einer der heissesten Regionen Ugandas ist regenerative Landwirtschaft eine kritische Anpassungsstrategie und reduziert gleichzeitig die Abhängigkeit von teuren synthetischen Düngemitteln.',
        social: 'Die West-Nil-Region ist historisch stark unterinvestiert. Das Mikrostationssystem hält die Wertschöpfung bei den Bäuerinnen und Bauern – jede Station wird von einem gewählten Komitee betrieben. Die Landwirt:innen verkaufen ihre Kirschen zwei Drittel über dem Living-Income-Referenzpreis für Ugandan Arabica. So entstehen stabile, bezahlte Arbeitsplätze in ländlichen Dörfern, in denen Erwerbsmöglichkeiten rar sind.'
    },
    {
        id: 'excelsa-natural',
        name: 'Excelsa Natural',
        species: 'Excelsa',
        country: 'Uganda',
        score: '—',
        process: 'Natural',
        variety: '—',
        harvest: '2025',
        region: 'Zirobwe, Uganda',
        altitude: '680–1.200 m',
        flavour: 'Joghurt/Kefir, Ahornsirup, Blutorange, Schokolade',
        intro: 'Excelsa (Coffea dewevrei) ist in Uganda beheimatet und wird traditionell in der Region Zirobwe angebaut. Gemeinsam mit der Uganda Coffee Farmers Alliance unterstützt HyCoffee Landwirt:innen dabei, Anbaupraktiken, Ernte und Verarbeitung zu verbessern und die Qualität von Excelsa so für den europäischen Markt aufzuwerten. Das erhöht Einkommen und stärkt zugleich die Klimaresilienz. Die natürliche Trocknung der Kirschen lässt Excelsas Charakter strahlen: eine Süsse, die weder an Arabica noch an Robusta erinnert – mit Noten von Kefir, Ahornsirup, heller Blutorange und weicher Schokolade. Da die Qualitätsverbesserung noch am Anfang steht, liegt das aktuelle Niveau auf Commercial – nicht Specialty. Umso spannender für klimaresiliente Blends und Dark-Roast-Profile.',
        climate: 'Excelsa gedeiht bei höheren Temperaturen und geringerer Luftfeuchtigkeit als Arabica oder Robusta und ist zudem weniger anfällig für gängige Schädlinge und Krankheiten. Im Mischanbau mit Robusta oder Arabica verringert sich das Risiko, dass ein klimatischer Schock alle Kulturen gleichzeitig trifft – die Arten unterscheiden sich in Wachstumszyklus und Erntezeit. Hinzu kommen höhere und verlässlichere Erträge, die Landwirt:innen ein stabileres Einkommen und Investitionen in Klimaanpassung ermöglichen.',
        social: 'Unser Excelsa stammt aus einem Kooperativen-Netzwerk in Zentraluganda. Gemeinsam mit den Produzent:innen verbessern wir Qualität und erproben neue, experimentelle Verarbeitungsmethoden. Wir schaffen einen direkten Marktzugang nach Europa, wo Excelsa traditionell kaum eine Rolle gespielt hat. HyCoffee zahlt Produzent:innen 200 % des Preises, den sie bislang für Excelsa erhalten haben – für höhere Einkommen, eine diversifiziertere Produktion und eine resilientere Zukunft.'
    }
];
