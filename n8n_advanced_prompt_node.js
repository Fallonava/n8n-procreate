// -----------------------------------------------------------------------------
// N8N CODE NODE: Advanced Prompt Engine
// -----------------------------------------------------------------------------
// Copy this code into your n8n "Prompt Enhancement" Code Node.
// -----------------------------------------------------------------------------

const input = $input.item.json;

// 1. Configuration & Templates
const TEMPLATES = {
    nature: {
        text: "Professional landscape photography, [SUBJECT], [TIME], [WEATHER], highly detailed, 8K resolution, natural lighting, commercial stock photo, no people, serene atmosphere",
        defaults: { SUBJECT: "majestic mountain range", TIME: "golden hour", WEATHER: "clear sky" }
    },
    business: {
        text: "Professional corporate photography, [SUBJECT], modern office environment, clean composition, professional lighting, high detail, 8K resolution, commercial use, business stock photo",
        defaults: { SUBJECT: "diverse team meeting" }
    },
    lifestyle: {
        text: "Professional lifestyle photography, [SUBJECT], diverse people, authentic moments, natural lighting, emotional connection, high detail, 8K resolution, commercial stock photo",
        defaults: { SUBJECT: "happy family outdoor" }
    },
    technology: {
        text: "Futuristic technology photography, [SUBJECT], sleek modern design, glowing lights, cyber aesthetic, high tech, 8K resolution, highly detailed, commercial stock photo",
        defaults: { SUBJECT: "artificial intelligence circuit" }
    },
    food: {
        text: "Professional food photography, [SUBJECT], studio lighting, appetizing, macro shot, 8K resolution, culinary art, commercial stock photo",
        defaults: { SUBJECT: "gourmet dish plating" }
    },
    abstract: {
        text: "Abstract digital art, [SUBJECT], vibrant colors, geometric shapes, 4k, artistic composition, wallpaper style, commercial background",
        defaults: { SUBJECT: "fluid color explosion" }
    },
    general: {
        text: "Professional stock photo, [SUBJECT], highly detailed, 8k, commercial quality, sharp focus",
        defaults: { SUBJECT: "abstract background" }
    }
};

const QUALITY_BOOSTERS = [
    "highly detailed", "8k", "masterpiece", "sharp focus", "hdr", "professional composition"
];

const NEGATIVE_PROMPT = "blur, low quality, watermark, text, signature, ugly, deformed, bad anatomy, pixelated, noise, grain, cropped, out of frame, amateur, distorted";

// 2. Input Processing
const category = (input.category || input.niche || 'general').toLowerCase();
const userPrompt = input.prompt || '';
const enhance = input.enhance_prompt !== false; // Default true

// 3. Template Selection
let selectedTemplate = TEMPLATES[category] || TEMPLATES.general;
let finalPrompt = userPrompt;

// 4. Construction Logic
if (enhance) {
    // If user provided a full prompt, we treat it as the SUBJECT in the template
    // OR if the user prompt is very short, we use it as subject.
    // If the user prompt is long/complex, we might just append quality keywords.

    if (userPrompt.length < 50) {
        // Treat as subject injection
        let templateText = selectedTemplate.text;
        const subject = userPrompt || selectedTemplate.defaults.SUBJECT;

        templateText = templateText.replace('[SUBJECT]', subject);

        // Handle other placeholders with defaults if not provided in input
        for (const [key, val] of Object.entries(selectedTemplate.defaults)) {
            if (key === 'SUBJECT') continue;
            // Check if input has a matching key (case insensitive)
            const inputVal = input[key.toLowerCase()] || val;
            templateText = templateText.replace(`[${key}]`, inputVal);
        }

        // Clean up any missed tags
        templateText = templateText.replace(/\[.*?\]/g, '');

        finalPrompt = templateText;
    } else {
        // Long prompt: just append quality boosters if not present
        const boostersToAdd = QUALITY_BOOSTERS.filter(b => !userPrompt.includes(b));
        if (boostersToAdd.length > 0) {
            finalPrompt = `${userPrompt}, ${boostersToAdd.join(', ')}`;
        }
    }
}

// 5. Output Construction
return {
    json: {
        ...input,
        original_prompt: userPrompt,
        enhanced_prompt: finalPrompt,
        negative_prompt: input.negative_prompt || NEGATIVE_PROMPT,
        category_used: category,
        enhancement_applied: enhance,
        timestamp: new Date().toISOString()
    }
};
