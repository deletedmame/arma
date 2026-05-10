// ============================================
// UNIT 4: Reproduction
// Based on textbook pages 79-107
// ============================================

function unit4Reply(question) {
    const q = question.toLowerCase();

    const offTopics = ['movie', 'football', 'crypto', 'celebrity', 'game'];
    if (offTopics.some(topic => q.includes(topic))) {
        return "❌ I'm your Unit 4 Biology tutor only. Ask about: asexual reproduction, sexual reproduction, human reproductive systems, menstrual cycle, fertilization, pregnancy, birth control methods, or STIs.";
    }

    // Asexual reproduction
    if (q.includes('asexual reproduction') || (q.includes('asexual') && q.includes('reproduction'))) {
        return "🌱 Asexual reproduction is the production of individuals without gametes (eggs or sperm). Only one parent, offspring are genetically identical (clones).\n\nAdvantages:\n• No mate needed\n• No gametes needed\n• All good traits passed on\n• Rapid reproduction\n\nDisadvantages:\n• Little variation\n• Adaptation unlikely\n• Competition for resources if no dispersal\n\nTypes: Fission, Fragmentation, Budding, Vegetative propagation, Parthenogenesis, Sporulation";
    }

    // Types of asexual reproduction
    if (q.includes('binary fission') || (q.includes('fission') && q.includes('asexual'))) {
        return "🔬 Fission - organism divides into two (binary) or more (multiple) equal parts.\n\nBinary fission:\n• Common in bacteria, algae, protozoa\n• Body of unicellular parent divides by mitosis into two approximately equal parts\n• Each grows into an individual similar to parent\n• Bacterial nucleus is replicated (copied) first\n\nMultiple fission:\n• Nucleus divides repeatedly\n• Each daughter nucleus breaks away with small portion of cytoplasm\n• Results in many daughter cells\n• Common in parasitic protozoa (e.g., malarial parasites)";
    }

    // Fragmentation
    if (q.includes('fragmentation')) {
        return "🧩 Fragmentation involves the breakdown of a parent organism into parts that develop into whole organisms.\n\n• Observed in fungi, plants, animals, and algae\n• Example: Spirogyra (filamentous green algae) - breaks into many filaments, each grows into mature filament\n• Multicellular animals (e.g., worms) can break into two or more parts, each fragment regenerates missing parts";
    }

    // Budding
    if (q.includes('budding')) {
        return "🌿 Budding - organism divides into two UNEQUAL parts.\n\nProcess:\n• Bulge (bud) forms on side of cell\n• Nucleus divides mitotically\n• Bud ultimately detaches from mother cell\n\nExamples:\n• Yeast (fungus) - bud develops on surface, cytoplasm continuous with parent, nucleus divides, one daughter nucleus migrates into bud\n• Hydra (invertebrate animal)";
    }

    // Vegetative propagation
    if (q.includes('vegetative') || q.includes('stolon') || q.includes('rhizome') || q.includes('tuber') || q.includes('bulb') || q.includes('corm')) {
        return "🌱 Vegetative propagation is asexual reproduction in plants using structures with lateral meristems (roots, stems, buds, leaves).\n\nTypes:\n• Stolons (Runners) - horizontal stems above ground (strawberry)\n• Rhizomes - underground horizontal stems (grass, ginger, couch grass)\n• Tubers - swollen underground stems that store starch (potato - Solanum sp.)\n• Bulbs - underground storage with fleshy leaves emerging from stem (onion, garlic)\n• Corms - rounded fleshy stems (gladiolus)";
    }

    // Parthenogenesis
    if (q.includes('parthenogenesis')) {
        return "🐝 Parthenogenesis is a form of asexual reproduction in which an unfertilized egg develops into an adult organism.\n\nExamples:\n• Honeybees (Apis mellifera) - queen bee lays unfertilized eggs that develop into male drones\n• Whip tail lizard (Aspidoscelis uniparens) - all members are female, all reproduction is parthenogenesis, each new lizard is a clone of her mother";
    }

    // Sexual reproduction
    if (q.includes('sexual reproduction') || (q.includes('sexual') && q.includes('reproduction'))) {
        return "💑 Sexual reproduction involves the production of sex cells (gametes) through meiosis. It almost always involves two parent organisms.\n\nProcess:\n• Male gamete (sperm) - small, mobile\n• Female gamete (egg) - larger, not mobile\n• Fertilization - union of sperm and egg (internal or external)\n• Zygote - fertilized egg cell\n• Zygote grows into new individual\n\nAdvantages: Genetic variation, better adaptation to changing environments";
    }

    // Male reproductive system
    if (q.includes('male reproductive') || (q.includes('male') && (q.includes('organ') || q.includes('system')))) {
        return "👨 Male Reproductive Structures:\n\n• Testes (testicles) - produce sperm and testosterone; located in scrotum (keeps cooler for sperm production)\n• Epididymis - sperm maturation and storage\n• Vas deferens - carries sperm from epididymis to urethra\n• Seminal vesicles - secrete fructose-rich fluid for sperm nutrition\n• Prostate gland - produces alkaline fluid to neutralize vaginal acidity\n• Bulbourethral glands (Cowper's) - secrete lubricating mucus\n• Penis - organ of intercourse, delivers sperm\n• Scrotum - sac holding testes\n\nSemen = sperm + secretions from seminal vesicles and prostate gland (sperm <5% of semen volume)";
    }

    // Female reproductive system
    if (q.includes('female reproductive') || (q.includes('female') && (q.includes('organ') || q.includes('system')))) {
        return "👩 Female Reproductive Structures:\n\n• Ovaries - produce eggs (ova), estrogen, and progesterone\n• Oviducts (Fallopian tubes) - carry egg from ovary to uterus; site of fertilization\n• Uterus (womb) - houses developing embryo/fetus; has thick muscular walls\n• Endometrium - uterine lining that thickens for pregnancy\n• Cervix - opening of uterus into vagina\n• Vagina - birth canal and organ of intercourse\n• Labia majora/minora - external genitalia (skin folds)\n• Clitoris - sensitive erectile tissue\n• Hymen - membrane that may reduce vaginal opening (virgin state)";
    }

    // Menstrual cycle
    if (q.includes('menstrual cycle') || q.includes('period') || q.includes('ovulation')) {
        return "📅 The Menstrual Cycle (approximately 28 days):\n\nPhase 1 - Menstruation (Days 1-5):\n• Shedding of uterine lining (endometrium) if no pregnancy\n• Flow of bits of uterine lining and blood through cervix and vagina\n\nPhase 2 - Follicular Phase (Days 6-13):\n• FSH stimulates maturation of ovarian follicle\n• Follicle cells secrete estrogen\n• Estrogen thickens endometrium\n\nPhase 3 - Ovulation (Day 14):\n• LH surge triggers egg release from ovary\n• Egg ejected into adjacent oviduct\n\nPhase 4 - Luteal Phase (Days 15-28):\n• LH stimulates formation of corpus luteum\n• Corpus luteum secretes estrogen and progesterone\n• Hormones cause uterine lining to thicken further\n• If no pregnancy, corpus luteum breaks down, cycle repeats";
    }

    // Fertilization
    if (q.includes('fertilization')) {
        return "🥚 Fertilization is the fusion of gamete nuclei.\n\nProcess:\n1. Sperm swims through cervix, uterus, into oviduct\n2. Sperm bumps into egg and sticks to surface\n3. Sperm enters egg cytoplasm\n4. Male nucleus (sperm) fuses with female nucleus (egg)\n\nTiming:\n• Released egg survives about 24 hours\n• Sperm can fertilize egg for about 2-3 days\n• Only about 4 days each month when fertilization can occur";
    }

    // Pregnancy / Embryo development
    if (q.includes('pregnancy') || q.includes('embryo') || q.includes('fetus') || q.includes('implantation')) {
        return "🤰 Pregnancy and Development:\n\n• Zygote divides into 2 cells, then 4, then solid ball of cells (morula)\n• Early embryo travels down oviduct to uterus\n• Implantation - embryo sinks into uterine lining\n• After 8 weeks, when all organs formed, embryo is called FETUS\n\nSupport structures:\n• Amnion (water sac) - fluid-filled sac protecting fetus, contains amniotic fluid\n• Placenta - attaches to uterine lining, provides oxygen and nutrients from mother to fetus\n• Umbilical cord - connects fetus to placenta\n\nNote: Mother's blood does NOT mix with fetus's blood; exchange occurs across placenta";
    }

    // Twins
    if (q.includes('twin')) {
        return "👯‍♂️ Types of Twins:\n\nIdentical (Monozygotic) Twins:\n• Come from ONE zygote that splits\n• Genetically identical\n• Always same sex\n• About 33% have separate placentas, others share common placenta\n\nFraternal (Dizygotic) Twins:\n• Come from TWO separate zygotes (two eggs fertilized by two sperm)\n• No more alike than other siblings\n• Can be same or different sexes\n\nTriplets, quadruplets, quintuplets may include a pair of identical twins; others usually from separate zygotes";
    }

    // Birth control methods
    if (q.includes('birth control') || q.includes('contraception') || q.includes('prevent pregnancy')) {
        return "🔒 Birth Control Methods:\n\nNATURAL:\n• Abstinence - avoiding intercourse (100% effective, prevents STIs)\n• Calendar/Rhythm method - avoid intercourse during fertile period (less reliable)\n• Temperature method - track body temperature rise after ovulation\n• Cervical mucus method - track mucus changes\n\nBARRIER:\n• Condom (male/female) - traps sperm, prevents STIs\n• Diaphragm - covers cervix, used with spermicide (~95% effective)\n• Spermicides - chemicals that kill sperm\n\nHORMONAL:\n• Birth control pill - estrogen/progesterone, suppresses ovulation (99% effective)\n• Contraceptive implant - releases progesterone, lasts 3 years\n• Contraceptive injection - progesterone, lasts 8-12 weeks\n• Intrauterine System (IUS) - releases progesterone, lasts 5 years\n\nINTRAUTERINE DEVICE (IUD):\n• T-shaped device inserted into uterus, prevents implantation (~98% effective)\n\nSURGICAL (Permanent):\n• Vasectomy (male) - cut and seal vas deferens\n• Tubal ligation (female) - cut and seal oviducts (laparotomy)";
    }

    // STIs
    if (q.includes('sti') || q.includes('std') || q.includes('sexually transmitted') || q.includes('hiv') || q.includes('aids') || q.includes('gonorrhea') || q.includes('syphilis')) {
        return "⚠️ Common STIs in Ethiopia:\n\n• HIV/AIDS - virus (Human Immunodeficiency Virus), attacks immune cells (T-lymphocytes), no cure, leads to AIDS (Acquired Immunodeficiency Syndrome). Transmission: sexual contact, blood transfusion, sharing needles, mother to fetus/baby.\n\n• Syphilis - bacterium (Treponema pallidum), spiral-shaped, can be cured with antibiotics; if untreated can damage brain, liver, bones.\n\n• Gonorrhea - bacterium, causes painful urination and discharge; treatable with antibiotics but drug-resistant strains increasing.\n\n• Chlamydia - bacterium (Chlamydia trachomatis), often goes undetected, can cause infertility if untreated; curable with antibiotics.\n\n• Trichomoniasis - protozoan (Trichomonas vaginalis), causes discharge and itching; curable with antiprotozoal drugs.\n\nPrevention: Abstinence, condom use, faithful partnership, regular testing, avoid sharing needles.";
    }

    // Puberty / Adolescence
    if (q.includes('puberty') || q.includes('adolescence') || q.includes('secondary sexual characteristics')) {
        return "🌱 Puberty is the time when secondary sex characteristics begin to develop and sexual maturity is reached.\n\nMale secondary sexual characteristics:\n• Growth/maintenance of male sex organs\n• Increased body hair\n• Increased muscle mass\n• Increased growth of long bones\n• Deepening of voice (voice change)\n• Hormones: Testosterone, FSH, LH\n\nFemale secondary sexual characteristics:\n• Increased growth rate of long bones\n• More body hair (underarms, pubic area)\n• Hips broaden\n• More fat deposited in breasts, buttocks, thighs\n• Menstrual cycle begins\n• Hormones: Estrogen, Progesterone, FSH, LH";
    }

    return "📘 I specialize in Unit 4: Reproduction. Try asking:\n• 'What is asexual reproduction and what are its types?'\n• 'What is the difference between binary fission and budding?'\n• 'What are the parts of the male reproductive system?'\n• 'What are the parts of the female reproductive system?'\n• 'What are the phases of the menstrual cycle?'\n• 'What is fertilization and how does pregnancy occur?'\n• 'What are the different birth control methods?'\n• 'What are STIs and how can they be prevented?'";
}