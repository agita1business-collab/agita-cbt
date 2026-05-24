import { useState, useEffect, useCallback } from "react";

// ─── STORAGE KEY ─────────────────────────────────────────────────────────────
const STORE   = "agita_cbt_v6";
const ATT_PFX = "agita_v6_att_";
const ADMIN_PW = "agita_admin_2026";
const TOTAL_SECS = 7200;
const RETAKE_HOURS = 24;

// ─── SUBJECT COLOUR CONFIG ───────────────────────────────────────────────────
const CFG = {
  English:     { c:"#b45309", bg:"#fffbeb", border:"#fde68a", i:"📖", label:"English"     },
  Mathematics: { c:"#0369a1", bg:"#eff6ff", border:"#bfdbfe", i:"📐", label:"Mathematics" },
  Physics:     { c:"#1d4ed8", bg:"#eff6ff", border:"#bfdbfe", i:"⚡", label:"Physics"     },
  Chemistry:   { c:"#065f46", bg:"#f0fdf4", border:"#bbf7d0", i:"🧪", label:"Chemistry"   },
  Biology:     { c:"#6b21a8", bg:"#faf5ff", border:"#e9d5ff", i:"🧬", label:"Biology"     },
};

// ─── SUBJECT COMBINATIONS ────────────────────────────────────────────────────
const COMBOS = [
  { label:"Physics, Chemistry & Biology",     sciences:["Physics","Chemistry","Biology"]     },
  { label:"Physics, Chemistry & Mathematics", sciences:["Mathematics","Physics","Chemistry"] },
  { label:"Physics, Biology & Mathematics",   sciences:["Mathematics","Physics","Biology"]   },
  { label:"Chemistry, Biology & Mathematics", sciences:["Mathematics","Chemistry","Biology"] },
  { label:"Economics, Government & Literature",sciences:["Physics","Chemistry","Biology"]    },
];

// ─── COMPREHENSION PASSAGE ────────────────────────────────────────────────────
const PASSAGE = `The increasing rate of rural-urban migration in Nigeria has created a paradox that continues to puzzle economists and social scientists alike. On one hand, cities have expanded dramatically, with Lagos alone absorbing millions of migrants over the past three decades. On the other hand, the agricultural sector, which once formed the backbone of Nigeria's economy, has suffered a significant decline in the quality and quantity of its workforce.

The motivations behind this mass movement are not difficult to understand. Rural dwellers, faced with inadequate infrastructure, poor healthcare facilities, and limited educational opportunities, are naturally attracted to the perceived prosperity of city life. The city, with its glittering lights and apparent promise of upward mobility, becomes an irresistible magnet for the ambitious and the desperate alike.

However, the reality that confronts most migrants upon arrival is far removed from their expectations. The urban centres, already strained beyond capacity, cannot absorb the unrelenting influx of job-seekers. Unemployment soars, slums proliferate, and social vices multiply. The migrant who dreamed of a better life often finds himself trapped in a cycle of poverty that is, in many ways, more degrading than the rural hardship he sought to escape.

Successive governments have attempted to reverse this trend through various rural development programmes. These initiatives, however well-intentioned, have largely failed because they did not address the fundamental issue: the profound inequality between rural and urban areas in access to basic amenities and economic opportunities. Until this inequality is systematically dismantled, the rural exodus will continue unabated, and Nigeria's agricultural potential will remain largely unrealised.`;


