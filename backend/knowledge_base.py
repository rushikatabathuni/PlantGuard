# backend/app/knowledge_base.py
"""
Static knowledge base for plant disease treatment advisories.
Simple, fast, and reliable - no external dependencies needed!
"""

# Disease information for all 38 PlantVillage classes
DISEASE_KNOWLEDGE = {
    "Apple___Apple_scab": {
        "description": "Fungal disease causing dark, scabby lesions on leaves and fruit.",
        "severity": "MODERATE",
        "treatment": [
            "Apply fungicides like myclobutanil or captan at 7-14 day intervals during growing season",
            "Remove and destroy all infected leaves and fallen fruit immediately",
            "Prune trees to improve air circulation and light penetration",
            "Apply dormant spray in early spring before bud break"
        ],
        "prevention": [
            "Plant resistant varieties such as Liberty, Enterprise, or Freedom",
            "Maintain 15-20 feet spacing between trees for proper airflow",
            "Avoid overhead irrigation - use drip or ground-level watering",
            "Remove leaf litter in fall to reduce overwintering fungal spores",
            "Apply preventive fungicide sprays starting at bud break"
        ]
    },
    
    "Apple___Black_rot": {
        "description": "Fungal disease causing fruit rot and leaf spots with purple margins.",
        "severity": "MODERATE to HIGH",
        "treatment": [
            "Remove all infected fruit, branches, and mummified apples",
            "Apply captan or thiophanate-methyl fungicides",
            "Prune out dead wood and cankers during dormant season",
            "Improve air circulation through proper pruning"
        ],
        "prevention": [
            "Practice good sanitation - remove all mummies and infected debris",
            "Prune trees annually to reduce cankers and dead wood",
            "Apply preventive fungicides from pink bud through harvest",
            "Avoid wounding trees during maintenance"
        ]
    },
    
    "Apple___Cedar_apple_rust": {
        "description": "Fungal disease requiring both apple and cedar trees to complete lifecycle.",
        "severity": "LOW to MODERATE",
        "treatment": [
            "Apply myclobutanil or trifloxystrobin fungicides at pink and petal fall stages",
            "Remove galls from nearby cedar trees if practical",
            "Focus treatment on most susceptible varieties"
        ],
        "prevention": [
            "Plant resistant varieties like Freedom, Liberty, or Enterprise",
            "Remove cedar trees within 1-2 mile radius if possible",
            "Apply preventive fungicides from bud break through June",
            "Scout regularly for orange leaf spots in spring"
        ]
    },
    
    "Apple___healthy": {
        "description": "Plant shows no signs of disease - healthy foliage and normal growth.",
        "severity": "NONE",
        "treatment": [
            "No treatment needed - continue current care practices"
        ],
        "prevention": [
            "Maintain consistent watering (1-2 inches per week)",
            "Fertilize in early spring with balanced fertilizer (10-10-10)",
            "Prune annually during dormant season for shape and airflow",
            "Monitor regularly for early signs of pests or diseases",
            "Mulch around base but keep away from trunk"
        ]
    },
    
    "Blueberry___healthy": {
        "description": "Healthy blueberry plant with no disease symptoms.",
        "severity": "NONE",
        "treatment": [
            "No treatment required - maintain good cultural practices"
        ],
        "prevention": [
            "Maintain acidic soil pH (4.5-5.5) with sulfur or peat moss",
            "Water consistently - 1-2 inches per week",
            "Mulch with pine bark or wood chips (2-4 inches deep)",
            "Prune old canes annually to encourage new growth",
            "Monitor for mummy berry disease and remove infected fruit"
        ]
    },
    
    "Cherry_(including_sour)___Powdery_mildew": {
        "description": "Fungal disease causing white powdery coating on leaves and shoots.",
        "severity": "MODERATE",
        "treatment": [
            "Apply sulfur or myclobutanil fungicides at first sign of disease",
            "Remove heavily infected shoots and destroy",
            "Improve air circulation through proper pruning",
            "Avoid overhead watering, especially in evening"
        ],
        "prevention": [
            "Plant resistant varieties when available",
            "Ensure adequate spacing (15-20 feet) between trees",
            "Prune for open canopy to improve air circulation",
            "Apply preventive sulfur sprays in early spring",
            "Avoid excessive nitrogen fertilization"
        ]
    },
    
    "Cherry_(including_sour)___healthy": {
        "description": "Healthy cherry tree with no disease symptoms.",
        "severity": "NONE",
        "treatment": [
            "No treatment needed - continue good orchard management"
        ],
        "prevention": [
            "Water deeply once per week during growing season",
            "Fertilize in early spring with balanced fertilizer",
            "Prune annually in late winter for shape and health",
            "Protect from birds with netting during fruit ripening",
            "Monitor for brown rot and bacterial canker"
        ]
    },
    
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "description": "Fungal disease causing rectangular gray-brown lesions on leaves.",
        "severity": "MODERATE",
        "treatment": [
            "Apply fungicides (strobilurins or triazoles) if disease is severe before tasseling",
            "Consider fungicide application if >50% leaf area affected",
            "Ensure proper nutrient management, especially nitrogen"
        ],
        "prevention": [
            "Practice crop rotation - wait 2-3 years before planting corn again",
            "Use resistant hybrids when available",
            "Bury or remove crop residue after harvest",
            "Plant early to avoid peak disease pressure",
            "Maintain proper plant spacing for airflow"
        ]
    },
    
    "Corn_(maize)___Common_rust_": {
        "description": "Fungal disease causing small, circular to elongate reddish-brown pustules on leaves.",
        "severity": "LOW to MODERATE",
        "treatment": [
            "Apply fungicides only if disease is severe before tasseling",
            "Treatment usually not economical unless >5% leaf area affected",
            "Most effective when applied early in infection"
        ],
        "prevention": [
            "Plant resistant hybrids - most modern hybrids have good resistance",
            "Early planting often avoids peak rust pressure",
            "No need for treatment in most home gardens",
            "Monitor fields regularly during humid weather"
        ]
    },
    
    "Corn_(maize)___Northern_Leaf_Blight": {
        "description": "Fungal disease causing long, cigar-shaped gray-green lesions on leaves.",
        "severity": "MODERATE to HIGH",
        "treatment": [
            "Apply fungicides (strobilurins or triazoles) at first sign if weather favors disease",
            "Most effective when applied before disease reaches upper canopy",
            "Consider treatment if lesions reach ear leaf before tasseling"
        ],
        "prevention": [
            "Use resistant hybrids - most important management tool",
            "Rotate crops - avoid continuous corn planting",
            "Bury crop residue or use no-till to reduce spore levels",
            "Plant early to reduce disease pressure",
            "Maintain balanced fertility"
        ]
    },
    
    "Corn_(maize)___healthy": {
        "description": "Healthy corn plant with no disease symptoms.",
        "severity": "NONE",
        "treatment": [
            "No treatment required - continue good agronomic practices"
        ],
        "prevention": [
            "Ensure adequate water during critical growth stages",
            "Apply nitrogen in split applications for efficiency",
            "Scout regularly for corn borers and armyworms",
            "Maintain proper plant population (28,000-32,000 plants/acre)",
            "Practice 2-3 year crop rotation"
        ]
    },
    
    "Grape___Black_rot": {
        "description": "Fungal disease causing leaf spots and mummified fruit.",
        "severity": "HIGH - Can cause total crop loss",
        "treatment": [
            "Remove and destroy all mummified fruit immediately",
            "Apply fungicides (myclobutanil or mancozeb) from bud break through fruit set",
            "Spray every 10-14 days during wet weather",
            "Remove infected leaves and canes"
        ],
        "prevention": [
            "Sanitation is critical - remove ALL mummies in fall and spring",
            "Prune for open canopy to improve air circulation",
            "Apply preventive fungicides starting at bud swell",
            "Scout vines weekly during susceptible period (bloom to 8 weeks after)",
            "Avoid overhead irrigation"
        ]
    },
    
    "Grape___Esca_(Black_Measles)": {
        "description": "Complex fungal disease causing leaf spots and wood decay in older vines.",
        "severity": "HIGH - Can kill vines",
        "treatment": [
            "No effective chemical treatment available",
            "Remove severely affected vines to prevent spread",
            "Prune out dead wood during dormant season",
            "Maintain vine vigor through proper nutrition and irrigation"
        ],
        "prevention": [
            "Avoid pruning during wet weather",
            "Protect pruning wounds with fungicide paste",
            "Ensure proper drainage and avoid water stress",
            "Remove and burn infected wood",
            "Plant in well-drained soils"
        ]
    },
    
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "description": "Fungal disease causing angular brown spots on leaves.",
        "severity": "MODERATE",
        "treatment": [
            "Apply copper-based fungicides or mancozeb",
            "Remove heavily infected leaves",
            "Improve air circulation through canopy management"
        ],
        "prevention": [
            "Prune for open canopy and good airflow",
            "Remove leaf debris in fall",
            "Apply preventive fungicides during wet periods",
            "Avoid overhead watering"
        ]
    },
    
    "Grape___healthy": {
        "description": "Healthy grapevine with no disease symptoms.",
        "severity": "NONE",
        "treatment": [
            "No treatment needed - maintain vineyard health"
        ],
        "prevention": [
            "Prune annually for fruit quality and disease management",
            "Train vines on trellis for good air circulation",
            "Water deeply but infrequently (avoid wet foliage)",
            "Fertilize based on soil test results",
            "Scout regularly for powdery mildew and black rot"
        ]
    },
    
    # TOMATO DISEASES - Most complete section
    
    "Tomato___Bacterial_spot": {
        "description": "Bacterial disease causing small dark spots with yellow halos on leaves and fruit.",
        "severity": "MODERATE to HIGH",
        "treatment": [
            "Apply copper-based bactericides (fixed copper sprays)",
            "Remove and destroy severely infected plants",
            "Avoid working with plants when wet",
            "Increase spacing to improve air circulation"
        ],
        "prevention": [
            "Use certified disease-free seeds and transplants",
            "Rotate crops - avoid planting tomatoes for 2-3 years",
            "Mulch to prevent soil splash",
            "Use drip irrigation instead of overhead watering",
            "Disinfect tools and stakes between uses"
        ]
    },
    
    "Tomato___Early_blight": {
        "description": "Common fungal disease causing dark spots with concentric rings on lower leaves.",
        "severity": "MODERATE - Can significantly reduce yields",
        "treatment": [
            "Apply fungicides containing chlorothalonil, mancozeb, or copper",
            "Remove infected lower leaves promptly",
            "Mulch around plants to prevent soil splash",
            "Water at base of plants, never overhead",
            "Stake or cage plants to keep foliage off ground"
        ],
        "prevention": [
            "Rotate crops - wait 3-4 years before planting tomatoes in same spot",
            "Space plants 24-36 inches apart for airflow",
            "Use drip irrigation or soaker hoses",
            "Apply 2-3 inches of mulch around plants",
            "Remove all plant debris at end of season",
            "Choose resistant varieties when available"
        ]
    },
    
    "Tomato___Late_blight": {
        "description": "**CRITICAL** - Highly destructive fungal disease that can destroy entire crop within days!",
        "severity": "CRITICAL - IMMEDIATE ACTION REQUIRED",
        "treatment": [
            "Apply copper-based fungicides or chlorothalonil IMMEDIATELY upon detection",
            "Remove and destroy ALL infected plant parts (bag and trash, do not compost)",
            "If more than 50% of plant infected, remove entire plant",
            "Spray healthy plants preventively in same area",
            "Avoid overhead watering completely - use drip irrigation only"
        ],
        "prevention": [
            "Use only certified disease-free transplants from reputable sources",
            "Space plants 3-4 feet apart for maximum air circulation",
            "Mulch heavily to prevent soil splash onto leaves",
            "Monitor weather - disease thrives in cool (60-70°F), wet conditions",
            "Apply preventive fungicides during favorable disease weather",
            "Rotate crops - don't plant tomatoes or potatoes in same area for 3 years",
            "Scout plants daily during wet weather for brown spots",
            "**Late blight can spread from infected potato plants - check nearby potatoes!**"
        ]
    },
    
    "Tomato___Leaf_Mold": {
        "description": "Fungal disease causing pale green to yellow spots on upper leaf surface, olive-green mold underneath.",
        "severity": "MODERATE - Common in greenhouses",
        "treatment": [
            "Improve air circulation - open vents, use fans in greenhouse",
            "Apply chlorothalonil or copper fungicides",
            "Remove heavily infected lower leaves",
            "Reduce humidity below 85% if in greenhouse"
        ],
        "prevention": [
            "Space plants for good airflow (30-36 inches)",
            "Use resistant varieties in humid climates",
            "Avoid overhead watering",
            "Improve ventilation in greenhouses",
            "Keep humidity below 90%"
        ]
    },
    
    "Tomato___Septoria_leaf_spot": {
        "description": "Fungal disease causing small circular spots with dark borders and gray centers on leaves.",
        "severity": "MODERATE",
        "treatment": [
            "Apply fungicides with chlorothalonil or copper",
            "Remove infected lower leaves",
            "Mulch to prevent splash",
            "Improve air circulation"
        ],
        "prevention": [
            "Rotate crops (3-year minimum)",
            "Mulch around plants (2-3 inches)",
            "Water at soil level only",
            "Stake plants for better airflow",
            "Remove debris at season end"
        ]
    },
    
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "description": "Tiny pests causing stippling, yellowing, and webbing on leaves in hot, dry conditions.",
        "severity": "MODERATE to HIGH in dry climates",
        "treatment": [
            "Spray plants with strong water jet to dislodge mites",
            "Apply insecticidal soap or neem oil, targeting leaf undersides",
            "Use miticides (abamectin or bifenazate) for severe infestations",
            "Release predatory mites (Phytoseiulus persimilis) for biological control"
        ],
        "prevention": [
            "Maintain adequate soil moisture - mites thrive in dry conditions",
            "Avoid over-fertilizing with nitrogen",
            "Encourage beneficial insects (ladybugs, lacewings)",
            "Inspect undersides of leaves regularly",
            "Spray water on plants during dry, hot weather"
        ]
    },
    
    "Tomato___Target_Spot": {
        "description": "Fungal disease causing concentric rings on leaves similar to early blight.",
        "severity": "MODERATE",
        "treatment": [
            "Apply fungicides (chlorothalonil, mancozeb, or azoxystrobin)",
            "Remove infected leaves",
            "Improve air circulation and reduce humidity"
        ],
        "prevention": [
            "Use crop rotation (2-3 years)",
            "Mulch to prevent soil splash",
            "Avoid overhead irrigation",
            "Space plants adequately",
            "Use resistant varieties if available"
        ]
    },
    
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "description": "Viral disease transmitted by whiteflies, causing severe leaf curling and stunting.",
        "severity": "HIGH - No cure available",
        "treatment": [
            "NO CURE - Remove infected plants immediately to prevent spread",
            "Control whiteflies aggressively with insecticidal soap or neem oil",
            "Use yellow sticky traps to monitor whitefly populations"
        ],
        "prevention": [
            "Use row covers on young plants to exclude whiteflies",
            "Plant resistant varieties (check seed catalogs)",
            "Control weeds that harbor whiteflies",
            "Reflective mulches repel whiteflies",
            "Scout for whiteflies weekly - treat immediately if found",
            "Remove infected plants promptly"
        ]
    },
    
    "Tomato___Tomato_mosaic_virus": {
        "description": "Viral disease causing mottled, distorted leaves and reduced fruit quality.",
        "severity": "MODERATE to HIGH - No cure",
        "treatment": [
            "NO CURE - Remove and destroy infected plants",
            "Disinfect tools with 10% bleach solution between plants",
            "Wash hands thoroughly before handling plants"
        ],
        "prevention": [
            "Use certified virus-free seeds and transplants",
            "Don't smoke near tomato plants (tobacco mosaic virus related)",
            "Wash hands with soap before working with plants",
            "Disinfect tools, stakes, and cages between seasons",
            "Control aphids which can spread virus",
            "Plant resistant varieties (marked with TMV resistance)"
        ]
    },
    
    "Tomato___healthy": {
        "description": "Healthy tomato plant with no disease symptoms - vibrant green leaves and normal growth.",
        "severity": "NONE",
        "treatment": [
            "No treatment needed - continue excellent care practices"
        ],
        "prevention": [
            "Water consistently (1-2 inches per week) at soil level",
            "Fertilize every 2-3 weeks with balanced tomato fertilizer",
            "Mulch with 2-3 inches of organic material",
            "Stake or cage plants for support and airflow",
            "Prune suckers for better air circulation",
            "Monitor daily for early disease or pest signs",
            "Rotate planting location annually",
            "Remove weeds that compete for nutrients"
        ]
    },
    
    # PEPPER DISEASES
    
    "Pepper,_bell___Bacterial_spot": {
        "description": "Bacterial disease causing raised spots on leaves and fruit.",
        "severity": "MODERATE to HIGH",
        "treatment": [
            "Apply copper-based bactericides",
            "Remove severely infected plants",
            "Avoid overhead watering",
            "Improve spacing for air circulation"
        ],
        "prevention": [
            "Use disease-free seeds and transplants",
            "Rotate crops (3-year minimum)",
            "Mulch to prevent soil splash",
            "Use drip irrigation",
            "Disinfect tools between uses"
        ]
    },
    
    "Pepper,_bell___healthy": {
        "description": "Healthy pepper plant with no disease symptoms.",
        "severity": "NONE",
        "treatment": [
            "No treatment needed - maintain good practices"
        ],
        "prevention": [
            "Water consistently (1 inch per week)",
            "Fertilize with balanced fertilizer every 3-4 weeks",
            "Mulch to retain moisture and prevent weeds",
            "Stake tall varieties for support",
            "Monitor for aphids and hornworms regularly"
        ]
    },
    
    # POTATO DISEASES
    
    "Potato___Early_blight": {
        "description": "Fungal disease causing dark spots with concentric rings on older leaves.",
        "severity": "MODERATE",
        "treatment": [
            "Apply fungicides (chlorothalonil or mancozeb)",
            "Remove infected lower leaves",
            "Hill soil around plants to protect tubers"
        ],
        "prevention": [
            "Rotate crops (3-4 year minimum)",
            "Use certified disease-free seed potatoes",
            "Space plants for good airflow",
            "Remove volunteer potatoes",
            "Destroy plant debris after harvest"
        ]
    },
    
    "Potato___Late_blight": {
        "description": "**CRITICAL** - Same pathogen as tomato late blight. Can destroy crop rapidly!",
        "severity": "CRITICAL - IMMEDIATE ACTION",
        "treatment": [
            "Apply copper fungicides or chlorothalonil immediately",
            "Remove infected plants entirely if >50% affected",
            "Harvest uninfected tubers immediately if possible",
            "DO NOT compost infected material"
        ],
        "prevention": [
            "Use certified disease-free seed potatoes",
            "Hill soil high to protect tubers from infection",
            "Apply preventive fungicides during wet weather",
            "Monitor tomatoes nearby - disease spreads between both",
            "Remove volunteer potatoes from previous season",
            "Avoid overhead irrigation",
            "Space rows 36-42 inches apart"
        ]
    },
    
    "Potato___healthy": {
        "description": "Healthy potato plant with no disease symptoms.",
        "severity": "NONE",
        "treatment": [
            "No treatment needed"
        ],
        "prevention": [
            "Use certified seed potatoes",
            "Hill soil around plants as they grow",
            "Water consistently (1-2 inches per week)",
            "Mulch to keep soil cool and moist",
            "Harvest when foliage dies back naturally"
        ]
    },
    
    # RASPBERRY
    
    "Raspberry___healthy": {
        "description": "Healthy raspberry canes with no disease symptoms.",
        "severity": "NONE",
        "treatment": [
            "No treatment needed"
        ],
        "prevention": [
            "Prune out old fruiting canes after harvest",
            "Maintain good air circulation between rows",
            "Water at soil level, not overhead",
            "Mulch with wood chips or straw",
            "Monitor for Japanese beetles and spider mites"
        ]
    },
    
    # SOYBEAN DISEASES
    
    "Soybean___healthy": {
        "description": "Healthy soybean plants with no disease symptoms.",
        "severity": "NONE",
        "treatment": [
            "No treatment needed"
        ],
        "prevention": [
            "Rotate crops (2-3 years between soybeans)",
            "Use certified disease-free seeds",
            "Ensure proper drainage",
            "Scout regularly for sudden death syndrome",
            "Maintain balanced fertility"
        ]
    },
    
    # SQUASH
    
    "Squash___Powdery_mildew": {
        "description": "Fungal disease causing white powdery coating on leaves.",
        "severity": "MODERATE",
        "treatment": [
            "Apply sulfur or potassium bicarbonate sprays",
            "Remove heavily infected leaves",
            "Improve air circulation",
            "Spray early morning so leaves dry quickly"
        ],
        "prevention": [
            "Plant resistant varieties",
            "Space plants for good airflow",
            "Avoid overhead watering",
            "Apply preventive sulfur sprays weekly in humid weather",
            "Remove infected leaves promptly"
        ]
    },
    
    # STRAWBERRY
    
    "Strawberry___Leaf_scorch": {
        "description": "Fungal disease causing purple to brown spots on leaves.",
        "severity": "MODERATE",
        "treatment": [
            "Remove and destroy infected leaves",
            "Apply fungicides during renovation",
            "Improve spacing and air circulation"
        ],
        "prevention": [
            "Use disease-free plants",
            "Space plants 12-18 inches apart",
            "Avoid overhead watering",
            "Remove old leaves after harvest",
            "Apply preventive fungicides in spring"
        ]
    },
    
    "Strawberry___healthy": {
        "description": "Healthy strawberry plants with no disease symptoms.",
        "severity": "NONE",
        "treatment": [
            "No treatment needed"
        ],
        "prevention": [
            "Mulch with straw to keep fruit clean",
            "Water at soil level (1 inch per week)",
            "Renovate plants after harvest",
            "Remove old leaves and runners",
            "Monitor for slugs and spider mites"
        ]
    }
}


