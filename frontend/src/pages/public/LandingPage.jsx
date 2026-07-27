import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImg from '../../assets/spaceece-logo.png';
import heroMascotImg from '../../assets/hero_mascot.png';
import LoadingScreen from '../auth/LoadingScreen';
import './LandingPage.css';

/**
 * Full Multilingual Dictionary for SpacECE NGO Landing Page (EN, HI, MR)
 * Strictly aligned with SpacECE_Intern_Task_Allocation.pdf
 */
const content = {
  en: {
    // Nav
    navWhy: "Why It Matters",
    navHow: "How It Works",
    navLearn: "What Kids Learn",
    navPrograms: "Our Programs",
    navCenters: "For Centers",
    navLogin: "Portal Login",
    navRegister: "Get Started",

    // Hero
    heroBadge: "SpacECE India Foundation • Non-Profit Early Education (Ages 0–8)",
    heroTitleLine1: "Empowering Futures Through ",
    heroTitleHighlight: "Early Childhood Excellence",
    heroSubtitle: "AI-powered learning, milestone screening, and school-readiness tracking for children aged 0–8. Designed to support parents, educators, and community Anganwadis.",
    heroBtnPrimary: "🚀 Start Learning Journey — Free",
    heroBtnSecondary: "🔑 Select Your Role",
    trustNep: "NEP 2020 & ICDS Aligned",
    trustTesting: "Zero Pressure Testing",
    trustFoundation: "Backed by SpacECE Foundation",
    mascotTitle: "Meet Your AI Learning Mascot",
    mascotDesc: "Guiding early milestone adventures every day!",
    floatBadge1: "📚 Literacy & Storytelling",
    floatBadge2: "🔢 Numeracy & Math Logic",
    floatBadge3: "❤️ Emotional & Social Growth",

    // Why This Matters
    whyTag: "Why Early Childhood Matters",
    whyTitle: "The First 8 Years Shape 90% of Brain Architecture",
    whySubtitle: "Our digital companion extends SpacECE Foundation's trusted on-ground community work directly into every home and classroom.",
    whyCard1Title: "Critical Developmental Window",
    whyCard1Text: "Over 90% of brain architecture is constructed before age 8. SpacECE provides targeted milestone activities to nourish every stage of early growth.",
    whyCard2Title: "On-Ground SpacECE Credibility",
    whyCard2Text: "Built upon years of real, on-ground community foundation work in Maharashtra, extending physical early childhood programs into a digital companion.",
    whyCard3Title: "NEP 2020 & ICDS Alignment",
    whyCard3Text: "Fully aligned with National Education Policy (NEP 2020) and Integrated Child Development Services (ICDS) frameworks for holistic child care and education.",

    // How It Works
    howTag: "Simple 3-Step Process",
    howTitle: "How SpacECE Empowers Learning",
    howSubtitle: "Simple, stress-free, and effective learning for every child.",
    step1Title: "Child Plays Fun Games",
    step1Desc: "Children engage in joyful, play-based activities tailored to their age, covering phonics, math, puzzles, and creative storytelling.",
    step2Title: "Quiet Milestone Tracking",
    step2Desc: "The system quietly tracks developmental progress in the background — no exams, no stress, and no pressure on little learners.",
    step3Title: "Simple Readiness Reports",
    step3Desc: "Parents and teachers receive simple, actionable readiness reports highlighting strengths, progress, and personalized guidance.",

    // Learn Domains (Literacy, Numeracy, Cognitive, Creativity, Emotional - exact PDF match)
    learnTag: "Holistic Development",
    learnTitle: "What Your Child Will Learn (Ages 0–8)",
    learnSubtitle: "5 core developmental domains filled with engaging, milestone-based games and activities.",
    domainLiteracyTitle: "Literacy",
    domainLiteracyDesc: "Reading, storytelling, phonics, and vocabulary games.",
    domainNumeracyTitle: "Numeracy",
    domainNumeracyDesc: "Counting, shape recognition, math logic, and number games.",
    domainCognitiveTitle: "Cognitive",
    domainCognitiveDesc: "Memory, pattern matching, reasoning, and problem-solving puzzles.",
    domainCreativityTitle: "Creativity",
    domainCreativityDesc: "Drawing, music discovery, art appreciation, and imaginative play.",
    domainEmotionalTitle: "Emotional",
    domainEmotionalDesc: "Self-expression, empathy, mood regulation, and social skills.",

    // Programs
    programsTag: "Grounded Community Impact",
    programsTitle: "Backed by Real SpacECE Foundation Programs",
    programsSubtitle: "Integrating on-ground community initiatives into our digital ecosystem.",
    prog1Badge: "Screening & Assessment",
    prog1Title: "HAALS",
    prog1Desc: "Holistic Early Assessment & Learning System — Science-backed developmental tracking and early identification tools for educators and parents.",
    prog2Badge: "Grassroots Initiative",
    prog2Title: "UMANG",
    prog2Desc: "Universal Early Childhood Development Initiative — Community learning kits, grassroots workshops, and inclusive education resources across centers.",
    prog3Badge: "Home Learning Hub",
    prog3Title: "Parent-Toddler Program",
    prog3Desc: "Home-as-a-Learning-SPACE — Practical toolkits empowering parents to turn everyday household moments into rich learning opportunities for ages 0–8.",

    // Stats
    statsChildren: "Children Impacted",
    statsCenters: "Anganwadis & Centers",
    statsExperience: "On-Ground Experience",
    statsActivities: "Play-Based Activities",

    // Testimonials
    testTag: "Community Voices",
    testTitle: "Trusted by Parents & Educators",
    testSubtitle: "Real feedback from families and centers across India.",
    test1Quote: "SpacECE transformed how I understand my 4-year-old's growth. The play-based activities are engaging, and the milestone reports give total peace of mind!",
    test1Author: "Priya Sharma",
    test1Role: "Parent of 4-year-old (Pune)",
    test2Quote: "The readiness reports give our Anganwadi workers clear visibility into each child's development without subjecting them to stressful testing.",
    test2Author: "Sunita Patil",
    test2Role: "Anganwadi Center Coordinator",
    test3Quote: "The alignment with NEP 2020 guidelines makes SpacECE an indispensable tool for early childhood care and preschool management.",
    test3Author: "Rajesh Verma",
    test3Role: "Pre-Primary Educator",

    // Centers Callout
    centersTitle: "Empower Your Learning Center or Anganwadi",
    centersSubtitle: "Bring standardized early assessment, digital progress tracking, and NEP 2020-compliant learning modules to your children.",
    centersBtn: "🏫 Register Center / Anganwadi →",

    // Final CTA & Footer
    ctaTitle: "Start your child's learning journey today — takes 2 minutes.",
    ctaSubtitle: "Selecting your role takes less than 2 minutes and unlocks age-appropriate activities instantly.",
    ctaPrimary: "🚀 Select Your Role to Begin",
    ctaSecondary: "Already have an account? Login →",
    footerTagline: "Non-profit organisation dedicated to empowering early childhood care, education, and development for children aged 0–8 across India.",
    footerNavTitle: "Quick Links",
    footerAbout: "About Us",
    footerPrograms: "Our Programs",
    footerDonate: "Donate & Support",
    footerContactTitle: "Contact & Location",
    footerAddress: "SpacECE Foundation India, Pune, Maharashtra, India",
    footerPortalTitle: "Smart Parenting Portal",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",
    footerPortalLink: "Choose Role & Enter Portal →",
    footerCopyright: "© 2026 SpacECE India Foundation (NGO). All rights reserved.",
    footerCompliance: "NEP 2020 & ICDS Compliant Platform"
  },
  hi: {
    // Nav
    navWhy: "महत्व क्यों है",
    navHow: "यह कैसे काम करता है",
    navLearn: "बच्चे क्या सीखते हैं",
    navPrograms: "हमारे कार्यक्रम",
    navCenters: "केंद्रों के लिए",
    navLogin: "पोर्टल लॉगिन",
    navRegister: "शुरू करें",

    // Hero
    heroBadge: "SpacECE इंडिया फ़ाउंडेशन • गैर-लाभकारी प्रारंभिक शिक्षा (आयु 0–8 वर्ष)",
    heroTitleLine1: "प्रारंभिक बचपन की उत्कृष्टता से ",
    heroTitleHighlight: "उज्ज्वल भविष्य का निर्माण",
    heroSubtitle: "0–8 वर्ष के बच्चों के लिए एआई-संचालित शिक्षण, मील का पत्थर जांच, और स्कूल-तैयारी ट्रैकिंग। माता-पिता, शिक्षकों और आंगनवाड़ियों की सहायता के लिए निर्मित।",
    heroBtnPrimary: "🚀 सीखने की यात्रा शुरू करें — नि:शुल्क",
    heroBtnSecondary: "🔑 अपनी भूमिका चुनें",
    trustNep: "NEP 2020 और ICDS समर्थित",
    trustTesting: "तनावमुक्त परीक्षण",
    trustFoundation: "SpacECE फाउंडेशन द्वारा समर्थित",
    mascotTitle: "अपने एआई लर्निंग शुभंकर से मिलें",
    mascotDesc: "हर दिन प्रारंभिक मील के पत्थर के अभियानों का मार्गदर्शन!",
    floatBadge1: "📚 साक्षरता और कहानी सुनाना",
    floatBadge2: "🔢 संख्यात्मकता और गणितीय तर्क",
    floatBadge3: "❤️ भावात्मक और सामाजिक विकास",

    // Why This Matters
    whyTag: "प्रारंभिक बचपन का महत्व",
    whyTitle: "पहले 8 वर्ष बच्चे के 90% मस्तिष्क विकास को आकार देते हैं",
    whySubtitle: "हमारा डिजिटल प्लेटफ़ॉर्म SpacECE फ़ाउंडेशन के जमीनी कार्यों को सीधे हर घर और कक्षा तक पहुंचाता है।",
    whyCard1Title: "महत्वपूर्ण विकासात्मक चरण",
    whyCard1Text: "8 वर्ष की आयु से पहले 90% से अधिक मस्तिष्क वास्तुकला का निर्माण होता है। SpacECE प्रारंभिक विकास के हर चरण को पोषण देने के लिए लक्षित गतिविधियाँ प्रदान करता है।",
    whyCard2Title: "जमीनी SpacECE विश्वसनीयता",
    whyCard2Text: "महाराष्ट्र में वास्तविक जमीनी समुदाय के वर्षों के कार्य पर निर्मित, जो भौतिक प्रारंभिक बचपन कार्यक्रमों को डिजिटल साथी में विस्तारित करता है।",
    whyCard3Title: "NEP 2020 और ICDS संरेखण",
    whyCard3Text: "समग्र बाल देखभाल और शिक्षा के लिए राष्ट्रीय शिक्षा नीति (NEP 2020) और एकीकृत बाल विकास सेवाओं (ICDS) के ढाँचे के साथ पूरी तरह से संरेखित।",

    // How It Works
    howTag: "सरल 3-चरण प्रक्रिया",
    howTitle: "SpacECE शिक्षा को कैसे सशक्त बनाता है",
    howSubtitle: "हर बच्चे के लिए सरल, तनावमुक्त और प्रभावी शिक्षण।",
    step1Title: "बच्चा मजेदार खेल खेलता है",
    step1Desc: "बच्चे अपनी आयु के अनुरूप ध्वनि, गणित, पहेलियों और रचनात्मक कहानियों से भरी खेल-आधारित गतिविधियों में संलग्न होते हैं।",
    step2Title: "शांत मील का पत्थर ट्रैकिंग",
    step2Desc: "सिस्टम पृष्ठभूमि में विकासात्मक प्रगति को शांति से ट्रैक करता है — कोई परीक्षा नहीं, कोई तनाव नहीं, और छोटे शिक्षार्थियों पर कोई दबाव नहीं।",
    step3Title: "सरल तत्परता रिपोर्ट",
    step3Desc: "माता-पिता और शिक्षकों को शक्तियों, प्रगति और व्यक्तिगत मार्गदर्शन को उजागर करने वाली सरल, कार्रवाई योग्य तत्परता रिपोर्ट प्राप्त होती है।",

    // Learn Domains
    learnTag: "सर्वांगीण विकास",
    learnTitle: "आपका बच्चा क्या सीखेगा (आयु 0–8 वर्ष)",
    learnSubtitle: "5 मुख्य विकासात्मक क्षेत्र जो आकर्षक, मील के पत्थर आधारित खेलों और गतिविधियों से भरे हैं।",
    domainLiteracyTitle: "साक्षरता",
    domainLiteracyDesc: "पढ़ना, कहानी सुनाना, ध्वनिकी, और शब्दावली खेल।",
    domainNumeracyTitle: "संख्यात्मकता",
    domainNumeracyDesc: "गिनती, आकार पहचान, गणितीय तर्क, और संख्या खेल।",
    domainCognitiveTitle: "संज्ञानात्मक",
    domainCognitiveDesc: "स्मृति, पैटर्न मिलान, तर्क, और समस्या-समाधान पहेलियाँ।",
    domainCreativityTitle: "रचनात्मकता",
    domainCreativityDesc: "ड्राइंग, संगीत की खोज, कला की सराहना, और कल्पनाशील खेल।",
    domainEmotionalTitle: "भावात्मक",
    domainEmotionalDesc: "आत्म-अभिव्यक्ति, सहानुभूति, मनोदशा नियंत्रण, और सामाजिक कौशल।",

    // Programs
    programsTag: "जमीनी सामुदायिक प्रभाव",
    programsTitle: "SpacECE फ़ाउंडेशन के वास्तविक कार्यक्रमों द्वारा संचालित",
    programsSubtitle: "हमारे डिजिटल पारिस्थितिकी तंत्र में जमीनी सामुदायिक पहलों को एकीकृत करना।",
    prog1Badge: "जांच और मूल्यांकन",
    prog1Title: "HAALS",
    prog1Desc: "होलिस्टिक अर्ली असेसमेंट एंड लर्निंग सिस्टम — शिक्षकों और माता-पिता के लिए विज्ञान समर्थित विकासात्मक ट्रैकिंग और प्रारंभिक पहचान उपकरण।",
    prog2Badge: "जमीनी स्तर की पहल",
    prog2Title: "UMANG",
    prog2Desc: "यूनिवर्सल अर्ली चाइल्डहुड डेवलपमेंट इनिशिएटिव — सामुदायिक शिक्षण किट, जमीनी कार्यशालाएं, और केंद्रों में समावेशी शिक्षा संसाधन।",
    prog3Badge: "गृह शिक्षण केंद्र",
    prog3Title: "पेरेंट-टॉडलर प्रोग्राम",
    prog3Desc: "होम-ऐज-ए-लर्निंग-स्पेस — 0–8 वर्ष के बच्चों के लिए हर दिन के घरेलू क्षणों को समृद्ध शिक्षण अवसरों में बदलने के लिए व्यावहारिक टूलकिट।",

    // Stats
    statsChildren: "लाभान्वित बच्चे",
    statsCenters: "आंगनवाड़ी और केंद्र",
    statsExperience: "जमीनी अनुभव",
    statsActivities: "खेल-आधारित गतिविधियाँ",

    // Testimonials
    testTag: "सामुदायिक आवाज़ें",
    testTitle: "माता-पिता और शिक्षकों द्वारा विश्वसनीय",
    testSubtitle: "भारत भर के परिवारों और केंद्रों से वास्तविक प्रतिक्रिया।",
    test1Quote: "SpacECE ने मेरे 4 साल के बच्चे के विकास को समझने के तरीके को बदल दिया। खेल-आधारित गतिविधियाँ बहुत आकर्षक हैं, और मील का पत्थर रिपोर्ट पूर्ण मन की शांति देती हैं!",
    test1Author: "प्रिया शर्मा",
    test1Role: "4 वर्षीय बच्चे की मां (पुणे)",
    test2Quote: "तत्परता रिपोर्ट हमारे आंगनवाड़ी कार्यकर्ताओं को बच्चों को तनावपूर्ण परीक्षण के अधीन किए बिना प्रत्येक बच्चे के विकास की स्पष्ट दृश्यता प्रदान करती हैं।",
    test2Author: "सुनीता पाटिल",
    test2Role: "आंगनवाड़ी केंद्र समन्वयक",
    test3Quote: "NEP 2020 दिशानिर्देशों के साथ संरेखण SpacECE को प्रारंभिक बचपन की देखभाल और पूर्व-प्राथमिक प्रबंधन के लिए एक अनिवार्य उपकरण बनाता है।",
    test3Author: "राजेश वर्मा",
    test3Role: "पूर्व-प्राथमिक शिक्षक",

    // Centers Callout
    centersTitle: "अपने शिक्षण केंद्र या आंगनवाड़ी को सशक्त बनाएं",
    centersSubtitle: "मानकीकृत प्रारंभिक मूल्यांकन, डिजिटल प्रगति ट्रैकिंग और NEP 2020-अनुपालन शिक्षण मॉड्यूल अपने बच्चों के लिए लाएं।",
    centersBtn: "🏫 केंद्र / आंगनवाड़ी पंजीकृत करें →",

    // Final CTA & Footer
    ctaTitle: "आज ही अपने बच्चे की सीखने की यात्रा शुरू करें — 2 मिनट लगते हैं।",
    ctaSubtitle: "अपनी भूमिका का चयन करने में 2 मिनट से कम समय लगता है और यह तुरंत आयु-उपयुक्त गतिविधियों को अनलॉक करता है।",
    ctaPrimary: "🚀 शुरू करने के लिए अपनी भूमिका चुनें",
    ctaSecondary: "क्या आपके पास पहले से खाता है? लॉगिन करें →",
    footerTagline: "गैर-लाभकारी संगठन जो पूरे भारत में 0-8 वर्ष के बच्चों के लिए प्रारंभिक बचपन की देखभाल, शिक्षा और विकास को सशक्त बनाने के लिए समर्पित है।",
    footerNavTitle: "त्वरित लिंक",
    footerAbout: "हमारे बारे में",
    footerPrograms: "हमारे कार्यक्रम",
    footerDonate: "दान और सहायता",
    footerContactTitle: "संपर्क और स्थान",
    footerAddress: "SpacECE फाउंडेशन इंडिया, पुणे, महाराष्ट्र, भारत",
    footerPortalTitle: "स्मार्ट पेरेंटिंग पोर्टल",
    footerPrivacy: "गोपनीयता नीति",
    footerTerms: "सेवा की शर्तें",
    footerPortalLink: "भूमिका चुनें और पोर्टल में प्रवेश करें →",
    footerCopyright: "© 2026 SpacECE इंडिया फाउंडेशन (NGO)। सर्वाधिकार सुरक्षित।",
    footerCompliance: "NEP 2020 और ICDS अनुपालन मंच"
  },
  mr: {
    // Nav
    navWhy: "महत्व का आहे",
    navHow: "हे कसे कार्य करते",
    navLearn: "मुले काय शिकतात",
    navPrograms: "आमचे उपक्रम",
    navCenters: "केंद्रांसाठी",
    navLogin: "पोर्टल लॉगिन",
    navRegister: "सुरू करा",

    // Hero
    heroBadge: "SpacECE इंडिया फाउंडेशन • ना-नफा बालशिक्षण संस्था (वय ० ते ८ वर्षे)",
    heroTitleLine1: "प्रारंभिक बालशिक्षणाच्या उत्कृष्टतेतून ",
    heroTitleHighlight: "उज्ज्वल भविष्याची उभारणी",
    heroSubtitle: "० ते ८ वर्षांच्या मुलांसाठी AI-आधारित शिक्षण, प्रगती ट्रॅकिंग आणि बालवाडी तयारी. पालक, शिक्षक आणि अंगणवाडी कार्यकर्त्यांसाठी विशेष डिझाइन.",
    heroBtnPrimary: "🚀 शिकण्याचा प्रवास सुरू करा — मोफत",
    heroBtnSecondary: "🔑 तुमची भूमिका निवडा",
    trustNep: "NEP 2020 आणि ICDS प्रमाणित",
    trustTesting: "ताणमुक्त मूल्यांकन",
    trustFoundation: "SpacECE फाउंडेशनद्वारे समर्थित",
    mascotTitle: "तुमच्या AI लर्निंग मित्राला भेटा",
    mascotDesc: "दररोज बालविकासाच्या टप्प्यांचे मार्गदर्शन!",
    floatBadge1: "📚 साक्षरता व गोष्ट सांगणे",
    floatBadge2: "🔢 संख्याशास्त्र व गणिती तर्क",
    floatBadge3: "❤️ भावनिक व सामाजिक विकास",

    // Why This Matters
    whyTag: "प्रारंभिक बाल संगोपनाचे महत्व",
    whyTitle: "पहिले ८ वर्षे मुलाच्या ९०% मेंदूच्या विकासाला आकार देतात",
    whySubtitle: "अापले डिजिटल प्लॅटफॉर्म SpacECE फाउंडेशनचे कार्य थेट प्रत्येक घरापर्यंत आणि वर्गापर्यंत पोहोचवते.",
    whyCard1Title: "महत्वाचा विकासाचा काळ",
    whyCard1Text: "८ वर्षांच्या आधी मुलांच्या ९०% पेक्षा जास्त मेंदूची रचना तयार होते. SpacECE बालविकासाच्या प्रत्येक टप्प्याला समृद्ध करण्यासाठी योग्य उपक्रम पुरवते.",
    whyCard2Title: "SpacECE ची मैदानी विश्वासार्हता",
    whyCard2Text: "महाराष्ट्रातील वास्तविक मैदानी सामाजिक कार्याच्या वर्षांवर आधारित, जे प्रत्यक्ष बालशिक्षण उपक्रमांना डिजिटल साथीदार बनवते.",
    whyCard3Title: "NEP 2020 व ICDS सुसंगतता",
    whyCard3Text: "राष्ट्रीय शैक्षणिक धोरण (NEP 2020) आणि एकात्मिक बाल विकास सेवा (ICDS) च्या चौकटीशी पूर्णपणे सुसंगत.",

    // How It Works
    howTag: "सोपी ३-टप्प्यांची प्रक्रिया",
    howTitle: "SpacECE कसे कार्य करते",
    howSubtitle: "प्रत्येक मुलासाठी सोपे, ताणमुक्त आणि प्रभावी शिक्षण.",
    step1Title: "मूल रंजक खेळ खेळते",
    step1Desc: "मुले वयानुरुप अक्षरे, गणित, कोडी आणि गोष्टींच्या माध्यमातून आनंददायी खेळांमध्ये सहभागी होतात.",
    step2Title: "अदृश्य प्रगती ट्रॅकिंग",
    step2Desc: "प्रणाली मुलांवर कोणताही ताण न आणता पाठीमागून बालविकासाची प्रगती नोंदवते — परीक्षा नाही, दबाव नाही.",
    step3Title: "सोपे प्रगती अहवाल",
    step3Desc: "पालक आणि शिक्षकांना मुलांची ताकद, प्रगती आणि वैयक्तिक मार्गदर्शन दर्शवणारे सोपे अहवाल मिळतात.",

    // Learn Domains
    learnTag: "सर्वांगीण विकास",
    learnTitle: "तुमचे मूल काय शिकेल (वय ० ते ८ वर्षे)",
    learnSubtitle: "५ मुख्य विकासात्मक क्षेत्रे जी रंजक खेळांनी आणि उपक्रमांनी समृद्ध आहेत.",
    domainLiteracyTitle: "साक्षरता",
    domainLiteracyDesc: "वाचन, गोष्टी सांगणे, शब्दसंग्रह आणि संभाषण खेळ.",
    domainNumeracyTitle: "संख्याशास्त्र",
    domainNumeracyDesc: "मोजणी, आकार ओळख, गणितीय तर्क आणि संख्या खेळ.",
    domainCognitiveTitle: "तार्किक व बौद्धिक",
    domainCognitiveDesc: "स्मरणशक्ती, कोडी, आकार तर्क आणि समस्या निवारण.",
    domainCreativityTitle: "सर्जनशीलता",
    domainCreativityDesc: "चित्रकला, संगीत, कला आणि कल्पक खेळ.",
    domainEmotionalTitle: "भावनिक विकास",
    domainEmotionalDesc: "भावना व्यक्त करणे, ओळखणे, सहानुभूती आणि भावनिक समतोल.",

    // Programs
    programsTag: "वास्तविक सामाजिक प्रभाव",
    programsTitle: "SpacECE फाउंडेशनच्या मैदानी उपक्रमांवर आधारित",
    programsSubtitle: "आमच्या डिजिटल प्लॅटफॉर्ममध्ये मैदानी उपक्रम समाविष्ट करणे.",
    prog1Badge: "मूल्यांकन व ट्रॅकिंग",
    prog1Title: "HAALS",
    prog1Desc: "होलिस्टिक अर्ली असेसमेंट अँड लर्निंग सिस्टम — शिक्षक आणि पालकांसाठी शास्त्रोक्त बालविकास ट्रॅकिंग साधन.",
    prog2Badge: "सामाजिक उपक्रम",
    prog2Title: "UMANG",
    prog2Desc: "युनिव्हर्सल अर्ली चाइल्डहुड डेव्हलपमेंट इनिशिएटिव्ह — अंगणवाड्यांसाठी शैक्षणिक संच, कार्यशाळा आणि समावेशक शिक्षण.",
    prog3Badge: "घरगुती शिक्षण केंद्र",
    prog3Title: "पालक-बालक कार्यक्रम",
    prog3Desc: "होम-ॲज-अ-लर्निंग-स्पेस — ० ते ८ वर्षांच्या मुलांसाठी घरातील दैनंदिन प्रसंगांचे शिकण्याच्या संधींमध्ये रूपांतर करणारे टूलकिट.",

    // Stats
    statsChildren: "लाभार्थी मुले",
    statsCenters: "अंगणवाड्या व केंद्रे",
    statsExperience: "मैदानी अनुभव",
    statsActivities: "रंजक खेळ व उपक्रम",

    // Testimonials
    testTag: "सामाजिक अभिप्राय",
    testTitle: "पालक व शिक्षकांचा विश्वास",
    testSubtitle: "महाराष्ट्र आणि भारतभरातील कुटुंबांचे व केंद्रांचे अनुभव.",
    test1Quote: "SpacECE मुळे माझ्या ४ वर्षांच्या मुलाचा विकास समजणे सोपे झाले. खेळांवर आधारित उपक्रम खूप छान आहेत!",
    test1Author: "प्रिया शर्मा",
    test1Role: "४ वर्षांच्या मुलाची पालक (पुणे)",
    test2Quote: "या अहवालांमुळे आमच्या अंगणवाडी कार्यकर्त्यांना मुलांवर परीक्षेचा ताण न आणता त्यांच्या विकासाची स्पष्ट माहिती मिळते.",
    test2Author: "सुनीता पाटील",
    test2Role: "अंगणवाडी केंद्र समन्वयक",
    test3Quote: "NEP 2020 च्या मार्गदर्शक तत्त्वांशी सुसंगत असल्यामुळे SpacECE पूर्व-प्राथमिक शिक्षणासाठी अत्यंत उपयुक्त आहे.",
    test3Author: "राजेश वर्मा",
    test3Role: "पूर्व-प्राथमिक शिक्षक",

    // Centers Callout
    centersTitle: "तुमचे बालवाडी किंवा अंगणवाडी केंद्र सक्षम करा",
    centersSubtitle: "डिजिटल प्रगती ट्रॅकिंग आणि NEP 2020 वर आधारित बालशिक्षण आपल्या केंद्रात आणा.",
    centersBtn: "🏫 बालवाडी / अंगणवाडी केंद्र नोंदणी करा →",

    // Final CTA & Footer
    ctaTitle: "आजच तुमच्या पाल्याचा शिकण्याचा प्रवास सुरू करा — २ मिनिटे लागतात.",
    ctaSubtitle: "भूमिका निवडण्यासाठी २ मिनिटांपेक्षा कमी वेळ लागतो आणि तात्काळ शैक्षणिक खेळ उपलब्ध होतात.",
    ctaPrimary: "🚀 सुरू करण्यासाठी तुमची भूमिका निवडा",
    ctaSecondary: "आधीच खाते आहे का? लॉगिन करा →",
    footerTagline: "भारतभरातील ० ते ८ वयोगटातील मुलांच्या बालसंगोपन, शिक्षण आणि विकासासाठी कटिबद्ध ना-नफा संस्था.",
    footerNavTitle: "जलद लिंक्स",
    footerAbout: "आमच्याबद्दल",
    footerPrograms: "आमचे उपक्रम",
    footerDonate: "देणगी व मदत",
    footerContactTitle: "संपर्क व पत्ता",
    footerAddress: "SpacECE फाउंडेशन इंडिया, पुणे, महाराष्ट्र, भारत",
    footerPortalTitle: "स्मार्ट पेरेंटिंग पोर्टल",
    footerPrivacy: "गोपनीयता धोरण",
    footerTerms: "सेवा अटी",
    footerPortalLink: "भूमिका निवडा व पोर्टलमध्ये प्रवेश करा →",
    footerCopyright: "© 2026 SpacECE इंडिया फाउंडेशन (NGO). सर्व हक्क राखीव.",
    footerCompliance: "NEP 2020 आणि ICDS प्रमाणित व्यासपीठ"
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [scrolled, setScrolled] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAction = (targetPath = '/roles') => {
    setPendingPath(targetPath);
  };

  const handleLoadingComplete = () => {
    if (pendingPath) {
      navigate(pendingPath);
    }
  };

  const t = content[lang] || content.en;

  if (pendingPath) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="landing-container">
      {/* ====================================================================
          1. STICKY TOP NAVIGATION BAR (Team Member 1)
         ==================================================================== */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => handleAction('/roles')}>
            <img src={logoImg} alt="SpacECE Foundation Logo" className="brand-logo-img" />
            <div>
              <h1 className="brand-title">Spac<span>ECE</span></h1>
              <span className="brand-subtitle">India Foundation • NGO</span>
            </div>
          </div>

          <ul className="nav-links">
            <li className="nav-link-item"><a href="#why-matters">{t.navWhy}</a></li>
            <li className="nav-link-item"><a href="#how-it-works">{t.navHow}</a></li>
            <li className="nav-link-item"><a href="#domains">{t.navLearn}</a></li>
            <li className="nav-link-item"><a href="#programs">{t.navPrograms}</a></li>
            <li className="nav-link-item"><a href="#centers">{t.navCenters}</a></li>
          </ul>

          <div className="nav-actions">
            {/* Language Switcher Toggle (EN / HI / MR) */}
            <div className="lang-switcher" title="Select Language">
              <button
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
                onClick={() => setLang('hi')}
              >
                HI
              </button>
              <button
                className={`lang-btn ${lang === 'mr' ? 'active' : ''}`}
                onClick={() => setLang('mr')}
              >
                MR
              </button>
            </div>

            <button
              className="btn-nav-login"
              onClick={() => handleAction('/roles')}
            >
              {t.navLogin}
            </button>
            <button
              className="btn-nav-register"
              onClick={() => handleAction('/roles')}
            >
              <span>{t.navRegister}</span> →
            </button>
          </div>
        </div>
      </nav>

      {/* ====================================================================
          2. HERO SECTION WITH ILLUSTRATION (Team Member 1)
         ==================================================================== */}
      <section className="hero-section" id="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              <span>{t.heroBadge}</span>
            </div>

            <h2 className="hero-title">
              {t.heroTitleLine1}<span className="highlight">{t.heroTitleHighlight}</span>
            </h2>

            <p className="hero-subtitle">
              {t.heroSubtitle}
            </p>

            <div className="hero-actions">
              <button
                className="btn-hero-primary"
                onClick={() => handleAction('/roles')}
              >
                {t.heroBtnPrimary}
              </button>

              <button
                className="btn-hero-secondary"
                onClick={() => handleAction('/roles')}
              >
                {t.heroBtnSecondary}
              </button>
            </div>

            <div className="hero-trust-strip">
              <div className="trust-item">
                <span className="icon">📜</span>
                <span>{t.trustNep}</span>
              </div>
              <div className="trust-item">
                <span className="icon">🎯</span>
                <span>{t.trustTesting}</span>
              </div>
              <div className="trust-item">
                <span className="icon">🏛️</span>
                <span>{t.trustFoundation}</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-mascot-card">
              <img src={heroMascotImg} alt="SpacECE AI Learning Mascot Illustration" className="hero-mascot-img" />
              <div className="hero-mascot-info">
                <h3 className="hero-card-title">{t.mascotTitle}</h3>
                <p className="hero-card-text">{t.mascotDesc}</p>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="float-badge float-badge-1">
              <span>{t.floatBadge1}</span>
            </div>
            <div className="float-badge float-badge-2">
              <span>{t.floatBadge2}</span>
            </div>
            <div className="float-badge float-badge-3">
              <span>{t.floatBadge3}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. "WHY THIS MATTERS" & "HOW IT WORKS" (Team Member 2)
         ==================================================================== */}
      <section className="section-padding" id="why-matters">
        <div className="section-header">
          <span className="section-tag">{t.whyTag}</span>
          <h3 className="section-title">{t.whyTitle}</h3>
          <p className="section-subtitle">{t.whySubtitle}</p>
        </div>

        <div className="why-matters-grid">
          <div className="why-card">
            <div className="why-icon" style={{ background: '#FFF3DC', color: '#FF9500' }}>
              🧠
            </div>
            <h4 className="why-card-title">{t.whyCard1Title}</h4>
            <p className="why-card-text">{t.whyCard1Text}</p>
          </div>

          <div className="why-card">
            <div className="why-icon" style={{ background: '#DCFCE7', color: '#10B981' }}>
              🏛️
            </div>
            <h4 className="why-card-title">{t.whyCard2Title}</h4>
            <p className="why-card-text">{t.whyCard2Text}</p>
          </div>

          <div className="why-card">
            <div className="why-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}>
              📜
            </div>
            <h4 className="why-card-title">{t.whyCard3Title}</h4>
            <p className="why-card-text">{t.whyCard3Text}</p>
          </div>
        </div>
      </section>

      <section className="section-padding how-it-works-section" id="how-it-works">
        <div className="section-header">
          <span className="section-tag">{t.howTag}</span>
          <h3 className="section-title">{t.howTitle}</h3>
          <p className="section-subtitle">{t.howSubtitle}</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <span className="step-icon">🎮</span>
            <h4 className="step-title">{t.step1Title}</h4>
            <p className="step-desc">{t.step1Desc}</p>
          </div>

          <div className="step-card">
            <div className="step-num">2</div>
            <span className="step-icon">🤫</span>
            <h4 className="step-title">{t.step2Title}</h4>
            <p className="step-desc">{t.step2Desc}</p>
          </div>

          <div className="step-card">
            <div className="step-num">3</div>
            <span className="step-icon">📊</span>
            <h4 className="step-title">{t.step3Title}</h4>
            <p className="step-desc">{t.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. "WHAT YOUR CHILD WILL LEARN" & PROGRAMS (Team Member 3)
          5 Domains: Literacy, Numeracy, Cognitive, Creativity, Emotional (Exact PDF spec)
         ==================================================================== */}
      <section className="section-padding" id="domains">
        <div className="section-header">
          <span className="section-tag">{t.learnTag}</span>
          <h3 className="section-title">{t.learnTitle}</h3>
          <p className="section-subtitle">{t.learnSubtitle}</p>
        </div>

        <div className="domains-grid">
          <div className="domain-card domain-social">
            <div className="domain-emoji">📚</div>
            <h4 className="domain-name">{t.domainLiteracyTitle}</h4>
            <p className="domain-desc">{t.domainLiteracyDesc}</p>
          </div>

          <div className="domain-card domain-physical">
            <div className="domain-emoji">🔢</div>
            <h4 className="domain-name">{t.domainNumeracyTitle}</h4>
            <p className="domain-desc">{t.domainNumeracyDesc}</p>
          </div>

          <div className="domain-card domain-cognitive">
            <div className="domain-emoji">🧠</div>
            <h4 className="domain-name">{t.domainCognitiveTitle}</h4>
            <p className="domain-desc">{t.domainCognitiveDesc}</p>
          </div>

          <div className="domain-card domain-aesthetic">
            <div className="domain-emoji">🎨</div>
            <h4 className="domain-name">{t.domainCreativityTitle}</h4>
            <p className="domain-desc">{t.domainCreativityDesc}</p>
          </div>

          <div className="domain-card domain-emotional">
            <div className="domain-emoji">❤️</div>
            <h4 className="domain-name">{t.domainEmotionalTitle}</h4>
            <p className="domain-desc">{t.domainEmotionalDesc}</p>
          </div>
        </div>

        {/* Real SpacECE Grounded Programs: HAALS, UMANG, Parent-Toddler Program */}
        <div className="programs-container" id="programs">
          <div className="programs-header">
            <h3>{t.programsTitle}</h3>
            <p>{t.programsSubtitle}</p>
          </div>

          <div className="programs-grid">
            <div className="program-card">
              <span className="program-badge">{t.prog1Badge}</span>
              <h4 className="program-title">{t.prog1Title}</h4>
              <p className="program-text">{t.prog1Desc}</p>
            </div>

            <div className="program-card">
              <span className="program-badge">{t.prog2Badge}</span>
              <h4 className="program-title">{t.prog2Title}</h4>
              <p className="program-text">{t.prog2Desc}</p>
            </div>

            <div className="program-card">
              <span className="program-badge">{t.prog3Badge}</span>
              <h4 className="program-title">{t.prog3Title}</h4>
              <p className="program-text">{t.prog3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. SOCIAL PROOF, STATS & ANGANWADI CALLOUT (Team Member 4)
         ==================================================================== */}
      <section className="stats-strip" id="impact-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <h4>50,000+</h4>
            <p>{t.statsChildren}</p>
          </div>
          <div className="stat-item">
            <h4>250+</h4>
            <p>{t.statsCenters}</p>
          </div>
          <div className="stat-item">
            <h4>10+ Years</h4>
            <p>{t.statsExperience}</p>
          </div>
          <div className="stat-item">
            <h4>1,000+</h4>
            <p>{t.statsActivities}</p>
          </div>
        </div>
      </section>

      <section className="section-padding" id="testimonials">
        <div className="section-header">
          <span className="section-tag">{t.testTag}</span>
          <h3 className="section-title">{t.testTitle}</h3>
          <p className="section-subtitle">{t.testSubtitle}</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-quote">"{t.test1Quote}"</p>
            <div className="testimonial-author">
              <div className="author-avatar">P</div>
              <div className="author-info">
                <h5>{t.test1Author}</h5>
                <p>{t.test1Role}</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-quote">"{t.test2Quote}"</p>
            <div className="testimonial-author">
              <div className="author-avatar">S</div>
              <div className="author-info">
                <h5>{t.test2Author}</h5>
                <p>{t.test2Role}</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-quote">"{t.test3Quote}"</p>
            <div className="testimonial-author">
              <div className="author-avatar">R</div>
              <div className="author-info">
                <h5>{t.test3Author}</h5>
                <p>{t.test3Role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated For Centers & Anganwadis Callout */}
        <div className="centers-callout-card" id="centers">
          <div className="centers-content">
            <h3>{t.centersTitle}</h3>
            <p>{t.centersSubtitle}</p>
          </div>
          <button
            className="btn-center-register"
            onClick={() => handleAction('/roles')}
          >
            {t.centersBtn}
          </button>
        </div>
      </section>

      {/* ====================================================================
          6. FINAL CALL-TO-ACTION & FOOTER (Team Member 5)
         ==================================================================== */}
      <section className="final-cta-section">
        <div className="final-cta-inner">
          <h3 className="final-cta-title">{t.ctaTitle}</h3>
          <p className="final-cta-subtitle">{t.ctaSubtitle}</p>

          <div className="final-cta-buttons">
            <button
              className="btn-final-primary"
              onClick={() => handleAction('/roles')}
            >
              {t.ctaPrimary}
            </button>
            <button
              className="btn-final-secondary"
              onClick={() => handleAction('/roles')}
            >
              {t.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-col-brand">
            <h4>Spac<span>ECE</span> Foundation</h4>
            <p>{t.footerTagline}</p>
          </div>

          <div className="footer-col">
            <h5>{t.footerNavTitle}</h5>
            <ul className="footer-links">
              <li><a href="#why-matters">{t.navWhy}</a></li>
              <li><a href="#how-it-works">{t.navHow}</a></li>
              <li><a href="#domains">{t.navLearn}</a></li>
              <li><a href="#programs">{t.footerPrograms}</a></li>
              <li><a href="#centers">{t.navCenters}</a></li>
              <li><span onClick={() => handleAction('/roles')} style={{ cursor: 'pointer', color: '#94A3B8' }}>{t.footerDonate}</span></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>{t.footerContactTitle}</h5>
            <p style={{ margin: '0 0 0.5rem 0' }}>📍 <strong>{t.footerAddress}</strong></p>
            <p style={{ margin: '0 0 0.5rem 0' }}>📧 contact@spacece.in</p>
            <p style={{ margin: 0 }}>🌐 <a href="https://www.spacece.in/" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8' }}>www.spacece.in</a></p>
          </div>

          <div className="footer-col">
            <h5>{t.footerPortalTitle}</h5>
            <ul className="footer-links">
              <li><Link to="/privacy">{t.footerPrivacy}</Link></li>
              <li><Link to="/terms">{t.footerTerms}</Link></li>
              <li><span onClick={() => handleAction('/roles')} style={{ cursor: 'pointer', color: '#FF9500', fontWeight: 'bold' }}>{t.footerPortalLink}</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t.footerCopyright}</p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>{t.footerCompliance}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