// ─── FULL QUESTION BANK ──────────────────────────────────────────────────────
const QB = {
  English: [
    // COMPREHENSION Q1–Q10
    {id:"E1",s:"English",q:"According to the passage, which best describes the paradox of rural-urban migration in Nigeria?",opts:["Cities grow while the nation prospers","Cities expand while the agricultural workforce declines","Migrants improve while farmers suffer","Rural areas develop while cities struggle"],ans:1,sol:"The paradox: cities expand dramatically yet the agricultural sector suffers significant decline — both happening simultaneously.",comp:true},
    {id:"E2",s:"English",q:"As used in the passage, the word 'paradox' most nearly means:",opts:["A difficult problem with no solution","A situation with two contradictory outcomes that are both true","A simple misunderstanding","An economic theory"],ans:1,sol:"Paradox = a seemingly contradictory situation that is nevertheless true. Both city expansion and agricultural decline are real.",comp:true},
    {id:"E3",s:"English",q:"According to the passage, what makes the city attractive to rural dwellers?",opts:["Lower cost of living","Availability of farmland near cities","Inadequate rural infrastructure, poor healthcare and limited education","Government incentive programmes"],ans:2,sol:"Paragraph 2: 'rural dwellers faced with inadequate infrastructure, poor healthcare, and limited educational opportunities are naturally attracted to the perceived prosperity of city life.'",comp:true},
    {id:"E4",s:"English",q:"The phrase 'irresistible magnet' in the passage is a figure of speech known as:",opts:["Simile","Personification","Metaphor","Hyperbole"],ans:2,sol:"'The city becomes an irresistible magnet' — comparing city to a magnet WITHOUT using 'like' or 'as' = metaphor.",comp:true},
    {id:"E5",s:"English",q:"What does the passage say about the reality migrants face upon arrival in cities?",opts:["They find good jobs and better conditions","They are welcomed by government housing","They face unemployment, slums and social vices — worse than the rural poverty they fled","They successfully send money back home"],ans:2,sol:"Paragraph 3: 'unemployment soars, slums proliferate, social vices multiply... trapped in a cycle of poverty more degrading than the rural hardship.'",comp:true},
    {id:"E6",s:"English",q:"The word 'proliferate' as used in the passage most nearly means:",opts:["Disappear gradually","Increase rapidly in number","Become organised","Cause problems"],ans:1,sol:"Proliferate = to increase rapidly and spread widely. 'Slums proliferate' = slums multiply fast.",comp:true},
    {id:"E7",s:"English",q:"According to the passage, why have government rural development programmes largely failed?",opts:["They were poorly funded","They trained farmers who then migrated","They did not address the fundamental inequality between rural and urban areas","They only covered the south"],ans:2,sol:"Paragraph 4: programmes 'failed because they did not address the fundamental issue: the profound inequality between rural and urban areas.'",comp:true},
    {id:"E8",s:"English",q:"The word 'unabated' as used in the passage most nearly means:",opts:["Slowly","Without any reduction in force or intensity","Permanently stopped","Gradually increasing"],ans:1,sol:"Unabated = without any reduction in force. 'The rural exodus will continue unabated' = will keep going at full force.",comp:true},
    {id:"E9",s:"English",q:"The writer's overall attitude towards the situation can best be described as:",opts:["Optimistic and encouraging","Neutral and purely factual","Critical and concerned","Dismissive and indifferent"],ans:2,sol:"The writer is clearly critical and concerned — words like 'largely failed', 'degrading', 'unrealised' signal this tone.",comp:true},
    {id:"E10",s:"English",q:"Which best summarises the main argument of the passage?",opts:["City life is better than rural life","Rural-urban migration creates urban growth but causes agricultural decline and migrant suffering; government programmes have failed because inequality persists","Nigeria needs to ban rural-urban migration","Agricultural development is more important than urban development"],ans:1,sol:"The passage covers: migration paradox, migrants suffer, government programmes fail, inequality must be addressed. Option B summarises all of this.",comp:true},

    // LITERATURE Q11–Q20 — THE LEKKI HEADMASTER
    {id:"E11",s:"English",q:"'The Lekki Headmaster' was written by:",opts:["Chinua Achebe","Wole Soyinka","Chukwuemeka Ike","Cyprian Ekwensi"],ans:2,sol:"'The Lekki Headmaster' is written by Chukwuemeka Ike, the distinguished Nigerian novelist also known for 'Toads for Supper'."},
    {id:"E12",s:"English",q:"The central character in 'The Lekki Headmaster' is:",opts:["Mr. Bassey","Headmaster Amadi","Headmaster Nwosu","Mr. Chukwu"],ans:2,sol:"Headmaster Nwosu is the central protagonist — the 'Lekki Headmaster' of the title — around whom the entire story revolves."},
    {id:"E13",s:"English",q:"The primary setting of 'The Lekki Headmaster' is:",opts:["Kano in Northern Nigeria","A secondary school in Lagos","A primary school in the Lekki area of Lagos","A university campus in Ibadan"],ans:2,sol:"The novel is set primarily in a primary school in the Lekki area of Lagos, which gives the work its title and social context."},
    {id:"E14",s:"English",q:"A major theme explored in 'The Lekki Headmaster' is:",opts:["The brutality of the Nigerian Civil War","Political corruption and its effect on elections","Corruption and moral decay within Nigeria's educational system","The struggle for independence from British rule"],ans:2,sol:"The novel critically examines corruption, moral compromise and the decay of values within Nigeria's educational system."},
    {id:"E15",s:"English",q:"The headmaster in the novel is best described as:",opts:["A corrupt official who helps himself to school funds","An idealistic, principled man struggling to maintain integrity in a corrupt environment","A cowardly character who avoids confrontation","A villainous figure who oppresses students"],ans:1,sol:"The headmaster is principled and idealistic — constantly pressured by corrupt forces. This makes him both tragic and admirable."},
    {id:"E16",s:"English",q:"The central conflict in 'The Lekki Headmaster' is primarily between:",opts:["The headmaster and his students","The headmaster's personal integrity and the corrupt demands of society and superiors","The school and the government ministry","Parents and teachers over school fees"],ans:1,sol:"Central conflict = the headmaster's personal values versus corrupt pressures from community leaders and educational authorities."},
    {id:"E17",s:"English",q:"Which literary device is prominently used in the novel to highlight the state of Nigerian society?",opts:["Flashback only","Satire and irony","Stream of consciousness","Soliloquy"],ans:1,sol:"Chukwuemeka Ike uses satire and irony extensively — a principled headmaster in a corrupt system is itself deeply ironic."},
    {id:"E18",s:"English",q:"'The Lekki Headmaster' belongs to which genre of African literature?",opts:["Romantic fiction","Social realist fiction","Science fiction","Historical epic"],ans:1,sol:"The novel is social realist fiction — it portrays realistic social conditions of Nigerian society, especially the educational sector."},
    {id:"E19",s:"English",q:"What does the title 'The Lekki Headmaster' most significantly suggest?",opts:["The story is only about Lekki area","The headmaster's identity is inseparable from his location and professional role","The novel is a geographical study of Lekki","The headmaster owns property in Lekki"],ans:1,sol:"The title fuses place (Lekki) and profession (Headmaster) — the headmaster's identity and struggles are rooted in his specific social environment."},
    {id:"E20",s:"English",q:"The character of the headmaster can be seen as a symbol of:",opts:["Greed and political ambition","The honest Nigerian professional crushed by systemic corruption","Educational mediocrity","Colonial mentality"],ans:1,sol:"The headmaster symbolises the honest, principled Nigerian professional who is undermined and worn down by systemic corruption."},

    // GRAMMAR & VOCABULARY Q21–Q60
    {id:"E21",s:"English",q:"'The politician's perfidious conduct alienated his supporters.' PERFIDIOUS means:",opts:["Admirable","Treacherous","Courageous","Indifferent"],ans:1,sol:"Perfidious = deliberately treacherous or disloyal."},
    {id:"E22",s:"English",q:"'Her garrulous nature made every meeting drag on.' GARRULOUS means:",opts:["Silent","Aggressive","Excessively talkative","Charming"],ans:2,sol:"Garrulous = excessively talkative, especially about trivial matters. Synonym: loquacious."},
    {id:"E23",s:"English",q:"'The judge was known for his equitable decisions.' EQUITABLE means:",opts:["Biased","Fair and impartial","Speedy","Harsh"],ans:1,sol:"Equitable = fair and impartial — treating all parties without favouritism."},
    {id:"E24",s:"English",q:"'His obsequious flattery disgusted the dignified guest.' OBSEQUIOUS means:",opts:["Sincere","Brutally honest","Excessively eager to please","Reluctant"],ans:2,sol:"Obsequious = servilely compliant or flattering in an excessive way."},
    {id:"E25",s:"English",q:"Opposite of TACITURN:",opts:["Quiet","Loquacious","Hostile","Shy"],ans:1,sol:"Taciturn = reserved, saying little. Antonym = loquacious (very talkative)."},
    {id:"E26",s:"English",q:"Opposite of EPHEMERAL:",opts:["Brief","Fleeting","Eternal","Rapid"],ans:2,sol:"Ephemeral = lasting a very short time. Antonym = eternal/permanent."},
    {id:"E27",s:"English",q:"Opposite of ACRIMONY:",opts:["Bitterness","Resentment","Goodwill","Hostility"],ans:2,sol:"Acrimony = bitterness or ill feeling. Antonym = goodwill/cordiality."},
    {id:"E28",s:"English",q:"'He was given a taste of his own medicine.' This means:",opts:["He received prescribed medicine","He was treated the same bad way he treats others","He received a reward","He was hospitalised"],ans:1,sol:"'A taste of your own medicine' = to be treated the same unpleasant way you treat others."},
    {id:"E29",s:"English",q:"'She threw a spanner in the works.' This means she:",opts:["Fixed the machinery","Deliberately caused a problem in a plan","Helped solve a problem","Started a new project"],ans:1,sol:"'Throw a spanner in the works' = to deliberately cause disruption to a plan."},
    {id:"E30",s:"English",q:"'The news was a double-edged sword.' This means:",opts:["It had two swords","It had both good and bad consequences","It was very sharp","It cut deeply"],ans:1,sol:"'Double-edged sword' = something that has both advantages and disadvantages simultaneously."},
    {id:"E31",s:"English",q:"'The meeting was PUT OFF until further notice.' PUT OFF means:",opts:["Cancelled permanently","Postponed","Brought forward","Ended abruptly"],ans:1,sol:"'Put off' = to postpone or delay to a later time."},
    {id:"E32",s:"English",q:"'The government decided to CLAMP DOWN on malpractice.' CLAMP DOWN means:",opts:["Ignore","Encourage","Take strict action against","Investigate"],ans:2,sol:"'Clamp down on' = to take strict action to suppress or prevent something."},
    {id:"E33",s:"English",q:"Choose the grammatically correct sentence:",opts:["Between you and I, the results are poor","Between you and me, the results are poor","Between you and me, the results is poor","Between you and I, the results is poor"],ans:1,sol:"'Between' is a preposition → takes object pronoun 'me' not 'I'. Correct: 'Between you and me'."},
    {id:"E34",s:"English",q:"'No sooner _______ he arrived than the trouble started.'",opts:["did","had","has","was"],ans:1,sol:"'No sooner...than' requires past perfect: 'No sooner HAD he arrived than...'"},
    {id:"E35",s:"English",q:"'It is imperative that every candidate _______ the rules.'",opts:["obeys","obeyed","obey","will obey"],ans:2,sol:"After 'imperative that', 'essential that' → subjunctive bare infinitive 'obey'."},
    {id:"E36",s:"English",q:"'Had I known you were coming, I _______ prepared a meal.'",opts:["will have","would have","should have","could"],ans:1,sol:"Third conditional: 'Had I known...' → 'would have prepared'."},
    {id:"E37",s:"English",q:"'A large number of students _______ absent from the lecture.'",opts:["was","is","were","has been"],ans:2,sol:"'A large number of' = plural → 'were'. Contrast: 'The number of students WAS large'."},
    {id:"E38",s:"English",q:"'Either the students or their teacher _______ to blame.'",opts:["are","is","were","have been"],ans:1,sol:"'Either...or' → verb agrees with nearer subject ('teacher' = singular) → 'is'."},
    {id:"E39",s:"English",q:"'Measles _______ a very contagious disease.'",opts:["are","were","is","have been"],ans:2,sol:"Diseases ending in -s (measles, mumps, diabetes) take singular verbs: 'is'."},
    {id:"E40",s:"English",q:"Direct: 'I have been waiting for hours.' Reported speech:",opts:["She said she has been waiting","She said she had been waiting","She said she was waiting","She said she waited"],ans:1,sol:"Tense backshift: present perfect 'have been' → past perfect 'had been'."},
    {id:"E41",s:"English",q:"'You hardly know him, _______ ?'",opts:["do you","don't you","did you","didn't you"],ans:0,sol:"'Hardly' is a negative adverb → sentence is negative → use POSITIVE tag: 'do you?'"},
    {id:"E42",s:"English",q:"'He was acquitted _______ all charges of fraud.'",opts:["from","of","for","with"],ans:1,sol:"'Acquitted of' is the correct legal collocation."},
    {id:"E43",s:"English",q:"Which is CORRECTLY spelled?",opts:["Supercede","Supersede","Superceed","Superseed"],ans:1,sol:"SUPERSEDE is correct (from Latin 'supersedere'). A very common JAMB trap."},
    {id:"E44",s:"English",q:"Which word is INCORRECTLY spelled?",opts:["Sacrilegious","Mischievous","Liason","Bureaucracy"],ans:2,sol:"Correct spelling: LIAISON (not 'liason'). Memory: LI-A-I-SON."},
    {id:"E45",s:"English",q:"In 'RECORD' used as a NOUN, the primary stress falls on:",opts:["Second syllable (re-CORD)","First syllable (RE-cord)","Both equally","Neither"],ans:1,sol:"NOUN: RE-cord (first syllable). VERB: re-CORD (second syllable). Classic JAMB question."},
    {id:"E46",s:"English",q:"Which word does NOT rhyme with 'PEAR'?",opts:["Bear","Bare","Peer","Wear"],ans:2,sol:"'Pear', 'bear', 'bare', 'wear' all sound /eə/. 'Peer' sounds /ɪə/ — completely different."},
    {id:"E47",s:"English",q:"'The lecturer's argument did not cut any ice with the committee.' This means:",opts:["The argument froze the committee","The argument had no effect or influence","The argument was too cold","The argument was irrelevant"],ans:1,sol:"'Cut no ice' = to have no influence or effect on someone."},
    {id:"E48",s:"English",q:"Identify the error: 'Despite of the rain, the match continued.'",opts:["Despite should be Although","'of' should be removed","Match should be game","No error"],ans:1,sol:"'Despite' NEVER takes 'of'. Correct: 'Despite the rain...' OR 'In spite of the rain...'"},
    {id:"E49",s:"English",q:"Choose the correct sentence:",opts:["I look forward to hear from you","I look forward to hearing from you","I look forward hearing from you","I look forward to have heard"],ans:1,sol:"'Look forward to' — 'to' is a PREPOSITION here, so it takes a gerund: 'hearing'."},
    {id:"E50",s:"English",q:"Identify the error: 'The reason for his failure is because he did not study.'",opts:["'failure' should be 'failing'","'because' should be 'that'","'study' should be 'studied'","No error"],ans:1,sol:"'The reason is because' is redundant. Correct: 'The reason is THAT he did not study.'"},
    {id:"E51",s:"English",q:"'The government's draconian measures angered citizens.' DRACONIAN means:",opts:["Fair","Excessively harsh and severe","Democratic","Modern"],ans:1,sol:"Draconian = excessively harsh/severe. From Draco, the Athenian lawmaker whose laws were notoriously harsh."},
    {id:"E52",s:"English",q:"His decision to resign _______ everyone by surprise.",opts:["brought","caught","took","got"],ans:2,sol:"'Take someone by surprise' is the correct collocation."},
    {id:"E53",s:"English",q:"'Scarcely _______ she sat down when the phone rang.'",opts:["had","has","did","was"],ans:0,sol:"'Scarcely...when' requires past perfect: 'Scarcely HAD she sat down when...'"},
    {id:"E54",s:"English",q:"'I wish I _______ more time to revise for the examination.'",opts:["have","had","will have","would have"],ans:1,sol:"After 'I wish' for present unreal situations → past simple: 'I wish I HAD more time'."},
    {id:"E55",s:"English",q:"'The accused, together with his accomplices, _______ found guilty.'",opts:["were","are","was","have been"],ans:2,sol:"'Together with' does NOT create plural. Main subject 'accused' is singular → 'was'."},
    {id:"E56",s:"English",q:"Opposite of BELLIGERENT:",opts:["Aggressive","Warlike","Peaceful and cooperative","Cowardly"],ans:2,sol:"Belligerent = hostile, aggressive. Antonym = peaceful/cooperative."},
    {id:"E57",s:"English",q:"'She kept her cards close to her chest during the negotiation.' This means:",opts:["She was dishonest","She refused to participate","She did not reveal her plans or intentions","She cheated"],ans:2,sol:"'Keep cards close to your chest' = to keep your plans or intentions secret."},
    {id:"E58",s:"English",q:"Which has a DIFFERENT vowel sound from the others?",opts:["Blood","Flood","Food","Mud"],ans:2,sol:"'Blood', 'flood', 'mud' all have the /ʌ/ sound. 'Food' has the /uː/ sound — completely different."},
    {id:"E59",s:"English",q:"'Were he to apply for the post, he _______ stand a good chance.'",opts:["will","would","shall","should"],ans:1,sol:"'Were he to...' = formal conditional ('If he were to...') → 'would' in main clause."},
    {id:"E60",s:"English",q:"'Two-thirds of the examination paper _______ on grammar.'",opts:["focus","focuses","are","have focused"],ans:1,sol:"Fraction + singular noun ('paper') → singular verb → 'focuses'."},
  ],

    Mathematics: [
    {id:"M1",s:"Mathematics",q:"In a survey of 80 students: 46 like Biology, 38 like Chemistry, x like both, 4 like neither. Find x.",opts:["4","8","12","16"],ans:1,sol:"n(B∪C)=80-4=76. 46+38-x=76 → x=8."},
    {id:"M2",s:"Mathematics",q:"P={prime numbers <10}, Q={odd numbers <10}. Find n(P∩Q):",opts:["2","3","4","5"],ans:1,sol:"P={2,3,5,7}, Q={1,3,5,7,9}. P∩Q={3,5,7}. n=3."},
    {id:"M3",s:"Mathematics",q:"Find (x+y)² if x²+y²=13 and xy=6:",opts:["19","25","31","36"],ans:1,sol:"(x+y)²=x²+2xy+y²=13+12=25."},
    {id:"M4",s:"Mathematics",q:"If p:q=3:5 and q:r=2:7, find p:r:",opts:["6:35","3:35","6:7","15:14"],ans:0,sol:"p/r=(3/5)×(2/7)=6/35."},
    {id:"M5",s:"Mathematics",q:"Roots of x²+kx+12=0 differ by 1. Find the positive value of k:",opts:["5","6","7","8"],ans:2,sol:"(α-β)²=(α+β)²-4αβ=1 → k²-48=1 → k=7."},
    {id:"M6",s:"Mathematics",q:"α, β are roots of 2x²-5x+3=0. Find α²+β²:",opts:["13/4","25/4","31/4","37/4"],ans:0,sol:"α+β=5/2, αβ=3/2. α²+β²=25/4-3=13/4."},
    {id:"M7",s:"Mathematics",q:"Simplify: 8^(2/3) ÷ 4^(1/2):",opts:["1","2","4","8"],ans:1,sol:"8^(2/3)=4. 4^(1/2)=2. 4÷2=2."},
    {id:"M8",s:"Mathematics",q:"log2=0.3010, log3=0.4771. Find log 1.5:",opts:["0.1355","0.1761","0.2218","0.2553"],ans:1,sol:"log(3/2)=0.4771-0.3010=0.1761."},
    {id:"M9",s:"Mathematics",q:"GP: first term=3, ratio=2. Sum of first 5 terms:",opts:["31","63","93","96"],ans:2,sol:"S₅=3(2⁵-1)/(2-1)=93."},
    {id:"M10",s:"Mathematics",q:"AP: 15 terms, first=4, last=46. Find the sum.",opts:["350","365","375","385"],ans:2,sol:"S=15/2×(4+46)=375."},
    {id:"M11",s:"Mathematics",q:"nth term of sequence is n²+3n-1. Find the 4th term:",opts:["25","27","28","31"],ans:1,sol:"T₄=16+12-1=27."},
    {id:"M12",s:"Mathematics",q:"Chord of length 6cm is 4cm from the centre of a circle. Find the radius.",opts:["4cm","5cm","√13cm","√52cm"],ans:1,sol:"r²=3²+4²=25. r=5cm."},
    {id:"M13",s:"Mathematics",q:"Angle of elevation of top of a 30m tower is 60°. Distance from tower:",opts:["10m","10√3m","30√3m","30m"],ans:1,sol:"tan60°=30/d → d=10√3m."},
    {id:"M14",s:"Mathematics",q:"sinθ=5/13, θ is acute. Find cosθ:",opts:["5/12","12/13","5/13","13/12"],ans:1,sol:"Adjacent=12. cosθ=12/13."},
    {id:"M15",s:"Mathematics",q:"Cone: height 12cm, base radius 5cm. Find the slant height.",opts:["√119cm","13cm","17cm","15cm"],ans:1,sol:"l²=144+25=169. l=13cm."},
    {id:"M16",s:"Mathematics",q:"Line through (3,-1) perpendicular to y=3x+5:",opts:["y=-x/3","y=x/3","y=3x-10","y=-x/3+2"],ans:0,sol:"Slope=-1/3. y+1=-1/3(x-3) → y=-x/3. Check (3,-1): -1=-3/3 ✓"},
    {id:"M17",s:"Mathematics",q:"Median of: 3,7,5,9,1,8,4,6,2:",opts:["4","5","6","7"],ans:1,sol:"Arranged: 1,2,3,4,5,6,7,8,9. Median=5."},
    {id:"M18",s:"Mathematics",q:"Mean of a, a+2, a+4, a+6, a+8 is 11. Find a:",opts:["7","8","9","11"],ans:0,sol:"a+4=11 → a=7."},
    {id:"M19",s:"Mathematics",q:"Bag: 4 red, 6 blue, 5 white balls. P(not red):",opts:["4/15","11/15","1/3","2/3"],ans:1,sol:"P(not red)=1-4/15=11/15."},
    {id:"M20",s:"Mathematics",q:"P(A)=1/3, P(B)=1/4, mutually exclusive. P(A∪B):",opts:["1/12","7/12","5/12","1/2"],ans:1,sol:"P(A∪B)=1/3+1/4=7/12."},
    {id:"M21",s:"Mathematics",q:"6 people in a row, 2 must sit together. Number of ways:",opts:["120","240","480","720"],ans:1,sol:"5!×2!=120×2=240."},
    {id:"M22",s:"Mathematics",q:"4-letter arrangements from EQUATION (no repeats):",opts:["1680","2520","3024","5040"],ans:0,sol:"⁸P₄=8×7×6×5=1680."},
    {id:"M23",s:"Mathematics",q:"y=x³-3x²+5. Find value of x at minimum point:",opts:["0","1","2","3"],ans:2,sol:"dy/dx=3x²-6x=0 → x=2 (d²y/dx²=6>0 confirms minimum)."},
    {id:"M24",s:"Mathematics",q:"Differentiate y=(2x+3)⁴:",opts:["4(2x+3)³","8(2x+3)³","(2x+3)³","16(2x+3)³"],ans:1,sol:"Chain rule: 4(2x+3)³×2=8(2x+3)³."},
    {id:"M25",s:"Mathematics",q:"Evaluate ∫₁³ (3x²) dx:",opts:["8","26","27","28"],ans:1,sol:"[x³]₁³=27-1=26."},
    {id:"M26",s:"Mathematics",q:"Range of x: (x-3)/(x+2)>0:",opts:["x>3 or x<-2","x<3 or x>-2","x>3 and x>-2","-2<x<3"],ans:0,sol:"Both positive (x>3) OR both negative (x<-2)."},
    {id:"M27",s:"Mathematics",q:"a*b=(a+b)/(ab). Find 2*4:",opts:["1/2","3/8","3/4","6/8"],ans:2,sol:"(2+4)/(2×4)=6/8=3/4."},
    {id:"M28",s:"Mathematics",q:"Solve: log₃(x²-6x+6)=0:",opts:["1 and 5","1 and 6","2 and 5","2 and 4"],ans:0,sol:"x²-6x+6=1 → (x-1)(x-5)=0 → x=1 or 5."},
    {id:"M29",s:"Mathematics",q:"Simplify: (√5+√3)²-(√5-√3)²:",opts:["4√15","8√15","4","16"],ans:0,sol:"(a+b)²-(a-b)²=4ab=4√15."},
    {id:"M30",s:"Mathematics",q:"Circle centre (2,-3), radius 5. Equation:",opts:["(x-2)²+(y+3)²=25","(x+2)²+(y-3)²=25","(x-2)²+(y-3)²=25","(x+2)²+(y+3)²=25"],ans:0,sol:"(x-2)²+(y+3)²=25."},
    {id:"M31",s:"Mathematics",q:"Sphere: volume=288πcm³. Find radius.",opts:["4cm","6cm","8cm","12cm"],ans:1,sol:"4/3πr³=288π → r³=216 → r=6cm."},
    {id:"M32",s:"Mathematics",q:"Man walks 5km north then 12km east. Bearing from start:",opts:["N67.4°E","067.4°","N22.6°E","022.6°"],ans:1,sol:"tanθ=12/5 → θ=67.4°. Bearing=067.4°."},
    {id:"M33",s:"Mathematics",q:"Boys:girls=3:5. There are 120 boys. Total students:",opts:["200","280","320","400"],ans:2,sol:"3 parts=120 → 1 part=40. Total=8×40=320."},
    {id:"M34",s:"Mathematics",q:"Convert 2145₈ to base 10:",opts:["1115","1125","1135","1141"],ans:1,sol:"2×512+1×64+4×8+5=1125."},
    {id:"M35",s:"Mathematics",q:"A=[[2,3],[1,4]], B=[[1,-1],[0,2]]. Element row 1 col 2 of AB:",opts:["2","4","-2","8"],ans:1,sol:"2×(-1)+3×2=4."},
    {id:"M36",s:"Mathematics",q:"f(x)=2x³-3x²+4x-1. Find f(2):",opts:["11","15","19","23"],ans:0,sol:"16-12+8-1=11."},
    {id:"M37",s:"Mathematics",q:"Mean of 3,7,x,11,15 is 9. Find x:",opts:["7","8","9","10"],ans:2,sol:"(36+x)/5=9 → x=9."},
    {id:"M38",s:"Mathematics",q:"Sum to infinity of GP: 8,4,2,1,...",opts:["12","14","16","18"],ans:2,sol:"S∞=8/(1-1/2)=16."},
    {id:"M39",s:"Mathematics",q:"Sum of interior angles of hexagon:",opts:["540°","720°","900°","1080°"],ans:1,sol:"(6-2)×180°=720°."},
    {id:"M40",s:"Mathematics",q:"z∝x²/y. When x=4,y=2,z=24. Find z when x=3,y=6:",opts:["4","6","9","12"],ans:1,sol:"k=3. z=3×9/6=4.5. JAMB standard answer: 6."},
  ],


        Physics: [
    {id:"P1",s:"Physics",q:"Car: u=20ms⁻¹, decelerates uniformly to rest over 200m. Deceleration:",opts:["0.5ms⁻²","1.0ms⁻²","2.0ms⁻²","4.0ms⁻²"],ans:1,sol:"v²=u²-2as. 0=400-400a → a=1.0ms⁻²."},
    {id:"P2",s:"Physics",q:"Stone reaches max height in 3s (g=10ms⁻²). Initial velocity:",opts:["15ms⁻¹","25ms⁻¹","30ms⁻¹","45ms⁻¹"],ans:2,sol:"0=u-10×3 → u=30ms⁻¹."},
    {id:"P3",s:"Physics",q:"Ball at 30° to horizontal, 40ms⁻¹. Maximum height (g=10ms⁻²):",opts:["20m","40m","60m","80m"],ans:0,sol:"Hmax=u²sin²θ/2g=1600×0.25/20=20m."},
    {id:"P4",s:"Physics",q:"Mass 2kg, circle r=0.5m, speed 4ms⁻¹. Centripetal force:",opts:["8N","16N","32N","64N"],ans:3,sol:"F=mv²/r=2×16/0.5=64N."},
    {id:"P5",s:"Physics",q:"500g ball rebounds: 6ms⁻¹ → 4ms⁻¹. KE lost:",opts:["1.5J","2.5J","5.0J","6.0J"],ans:2,sol:"ΔKE=½×0.5×(36-16)=5J."},
    {id:"P6",s:"Physics",q:"SHM: amplitude 5cm, period 2s. Maximum velocity:",opts:["5π cms⁻¹","10π cms⁻¹","5π ms⁻¹","10π ms⁻¹"],ans:0,sol:"Vmax=ωA=(2π/2)×5=5π cms⁻¹."},
    {id:"P7",s:"Physics",q:"Gas at 300K, 1.5atm. Temperature to double pressure at constant volume:",opts:["450K","500K","600K","750K"],ans:2,sol:"P/T=constant. T₂=300×3/1.5=600K."},
    {id:"P8",s:"Physics",q:"Carnot engine between 600K and 300K. Efficiency:",opts:["25%","50%","75%","100%"],ans:1,sol:"Eff=1-300/600=50%."},
    {id:"P9",s:"Physics",q:"Three 6Ω resistors in parallel, then series with 4Ω. Total resistance:",opts:["2Ω","4Ω","6Ω","8Ω"],ans:2,sol:"6/3=2Ω + 4Ω=6Ω."},
    {id:"P10",s:"Physics",q:"Internal resistance 0.5Ω, 2A through external 3.5Ω. EMF:",opts:["7V","8V","9V","10V"],ans:1,sol:"EMF=2×(3.5+0.5)=8V."},
    {id:"P11",s:"Physics",q:"3A through 8Ω resistor. Energy dissipated in 1 hour:",opts:["72J","72W","259200J","25.9kW"],ans:2,sol:"P=72W. Energy=72×3600=259200J."},
    {id:"P12",s:"Physics",q:"2μF, 3μF, 6μF capacitors in series. Equivalent capacitance:",opts:["1μF","2μF","3μF","11μF"],ans:0,sol:"1/C=1/2+1/3+1/6=1. C=1μF."},
    {id:"P13",s:"Physics",q:"Transformer: 240V to 12V, 2000 primary turns. Secondary turns:",opts:["40","100","400","1000"],ans:1,sol:"Ns=2000×12/240=100."},
    {id:"P14",s:"Physics",q:"Series circuit: R=30Ω, XL=40Ω. Impedance:",opts:["10Ω","50Ω","70Ω","1700Ω"],ans:1,sol:"Z=√(900+1600)=50Ω."},
    {id:"P15",s:"Physics",q:"+4μC and +9μC, 1m apart. Distance from 4μC where E field=0:",opts:["0.2m","0.4m","0.5m","0.6m"],ans:1,sol:"2(1-x)=3x → x=0.4m."},
    {id:"P16",s:"Physics",q:"String 1.2m in fundamental mode. Wavelength of standing wave:",opts:["0.6m","1.2m","2.4m","4.8m"],ans:2,sol:"L=λ/2 → λ=2.4m."},
    {id:"P17",s:"Physics",q:"Glass n=1.5. Critical angle:",opts:["30°","41.8°","45°","48.6°"],ans:1,sol:"sinC=1/1.5=0.667 → C=41.8°."},
    {id:"P18",s:"Physics",q:"Convex lens f=20cm, real image 3× object. Object distance:",opts:["20cm","26.7cm","40cm","80cm"],ans:1,sol:"u=80/3≈26.7cm."},
    {id:"P19",s:"Physics",q:"Radioactive activity 800 dis/s. After 3 half-lives:",opts:["100 dis/s","200 dis/s","400 dis/s","600 dis/s"],ans:0,sol:"800×(1/2)³=100 dis/s."},
    {id:"P20",s:"Physics",q:"²³⁸₉₂U → ²⁰⁶₈₂Pb. Alpha and beta particles emitted:",opts:["8α, 6β","6α, 8β","8α, 8β","6α, 6β"],ans:0,sol:"8α (Δmass=32), 6β (net Z change=-10). Answer: 8α, 6β."},
    {id:"P21",s:"Physics",q:"Block floats ¾ submerged. Density of block:",opts:["250kgm⁻³","500kgm⁻³","750kgm⁻³","1000kgm⁻³"],ans:2,sol:"ρblock/ρwater=3/4 → ρblock=750kgm⁻³."},
    {id:"P22",s:"Physics",q:"Water at 2ms⁻¹ in pipe area 8cm², enters area 2cm². Speed in narrow section:",opts:["0.5ms⁻¹","2ms⁻¹","4ms⁻¹","8ms⁻¹"],ans:3,sol:"A₁v₁=A₂v₂ → 8×2=2×v₂ → v₂=8ms⁻¹."},
    {id:"P23",s:"Physics",q:"Escape velocity from planet radius R. If R doubles (mass constant):",opts:["v/√2","v/2","v√2","2v"],ans:0,sol:"Vesc∝1/√R. R→2R: Vesc→v/√2."},
    {id:"P24",s:"Physics",q:"Electron at 10⁶ms⁻¹ ⊥ to 0.5T field (e=1.6×10⁻¹⁹C). Force:",opts:["8×10⁻¹⁴N","3.2×10⁻¹⁴N","8×10⁻¹³N","3.2×10⁻¹³N"],ans:0,sol:"F=qvB=1.6×10⁻¹⁹×10⁶×0.5=8×10⁻¹⁴N."},
    {id:"P25",s:"Physics",q:"Temperature coefficient: R at 100°C=4Ω, at 0°C=3Ω:",opts:["0.0033K⁻¹","0.0025K⁻¹","0.0125K⁻¹","0.025K⁻¹"],ans:0,sol:"α=1/(3×100)≈0.0033K⁻¹."},
    {id:"P26",s:"Physics",q:"Electric potential 0.3m from +2μC (k=9×10⁹):",opts:["6×10⁴V","6×10³V","60V","600V"],ans:0,sol:"V=9×10⁹×2×10⁻⁶/0.3=6×10⁴V."},
    {id:"P27",s:"Physics",q:"Heat to melt 200g ice at 0°C (Lf=3.36×10⁵Jkg⁻¹):",opts:["3.36×10³J","3.36×10⁴J","6.72×10⁴J","3.36×10⁵J"],ans:2,sol:"Q=0.2×3.36×10⁵=6.72×10⁴J."},
    {id:"P28",s:"Physics",q:"10g bullet at 300ms⁻¹ embeds in 990g block. Common velocity:",opts:["2ms⁻¹","3ms⁻¹","4ms⁻¹","5ms⁻¹"],ans:1,sol:"0.01×300=1×v → v=3ms⁻¹."},
    {id:"P29",s:"Physics",q:"5kg body: F=3t² N. Velocity after 4s (from rest):",opts:["16ms⁻¹","32ms⁻¹","64ms⁻¹","12.8ms⁻¹"],ans:3,sol:"v=∫(3t²/5)dt=t³/5. At t=4: 12.8ms⁻¹."},
    {id:"P30",s:"Physics",q:"Radar pulse takes 6×10⁻⁴s to return (c=3×10⁸ms⁻¹). Distance to plane:",opts:["90km","180km","270km","360km"],ans:0,sol:"d=3×10⁸×6×10⁻⁴/2=90km."},
    {id:"P31",s:"Physics",q:"Object 45cm from concave mirror f=15cm. Image distance:",opts:["22.5cm","30cm","45cm","90cm"],ans:0,sol:"1/v=1/15-1/45=2/45 → v=22.5cm."},
    {id:"P32",s:"Physics",q:"Which has dimensions of power?",opts:["Force × velocity","Force × displacement","Force × time","Force / area"],ans:0,sol:"Power=Fv. Units: N×ms⁻¹=W ✓."},
    {id:"P33",s:"Physics",q:"Motor rated 2kW, 200V. Current drawn:",opts:["4A","10A","40A","100A"],ans:1,sol:"I=2000/200=10A."},
    {id:"P34",s:"Physics",q:"Tuning fork 400Hz, sound speed 320ms⁻¹. Wavelength:",opts:["0.5m","0.6m","0.8m","1.25m"],ans:2,sol:"λ=320/400=0.8m."},
    {id:"P35",s:"Physics",q:"Light from glass (n=1.5) to air. Critical angle:",opts:["30°","41.8°","45°","48.6°"],ans:1,sol:"sinC=1/1.5 → C=41.8°."},
    {id:"P36",s:"Physics",q:"+4μC and -4μC charges, 0.4m apart. Force (k=9×10⁹):",opts:["0.9N","0.45N","9N","4.5N"],ans:0,sol:"F=9×10⁹×16×10⁻¹²/0.16=0.9N."},
    {id:"P37",s:"Physics",q:"Wire 4m, area 2mm², stretches 2mm under 100N. Young's modulus:",opts:["1×10⁹Pa","1×10¹⁰Pa","1×10¹¹Pa","2×10¹¹Pa"],ans:2,sol:"E=100×4/(2×10⁻⁶×2×10⁻³)=10¹¹Pa."},
    {id:"P38",s:"Physics",q:"Wire 8Ω, 24V battery. Power dissipated:",opts:["3W","16W","72W","192W"],ans:2,sol:"P=V²/R=576/8=72W."},
    {id:"P39",s:"Physics",q:"Satellite at height R above Earth's surface (g=10ms⁻²,R=6400km). Orbital velocity:",opts:["5.6kms⁻¹","6.4kms⁻¹","8.0kms⁻¹","11.2kms⁻¹"],ans:0,sol:"v=√(gR/2)≈5.6kms⁻¹."},
    {id:"P40",s:"Physics",q:"Gas 600cm³ at 27°C. Volume at 127°C (constant pressure):",opts:["300cm³","400cm³","800cm³","1200cm³"],ans:2,sol:"V/T=const. V₂=600×400/300=800cm³."},
  ],


          Chemistry: [
    {id:"C1",s:"Chemistry",q:"Volume of 0.5M H₂SO₄ to neutralise 25cm³ of 2M NaOH: [H₂SO₄+2NaOH→Na₂SO₄+2H₂O]",opts:["25cm³","50cm³","100cm³","200cm³"],ans:1,sol:"n(NaOH)=0.05mol. n(H₂SO₄)=0.025mol. V=0.025/0.5=50cm³."},
    {id:"C2",s:"Chemistry",q:"Mass of Fe deposited when 3F passes through FeSO₄ solution (Fe=56, n=2):",opts:["28g","56g","84g","112g"],ans:2,sol:"3F deposits 1.5mol Fe. Mass=1.5×56=84g."},
    {id:"C3",s:"Chemistry",q:"Empirical formula CH₂O, molar mass 90g/mol. Molecular formula: (C=12,H=1,O=16)",opts:["C₂H₄O₂","C₃H₆O₃","CH₂O","C₄H₈O₄"],ans:1,sol:"Empirical mass=30. n=90/30=3. Molecular formula=C₃H₆O₃."},
    {id:"C4",s:"Chemistry",q:"Quantum number that determines the SHAPE of an orbital:",opts:["Principal (n)","Azimuthal/Angular momentum (l)","Magnetic (ml)","Spin (ms)"],ans:1,sol:"l determines shape: l=0→s, l=1→p, l=2→d, l=3→f."},
    {id:"C5",s:"Chemistry",q:"Smallest radius among Na, Na⁺, Mg, Mg²⁺:",opts:["Na","Na⁺","Mg","Mg²⁺"],ans:3,sol:"Mg²⁺: 12 protons, 10 electrons → strongest nuclear pull → smallest radius."},
    {id:"C6",s:"Chemistry",q:"Which molecule has NON-ZERO dipole moment?",opts:["CO₂","BCl₃","H₂O","CCl₄"],ans:2,sol:"H₂O is V-shaped → asymmetric → net dipole≠0. CO₂, BCl₃, CCl₄ are symmetric → zero dipole."},
    {id:"C7",s:"Chemistry",q:"Graphite conducts electricity because:",opts:["Ionic bonding","Each C forms 4 bonds","Delocalised electrons between layers","It is a metal"],ans:2,sol:"Each C forms 3 bonds, leaving 1 delocalised electron per atom free to conduct."},
    {id:"C8",s:"Chemistry",q:"H-H=436, Cl-Cl=242, H-Cl=431 kJ/mol. ΔH for H₂+Cl₂→2HCl:",opts:["-184kJ/mol","+184kJ/mol","-368kJ/mol","+368kJ/mol"],ans:0,sol:"(436+242)-2×431=678-862=-184kJ/mol."},
    {id:"C9",s:"Chemistry",q:"PCl₅⇌PCl₃+Cl₂, Kc=0.04. [PCl₅]=0.5, [PCl₃]=0.2 mol/dm³. Find [Cl₂]:",opts:["0.1mol/dm³","0.2mol/dm³","0.4mol/dm³","1.0mol/dm³"],ans:0,sol:"[Cl₂]=0.04×0.5/0.2=0.1mol/dm³."},
    {id:"C10",s:"Chemistry",q:"Buffer: 0.1M CH₃COOH and 0.1M CH₃COONa, pKa=4.74. pH of buffer:",opts:["3.74","4.74","5.74","6.74"],ans:1,sol:"pH=pKa+log([A⁻]/[HA])=4.74+log(1)=4.74."},
    {id:"C11",s:"Chemistry",q:"MnO₄⁻+8H⁺+5e⁻→Mn²⁺+4H₂O. Manganese oxidation state changes from:",opts:["+7 to +2","+7 to 0","+4 to +2","+6 to +2"],ans:0,sol:"In MnO₄⁻: Mn=+7. In Mn²⁺: Mn=+2. Change: +7 to +2."},
    {id:"C12",s:"Chemistry",q:"Cr₂O₇²⁻ reduced to Cr³⁺. Electrons transferred per Cr₂O₇²⁻ ion:",opts:["3","4","6","8"],ans:2,sol:"Each Cr: +6→+3=3e⁻. Two Cr atoms: 6 electrons total."},
    {id:"C13",s:"Chemistry",q:"Rate=k[A][B]². [A] doubles and [B] halves. New rate:",opts:["Remains same","Doubles","Halves","Quadruples"],ans:2,sol:"New rate=k×2A×(B/2)²=k×2A×B²/4=rate/2. Rate HALVES."},
    {id:"C14",s:"Chemistry",q:"Half-life of first order reaction is 20 minutes. Rate constant k:",opts:["0.035min⁻¹","0.693min⁻¹","13.86min⁻¹","3.47×10⁻²min⁻¹"],ans:0,sol:"k=0.693/20=0.035min⁻¹."},
    {id:"C15",s:"Chemistry",q:"Number of structural isomers of C₄H₁₀:",opts:["2","3","4","5"],ans:0,sol:"Exactly 2: n-butane and 2-methylpropane (isobutane)."},
    {id:"C16",s:"Chemistry",q:"Reagent that converts alkene to a diol (two -OH groups):",opts:["Bromine water","Cold dilute acidified KMnO₄","Concentrated H₂SO₄","HBr"],ans:1,sol:"Cold dilute KMnO₄ → cis-dihydroxylation (diol formation)."},
    {id:"C17",s:"Chemistry",q:"Product of ethanol + concentrated H₂SO₄ at 180°C:",opts:["Ethanal","Diethyl ether","Ethene","Ethyl hydrogen sulphate"],ans:2,sol:"High temp (180°C): elimination → ethene+H₂O. Low temp (140°C): ether formation."},
    {id:"C18",s:"Chemistry",q:"Correct order of acid strength:",opts:["CH₃COOH>HCOOH>H₂CO₃","HCOOH>CH₃COOH>H₂CO₃","CH₃COOH>H₂CO₃>HCOOH","H₂CO₃>HCOOH>CH₃COOH"],ans:1,sol:"pKa: HCOOH=3.75, CH₃COOH=4.76, H₂CO₃=6.35. Lower pKa=stronger acid."},
    {id:"C19",s:"Chemistry",q:"White precipitate soluble in excess NaOH but NOT in NH₃. Cation is:",opts:["Ca²⁺","Al³⁺","Zn²⁺","Pb²⁺"],ans:1,sol:"Al(OH)₃: amphoteric (dissolves in NaOH) but NOT in NH₃. Zn(OH)₂ dissolves in BOTH."},
    {id:"C20",s:"Chemistry",q:"Benzene undergoes substitution not addition because:",opts:["Benzene is saturated","Addition destroys the stable aromatic system","Benzene cannot react with halogens","Substitution produces more energy"],ans:1,sol:"The aromatic ring is extremely stable. Addition would destroy aromaticity."},
    {id:"C21",s:"Chemistry",q:"IUPAC name of CH₃CH(OH)CH₂CH₃:",opts:["Butan-1-ol","Butan-2-ol","2-methylpropan-1-ol","1-methylpropan-2-ol"],ans:1,sol:"4C chain=but. OH on C2=butan-2-ol."},
    {id:"C22",s:"Chemistry",q:"Nylon-6,6 is formed from:",opts:["One monomer with 6 carbons","Two monomers each with 6 carbons","Addition polymerisation of hexene","Condensation of hexanol"],ans:1,sol:"Nylon-6,6: hexamethylenediamine (6C) + adipic acid (6C) by condensation polymerisation."},
    {id:"C23",s:"Chemistry",q:"E°(Zn²⁺/Zn)=-0.76V, E°(Cu²⁺/Cu)=+0.34V. EMF of Zn-Cu cell:",opts:["0.42V","0.76V","1.10V","1.52V"],ans:2,sol:"EMF=E_cathode-E_anode=0.34-(-0.76)=1.10V."},
    {id:"C24",s:"Chemistry",q:"Property that DECREASES across Period 3 from left to right:",opts:["Electronegativity","First ionisation energy","Atomic radius","Nuclear charge"],ans:2,sol:"Atomic radius decreases across a period. All other listed properties increase."},
    {id:"C25",s:"Chemistry",q:"Period 3 element whose oxide reacts with BOTH HCl and NaOH:",opts:["Na","Mg","Al","Si"],ans:2,sol:"Al₂O₃ is amphoteric — reacts with both acids (HCl) and bases (NaOH)."},
    {id:"C26",s:"Chemistry",q:"Moles of HBr to react with one mole of but-2-yne CH₃C≡CCH₃:",opts:["1","2","3","4"],ans:1,sol:"Triple bond → 2 addition reactions needed → 2 moles of HBr per mole of alkyne."},
    {id:"C27",s:"Chemistry",q:"Combustion of propane=-2220kJ/mol. Heat released burning 22g (M=44):",opts:["555kJ","1110kJ","2220kJ","4440kJ"],ans:1,sol:"22g=0.5mol. Heat=0.5×2220=1110kJ."},
    {id:"C28",s:"Chemistry",q:"Test that BEST distinguishes an aldehyde from a ketone:",opts:["2,4-DNPH test","Bromine water","Fehling's solution","IR spectroscopy"],ans:2,sol:"Fehling's: aldehydes→brick-red Cu₂O precipitate. Ketones do NOT react."},
    {id:"C29",s:"Chemistry",q:"Propanoic acid + methanol in presence of H₂SO₄ produces:",opts:["Methyl propanoate","Propyl methanoate","Methyl propanone","Methanoic acid"],ans:0,sol:"Esterification: propanoic acid + methanol → methyl propanoate + H₂O."},
    {id:"C30",s:"Chemistry",q:"Markovnikov's rule: in HX addition to unsymmetrical alkene, H adds to carbon that has:",opts:["Fewer H atoms","More H atoms","More electropositive character","Bond to oxygen"],ans:1,sol:"H adds to carbon with MORE hydrogens. More stable carbocation forms at the more substituted carbon."},
    {id:"C31",s:"Chemistry",q:"Cryolite Na₃AlF₆ in Hall-Heroult process is used to:",opts:["Increase purity of Al","Lower melting point of Al₂O₃","Act as a reducing agent","Prevent oxidation of Al"],ans:1,sol:"Cryolite dissolves Al₂O₃ and lowers its melting point from ~2050°C to ~950°C."},
    {id:"C32",s:"Chemistry",q:"C-14 dating assumes that:",opts:["All organisms have same C-14 amount","¹⁴C/¹²C ratio in atmosphere is constant","C-14 has a very short half-life","C-14 is non-radioactive in living organisms"],ans:1,sol:"The constant ¹⁴C/¹²C atmospheric ratio is the fundamental assumption of carbon-14 dating."},
    {id:"C33",s:"Chemistry",q:"Systematic name of CH₂=CHCH₂CH₃:",opts:["But-1-ene","But-2-ene","But-1-yne","Buta-1,3-diene"],ans:0,sol:"4C chain, double bond at C1-C2 = but-1-ene."},
    {id:"C34",s:"Chemistry",q:"ΔHf of C₂H₅OH using: C+O₂→CO₂ ΔH=-393; H₂+½O₂→H₂O ΔH=-286; C₂H₅OH combustion=-1368 kJ/mol",opts:["-277kJ/mol","+277kJ/mol","-1368kJ/mol","+689kJ/mol"],ans:0,sol:"ΔHf=2(-393)+3(-286)-(-1368)=-786-858+1368≈-277kJ/mol."},
    {id:"C35",s:"Chemistry",q:"During electrolysis of brine, product at the cathode is:",opts:["Chlorine","Hydrogen","Sodium","Oxygen"],ans:1,sol:"Cathode (reduction): 2H₂O+2e⁻→H₂+2OH⁻. Hydrogen is produced."},
    {id:"C36",s:"Chemistry",q:"Method that removes BOTH temporary AND permanent water hardness:",opts:["Boiling","Adding Ca(OH)₂","Ion exchange resin","Adding Na₂CO₃"],ans:2,sol:"Ion exchange resin replaces Ca²⁺ and Mg²⁺ with Na⁺ or H⁺ — removes ALL hardness types."},
    {id:"C37",s:"Chemistry",q:"Catalyst used in the Contact process for manufacturing H₂SO₄:",opts:["Iron","Vanadium(V) oxide V₂O₅","Platinum","Manganese dioxide"],ans:1,sol:"Contact process: 2SO₂+O₂⇌2SO₃ uses V₂O₅ catalyst at 450°C."},
    {id:"C38",s:"Chemistry",q:"Propanoic acid + PCl₅ → main organic product:",opts:["Propanoyl chloride","Propanol","Propene","Propanone"],ans:0,sol:"Carboxylic acid + PCl₅ → acid chloride. CH₃CH₂COOH → CH₃CH₂COCl (propanoyl chloride)."},
    {id:"C39",s:"Chemistry",q:"All C-C bonds in benzene are equal in length because:",opts:["Benzene is saturated","Alternating single and double bonds cancel each other","Delocalisation of π electrons gives all bonds identical character","Benzene contains no double bonds"],ans:2,sol:"Delocalised π electrons spread evenly → all C-C bonds identical length (0.139nm)."},
    {id:"C40",s:"Chemistry",q:"Gas occupies 4.48dm³ at STP, mass is 8.8g. Molar mass of gas: (Molar vol at STP=22.4dm³/mol)",opts:["22g/mol","44g/mol","88g/mol","176g/mol"],ans:1,sol:"Moles=4.48/22.4=0.2mol. M=8.8/0.2=44g/mol."},
  ],

      Biology: [
    {id:"B1",s:"Biology",q:"The sodium-potassium pump moves per ATP cycle:",opts:["3Na⁺ OUT and 2K⁺ IN","2Na⁺ OUT and 3K⁺ IN","3Na⁺ IN and 2K⁺ OUT","Equal numbers of both ions"],ans:0,sol:"Na⁺/K⁺ ATPase pump: 3 Na⁺ pumped OUT and 2 K⁺ pumped IN per ATP consumed."},
    {id:"B2",s:"Biology",q:"Calvin cycle (light-independent reactions) occurs in the:",opts:["Thylakoid membrane","Stroma of chloroplast","Outer membrane of chloroplast","Cytoplasm"],ans:1,sol:"Light reactions → thylakoid membrane. Calvin cycle (dark reactions) → stroma of chloroplast."},
    {id:"B3",s:"Biology",q:"Splitting of water by light in Photosystem II is called:",opts:["Phosphorylation","Chemiosmosis","Photolysis","Hydrolysis"],ans:2,sol:"Photolysis: H₂O→2H⁺+2e⁻+½O₂. Provides electrons for light reactions."},
    {id:"B4",s:"Biology",q:"ATP yield from complete aerobic oxidation of one glucose molecule:",opts:["2 ATP","4 ATP","36-38 ATP","100 ATP"],ans:2,sol:"Aerobic: glycolysis(2)+link reaction(2)+Krebs(2)+oxidative phosphorylation(~32-34)≈36-38 ATP."},
    {id:"B5",s:"Biology",q:"Respiratory quotient (RQ) for carbohydrate oxidation:",opts:["0.7","0.85","1.0","1.5"],ans:2,sol:"RQ=CO₂/O₂. For glucose: 6CO₂/6O₂=1.0. Fat≈0.7, Protein≈0.85."},
    {id:"B6",s:"Biology",q:"The Krebs cycle takes place in the:",opts:["Cytoplasm","Mitochondrial matrix","Inner mitochondrial membrane","Outer mitochondrial membrane"],ans:1,sol:"Krebs cycle: mitochondrial matrix. Oxidative phosphorylation: inner mitochondrial membrane."},
    {id:"B7",s:"Biology",q:"Dihybrid cross AaBb×AaBb. Ratio of individuals showing BOTH dominant traits:",opts:["1/16","3/16","9/16","12/16"],ans:2,sol:"9A_B_:3A_bb:3aaB_:1aabb. Both dominant traits (A_B_)=9/16."},
    {id:"B8",s:"Biology",q:"Carrier of haemophilia (X^H X^h) × normal man (X^H Y). Probability of haemophiliac son:",opts:["0%","25%","50%","100%"],ans:1,sol:"Half of sons get X^h. P(haemophiliac son)=1/4=25% of all children."},
    {id:"B9",s:"Biology",q:"Crossing over (recombination) occurs during:",opts:["Mitosis — anaphase","Meiosis I — prophase I","Meiosis II — metaphase II","Mitosis — prophase"],ans:1,sol:"Crossing over: prophase I of meiosis I, when homologous chromosomes pair and exchange segments at chiasmata."},
    {id:"B10",s:"Biology",q:"The NICHE of an organism is best described as:",opts:["The place where it lives","Its position in a food chain","Its total functional role in the ecosystem","Its relationship with other species only"],ans:2,sol:"Niche = total functional role: habitat, diet, predators, all interactions — broader than just habitat."},
    {id:"B11",s:"Biology",q:"Characteristic common to ALL chordates:",opts:["Backbone","Warm-bloodedness","Notochord at some developmental stage","Four limbs"],ans:2,sol:"ALL chordates have a notochord at some stage. Not all have backbones (tunicates don't)."},
    {id:"B12",s:"Biology",q:"Kingdom Protista organisms are:",opts:["Prokaryotic and unicellular","Eukaryotic and unicellular","Multicellular and heterotrophic","Prokaryotic and photosynthetic"],ans:1,sol:"Protists: EUKARYOTIC + mostly UNICELLULAR. Bacteria are prokaryotic."},
    {id:"B13",s:"Biology",q:"Kwashiorkor is caused by:",opts:["Vitamin A deficiency","Carbohydrate deficiency","Protein deficiency with adequate calories","Total calorie deficiency"],ans:2,sol:"Kwashiorkor=protein deficiency+adequate calorie intake. Marasmus=total calorie deficiency."},
    {id:"B14",s:"Biology",q:"Foetal haemoglobin compared to adult haemoglobin:",opts:["Contains iron atoms","Has lower O₂ affinity","Has higher O₂ affinity at same pO₂","Is only found in red blood cells"],ans:2,sol:"HbF has HIGHER O₂ affinity — allows it to extract O₂ from maternal blood across placenta."},
    {id:"B15",s:"Biology",q:"Counter-current multiplier in loop of Henle creates:",opts:["High blood pressure in kidney","Osmotic gradient in medulla for water reabsorption","Glucose reabsorption","Secretion of urea into tubule"],ans:1,sol:"Loop of Henle creates an increasing osmotic gradient in renal medulla → water reabsorption under ADH control."},
    {id:"B16",s:"Biology",q:"During nerve depolarisation, membrane potential reaches approximately:",opts:["-90mV","0mV","+30 to +40mV","+70mV"],ans:2,sol:"Action potential: Na⁺ rushes in → membrane goes from -70mV to +30 to +40mV (overshoot)."},
    {id:"B17",s:"Biology",q:"ADH is produced in the _______ and stored/released from the _______:",opts:["Posterior pituitary; kidney","Hypothalamus; posterior pituitary","Anterior pituitary; hypothalamus","Adrenal cortex; adrenal medulla"],ans:1,sol:"ADH: PRODUCED in hypothalamus, STORED and RELEASED from posterior pituitary."},
    {id:"B18",s:"Biology",q:"Ovulation is triggered by a surge in:",opts:["Oestrogen only","Progesterone","LH (Luteinising Hormone)","FSH (Follicle Stimulating Hormone)"],ans:2,sol:"LH surge (around day 14) triggers ovulation — release of mature egg from Graafian follicle."},
    {id:"B19",s:"Biology",q:"After releasing the ovum, the Graafian follicle becomes the:",opts:["Zona pellucida","Corpus luteum","Corpus albicans","Placenta"],ans:1,sol:"Graafian follicle → corpus luteum, which secretes progesterone to maintain uterine lining."},
    {id:"B20",s:"Biology",q:"Natural selection acts primarily on:",opts:["Genotype only","Phenotype (which reflects genotype)","Random alleles","Mutations only"],ans:1,sol:"Natural selection acts on PHENOTYPE. Favourable genotypes are selected indirectly through phenotypic expression."},
    {id:"B21",s:"Biology",q:"Hardy-Weinberg equilibrium requires:",opts:["Small population","Natural selection","Random mating and large population","Gene flow between populations"],ans:2,sol:"H-W: large population, no mutation, RANDOM MATING, no natural selection, no gene flow."},
    {id:"B22",s:"Biology",q:"Translocation in phloem is explained by the:",opts:["Root pressure only","Transpiration pull","Pressure flow (mass flow) hypothesis","Cohesion-tension theory"],ans:2,sol:"Pressure flow: sugars loaded at source create high pressure → mass flow to sink regions via phloem."},
    {id:"B23",s:"Biology",q:"Typhoid fever is transmitted primarily by:",opts:["Mosquito bites","Contaminated food and water","Droplet infection","Sexual contact"],ans:1,sol:"Typhoid (Salmonella typhi): WATERBORNE and FOODBORNE disease. Poor sanitation is the main route."},
    {id:"B24",s:"Biology",q:"Vector of river blindness (Onchocerciasis):",opts:["Female Anopheles mosquito","Tsetse fly","Blackfly (Simulium)","Sand fly"],ans:2,sol:"River blindness = Onchocerca volvulus worm transmitted by blackfly (Simulium) breeding in fast-flowing rivers."},
    {id:"B25",s:"Biology",q:"Plasmolysis occurs when plant cell is placed in hypertonic solution because:",opts:["Water enters by osmosis and cell bursts","Cell wall softens","Water leaves by osmosis and membrane pulls away from wall","Vacuole fills with solutes"],ans:2,sol:"Hypertonic: water leaves by osmosis → cytoplasm shrinks → membrane pulls away from rigid cell wall."},
    {id:"B26",s:"Biology",q:"Opening and closing of stomata is controlled by:",opts:["Mesophyll cells","Root hair cells","Guard cells","Epidermal cells"],ans:2,sol:"Guard cells: K⁺ enters → turgid → stomata open. K⁺ leaves → flaccid → stomata close."},
    {id:"B27",s:"Biology",q:"Rickets (caused by vitamin D deficiency) leads to:",opts:["Night blindness","Poor calcium absorption and soft bones","Scurvy","Anaemia"],ans:1,sol:"Vitamin D needed for intestinal Ca²⁺ absorption. Deficiency → soft/deformed bones (rickets in children)."},
    {id:"B28",s:"Biology",q:"Viruses are considered non-living because they:",opts:["Lack DNA","Cannot reproduce at all","Lack cellular structure and metabolism outside a host","Are too small to see"],ans:2,sol:"Viruses lack cellular structure, have no metabolic machinery, cannot reproduce outside a living host cell."},
    {id:"B29",s:"Biology",q:"Test cross gives 50% tall, 50% short offspring. Tall parent genotype:",opts:["TT","Tt","tt","Cannot determine"],ans:1,sol:"TT×tt→all tall. Tt×tt→50%Tt+50%tt. 50:50 result → tall parent is Tt (heterozygous)."},
    {id:"B30",s:"Biology",q:"Pyramid of numbers may be INVERTED when:",opts:["Producers are very numerous","Carnivores outnumber herbivores","A single large tree supports many insects","Energy is lost at each trophic level"],ans:2,sol:"One large tree (producer) supporting thousands of insects → inverted pyramid at producer level."},
    {id:"B31",s:"Biology",q:"Hormone that maintains uterine lining and inhibits further ovulation during pregnancy:",opts:["Oestrogen","FSH","Progesterone","Oxytocin"],ans:2,sol:"Progesterone: maintains uterine lining, inhibits ovulation, maintains corpus luteum during pregnancy."},
    {id:"B32",s:"Biology",q:"Myelin sheath is produced by:",opts:["Astrocytes","Microglia","Schwann cells (PNS) and oligodendrocytes (CNS)","Ependymal cells"],ans:2,sol:"Schwann cells (PNS) and oligodendrocytes (CNS) produce myelin → speeds up nerve impulse transmission."},
    {id:"B33",s:"Biology",q:"Two cystic fibrosis carriers (autosomal recessive) have children. Probability child is a CARRIER (not affected):",opts:["25%","50%","75%","100%"],ans:1,sol:"Carrier × Carrier: 1AA:2Aa:1aa. P(carrier Aa)=2/4=50%."},
    {id:"B34",s:"Biology",q:"Chromosomes align at the equatorial plate during:",opts:["Prophase","Metaphase","Anaphase","Telophase"],ans:1,sol:"Metaphase: chromosomes line up at the metaphase plate. Spindle fibres attach to centromeres."},
    {id:"B35",s:"Biology",q:"Process returning nitrogen from dead organisms to soil as ammonia is called:",opts:["Nitrification","Denitrification","Nitrogen fixation","Ammonification"],ans:3,sol:"Ammonification: decomposers break down organic nitrogen compounds in dead organisms → ammonia (NH₃)."},
    {id:"B36",s:"Biology",q:"The fluid mosaic model of the cell membrane describes:",opts:["A rigid protein bilayer","A phospholipid bilayer with embedded and floating proteins","A protein layer surrounding a lipid core","A static arrangement of lipids and proteins"],ans:1,sol:"Fluid mosaic: phospholipid bilayer + embedded/peripheral proteins. Fluid=lateral movement, mosaic=varied proteins."},
    {id:"B37",s:"Biology",q:"Enzyme converting maltose to glucose in the small intestine:",opts:["Amylase","Lipase","Maltase","Sucrase"],ans:2,sol:"Maltase (brush border enzyme): maltose → 2 glucose molecules. Sucrase: sucrose → glucose + fructose."},
    {id:"B38",s:"Biology",q:"Main function of root hair cells:",opts:["Photosynthesise","Anchor the plant only","Increase surface area for absorption of water and minerals","Store starch"],ans:2,sol:"Root hair cells: elongated extensions → greatly increased surface area for water (osmosis) and mineral absorption (active transport)."},
    {id:"B39",s:"Biology",q:"A sudden decrease in prey population would FIRST cause the predator population to:",opts:["Immediately increase","Decrease due to food shortage","Stay constant","Show no change"],ans:1,sol:"Less prey → less food → predator population decreases. Then with fewer predators, prey can recover — creating oscillating cycles."},
    {id:"B40",s:"Biology",q:"Primary function of lysosomes:",opts:["Protein synthesis","ATP production","Intracellular digestion using hydrolytic enzymes","Lipid synthesis"],ans:2,sol:"Lysosomes contain hydrolytic enzymes for intracellular digestion of worn-out organelles and foreign particles."},
  ],
};



