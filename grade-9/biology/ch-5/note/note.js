// ============================================
// UNIT 5: Human Health, Nutrition and Diseases
// Based on textbook pages 108-141
// ============================================

function unit5Reply(question) {
    const q = question.toLowerCase();

    const offTopics = ['movie', 'football', 'crypto', 'celebrity', 'game'];
    if (offTopics.some(topic => q.includes(topic))) {
        return "❌ I'm your Unit 5 Biology tutor only. Ask about: nutrients, balanced diet, deficiency diseases, malnutrition, substance abuse (smoking, alcohol, khat, drugs), infectious diseases (HIV/AIDS, TB, malaria, COVID-19), or non-infectious diseases.";
    }

    // What is food / Nutrition
    if ((q.includes('what is food') || q.includes('nutrition')) && !q.includes('nutrient')) {
        return "🍎 Food is any beneficial substance eaten, drunk, or taken into the body to sustain life, provide energy, and promote growth.\n\nImportance of food:\n• GROWTH - provides substances for making new cells, tissues, organs\n• ENERGY - fuels all biological activities (running, moving, growing, reproducing)\n• REPLACEMENT - replaces damaged cells\n• PROTECTION - protects from deficiency diseases\n\nNutrition is the process of taking in food and converting it into energy and other vital nutrients required for life.";
    }

    // Nutrients
    if (q.includes('nutrient')) {
        return "🥗 Nutrients are important chemical substances found in foods. We need them for growth, energy, and staying healthy.\n\nMACRONUTRIENTS (needed in large amounts):\n• Carbohydrates - energy (16 kJ/g)\n• Proteins - growth, repair (17 kJ/g)\n• Lipids (Fats & Oils) - energy storage, insulation (37 kJ/g)\n\nMICRONUTRIENTS (needed in small amounts):\n• Vitamins (A, B1, B2, C, D, E, K) - organic compounds\n• Minerals (Calcium, Iron, Iodine, Phosphorus) - inorganic compounds\n• Water - major component of body fluids\n• Fiber (Roughage) - indigestible carbohydrate, prevents constipation";
    }

    // Carbohydrates
    if (q.includes('carbohydrate')) {
        return "🍞 Carbohydrates provide energy for the human body. Composed of carbon, oxygen, and hydrogen. One gram provides 16 kJ of energy.\n\nSources: Potatoes, bread, maize, rice, cereals, honey, fruits, sugar\n\nTypes:\n• Monosaccharides - simple sugars (glucose, fructose, galactose) - C6H12O6\n• Disaccharides - two simple sugars (sucrose=glucose+fructose, lactose=glucose+galactose, maltose=glucose+glucose) - C12H22O11\n• Polysaccharides - hundreds of monosaccharides (starch, cellulose, glycogen) - (C6H10O5)n\n\nFiber (Roughage): Indigestible carbohydrate (cellulose) from plant cell walls; prevents constipation, keeps colon healthy, increases bowel movement.";
    }

    // Fats / Lipids
    if (q.includes('fat') || q.includes('lipid') || q.includes('oil')) {
        return "🧈 Fats and oils are high-energy nutrients. Composed of carbon, oxygen, and hydrogen. One gram provides 37 kJ of energy (more than twice that of carbohydrates).\n\nFats: solid at room temperature, from animal sources (meat, milk, cheese, butter, egg yolk)\nOils: liquid at room temperature, from plant sources (sunflower, olive, peanut, seeds)\n\nFunctions:\n• Energy storage\n• Insulation against heat loss\n• Hormone production\n• Cell membranes\n• Absorption of fat-soluble vitamins (A, D, E, K)\n• Forms adipose (fatty) tissue under skin";
    }

    // Proteins
    if (q.includes('protein')) {
        return "🥚 Proteins provide growth and build new cells. Made of amino acids composed of carbon, hydrogen, oxygen, and nitrogen. One gram provides 17 kJ of energy.\n\nSources: Meat, fish, eggs, milk, cheese, beans, chickpeas, soy beans, nuts, groundnuts\n\nFunctions:\n• Growth of body\n• Tissue repair (replacing damaged cells)\n• Enzymes\n• Some hormones\n• Cell membranes\n• Hair and nails\n• Can be broken down to provide energy if needed";
    }

    // Vitamins
    if (q.includes('vitamin')) {
        return "💊 Vitamins are organic substances needed in small quantities for chemical reactions in human cells. If missing, vitamin-deficiency diseases develop.\n\n• Vitamin A - Sources: carrots, spinach, liver, milk; Function: vision, immune function, skin; Deficiency: Night blindness\n• Vitamin B1 (Thiamine) - Sources: grains, meat, beans; Function: energy metabolism, nerve function; Deficiency: Beriberi\n• Vitamin B2 (Riboflavin) - Sources: milk, eggs, green vegetables; Deficiency: Ariboflavinosis\n• Vitamin C - Sources: oranges, lemons, tomatoes, fresh greens; Function: tissue repair, immunity, wound healing; Deficiency: Scurvy (bleeding gums)\n• Vitamin D - Sources: sunlight, fish oil, milk, butter, egg yolk; Function: calcium absorption, bone/teeth strength; Deficiency: Rickets (soft, deformed bones)\n• Vitamin E - Sources: nuts, seeds, vegetable oils; Function: antioxidant\n• Vitamin K - Sources: leafy greens, broccoli; Function: blood clotting";
    }

    // Minerals
    if (q.includes('mineral')) {
        return "🧂 Minerals are inorganic substances essential in small quantities for the human body.\n\n• Calcium - Sources: milk, cheese, fish, green vegetables; Function: builds bones/teeth, muscle contraction, nerve impulses; Deficiency: Rickets, weak bones\n• Iron - Sources: red meat, liver, kidney, eggs, groundnuts, tef (Tikiur tef); Function: forms hemoglobin in red blood cells for oxygen transport; Deficiency: Anemia (tiredness, weakness, irritability)\n• Iodine - Sources: iodized salt, seafood; Function: thyroid gland function; Deficiency: Goiter\n• Phosphorus - Sources: milk, fish, meat, eggs; Function: builds bones/teeth; Deficiency: Weak bones";
    }

    // Balanced diet
    if (q.includes('balanced diet')) {
        return "⚖️ A balanced diet contains all nutrients in the correct amount and proportion.\n\nIt must contain:\n• Enough carbohydrates and fats for energy\n• Enough protein of the right kind for growth and repair\n• Vitamins and mineral salts for normal functioning\n• Plant fiber (roughage) for healthy digestion\n• Water for bodily functions\n\nEnergy requirements vary by:\n• Age (children need more protein and energy for growth)\n• Sex (men generally need more energy than women)\n• Activity level (athletes, manual workers need more)\n• Physiological condition (pregnant/breastfeeding women need more calcium, iron, protein)";
    }

    // Deficiency diseases
    if (q.includes('deficiency disease') || q.includes('kwashiorkor') || q.includes('marasmus') || q.includes('anemia') || q.includes('rickets') || q.includes('scurvy')) {
        return "⚠️ Deficiency Diseases:\n\n• Kwashiorkor - PROTEIN deficiency. Symptoms: swollen belly (edema), dry/flaky skin, hair changes, weakness, irritability. Common in children.\n\n• Marasmus - ENERGY (carbohydrate) deficiency. Symptoms: extreme thinness, little muscle, old-looking face, reduced fat and muscle tissue, skin hangs in folds.\n\n• Anemia - IRON deficiency. Symptoms: weakness, tiredness, irritability, less energy due to reduced hemoglobin and oxygen transport.\n\n• Rickets - VITAMIN D deficiency. Symptoms: soft, deformed bones in children (legs bow outward). Vitamin D helps absorb calcium and phosphorus for bone health.\n\n• Scurvy - VITAMIN C deficiency. Symptoms: bleeding gums, poor wound healing, bleeding under skin (especially at joints), connective tissue problems.";
    }

    // Malnutrition
    if (q.includes('malnutrition') || q.includes('obesity') || q.includes('bmi')) {
        return "📏 Malnutrition is the insufficient, excessive, or imbalanced consumption of nutrients leading to health problems.\n\nCauses: poverty, famine (drought/flood), soil erosion, wars, too little land for too many people, ignorance of nutritional requirements.\n\nUnder nutrition conditions:\n• Wasting (low weight-for-height) - indicates recent severe weight loss\n• Stunting (low height-for-age) - chronic undernutrition\n• Underweight (low weight-for-age)\n• Micronutrient deficiencies - lack of vitamins and minerals\n\nObesity: overweight caused by imbalance between energy intake and energy release. Health risks: heart disease, high blood pressure, diabetes, arthritis (worn joints).\n\nBMI (Body Mass Index) = weight(kg) / height²(m²)\n• Underweight: <18.5\n• Normal: 18.5-24.9\n• Overweight: 25-29.9\n• Obese: ≥30";
    }

    // Substance abuse - Smoking
    if (q.includes('smoking') || q.includes('cigarette') || q.includes('tobacco') || q.includes('nicotine')) {
        return "🚬 Cigarette smoking contains three harmful substances:\n\nTAR:\n• Black sticky substance that collects in lungs when smoke cools\n• Irritates lining of bronchioles, stimulates excess mucus production\n• Damages cilia (cannot remove mucus/dirt)\n• Causes chronic bronchitis (thickened bronchioles, difficulty breathing)\n• Contains carcinogens (cancer-causing compounds) → lung cancer\n\nCARBON MONOXIDE (CO):\n• Poisonous gas\n• Binds to hemoglobin forming carboxyhemoglobin\n• Reduces oxygen transport to heart\n• Damages blood vessel lining → coronary heart disease, stroke\n\nNICOTINE:\n• Addictive stimulant\n• Increases heart rate and blood pressure\n• Narrows blood vessels (arterioles)\n• Activates dopamine release (pleasure), leading to addiction";
    }

    // Emphysema
    if (q.includes('emphysema')) {
        return "🫁 Emphysema is a lung disease caused by smoking.\n\n• Tar weakens alveoli walls\n• Coughing causes weakened alveoli to burst\n• Reduced number of alveoli decreases absorbing surface of lungs\n• Smoker cannot oxygenate blood properly\n• Least exertion makes person breathless and exhausted\n• Bronchioles collapse during expiration, trapping air in alveoli";
    }

    // Alcohol
    if (q.includes('alcohol') || q.includes('drinking') || q.includes('tej') || q.includes('tella')) {
        return "🍺 Alcohol is a depressant that slows down nerve impulse transmission.\n\nShort-term effects:\n• Loss of coordination\n• Loss of self-control\n• Loss of judgment and control of movements\n• Slower reaction times\n\nLong-term effects:\n• Stomach ulcers\n• Heart disease\n• Brain damage\n• Liver cirrhosis (scarred liver tissue - irreversible)\n\nSocial problems: family disputes, crime, absenteeism, vandalism, assault, violence\n\nNote: Men break down alcohol faster than women (men have more of the liver enzyme)";
    }

    // Khat
    if (q.includes('khat') || q.includes('chat') || q.includes('catha edulis')) {
        return "🌿 Khat (Catha edulis) is a bushy plant whose leaves are chewed for stimulant effect. Contains cathinone which affects the central nervous system.\n\nEffects:\n• Initial euphoria and increased alertness\n• Then depressed mood, irritability\n• Loss of appetite\n• Gastritis and peptic ulcer disease\n• Difficulty sleeping\n\nSocial problems:\n• Family fragmentation\n• Multiple sexual practices\n• Spread of STIs due to unprotected sex\n• Early sexual initiation\n• Financial problems\n\nNote: Only fresh leaves contain cathinone - it degrades in dry plant material.";
    }

    // Cannabis / Marijuana
    if (q.includes('cannabis') || q.includes('marijuana') || q.includes('weed') || q.includes('thc')) {
        return "🌿 Cannabis (marijuana/weed) contains Tetrahydrocannabinol (THC) - a psychoactive component.\n\nEffects:\n• Altered perception and sense of time\n• Difficulty concentrating\n• Reduced short-term memory\n• Body relaxation\n• Increased appetite\n\nHigh doses:\n• Nervousness, panic\n• False beliefs (delusions)\n• Hallucinations\n• Suspicion\n• Psychosis\n\nEffects last 2-6 hours depending on quantity.";
    }

    // Heroin
    if (q.includes('heroin')) {
        return "💉 Heroin is a powerful depressant that slows the nervous system.\n\n• Chemical structure similar to endorphins (natural pain relievers in brain)\n• Heroin binds to endorphin receptor sites, blocking nerve transmission\n• Produces pain relief and euphoria\n• Highly addictive - body develops tolerance, needs ever-greater quantities\n\n⚠️ DANGER: Sharing needles can transmit HIV/AIDS and hepatitis";
    }

    // Doping
    if (q.includes('doping') || q.includes('performance enhancing') || q.includes('wada')) {
        return "🏃 Doping is the use of prohibited medications, drugs, or treatments in competitive sports to improve athletic performance.\n\nHealth risks:\n• Cardiovascular: irregular heart rhythm, high blood pressure, heart attack, stroke\n• Central Nervous System: insomnia, depression, aggression, suicide, addiction, psychosis\n• Hormonal: infertility, gynecomastia (enlarged breasts), decreased testicular size\n• Cancer\n\nConsequences: loss of medals, suspension, financial penalties, health damage\n\nWADA (World Anti-Doping Agency) tests athletes using biological passport program.";
    }

    // HIV/AIDS
    if (q.includes('hiv') || q.includes('aids')) {
        return "🦠 HIV (Human Immunodeficiency Virus) causes AIDS (Acquired Immunodeficiency Syndrome).\n\n• HIV infects and destroys T-lymphocytes (immune cells)\n• As T-lymphocytes decrease, disease resistance declines\n• Leads to opportunistic diseases: pneumonia, TB, cancers, weight loss, diarrhea\n\nTransmission:\n• Sexual intercourse (unprotected)\n• Blood transfusion (contaminated blood)\n• Sharing needles (intravenous drug users)\n• Mother to fetus across placenta\n• Mother to infant during birth\n• Mother to infant through breast milk\n\nPrevention:\n• Abstinence\n• Condom use\n• Sterile needles\n• Tested blood transfusions\n• Antiretroviral drugs for HIV-positive mothers\n\nNote: No cure or vaccine exists; antiretroviral drugs can prolong life";
    }

    // Tuberculosis (TB)
    if (q.includes('tuberculosis') || q.includes('tb')) {
        return "🫁 Tuberculosis (TB) is caused by bacterium Mycobacterium tuberculosis (and rarely Mycobacterium bovis).\n\nSymptoms: cough, chest pain, shortness of breath, fever, sweating, weight loss\n\nTransmission:\n• Airborne droplets when infected person coughs or sneezes\n• Consuming undercooked meat\n• Drinking unpasteurized milk\n\nPrevention/Treatment:\n• BCG vaccine (70-80% effective, given in early childhood)\n• Antibiotics (6-9 months treatment)\n• Avoid overcrowding\n• Good ventilation\n• Avoid undercooked meat and unpasteurized milk";
    }

    // Malaria
    if (q.includes('malaria') || q.includes('plasmodium') || q.includes('anopheles')) {
        return "🦟 Malaria is caused by Plasmodium protozoa. Transmitted by female Anopheles mosquito.\n\nLife cycle:\n• Mosquito bites infected person → picks up Plasmodium\n• Mosquito bites healthy person → injects Plasmodium with saliva\n• Parasites enter red blood cells and multiply\n• Sexual reproduction in mosquito, asexual reproduction in humans\n\nPrevention:\n• Sleep under mosquito nets\n• Use insect repellent\n• Remove standing water (mosquito breeding sites)\n• Biological controls (fish that eat mosquito larvae)\n• Antimalarial drugs: quinine, chloroquine (resistance in some areas), mefloquine";
    }

    // COVID-19
    if (q.includes('covid') || q.includes('coronavirus') || q.includes('pandemic')) {
        return "😷 COVID-19 is caused by coronavirus SARS-CoV-2. Declared a pandemic by WHO in March 2020.\n\nSymptoms: fever, cough, tiredness, shortness of breath, loss of taste/smell, muscle aches, chills, sore throat, headache, chest pain (appear 2-14 days after exposure)\n\nTransmission:\n• Respiratory droplets when infected person breathes, talks, coughs, sneezes\n• Touching contaminated surfaces then touching mouth/nose/eyes\n\nPrevention:\n• Wear mask in public places\n• Social distancing (2 meters/6 feet)\n• Wash hands with soap for 20 seconds or use 60%+ alcohol sanitizer\n• Good ventilation\n• Vaccines available (AstraZeneca, BioNTech/Pfizer, etc.)";
    }

    // Non-infectious diseases
    if (q.includes('non-infectious') || (q.includes('non infectious'))) {
        return "🏥 Non-infectious diseases are NOT caused by pathogens and cannot be transmitted between people.\n\nExamples:\n• Deficiency diseases (kwashiorkor, marasmus, scurvy, rickets)\n• Diseases from substance abuse (lung cancer, cirrhosis, chronic bronchitis)\n• Sickle cell anemia (genetic)\n• Cancer\n• Allergies\n• Diabetes\n• Podoconiosis\n• Heart disease\n• High blood pressure";
    }

    return "📘 I specialize in Unit 5: Health & Nutrition. Try asking:\n• 'What are the different types of nutrients?'\n• 'What is a balanced diet and why is it important?'\n• 'What are deficiency diseases like kwashiorkor, marasmus, rickets, scurvy?'\n• 'What is malnutrition and how is BMI calculated?'\n• 'What are the effects of smoking, alcohol, and khat?'\n• 'How is HIV/AIDS, TB, malaria, and COVID-19 transmitted and prevented?'\n• 'What is the difference between infectious and non-infectious diseases?'";
}