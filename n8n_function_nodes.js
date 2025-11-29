/**
 * N8N Function Node Implementations
 * 
 * This file contains the JavaScript code intended to be pasted into the "Code" nodes
 * within the n8n workflow.
 */

// -----------------------------------------------------------------------------
// NODE: Prompt Enhancement (Code Node)
// -----------------------------------------------------------------------------
// Description: Enhances user prompt with keywords, handles defaults, and validation.
// -----------------------------------------------------------------------------

const input = $input.item.json;
const category = input.category || 'general';
const basePrompt = input.prompt || '';
const width = input.width || 1024;
const height = input.height || 1024;
const batchSize = Math.min(input.batch_size || 1, 8); // Cap at 8 for safety

// Validation
if (!basePrompt && !input.job) {
    throw new Error("Missing 'prompt' or 'job' parameter.");
}

// Keywords map
const keywords = {
    nature: 'highly detailed, 8k, photorealistic, cinematic lighting, national geographic style, sharp focus',
    business: 'professional, corporate, clean background, high quality, stock photography, 8k, detailed',
    technology: 'futuristic, sleek, modern, glowing, cyber, high tech, 8k, highly detailed',
    abstract: 'vibrant colors, geometric shapes, artistic, 4k, digital art, abstract expressionism',
    lifestyle: 'candid, authentic, warm lighting, high resolution, professional photography',
    food: 'delicious, appetizing, studio lighting, macro, 8k, food photography'
};

// Negative prompts
const negativePrompt = 'blur, low quality, watermark, text, signature, ugly, deformed, bad anatomy, pixelated, noise, grain, cropped, out of frame';

// Enhance prompt
let enhancedPrompt = basePrompt;
if (input.enhance_prompt !== false) { // Default to true
    const suffix = keywords[category] || keywords.nature;
    enhancedPrompt = `${basePrompt}, ${suffix}`;
}

return {
    json: {
        ...input,
        enhanced_prompt: enhancedPrompt,
        negative_prompt: negativePrompt,
        width,
        height,
        batch_size: batchSize,
        generation_id: 'job_' + Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString()
    }
};


// -----------------------------------------------------------------------------
// NODE: Result Formatter & QC (Code Node)
// -----------------------------------------------------------------------------
// Description: Formats the output, simulates QC scoring, and handles partial failures.
// -----------------------------------------------------------------------------

// In a real scenario, this node would process the output from ComfyUI.
// Since we are simulating or using a simplified flow, we generate the structure here.

const promptId = $input.item.json.prompt_id || $input.item.json.generation_id;
const baseUrl = 'https://fallonava.my.id/generated'; // Replace with actual storage URL
const images = [];
const batchSize = $input.item.json.batch_size || 1;

// Simulate processing results
for (let i = 0; i < batchSize; i++) {
    // Simulate a random quality score
    const qualityScore = 70 + Math.floor(Math.random() * 30); // 70-100
    const isSuccess = Math.random() > 0.1; // 10% chance of failure simulation

    if (isSuccess) {
        images.push({
            url: `${baseUrl}/n8n_stock_${promptId}_${i}.png`,
            prompt: $input.item.json.enhanced_prompt,
            quality_score: qualityScore,
            seed: 123456 + i,
            recommendation: qualityScore > 80 ? 'APPROVE' : 'REVIEW'
        });
    } else {
        // Log failed generation in the batch
        images.push({
            error: "Generation failed for this index",
            index: i
        });
    }
}

const successCount = images.filter(img => !img.error).length;

return {
    json: {
        success: successCount > 0,
        job_id: promptId,
        images: images,
        metadata: {
            generation_time: '15s', // Placeholder
            model_used: 'sd_xl_base_1.0',
            total_batch: batchSize,
            success_count: successCount,
            failure_count: batchSize - successCount
        }
    }
};


// -----------------------------------------------------------------------------
// NODE: Error Handler (Code Node)
// -----------------------------------------------------------------------------
// Description: Standardized error response for the API.
// -----------------------------------------------------------------------------

const error = $input.item.error || {};
const context = $input.item.json || {};

return {
    json: {
        success: false,
        error: {
            message: error.message || "Unknown workflow error",
            code: error.name || "WORKFLOW_ERROR",
            timestamp: new Date().toISOString()
        },
        job_id: context.generation_id || null,
        retryable: error.message && (error.message.includes('timeout') || error.message.includes('rate limit'))
    }
};
