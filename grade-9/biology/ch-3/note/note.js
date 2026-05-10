// ============================================
// UNIT 3: Cells
// Based on textbook pages 49-78
// ============================================

function unit3Reply(question) {
    const q = question.toLowerCase();

    const offTopics = ['movie', 'football', 'crypto', 'celebrity', 'game'];
    if (offTopics.some(topic => q.includes(topic))) {
        return "❌ I'm your Unit 3 Biology tutor only. Ask about: cell theory, cell structure, organelles, prokaryotic vs eukaryotic cells, plant vs animal cells, diffusion, osmosis, active transport, or levels of biological organization.";
    }

    // What is a cell
    if (q.includes('what is a cell') || (q.includes('cell') && q.includes('definition'))) {
        return "🔬 A cell is the smallest and basic unit of living things. All living things are composed of cells.\n\n• Unicellular organisms: consist of a single cell (e.g., Paramecium, bacteria)\n• Multicellular organisms: consist of many cells (e.g., plants, animals, humans)\n\nInteresting fact: An ostrich egg is a single cell about 6 inches in diameter! Nerve cells can stretch several feet long.";
    }

    // Cell theory
    if (q.includes('cell theory')) {
        return "🧬 The Cell Theory states:\n\n1. Living organisms are composed of one or more cells\n2. Cells are the smallest unit of life\n3. Cells arise only by division of pre-existing cells\n\nHistory:\n• Robert Hooke (1665) - first to observe cells (cork cells), named them 'cells'\n• Anton van Leeuwenhoek (1674) - first to observe protozoa and bacteria, 'Father of Microbiology'\n• Matthias Schleiden (1838) - concluded all plants are made of cells\n• Theodor Schwann (1839) - concluded all animals are made of cells\n• Rudolf Virchow (1856) - cells arise only from pre-existing cells";
    }

    // Cell organelles
    if (q.includes('organelle') || (q.includes('cell structure') && !q.includes('membrane'))) {
        return "🧫 Cell Organelles and their functions:\n\n• Nucleus - largest organelle, contains DNA, controls cell activities and division\n• Cell membrane - selectively permeable, controls what enters/leaves cell\n• Cytoplasm - thick fluid containing organelles, site of chemical reactions\n• Ribosomes - synthesize proteins\n• Rough ER - has ribosomes, makes and stores proteins\n• Smooth ER - no ribosomes, manufactures lipids\n• Golgi apparatus - packages and distributes molecules\n• Mitochondria - 'powerhouse', site of respiration, produces energy (ATP)\n• Lysosomes - contain digestive enzymes, digest bacteria and damaged organelles\n• Vacuoles - store water, food, waste (large in plants, small in animals)\n• Chloroplasts (plants only) - site of photosynthesis, contain chlorophyll\n• Centrioles (animals only) - anchor microtubules during cell division\n• Cilia and Flagella - locomotion (cilia short/numerous, flagella long/few)";
    }

    // Prokaryotic vs Eukaryotic
    if ((q.includes('prokaryotic') && q.includes('eukaryotic')) || (q.includes('difference') && (q.includes('prokaryote') || q.includes('eukaryote')))) {
        return "🔬 Prokaryotic vs Eukaryotic Cells:\n\nProkaryotic Cells:\n• No nucleus or membrane-bound organelles\n• Generally smaller (1-10 μm)\n• Unicellular\n• DNA not associated with proteins\n• Examples: Bacteria, Archaea\n\nEukaryotic Cells:\n• Have nucleus and membrane-bound organelles\n• Generally larger (10-100 μm)\n• Usually multicellular\n• DNA arranged in long strands associated with proteins\n• Examples: Plants, Animals, Fungi, Protists";
    }

    // Plant vs Animal cells
    if ((q.includes('plant') && q.includes('animal')) && (q.includes('difference') || q.includes('compare'))) {
        return "🌱 Plant Cell vs 🐾 Animal Cell:\n\nPlant Cells have:\n• Cell wall (made of cellulose) - provides support and shape\n• Chloroplasts - for photosynthesis\n• Large central vacuole - stores water, maintains pressure\n• Fixed/rectangular shape\n\nAnimal Cells have:\n• No cell wall\n• No chloroplasts\n• Small vacuoles\n• Centrioles - for cell division\n• Irregular/round shape\n\nBoth have: nucleus, cell membrane, cytoplasm, mitochondria, ribosomes, ER, Golgi apparatus";
    }

    // Nucleus
    if (q.includes('nucleus')) {
        return "🧬 The nucleus is the largest organelle surrounded by a double membrane.\n\n• Contains chromosomes (thread-like structures) made of DNA\n• DNA determines what the cell will be (blood cell, liver cell, muscle cell, nerve cell)\n• Controls cell division\n• Contains a darker area called the nucleolus - site where new ribosomes are made\n\nInteresting: Mature red blood cells and sieve tube elements of phloem have NO nucleus. Muscle fibers are multinucleate.";
    }

    // Mitochondria
    if (q.includes('mitochondria')) {
        return "⚡ Mitochondria are often described as the 'powerhouse of the cell'.\n\n• Relatively large organelles\n• Have double membrane\n• Inner membrane forms many folds (cristae)\n• Site of chemical reactions of respiration\n• Site of ATP (energy) synthesis\n• Metabolically active cells (like muscle cells) contain thousands of mitochondria";
    }

    // Chloroplasts
    if (q.includes('chloroplast')) {
        return "🌿 Chloroplasts are double membrane-bound organelles found in green plant cells, mostly in leaves.\n\n• Site of photosynthesis\n• Contain green pigment called chlorophyll\n• Chlorophyll traps sunlight energy to synthesize carbohydrates (sugar)\n• Only found in plant cells, not animal cells";
    }

    // Diffusion
    if (q.includes('diffusion')) {
        return "💨 Diffusion is the net movement of molecules or ions from a region of high concentration to a region of low concentration (down the concentration gradient).\n\n• Passive transport (no energy required)\n• Examples: Oxygen diffusing into cells for respiration, carbon dioxide diffusing out\n\nFactors affecting diffusion rate:\n• Concentration gradient (higher difference = faster diffusion)\n• Temperature (higher temperature = faster)\n• Mass of molecule (heavier = slower)\n• Distance travelled (farther = slower)\n• Surface area (larger = faster)";
    }

    // Osmosis
    if (q.includes('osmosis')) {
        return "💧 Osmosis is the diffusion of water molecules from a region of higher water concentration (dilute solution) to a region of lower water concentration (concentrated solution) across a selectively permeable membrane.\n\nSolution types:\n• Hypotonic - lower solute concentration, water enters cell (cell swells)\n• Isotonic - equal solute concentration, no net water movement\n• Hypertonic - higher solute concentration, water leaves cell (cell shrinks)\n\nIn plant cells: turgor pressure keeps plants upright. In animal cells: too much water causes bursting (hemolysis), too little causes shrinking (crenation).";
    }

    // Active transport
    if (q.includes('active transport')) {
        return "⚡ Active transport is the movement of ions or molecules across the cell membrane against a concentration gradient (from low to high concentration) using energy (ATP) released during respiration.\n\nExamples:\n• Sodium-potassium pump (nerve cells)\n• Ion uptake by root hairs\n• Uptake of glucose by epithelial cells of villi (small intestine)\n\nUnlike diffusion and osmosis (passive transport), active transport REQUIRES energy.";
    }

    // Levels of organization
    if (q.includes('levels of organization') || q.includes('biological organization')) {
        return "📊 Levels of Biological Organization:\n\nAtomic level:\n• Atoms → Molecules → Organelles → CELLS (smallest living unit)\n\nCellular level:\n• Cells → Tissues (groups of similar cells with same function)\n→ Organs (groups of tissues working together)\n→ Organ Systems (groups of organs working together)\n→ Organism (complete individual)\n\nPopulation level:\n• Population (same species in same area)\n→ Community (different populations)\n→ Ecosystem (community + abiotic factors)\n→ Biosphere (all ecosystems on Earth)";
    }

    // Tissues
    if (q.includes('tissue')) {
        return "🔬 Tissues are groups of similar cells that act as a functional unit. The cells of each type have similar structure and function.\n\nExamples in animals:\n• Muscle tissue - contracts to cause movement\n• Nerve tissue - transmits electrical signals\n• Epithelial tissue - covers body surfaces\n\nExamples in plants:\n• Xylem - carries water upward\n• Phloem - carries sugars throughout plant\n• Epidermis - protective outer layer\n• Palisade tissue - photosynthesis\n• Spongy tissue - gas exchange";
    }

    // Organs
    if (q.includes('organ') && !q.includes('organelle')) {
        return "🧠 Organs are body structures composed of several different tissues that act as structural and functional units.\n\nExamples in animals:\n• Brain (nerve tissue)\n• Heart (muscle tissue)\n• Lungs, intestines, stomach, eyes\n\nThe stomach contains epithelial cells, gland cells, and muscle cells, supplied with food and oxygen by blood vessels.\n\nExamples in plants:\n• Roots, stem, leaves";
    }

    // Organ systems
    if (q.includes('organ system') || q.includes('system in human')) {
        return "🩺 Organ systems are different organs working together to perform a particular function.\n\nExamples in humans:\n• Digestive system - stomach, intestine, liver, pancreas\n• Nervous system - brain, spinal cord, nerves\n• Circulatory system - heart, blood vessels\n• Respiratory system - lungs, trachea, bronchi\n• Reproductive system\n• Muscular system\n• Skeletal system\n• Endocrine system";
    }

    return "📘 I specialize in Unit 3: Cells. Try asking:\n• 'What is cell theory?'\n• 'What are the organelles and their functions?'\n• 'What is the difference between prokaryotic and eukaryotic cells?'\n• 'How are plant and animal cells different?'\n• 'What is diffusion, osmosis, and active transport?'\n• 'What are the levels of biological organization?'";
}