// ============================================
// UNIT 6: Ecology
// Based on textbook pages 142-165
// ============================================

function unit6Reply(question) {
    const q = question.toLowerCase();
    
    const offTopics = ['movie', 'football', 'crypto', 'celebrity', 'game'];
    if (offTopics.some(topic => q.includes(topic))) {
        return "❌ I'm your Unit 6 Biology tutor only. Ask about: ecology definition, biotic/abiotic factors, ecological levels, ecosystems, biomes, ecological succession, or species interactions (competition, predation, mutualism, etc.).";
    }
    
    // Ecology definition
    if ((q.includes('what is ecology') || q.includes('define ecology')) && !q.includes('level')) {
        return "🌿 Ecology is the study of relationships of organisms to one another and to their environment.\n\n• Ecologist: scientist who studies ecology\n• Natural history is the study of plants and animals, where they live, what they eat, and what eats them\n• Ecology developed from natural history\n• Ecologists use both qualitative (observing) and quantitative (measurements, experiments) research";
    }
    
    // Abiotic factors
    if (q.includes('abiotic')) {
        return "☀️ Abiotic factors are non-living components of the ecosystem that influence the distribution of organisms.\n\nExamples:\n• Energy/Sunlight - powers most ecosystems via photosynthesis; limited in aquatic environments below certain depths\n• Temperature - affects metabolism; most organisms function best within specific temperature ranges (0°C to 45°C)\n• Water - essential for all life; terrestrial organisms face drying out (have watertight coverings like scales, waxy coatings)\n• Nutrients - nitrogen and phosphorus compounds needed for growth; obtained from soil\n• Oxygen - critical for aquatic organisms; cold, fast-moving water has higher oxygen\n• Wind - increases water loss by evaporation on land\n• Salinity (saltiness) - important in aquatic ecosystems\n• pH, soil structure, currents, tides, storms, fire";
    }
    
    // Biotic factors
    if (q.includes('biotic')) {
        return "🐾 Biotic factors are living components of the ecosystem that influence the distribution of organisms.\n\nExamples:\n• Predators - organisms that kill and eat other organisms (prey)\n• Herbivores - organisms that eat plants or algae\n• Parasites - organisms that live on/in host, harming it\n• Pathogens - disease-causing organisms\n• Competitors - organisms competing for same resources\n• Pollinators - organisms that help plants reproduce\n• Decomposers - organisms that break down dead matter\n• Food resources - availability of prey or food sources";
    }
    
    // Ecological levels
    if (q.includes('ecological levels') || q.includes('levels of organization') || q.includes('population') && q.includes('community')) {
        return "📊 Ecological Levels (from smallest to largest):\n\n1. ORGANISM - individual living thing\n2. POPULATION - group of same species living in same area at same time\n3. COMMUNITY - different populations (species) living together in an area\n4. ECOSYSTEM - community + abiotic factors (air, water, soil, light)\n5. BIOME - large area with similar climate and communities\n6. BIOSPHERE - all ecosystems on Earth\n\nA population may compete for food, water, mates. A biological community includes interactions like predation, parasitism, herbivory, competition, and pollination.";
    }
    
    // Ecosystem
    if (q.includes('ecosystem') && !q.includes('biome')) {
        return "🌍 An ecosystem is a community of organisms in a habitat, plus the non-living part of the environment (air, water, soil, light).\n\n• An ecosystem is SELF-SUPPORTING\n• Example: Lake ecosystem - plant and animal communities + water, minerals, dissolved oxygen, soil, sunlight\n• Plants absorb light and rainwater for photosynthesis\n• Animals feed on plants and each other\n• Dead remains decomposed by fungi and bacteria return nutrients to soil\n• The biosphere (Earth's surface containing living organisms) is one vast ecosystem\n\nTypes:\n• Terrestrial ecosystems (land-based): forests, fields, rotting logs\n• Aquatic ecosystems: freshwater (ponds, lakes, streams) and marine (oceans)";
    }
    
    // Biomes - general
    if (q.includes('biome') && !q.includes('tropical') && !q.includes('desert') && !q.includes('savanna') && !q.includes('grassland') && !q.includes('forest') && !q.includes('tundra')) {
        return "🌎 A biome is a major terrestrial or aquatic life zone characterized by vegetation type (in terrestrial biomes) and physical environment (in aquatic biomes).\n\nTerrestrial Biomes (land-based):\n• Tropical Rain Forest, Savanna, Desert, Temperate Grassland, Temperate Broadleaf Forest, Boreal Forest (Taiga), Tundra\n\nAquatic Biomes (water-based, 75% of Earth's surface):\n• Freshwater (<1% salt): lakes, streams, rivers, wetlands\n• Marine (~3% salt): oceans, intertidal zones, coral reefs, estuaries";
    }
    
    // Tropical Rainforest
    if (q.includes('tropical rain') || (q.includes('rainforest') && !q.includes('temperate'))) {
        return "🌴 Tropical Rain Forest:\n\nLocation: between 10° north and south of equator (equatorial Africa, East Indies, Southeast Asia, South America, Central America)\n\nClimate:\n• Rainfall: 130-200 cm/year (throughout the year)\n• Temperature: average 25°C (77°F)\n• Little variation in day length\n\nCharacteristics:\n• Evergreen broad-leaf trees\n• Vertical layering of plants\n• Intense competition for light\n• HIGHEST animal diversity of any terrestrial biome\n• Animals: amphibians, birds, reptiles, mammals, arthropods\n\nThreats: Deforestation for lumber, fuel, and agriculture";
    }
    
    // Savanna
    if (q.includes('savanna')) {
        return "🦒 Savanna:\n\nLocation: equatorial and sub-equatorial regions (Africa, India, Australia) - between tropical forests and hot deserts\n\nClimate:\n• Rainfall: 30-50 cm/year\n• Dry season: up to 8-9 months\n• Temperature: 24-29°C year-round\n\nCharacteristics:\n• Scattered trees at different densities\n• Fires common in dry season\n• Grasses and small non-woody plants dominate\n• Plants are fire-adapted and drought-tolerant\n\nAnimals:\n• Herbivores: giraffes, zebras, elephants, antelopes, wildebeests\n• Carnivores: lions, hyenas\n\nThreats: Cattle ranching, over-hunting";
    }
    
    // Desert
    if (q.includes('desert')) {
        return "🏜️ Desert:\n\nLocation: about 30° north and south latitude (Chile's Atacama Desert, China's Gobi Desert)\n\nClimate:\n• Rainfall: <10 cm/year (covers 1/5 of Earth's land surface)\n• Hot deserts: max temperature >50°C\n• Cold deserts: temperature below -30°C\n• Low humidity (little water vapor to block sun's rays)\n• Intense sunlight heats ground during day; rapid cooling at night\n\nPlants:\n• Succulents (cacti, euphorbs)\n• Deeply rooted shrubs\n• Herbs that grow during moist periods\n• Adaptations: heat tolerance, water storage, reduced leaf surface area\n\nAnimals:\n• Snakes, lizards, scorpions, ants, beetles\n• Migratory and resident birds\n• Seed-eating rodents\n• Many are nocturnal\n• Water conservation adaptations";
    }
    
    // Temperate Grassland
    if (q.includes('temperate grassland') || q.includes('prairie')) {
        return "🌾 Temperate Grassland:\n\nLocation: North America (prairies)\n\nClimate:\n• Rainfall: 25-100 cm/year (rains throughout year)\n• Warm summers, cold winters\n\nCharacteristics:\n• Grass roots extend through thick topsoil, preventing erosion\n• Shortgrass prairie (drier) and tallgrass prairie (more rainfall)\n• Nearly all tallgrass prairie converted to cropland\n\nAnimals (formerly): elk, pronghorn antelope, bison, wolves\n\nThreats: Conversion to agriculture, loss of predators and prey";
    }
    
    // Boreal Forest / Taiga
    if (q.includes('boreal') || q.includes('taiga') || q.includes('coniferous')) {
        return "🌲 Boreal Forest (Taiga/Coniferous Forest):\n\nLocation: south of Arctic Circle (Canada, Alaska, Russia, northern Europe)\n\nClimate:\n• Rainfall: 40-100 cm (mostly snow)\n• Cold, dry winters\n• Short, cool, wet summers\n• Little evaporation due to cold\n\nCharacteristics:\n• Cold-tolerant cone-bearing (coniferous) plants\n• Evergreen coniferous trees (pines, spruce) - retain needle-shaped leaves year-round\n• Evergreens grow faster than deciduous trees in this biome\n• Soils are acidic with little available nitrogen\n• Low plant species diversity";
    }
    
    // Temperate Broadleaf Forest
    if (q.includes('temperate broadleaf') || q.includes('deciduous')) {
        return "🍂 Temperate Broadleaf Forest (Deciduous Forest):\n\nLocation: mid-latitudes in Northern Hemisphere (also Chile, South Africa, Australia, New Zealand)\n\nClimate:\n• Rainfall: 70-200+ cm annually\n• Winter: average 0°C\n• Summer: up to 35°C, hot and humid\n\nCharacteristics:\n• Dominant plants: deciduous trees (drop leaves before winter)\n• Many mammals hibernate in winter\n• Many bird species migrate to warmer climates\n\nHuman impact: Heavily settled; logging and land clearing removed virtually all original forests in North America; forests are returning due to recovery capacity";
    }
    
    // Tundra
    if (q.includes('tundra')) {
        return "❄️ Tundra:\n\nLocation: Arctic (20% of Earth's land surface) and alpine (high mountaintops)\n\nClimate:\n• Arctic tundra: 20-60 cm precipitation/year\n• Alpine tundra: >100 cm precipitation/year\n• Winter: below -30°C\n• Summer: <10°C\n• High winds\n\nCharacteristics:\n• Vegetation: herbaceous (mosses, grasses, forbs, dwarf shrubs, trees, lichens)\n• Permafrost: permanently frozen layer of soil that restricts plant root growth\n\nAnimals:\n• Grazers: musk oxen (resident), caribou, reindeer (migratory)\n• Predators: bears, wolves, foxes\n• Many bird species migrate to tundra for summer nesting\n\nHuman impact: mineral and oil extraction";
    }
    
    // Aquatic biomes
    if (q.includes('aquatic biome') || q.includes('freshwater') || q.includes('lake') || q.includes('wetland') || q.includes('estuary')) {
        return "💧 Aquatic biomes occupy roughly 75% of Earth's surface.\n\nFreshwater biomes (salt concentration <1%):\n• Lakes and ponds - standing water; rooted/floating aquatic plants near shore; phytoplankton (cyanobacteria, zooplankton) in open water; fish in all zones with sufficient oxygen\n• Wetlands - soil permanently or periodically saturated with water; marshes, swamps, bogs, mudflats, salt marshes; high capacity to filter nutrients and pollutants; among most productive biomes\n• Streams and rivers - flowing water; headwaters cold, clear, swift, turbulent; downstream warmer, more turbid; dams and flood control threaten ecosystems\n\nMarine biomes (salt concentration ~3%):\n• Estuaries - transition area between river and sea; salinity varies; nutrients make estuaries among most productive biomes; support worms, oysters, crabs, fish; crucial breeding grounds and feeding areas";
    }
    
    // Ecological succession
    if (q.includes('succession') || q.includes('primary succession') || q.includes('secondary succession') || q.includes('climax community')) {
        return "🔄 Ecological succession is the process of change in species composition of a community after a disturbance.\n\nPRIMARY SUCCESSION:\n• Begins in virtually LIFELESS area (new volcanic island, glacier retreat, bare rock)\n• First colonizers: prokaryotes, protists, lichens, mosses (pioneer species from windblown spores)\n• Soil develops gradually from weathering rock and organic matter from decomposing colonizers\n• Grasses, shrubs, trees follow\n• Eventually reaches CLIMAX COMMUNITY (stable, little change)\n• Takes hundreds or thousands of years\n\nSECONDARY SUCCESSION:\n• Re-colonization after disturbance that removes MOST but NOT ALL organisms (fire, flood, farming, logging)\n• Area may return to something like original state\n• Example: abandoned farmland → herbaceous plants → woody shrubs → forest trees";
    }
    
    // Species interactions
    if (q.includes('competition') || q.includes('predation') || q.includes('parasitism') || q.includes('mutualism') || q.includes('commensalism') || q.includes('herbivory')) {
        return "🤝 Inter-specific interactions:\n\n1. COMPETITION (-/-) - Both species harmed. Individuals of different/same species use a resource that limits survival/reproduction of both. Example: weeds competing with garden plants for nutrients and water.\n\n2. PREDATION (+/-) - One species (predator) kills and eats another (prey). Adaptations refined through natural selection. Example: lion eating zebra, rotifer eating protist.\n\n3. HERBIVORY (+/-) - Organism eats parts of a plant or alga, harming it but usually not killing it. Examples: cattle, sheep, grasshoppers, caterpillars, beetles.\n\n4. PARASITISM (+/-) - Parasite derives nourishment from host, which is harmed. Endoparasites (live inside - roundworms), ectoparasites (feed on external surface - ticks). Example: blood fluke (humans and freshwater snails).\n\n5. MUTUALISM (+/+) - Both species benefit. Examples: cellulose digestion by microorganisms in termites/ruminants, pollination, seed dispersal, mycorrhizae (fungi + plant roots), algae in corals.\n\n6. COMMENSALISM (+/0) - One benefits, other neither harmed nor helped. Example: cattle egrets following grazing animals to eat insects flushed out of grass.";
    }
    
    return "📘 I specialize in Unit 6: Ecology. Try asking:\n• 'What is ecology and what do ecologists study?'\n• 'What are abiotic and biotic factors?'\n• 'What are the ecological levels from organism to biosphere?'\n• 'What are the different biomes (tropical rainforest, savanna, desert, grassland, taiga, tundra)?'\n• 'What is the difference between primary and secondary succession?'\n• 'What are the types of species interactions (competition, predation, mutualism, etc.)?'";
}