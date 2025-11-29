export const PROMPT_TEMPLATES = {
    nature: {
        template: "Professional landscape photography, [SUBJECT], [TIME], [WEATHER], highly detailed, 8K resolution, natural lighting, commercial stock photo, no people, serene atmosphere",
        defaults: {
            SUBJECT: "majestic mountain range",
            TIME: "golden hour",
            WEATHER: "clear sky"
        }
    },
    business: {
        template: "Professional corporate photography, [SUBJECT], modern office environment, clean composition, professional lighting, high detail, 8K resolution, commercial use, business stock photo",
        defaults: {
            SUBJECT: "diverse team meeting"
        }
    },
    lifestyle: {
        template: "Professional lifestyle photography, [SUBJECT], diverse people, authentic moments, natural lighting, emotional connection, high detail, 8K resolution, commercial stock photo",
        defaults: {
            SUBJECT: "happy family outdoor"
        }
    },
    technology: {
        template: "Futuristic technology photography, [SUBJECT], sleek modern design, glowing lights, cyber aesthetic, high tech, 8K resolution, highly detailed, commercial stock photo",
        defaults: {
            SUBJECT: "artificial intelligence circuit"
        }
    },
    food: {
        template: "Professional food photography, [SUBJECT], studio lighting, appetizing, macro shot, 8K resolution, culinary art, commercial stock photo",
        defaults: {
            SUBJECT: "gourmet dish plating"
        }
    },
    abstract: {
        template: "Abstract digital art, [SUBJECT], vibrant colors, geometric shapes, 4k, artistic composition, wallpaper style, commercial background",
        defaults: {
            SUBJECT: "fluid color explosion"
        }
    }
};

export const QUALITY_KEYWORDS = [
    "highly detailed",
    "8k",
    "photorealistic",
    "masterpiece",
    "sharp focus",
    "hdr",
    "professional composition"
];

export const NEGATIVE_PROMPT = "blur, low quality, watermark, text, signature, ugly, deformed, bad anatomy, pixelated, noise, grain, cropped, out of frame, amateur, distorted";

export function constructPrompt(category, subject, params = {}) {
    const config = PROMPT_TEMPLATES[category] || PROMPT_TEMPLATES.nature;
    let prompt = config.template;

    // Replace Subject
    const finalSubject = subject || config.defaults.SUBJECT;
    prompt = prompt.replace('[SUBJECT]', finalSubject);

    // Replace other placeholders with provided params or defaults
    for (const [key, value] of Object.entries(config.defaults)) {
        if (key === 'SUBJECT') continue;
        const paramValue = params[key] || value;
        prompt = prompt.replace(`[${key}]`, paramValue);
    }

    // Clean up any remaining brackets if params weren't provided
    prompt = prompt.replace(/\[.*?\]/g, '');

    return prompt;
}
