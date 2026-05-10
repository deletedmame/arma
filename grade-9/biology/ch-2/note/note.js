// ============================================
// UNIT 2: Characteristics and Classification of Organisms
// Based on textbook pages 19-48
// ============================================

function unit2Reply(question) {
    const q = question.toLowerCase();

    const offTopics = ['movie', 'football', 'crypto', 'celebrity', 'game'];
    if (offTopics.some(topic => q.includes(topic))) {
        return "❌ I'm your Unit 2 Biology tutor only. Ask about: characteristics of living things, taxonomy, classification, binomial nomenclature, the five kingdoms, or Ethiopian plants and animals.";
    }

    // Characteristics of living things
    if ((q.includes('characteristic') || q.includes('properties')) && (q.includes('living') || q.includes('life'))) {
        return "📖 The 9 characteristics of living things:\n1. Made of one or more cells (unicellular or multicellular)\n2. Require energy (autotrophs make their own food, heterotrophs consume others)\n3. Respond to stimuli (detect and respond to environmental changes)\n4. Grow (permanent increase in size and mass)\n5. Reproduce (produce offspring)\n6. Excrete (remove metabolic wastes)\n7. Display ordered complexity (highly organized structures)\n8. Maintain homeostasis (stable internal conditions)\n9. Possess adaptations that evolve over time";
    }

    // Taxonomy definition
    if (q.includes('taxonomy') || (q.includes('classification') && !q.includes('five kingdom'))) {
        return "🔬 Taxonomy is the science of naming, identifying, and classifying organisms. Scientists who study taxonomy are called taxonomists. Classification is the process of grouping things based on their similarities. Taxonomists consider external/internal structures, where the organism lives, and genetic makeup to reveal evolutionary relationships.";
    }

    // Aristotle
    if (q.includes('aristotle')) {
        return "🏛️ Aristotle (384-322 BC) developed the first widely accepted biological classification system. He used simple morphological characters to classify plants into trees, shrubs, and herbs. He divided animals into those with red blood and those without. However, he grouped some organisms with very little in common (e.g., birds, bats, and flying insects together because they could fly).";
    }

    // Linnaeus / Father of taxonomy
    if (q.includes('linnaeus') || q.includes('father of taxonomy') || q.includes('carolus')) {
        return "👨‍🔬 Carolus Linnaeus (1707-1778) is the Swedish botanist known as the 'Father of Taxonomy'. In 1735 he published Systema Naturae, accurately describing 7700 plant species. He introduced the taxonomic hierarchy (Kingdom, Phylum, Class, Order, Family, Genus, Species) and popularized the binomial system of naming organisms (genus + specific epithet).";
    }

    // Taxonomic hierarchy
    if (q.includes('hierarchy') || q.includes('taxonomic levels') || (q.includes('classification') && q.includes('levels'))) {
        return "📊 Taxonomic hierarchy (from broadest to most specific):\n1. Domain (Bacteria, Archaea, Eukarya)\n2. Kingdom (Animalia, Plantae, Fungi, Protista, Monera)\n3. Phylum (Division for plants)\n4. Class\n5. Order\n6. Family\n7. Genus\n8. Species\n\nMemory trick: 'Dear King Philip Came Over For Good Soup'";
    }

    // Binomial nomenclature
    if (q.includes('binomial') || q.includes('scientific name') || q.includes('naming')) {
        return "📝 Binomial nomenclature is the two-name system introduced by Linnaeus:\n• First name = genus (capitalized)\n• Second name = specific epithet (lowercase)\n• Scientific names are italicized when printed or underlined when handwritten\n\nExamples:\n• Humans: Homo sapiens\n• Maize: Zea mays\n• Enset: Ensete ventricosum\n• Lion: Panthera leo\n• Tef: Eragrostis tef";
    }

    // Five kingdoms
    if (q.includes('five kingdom') || (q.includes('whittaker'))) {
        return "🌍 Whittaker (1969) proposed the five-kingdom classification system based on cell structure, body organization, mode of nutrition, reproduction, and phylogenetic relationships:\n\n1. MONERA - Prokaryotic, unicellular, no nucleus (bacteria, archaea)\n2. PROTISTA - Eukaryotic, mostly unicellular, diverse (amoeba, paramecium, algae)\n3. FUNGI - Eukaryotic, heterotrophic, chitin cell walls (mushrooms, yeast, mold)\n4. PLANTAE - Eukaryotic, autotrophic, cellulose cell walls\n5. ANIMALIA - Eukaryotic, heterotrophic, no cell walls";
    }

    // Kingdom Monera
    if (q.includes('monera')) {
        return "🦠 Kingdom Monera includes eubacteria and archaebacteria:\n\nEubacteria (true bacteria):\n• Have strong cell walls\n• Exist in various shapes and forms\n• Some are heterotrophs, some autotrophs (photosynthetic or chemosynthetic)\n• Live in most habitats\n• Examples: E. coli, Streptococcus, Mycobacterium tuberculosis\n\nArchaebacteria (Archaea):\n• Have very different cell walls than bacteria\n• Live in extreme environments (swamps, deep-ocean hot vents, evaporating ponds)\n• Often live without oxygen\n• Chemosynthetic or photosynthetic";
    }

    // Kingdom Protista
    if (q.includes('protista')) {
        return "🔬 Kingdom Protista contains the most diverse organisms:\n\n• All are eukaryotes (have membrane-bound organelles)\n• Some are unicellular, some multicellular\n• Some are microscopic, some very large\n• Some make their own food (autotrophs/algae), some cannot (heterotrophs/protozoans)\n\nExamples:\n• Protozoans (animal-like): Amoeba, Paramecium, Plasmodium (causes malaria)\n• Algae (plant-like): Diatoms, Euglena, Seaweed\n• Unicellular algae are the basis of aquatic food chains and produce much of Earth's oxygen";
    }

    // Kingdom Fungi
    if (q.includes('fungi') || q.includes('fungus')) {
        return "🍄 Kingdom Fungi characteristics:\n\n• Eukaryotic organisms\n• Heterotrophic (cannot make their own food)\n• Have cell walls made of chitin and polysaccharides\n• Bodies consist of long, slender thread-like structures called hyphae (network called mycelium)\n• Use extracellular digestion - secrete enzymes to break down food, then absorb nutrients\n\nTypes:\n• Saprophytes (decomposers) - break down dead organic matter\n• Parasitic fungi - absorb from living hosts (Candida, athlete's foot)\n• Mutualistic fungi - benefit host (lichens, mycorrhiza)\n\nExamples: Yeast (Saccharomyces - makes injera rise and alcohol), Mushrooms, Molds (Penicillium), Mucor";
    }

    // Kingdom Plantae
    if (q.includes('plantae') || (q.includes('plants') && !q.includes('animals'))) {
        return "🌱 Kingdom Plantae characteristics:\n\n• Eukaryotic, multicellular, autotrophic organisms\n• Make own food through photosynthesis (have chloroplasts with chlorophyll)\n• Stationary (do not move from place to place)\n• Cells contain rigid cell wall made of cellulose\n• Reproduce asexually (vegetative propagation) or sexually\n\nMajor divisions:\n• Bryophytes (mosses) - no vascular tissue, seedless\n• Pteridophytes (ferns) - vascular tissue, seedless\n• Gymnosperms - vascular tissue, 'naked' seeds (conifers, pines, spruce)\n• Angiosperms - vascular tissue, seeds in flowers/fruits (monocots and dicots)";
    }

    // Kingdom Animalia
    if (q.includes('animalia') || (q.includes('animals') && !q.includes('plants'))) {
        return "🐘 Kingdom Animalia characteristics:\n\n• Eukaryotic, multicellular, heterotrophic organisms\n• No cell walls\n• Have muscle cells and nerve cells\n• Most reproduce sexually\n\nInvertebrates (no backbone):\n• Sponges, Flatworms (Platyhelminthes), Roundworms (Nematoda)\n• Annelids (segmented worms - earthworms)\n• Mollusks (snails, clams, octopus)\n• Arthropods (insects, arachnids, crustaceans, myriapods)\n\nVertebrates (have backbone):\n• Fish, Amphibians (frogs, salamanders)\n• Reptiles (snakes, lizards, turtles)\n• Birds (Aves)\n• Mammals (Mammalia)";
    }

    // Viruses
    if (q.includes('virus') || q.includes('viruses')) {
        return "⚠️ Viruses are NOT included in any kingdom - they are not considered living organisms because they lack key characteristics of living things:\n\n• Viruses don't grow, develop, or carry out respiration\n• They are particles made of nucleic acids (DNA or RNA) surrounded by a protein coat\n• They are smaller than the smallest bacterium\n• They need a living host cell to replicate\n• The cell in which a virus replicates is called the host cell";
    }

    // Ethiopian endemic species
    if ((q.includes('ethiopia') || q.includes('ethiopian')) && (q.includes('animal') || q.includes('plant'))) {
        return "🇪🇹 Ethiopian endemic species:\n\nAnimals:\n• Ethiopian Wolf (Canis simensis) - endemic\n• Gelada Baboon (Theropithecus gelada) - endemic\n• Walia Ibex (Capra walie) - endemic\n• Mountain Nyala (Tragelaphus buxtoni) - endemic\n• Wattled Ibis (Bostrychia carunculata) - endemic\n\nPlants:\n• Tef (Eragrostis tef) - primary center of diversity\n• Noug (Guizotia abyssinica) - primary center of diversity\n• Ethiopian Mustard (Brassica carinata)\n• Enset/False Banana (Ensete ventricosum)\n• Coffee (Coffea arabica) - originated in Ethiopia";
    }

    // Dichotomous key
    if (q.includes('dichotomous') || q.includes('identification key')) {
        return "🔑 A dichotomous key is used to identify unfamiliar organisms. 'Dichotomous' means two branches - each step gives two choices between contrasting features. The key starts with general characteristics and progresses to more specific ones. By following the key and making appropriate choices, you can identify the organism correctly.";
    }

    // Ethiopian taxonomists
    if (q.includes('taxonomist') && q.includes('ethiopia')) {
        return "👨‍🔬 Renowned Ethiopian Taxonomists:\n\n• Dr. Mesfin Tadesse - contributed to Flora of Ethiopia\n• Professor Sebsebe Demissew - published books on vegetation and plants of Ethiopia; served as director of Flora of Ethiopia and Gulelle Botanical Garden\n• Professor Ensermu Kelbessa - plant taxonomy contributions\n• Professor Silesh Nemomissa - plant taxonomy\n• Professor Abebe Getahun - animal taxonomy (zoology)";
    }

    // Importance of classification
    if (q.includes('relevance') || q.includes('importance of classification')) {
        return "📊 Relevance of Classification:\n\n• Provides framework to study relationships between living and extinct organisms\n• Useful for agriculture, forestry, and medicine\n• Helps discover new sources of lumber, foods, medicines, and energy\n• Helps identify closely related species that may contain useful substances\n• Example: If one tree species has disinfectant chemicals, a closely related species might have the same useful substances";
    }

    return "📘 I specialize in Unit 2: Classification. Try asking:\n• 'What are the characteristics of living things?'\n• 'What is taxonomy and who is the father of taxonomy?'\n• 'What are the taxonomic hierarchies?'\n• 'What is binomial nomenclature?'\n• 'What are the five kingdoms?'\n• 'What are Ethiopian endemic species?'\n• 'What is a dichotomous key?'";
}