def get_advisory(disease_class: str) -> str:
    """
    Get formatted treatment advisory for a disease
    
    Args:
        disease_class: Disease name (e.g., "Tomato___Late_blight")
    
    Returns:
        Formatted advisory text with treatment and prevention
    """
    
    # Get disease info from knowledge base
    info = DISEASE_KNOWLEDGE.get(disease_class)
    
    if not info:
        # Fallback for diseases not in knowledge base
        return format_fallback_advisory(disease_class)
    
    # Format the advisory
    advisory = f"**{info['description']}**\n\n"
    advisory += f"**Severity Level:** {info['severity']}\n\n"
    
    # Treatment section
    advisory += "**🔬 Treatment Steps:**\n"
    for i, treatment in enumerate(info['treatment'], 1):
        advisory += f"{i}. {treatment}\n"
    
    # Prevention section
    advisory += "\n**🛡️ Prevention Measures:**\n"
    for i, prevention in enumerate(info['prevention'], 1):
        advisory += f"{i}. {prevention}\n"
    
    # Add warning for critical diseases
    if "CRITICAL" in info['severity']:
        advisory += "\n⚠️ **URGENT:** This disease can spread rapidly. Take immediate action!"
    
    return advisory


def format_fallback_advisory(disease_class: str) -> str:
    """Fallback advisory when disease not in knowledge base"""
    disease_name = disease_class.replace('___', ' - ').replace('_', ' ')
    
    return f"""**Disease Detected:** {disease_name}

**Detailed information not available in database.**

**General Recommendations:**
1. Consult your local agricultural extension service for specific treatment
2. Take clear photos of symptoms for professional diagnosis
3. Isolate affected plants to prevent potential spread
4. Remove and destroy severely infected plant parts
5. Improve air circulation and reduce leaf wetness
6. Consider submitting samples to plant diagnostic laboratory

**For Expert Guidance:**
- Contact your county extension office
- Visit local plant diagnostic clinic
- Consult certified crop advisor

**Note:** Accurate diagnosis is critical for effective treatment."""