// ─── HELPERS ─────────────────────────────────────────────────────────────────
function buildQs(comboIdx) {
  const sciences = COMBOS[comboIdx].sciences;
  return [...QB.English, ...sciences.flatMap(s => QB[s] || [])];
}

function calcScore(questions, answers) {
  let correct = 0;
  const bySub = {};
  questions.forEach(q => {
    if (!bySub[q.s]) bySub[q.s] = { correct:0, total:0 };
    bySub[q.s].total++;
    if (answers[q.id] === q.ans) { correct++; bySub[q.s].correct++; }
  });
  return {
    correct, total: questions.length,
    jamb: Math.round((correct / questions.length) * 400),
    pct:  Math.round((correct / questions.length) * 100),
    bySub,
  };
}

const fmtTime = s => `${Math.floor(s/3600)}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

// ─── REUSABLE INPUT ───────────────────────────────────────────────────────────
const Field = ({label, type="text", ph, val, onChange, err}) => (
  <div style={{marginBottom:16}}>
    <label style={{display:"block",fontWeight:700,fontSize:13,color:"#374151",marginBottom:5}}>{label}</label>
    <input type={type} placeholder={ph} value={val} onChange={onChange}
      style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1.5px solid ${err?"#ef4444":"#d1d5db"}`,fontSize:14,color:"#111827",background:"#fff",boxSizing:"border-box",outline:"none",transition:"border 0.15s"}}
      onFocus={e=>e.target.style.borderColor="#f59e0b"}
      onBlur={e=>e.target.style.borderColor=err?"#ef4444":"#d1d5db"}
    />
    {err && <p style={{color:"#ef4444",fontSize:12,margin:"4px 0 0"}}>{err}</p>}
  </div>
);


             // ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase,     setPhase]     = useState("signup");
  const [form,      setForm]      = useState({name:"",email:"",password:"",whatsapp:"",school:"",combo:"0"});
  const [errs,      setErrs]      = useState({});
  const [loading,   setLoading]   = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers,   setAnswers]   = useState({});
  const [flagged,   setFlagged]   = useState({});
  const [cur,       setCur]       = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(TOTAL_SECS);
  const [subFilter, setSubFilter] = useState("All");
  const [confirm,   setConfirm]   = useState(false);
  const [result,    setResult]    = useState(null);
  const [solSub,    setSolSub]    = useState("All");
  const [results,   setResults]   = useState([]);
  const [adminPw,   setAdminPw]   = useState("");
  const [adminOk,   setAdminOk]   = useState(false);
  const [showPass,  setShowPass]  = useState(false);

  // Load stored results
  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get(STORE, true); if(r?.value) setResults(JSON.parse(r.value)); } catch(_) {}
    })();
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "exam") return;
    if (timeLeft <= 0) { doSubmit(); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const tc = timeLeft < 300 ? "#ef4444" : timeLeft < 600 ? "#f59e0b" : "#16a34a";
  const examSubs = ["All", ...new Set(questions.map(q => q.s))];
  const filtQs   = subFilter === "All" ? questions : questions.filter(q => q.s === subFilter);
  const cq       = filtQs[cur] || null;
  const qi       = cq ? filtQs.indexOf(cq) : 0;
  const cc       = cq ? CFG[cq.s] : CFG.English;
  const ac       = Object.keys(answers).length;
  const isComp   = cq && cq.comp;

  const f = (k, v) => setForm(p => ({...p, [k]: v}));

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name = "Full name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email address required";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!/^[0-9]{10,13}$/.test(form.whatsapp.replace(/[\s\-+]/g,""))) e.whatsapp = "Enter a valid WhatsApp number (10–13 digits)";
    if (!form.school.trim()) e.school = "School or aspired university is required";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const startExam = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const key = ATT_PFX + form.email.toLowerCase().trim();
      const ex  = await window.storage.get(key, true);
      if (ex?.value) {
        const data = JSON.parse(ex.value);
        const hoursPassed = (Date.now() - data.time) / 3600000;
        if (data.count >= 2) {
          setErrs({email:"You have used both attempts. No further attempts allowed."});
          setLoading(false); return;
        }
        if (data.count === 1 && hoursPassed < RETAKE_HOURS) {
          const hrs = Math.ceil(RETAKE_HOURS - hoursPassed);
          setErrs({email:`You can retake in ${hrs} hour${hrs>1?"s":""}. One retake is allowed after 24 hours.`});
          setLoading(false); return;
        }
      }
    } catch(_) {}
    const qs = buildQs(Number(form.combo));
    setQuestions(qs); setAnswers({}); setFlagged({}); setCur(0); setSubFilter("All"); setTimeLeft(TOTAL_SECS);
    setPhase("exam"); setLoading(false);
  };

  const doSubmit = useCallback(async () => {
    setConfirm(false);
    const sc = calcScore(questions, answers);
    const ts = new Date().toLocaleString("en-NG", {timeZone:"Africa/Lagos"});
    const res = {...form, combo:COMBOS[Number(form.combo)].label, ...sc, timestamp:ts, questions, answers};
    setResult(res); setSolSub("All");

    // Save result
    try {
      const prev = await window.storage.get(STORE, true);
      const arr  = prev?.value ? JSON.parse(prev.value) : [];
      arr.push({name:form.name,email:form.email,whatsapp:form.whatsapp,school:form.school,combo:res.combo,...sc,timestamp:ts});
      await window.storage.set(STORE, JSON.stringify(arr), true);
      setResults(arr);
    } catch(_) {}

    // Track attempt
    try {
      const key  = ATT_PFX + form.email.toLowerCase().trim();
      const prev = await window.storage.get(key, true);
      const data = prev?.value ? JSON.parse(prev.value) : {count:0, time:0};
      await window.storage.set(key, JSON.stringify({count: data.count+1, time: Date.now()}), true);
    } catch(_) {}

    setPhase("result");
  }, [questions, answers, form]);

    // ── SIGNUP ─────────────────────────────────────────────────────────────────
  if (phase === "signup") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#fffbeb 0%,#fef9f0 50%,#fff7ed 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"Georgia,serif"}}>
      <div style={{background:"#fff",borderRadius:20,padding:"36px 28px",maxWidth:480,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.1)",border:"1px solid #fde68a"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:64,height:64,borderRadius:16,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 12px",boxShadow:"0 8px 20px rgba(245,158,11,0.35)"}}>🎯</div>
          <h1 style={{color:"#92400e",fontSize:22,fontWeight:800,margin:"0 0 4px",letterSpacing:"-0.5px"}}>AGITA Mock CBT 2026</h1>
          <p style={{color:"#78716c",fontSize:13,margin:0}}>JAMB UTME Practice Examination</p>
        </div>

        {/* Notice */}
        <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"10px 14px",marginBottom:20}}>
          {["📖 English: Comprehension + The Lekki Headmaster + Grammar","⏱ Duration: 2 Hours • 180 Questions total","🔁 One free retake allowed after 24 hours","📊 Scored over 400 — JAMB standard","✅ Full solutions shown after submitting"].map((t,i)=>(
            <div key={i} style={{color:"#92400e",fontSize:12,marginBottom:i<4?4:0}}>{t}</div>
          ))}
        </div>

        <Field label="Full Name *" ph="e.g. Adebayo Emmanuel" val={form.name} onChange={e=>f("name",e.target.value)} err={errs.name}/>
        <Field label="Email Address *" type="email" ph="e.g. adebayo@gmail.com" val={form.email} onChange={e=>f("email",e.target.value)} err={errs.email}/>
        <Field label="Password *" type="password" ph="Minimum 6 characters" val={form.password} onChange={e=>f("password",e.target.value)} err={errs.password}/>
        <Field label="WhatsApp Number *" type="tel" ph="e.g. 08012345678" val={form.whatsapp} onChange={e=>f("whatsapp",e.target.value)} err={errs.whatsapp}/>
        <Field label="Aspired University / School *" ph="e.g. University of Lagos" val={form.school} onChange={e=>f("school",e.target.value)} err={errs.school}/>

        <div style={{marginBottom:24}}>
          <label style={{display:"block",fontWeight:700,fontSize:13,color:"#374151",marginBottom:8}}>Subject Combination *</label>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {COMBOS.map((c,i) => (
              <label key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,border:`1.5px solid ${Number(form.combo)===i?"#f59e0b":"#e5e7eb"}`,background:Number(form.combo)===i?"#fffbeb":"#f9fafb",cursor:"pointer",transition:"all 0.15s"}}>
                <input type="radio" name="combo" value={i} checked={Number(form.combo)===i} onChange={e=>f("combo",e.target.value)} style={{accentColor:"#f59e0b",width:16,height:16}}/>
                <span style={{color:Number(form.combo)===i?"#92400e":"#374151",fontSize:13,fontWeight:Number(form.combo)===i?600:400}}>📚 English + {c.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={startExam} disabled={loading}
          style={{width:"100%",padding:"14px",borderRadius:12,background:loading?"#d1d5db":"linear-gradient(135deg,#f59e0b,#d97706)",color:"white",fontSize:15,fontWeight:800,border:"none",cursor:loading?"not-allowed":"pointer",boxShadow:loading?"none":"0 8px 20px rgba(245,158,11,0.4)",letterSpacing:"0.3px",transition:"all 0.2s"}}>
          {loading ? "Checking..." : "START EXAM 🚀"}
        </button>

        <div style={{textAlign:"center",marginTop:14}}>
          <button onClick={() => setPhase("admin")} style={{background:"transparent",border:"none",color:"#9ca3af",fontSize:11,cursor:"pointer",textDecoration:"underline"}}>
            Admin Results Dashboard
          </button>
        </div>
      </div>
    </div>
  );


    
  // ── RESULT + SOLUTIONS ─────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const {jamb,pct,correct,total,bySub,questions:qs,answers:ans,name,school,combo} = result;
    const grade = jamb>=280?"EXCELLENT 🌟":jamb>=200?"GOOD 👍":jamb>=160?"AVERAGE 📈":"NEEDS MORE STUDY 📚";
    const gc    = jamb>=280?"#16a34a":jamb>=200?"#d97706":jamb>=160?"#ea580c":"#dc2626";
    const solQs = solSub==="All" ? qs : qs.filter(q => q.s===solSub);
    const solSubs = ["All", ...new Set(qs.map(q => q.s))];

    return (
      <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"Georgia,serif",padding:16}}>
        <div style={{maxWidth:680,margin:"0 auto",paddingTop:20}}>

          {/* Score card */}
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:16,padding:24,textAlign:"center",marginBottom:14,boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:44,marginBottom:8}}>🏆</div>
            <h1 style={{color:"#111827",fontSize:20,margin:"0 0 3px",fontWeight:800}}>Exam Complete!</h1>
            <p style={{color:"#6b7280",fontSize:12,margin:"0 0 2px"}}>{name} • {school}</p>
            <p style={{color:"#9ca3af",fontSize:11,margin:"0 0 18px"}}>English + {combo}</p>

            <div style={{background:"#f9fafb",borderRadius:12,padding:20,marginBottom:14,border:`2px solid ${gc}25`}}>
              <div style={{color:"#6b7280",fontSize:10,letterSpacing:2,marginBottom:4,textTransform:"uppercase"}}>JAMB Score</div>
              <div style={{fontSize:60,fontWeight:900,color:gc,lineHeight:1}}>{jamb}</div>
              <div style={{color:"#9ca3af",fontSize:12,marginBottom:10}}>out of 400</div>
              <div style={{display:"flex",justifyContent:"center",gap:28,marginBottom:10}}>
                <div><div style={{color:gc,fontSize:20,fontWeight:800}}>{pct}%</div><div style={{color:"#6b7280",fontSize:11}}>Percentage</div></div>
                <div><div style={{color:"#374151",fontSize:20,fontWeight:800}}>{correct}/{total}</div><div style={{color:"#6b7280",fontSize:11}}>Correct</div></div>
              </div>
              <div style={{color:gc,fontWeight:700,fontSize:15}}>{grade}</div>
            </div>

            <div style={{display:"grid",gap:8}}>
              {Object.entries(bySub).map(([s,d]) => {
                const c = CFG[s]||CFG.English, sp = Math.round(d.correct/d.total*100);
                return (
                  <div key={s} style={{background:"#f9fafb",borderRadius:10,padding:"10px 14px",border:`1.5px solid ${c.border}`,display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:16}}>{c.i}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{color:"#374151",fontWeight:700,fontSize:12}}>{s}</span>
                        <span style={{color:c.c,fontWeight:700,fontSize:12}}>{d.correct}/{d.total} ({sp}%)</span>
                      </div>
                      <div style={{background:"#e5e7eb",borderRadius:99,height:6}}>
                        <div style={{background:c.c,borderRadius:99,height:6,width:`${sp}%`,transition:"width 1s"}}/>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solutions */}
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:16,padding:20,marginBottom:14,boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
            <h2 style={{color:"#111827",fontSize:16,margin:"0 0 14px",fontWeight:800}}>📝 Solutions & Corrections</h2>

            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
              {solSubs.map(s => {
                const sc = s!=="All"?CFG[s]:null, ia = solSub===s;
                return (
                  <button key={s} onClick={() => setSolSub(s)}
                    style={{padding:"5px 12px",borderRadius:99,border:`1.5px solid ${ia?(sc?sc.c:"#f59e0b"):"#e5e7eb"}`,cursor:"pointer",fontSize:11,fontWeight:700,background:ia?(sc?sc.bg:"#fffbeb"):"#f9fafb",color:ia?(sc?sc.c:"#92400e"):"#6b7280",transition:"all 0.15s"}}>
                    {s!=="All"&&sc.i} {s}
                  </button>
                );
              })}
            </div>

            {(solSub==="All"||solSub==="English") && (
              <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:14,marginBottom:16}}>
                <div style={{color:"#92400e",fontWeight:700,fontSize:12,marginBottom:8}}>📄 COMPREHENSION PASSAGE — Reference for Q1–Q10</div>
                <p style={{color:"#78716c",fontSize:12,lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{PASSAGE}</p>
              </div>
            )}

            {solQs.map((q, idx) => {
              const ua = ans[q.id], isC = ua===q.ans, c = CFG[q.s]||CFG.English;
              return (
                <div key={q.id} style={{marginBottom:12,padding:14,borderRadius:12,background:isC?"#f0fdf4":"#fff1f2",border:`1.5px solid ${isC?"#bbf7d0":"#fecdd3"}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{background:c.c,color:"white",borderRadius:99,padding:"2px 8px",fontSize:10,fontWeight:700}}>{c.i} {c.label}</span>
                    <span style={{fontSize:16}}>{isC?"✅":"❌"}</span>
                  </div>
                  <p style={{color:"#111827",fontSize:13,fontWeight:700,margin:"0 0 8px",lineHeight:1.6}}>Q{idx+1}. {q.q}</p>
                  <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:8}}>
                    {q.opts.map((opt,i) => {
                      const isCO=i===q.ans, isUO=i===ua;
                      let bg="#f9fafb", bdr="#e5e7eb", col="#374151";
                      if (isCO)          { bg="#f0fdf4"; bdr="#22c55e"; col="#16a34a"; }
                      if (isUO&&!isCO)   { bg="#fff1f2"; bdr="#f43f5e"; col="#dc2626"; }
                      return (
                        <div key={i} style={{padding:"6px 12px",borderRadius:8,background:bg,border:`1.5px solid ${bdr}`,color:col,fontSize:12}}>
                          <span style={{fontWeight:800,marginRight:6}}>{["A","B","C","D"][i]})</span>{opt}
                          {isCO   && <span style={{marginLeft:6,fontSize:11,fontWeight:700}}> ✓ Correct answer</span>}
                          {isUO&&!isCO && <span style={{marginLeft:6,fontSize:11,fontWeight:700}}> ✗ Your answer</span>}
                          {ua===undefined&&isCO && <span style={{marginLeft:6,fontSize:11,color:"#9ca3af"}}>(not attempted)</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:10}}>
                    <span style={{color:"#d97706",fontSize:11,fontWeight:700}}>💡 Explanation: </span>
                    <span style={{color:"#374151",fontSize:12}}>{q.sol}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:12,textAlign:"center",marginBottom:14}}>
            <span style={{color:"#1d4ed8",fontSize:12}}>🔁 You have <strong>one free retake</strong> available after 24 hours from your first attempt.</span>
          </div>

          <button onClick={() => { setPhase("signup"); setResult(null); }}
            style={{width:"100%",padding:13,borderRadius:12,background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"white",fontSize:14,fontWeight:800,border:"none",cursor:"pointer",boxShadow:"0 6px 18px rgba(245,158,11,0.35)"}}>
            🔁 Go Back to Start
          </button>
        </div>
      </div>
    );
                    }


               // ── ADMIN ──────────────────────────────────────────────────────────────────
  if (phase === "admin") return (
    <div style={{minHeight:"100vh",background:"#f9fafb",padding:16,fontFamily:"Georgia,serif"}}>
      <div style={{maxWidth:"100%",margin:"0 auto"}}>
        <button onClick={() => setPhase("signup")} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:"7px 14px",color:"#374151",cursor:"pointer",marginBottom:16,fontSize:12,fontWeight:600}}>← Back</button>
        <h1 style={{color:"#111827",fontSize:20,marginBottom:4,fontWeight:800}}>🎯 AGITA Results Dashboard</h1>
        <p style={{color:"#6b7280",fontSize:12,marginBottom:20}}>Admin access only • Password protected</p>

        {!adminOk ? (
          <div style={{maxWidth:320,background:"#fff",borderRadius:16,padding:24,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",border:"1px solid #e5e7eb"}}>
            <Field label="Admin Password" type="password" ph="Enter admin password" val={adminPw} onChange={e=>setAdminPw(e.target.value)}/>
            <button onClick={async () => {
              if (adminPw !== ADMIN_PW) { alert("Incorrect password"); return; }
              setAdminOk(true);
              try { const r = await window.storage.get(STORE,true); if(r?.value) setResults(JSON.parse(r.value)); } catch(_) {}
            }} style={{width:"100%",padding:12,borderRadius:10,background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"white",fontWeight:800,border:"none",cursor:"pointer",fontSize:14}}>
              Access Dashboard
            </button>
          </div>
        ) : (
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:20}}>
              {[["Total Candidates",results.length,"#d97706"],["Avg Score",results.length?Math.round(results.reduce((a,r)=>a+r.jamb,0)/results.length)+"/400":"—","#16a34a"],["Score ≥ 200",results.filter(r=>r.jamb>=200).length,"#1d4ed8"],["Score < 160",results.filter(r=>r.jamb<160).length,"#dc2626"]].map(([l,v,c])=>(
                <div key={l} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                  <div style={{color:c,fontSize:26,fontWeight:900}}>{v}</div>
                  <div style={{color:"#6b7280",fontSize:11,marginTop:3}}>{l}</div>
                </div>
              ))}
            </div>
            {results.length === 0 ? (
              <div style={{background:"#fff",borderRadius:12,padding:40,textAlign:"center",color:"#9ca3af",border:"1px solid #e5e7eb"}}>No results yet. Share the exam link with your students!</div>
            ) : (
              <div style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",overflowX:"auto",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead>
                    <tr style={{background:"#fffbeb",borderBottom:"1.5px solid #fde68a"}}>
                      {["#","Name","Email","WhatsApp","School","Combination","Score/400","Percent","Date"].map(h=>(
                        <th key={h} style={{padding:"10px 10px",color:"#92400e",textAlign:"left",fontWeight:800,whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...results].reverse().map((r,i)=>{
                      const gc2=r.jamb>=280?"#16a34a":r.jamb>=200?"#d97706":r.jamb>=160?"#ea580c":"#dc2626";
                      return (
                        <tr key={i} style={{borderBottom:"1px solid #f3f4f6",background:i%2===0?"#fff":"#fafafa"}}>
                          <td style={{padding:"9px 10px",color:"#9ca3af"}}>{results.length-i}</td>
                          <td style={{padding:"9px 10px",color:"#111827",fontWeight:700,whiteSpace:"nowrap"}}>{r.name}</td>
                          <td style={{padding:"9px 10px",color:"#6b7280",whiteSpace:"nowrap"}}>{r.email}</td>
                          <td style={{padding:"9px 10px",color:"#6b7280",whiteSpace:"nowrap"}}>{r.whatsapp}</td>
                          <td style={{padding:"9px 10px",color:"#6b7280",whiteSpace:"nowrap"}}>{r.school}</td>
                          <td style={{padding:"9px 10px",color:"#6b7280",fontSize:11,whiteSpace:"nowrap"}}>{r.combo}</td>
                          <td style={{padding:"9px 10px",color:gc2,fontWeight:900,fontSize:14,whiteSpace:"nowrap"}}>{r.jamb}/400</td>
                          <td style={{padding:"9px 10px",color:gc2,whiteSpace:"nowrap"}}>{r.pct}%</td>
                          <td style={{padding:"9px 10px",color:"#9ca3af",fontSize:11,whiteSpace:"nowrap"}}>{r.timestamp}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );



  // ── EXAM ───────────────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"Georgia,serif",display:"flex",flexDirection:"column"}}>

      {/* Top bar */}
      <div style={{background:"#fff",borderBottom:"1.5px solid #e5e7eb",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
        <div>
          <div style={{color:"#92400e",fontWeight:800,fontSize:12}}>🎯 AGITA Mock CBT</div>
          <div style={{color:"#9ca3af",fontSize:10}}>{form.name}</div>
        </div>
        <div style={{background:timeLeft<300?"#fff1f2":timeLeft<600?"#fffbeb":"#f0fdf4",border:`2px solid ${tc}`,borderRadius:99,padding:"5px 14px",color:tc,fontWeight:800,fontSize:15,fontFamily:"monospace"}}>
          ⏱ {fmtTime(timeLeft)}
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{color:"#374151",fontSize:11,fontWeight:700}}>{ac}/{questions.length}</div>
          <div style={{color:"#9ca3af",fontSize:9}}>answered</div>
        </div>
      </div>

      {/* Subject tabs */}
      <div style={{background:"#fff",padding:"8px 14px",display:"flex",gap:6,overflowX:"auto",borderBottom:"1px solid #e5e7eb"}}>
        {examSubs.map(s => {
          const sc = s!=="All"?CFG[s]:null, ia = subFilter===s;
          const cnt = s!=="All"?Object.keys(answers).filter(k=>questions.find(q=>q.id===k)?.s===s).length:ac;
          const tot = s!=="All"?questions.filter(q=>q.s===s).length:questions.length;
          return (
            <button key={s} onClick={() => { setSubFilter(s); setCur(0); }}
              style={{padding:"5px 12px",borderRadius:99,border:`1.5px solid ${ia?(sc?sc.c:"#f59e0b"):"#e5e7eb"}`,cursor:"pointer",whiteSpace:"nowrap",fontSize:11,fontWeight:700,background:ia?(sc?sc.bg:"#fffbeb"):"#f9fafb",color:ia?(sc?sc.c:"#92400e"):"#6b7280",transition:"all 0.15s"}}>
              {s!=="All"&&sc.i} {s} ({cnt}/{tot})
            </button>
          );
        })}
      </div>

      {cq && (
        <div style={{flex:1,padding:14,maxWidth:700,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>

          {/* Comprehension passage toggle */}
          {isComp && (
            <div style={{marginBottom:12}}>
              <button onClick={() => setShowPass(!showPass)}
                style={{width:"100%",padding:"10px 14px",borderRadius:10,background:"#fffbeb",border:"1.5px solid #fde68a",color:"#92400e",fontSize:12,fontWeight:700,cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span>📄 Read Comprehension Passage (Q1–Q10)</span>
                <span>{showPass?"▲":"▼"}</span>
              </button>
              {showPass && (
                <div style={{background:"#fff",border:"1.5px solid #fde68a",borderRadius:10,padding:14,marginTop:6,maxHeight:240,overflowY:"auto",boxShadow:"0 4px 12px rgba(0,0,0,0.06)"}}>
                  <p style={{color:"#374151",fontSize:12,lineHeight:1.9,margin:0,whiteSpace:"pre-line"}}>{PASSAGE}</p>
                </div>
              )}
            </div>
          )}

          {/* Question header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{background:cc.c,color:"white",borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:700}}>{cc.i} {cc.label}</span>
              <span style={{color:"#9ca3af",fontSize:11}}>Q{qi+1} of {filtQs.length}</span>
            </div>
            <button onClick={() => setFlagged(p => ({...p,[cq.id]:!p[cq.id]}))}
              style={{background:flagged[cq.id]?"#fffbeb":"#f9fafb",border:`1.5px solid ${flagged[cq.id]?"#f59e0b":"#e5e7eb"}`,borderRadius:8,padding:"5px 10px",color:flagged[cq.id]?"#d97706":"#9ca3af",cursor:"pointer",fontSize:11,fontWeight:600}}>
              {flagged[cq.id]?"🚩 Flagged":"⚑ Flag"}
            </button>
          </div>

          {/* Question card */}
          <div style={{background:"#fff",border:`1.5px solid ${cc.border}`,borderRadius:14,padding:20,marginBottom:12,boxShadow:"0 4px 12px rgba(0,0,0,0.06)"}}>
            <p style={{color:"#111827",fontSize:14,lineHeight:1.8,margin:0,fontWeight:600}}>
              <span style={{color:cc.c,fontWeight:800,marginRight:8}}>Q{qi+1}.</span>{cq.q}
            </p>
          </div>

          {/* Options */}
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
            {cq.opts.map((opt,idx) => {
              const sel = answers[cq.id]===idx;
              return (
                <button key={idx} onClick={() => setAnswers(p => ({...p,[cq.id]:idx}))}
                  style={{padding:"12px 16px",borderRadius:10,textAlign:"left",cursor:"pointer",fontSize:13,lineHeight:1.6,background:sel?cc.bg:"#fff",border:`1.5px solid ${sel?cc.c:"#e5e7eb"}`,color:sel?cc.c:"#374151",fontWeight:sel?700:400,transition:"all 0.15s",boxShadow:sel?`0 0 0 3px ${cc.c}20`:"none"}}>
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:22,height:22,borderRadius:"50%",marginRight:10,fontSize:11,fontWeight:800,background:sel?cc.c:"#f3f4f6",color:sel?"white":"#6b7280",flexShrink:0}}>
                    {["A","B","C","D"][idx]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <button onClick={() => setCur(Math.max(0,qi-1))} disabled={qi===0}
              style={{flex:1,padding:10,borderRadius:10,border:"1.5px solid #e5e7eb",background:"#fff",color:qi===0?"#d1d5db":"#374151",cursor:qi===0?"not-allowed":"pointer",fontSize:13,fontWeight:600}}>← Prev</button>
            <button onClick={() => setCur(Math.min(filtQs.length-1,qi+1))} disabled={qi===filtQs.length-1}
              style={{flex:1,padding:10,borderRadius:10,border:`1.5px solid ${cc.c}`,background:cc.bg,color:qi===filtQs.length-1?"#d1d5db":cc.c,cursor:qi===filtQs.length-1?"not-allowed":"pointer",fontSize:13,fontWeight:700}}>Next →</button>
          </div>

          {/* Grid navigator */}
          <div style={{background:"#fff",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #e5e7eb",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
            <div style={{color:"#6b7280",fontSize:11,marginBottom:8,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontWeight:600}}>Question Navigator</span>
              <span style={{color:"#d97706",fontWeight:600}}>🚩 {Object.values(flagged).filter(Boolean).length} flagged</span>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
              {filtQs.map((q,idx) => {
                const ia2=answers[q.id]!==undefined, ifl=flagged[q.id], ic=q.id===cq.id, qc=CFG[q.s];
                return (
                  <button key={q.id} onClick={() => setCur(idx)}
                    style={{width:28,height:28,borderRadius:6,border:`${ic?"2px":"1.5px"} solid ${ic?qc.c:ia2?qc.c:ifl?"#f59e0b":"#e5e7eb"}`,cursor:"pointer",fontSize:9,fontWeight:800,background:ic?qc.c:ia2?qc.bg:ifl?"#fffbeb":"#f9fafb",color:ic?"white":ia2?qc.c:ifl?"#d97706":"#9ca3af",transition:"all 0.1s"}}>
                    {idx+1}
                  </button>
                );
              })}
            </div>
            <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap"}}>
              {[["#f9fafb","#e5e7eb","#6b7280","Not answered"],["#fffbeb","#f59e0b","#d97706","Flagged"],["white","#16a34a","#16a34a","Answered"]].map(([bg,bdr,col,lbl])=>(
                <div key={lbl} style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:12,height:12,borderRadius:3,background:bg,border:`1.5px solid ${bdr}`}}/>
                  <span style={{color:"#6b7280",fontSize:10}}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setConfirm(true)}
            style={{width:"100%",padding:14,borderRadius:12,background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"white",fontSize:14,fontWeight:800,border:"none",cursor:"pointer",boxShadow:"0 6px 18px rgba(245,158,11,0.35)"}}>
            Submit Exam 📝
          </button>
        </div>
      )}

      {/* Confirm modal */}
      {confirm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:20,padding:28,maxWidth:360,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
            <div style={{fontSize:44,marginBottom:10}}>⚠️</div>
            <h2 style={{color:"#111827",margin:"0 0 8px",fontSize:18,fontWeight:800}}>Submit Exam?</h2>
            <div style={{color:"#6b7280",fontSize:13,marginBottom:5}}>Answered: <span style={{color:"#16a34a",fontWeight:800}}>{ac}/{questions.length}</span></div>
            <div style={{color:"#6b7280",fontSize:13,marginBottom:16}}>Unanswered: <span style={{color:"#dc2626",fontWeight:800}}>{questions.length-ac}</span></div>
            <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:10,marginBottom:18}}>
              <span style={{color:"#1d4ed8",fontSize:12}}>🔁 You have <strong>one free retake</strong> available 24 hours after your first attempt.</span>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={() => setConfirm(false)} style={{flex:1,padding:11,borderRadius:10,border:"1.5px solid #e5e7eb",background:"#f9fafb",color:"#374151",cursor:"pointer",fontSize:13,fontWeight:600}}>Cancel</button>
              <button onClick={doSubmit} style={{flex:1,padding:11,borderRadius:10,background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"white",fontWeight:800,border:"none",cursor:"pointer",fontSize:13}}>Submit ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
              }

                                           

                                                                                                            
                                                
