# Deployment & Testing Checklist - AI Stock Image Generator

## Deployment Checklist

### 1. Environment Setup
- [ ] **Node.js**: Ensure Node.js v18+ is installed.
- [ ] **Dependencies**: Run `npm install` to update all packages.
- [ ] **Environment Variables**:
    - `NEXT_PUBLIC_N8N_WEBHOOK_URL`: Set to your production n8n webhook URL.
    - `N8N_API_KEY` (if applicable): For secured webhooks.
    - `OPENAI_API_KEY` (if using any local AI features).

### 2. N8N Configuration
- [ ] **Import Workflow**: Import `workflow.json` into your n8n instance.
- [ ] **ComfyUI Connection**: Ensure n8n can reach ComfyUI (default: `http://comfyui:8188`).
- [ ] **Webhook Activation**: Activate the workflow (switch from "Inactive" to "Active").
- [ ] **CORS**: Ensure n8n allows requests from your frontend domain (`fallonava.my.id`).

### 3. ComfyUI Setup
- [ ] **Models**: Ensure `sd_xl_base_1.0.safetensors` (or configured model) is in `models/checkpoints`.
- [ ] **Upscalers**: Ensure `4x-UltraSharp.pth` is in `models/upscale_models`.
- [ ] **Custom Nodes**: Install any required custom nodes (e.g., `ComfyUI-JSON-Interface` if used, though standard API is usually sufficient).

### 4. Frontend Deployment
- [ ] **Build**: Run `npm run build` to ensure no errors.
- [ ] **Start**: Run `npm start` or deploy to Vercel/Netlify.
- [ ] **SSL**: Ensure the domain is served over HTTPS.

---

## Testing Protocol

### 1. Unit Tests

| Component | Test Case | Expected Outcome |
|-----------|-----------|------------------|
| **Form Validation** | Submit empty prompt | Error message "Prompt is required" |
| **Form Validation** | Submit batch size > 8 | Auto-capped at 8 or error message |
| **N8N Client** | Trigger workflow with timeout | Client retries 3 times then throws "Timeout" |
| **Prompt Logic** | "Nature" category selected | Appends "highly detailed, 8k, nature..." to prompt |

### 2. Integration Tests (Full Pipeline)

**Scenario A: Standard Generation**
1.  **Input**: Prompt "Blue ocean", Category "Nature", Batch 2.
2.  **Action**: Click "Generate".
3.  **Check**:
    -   Frontend shows "Initializing...".
    -   Progress bar moves.
    -   Images appear in Grid after ~15-30s.
    -   Images are high quality (1024x1024).

**Scenario B: Error Handling (ComfyUI Down)**
1.  **Setup**: Stop ComfyUI server or block port.
2.  **Input**: Any prompt.
3.  **Action**: Click "Generate".
4.  **Check**:
    -   Frontend shows "Retrying...".
    -   After 3 attempts, shows "Generation failed: Gateway Timeout" or similar.
    -   User can click "Retry".

**Scenario C: Partial Failure**
1.  **Setup**: Mock n8n to return 1 success, 1 failure image.
2.  **Action**: Generate Batch of 2.
3.  **Check**:
    -   Grid shows 1 image and 1 "Failed" placeholder.
    -   Batch status is "Completed (Partial)".

### 3. User Acceptance Tests (UAT)

- [ ] **Mobile Responsiveness**: Open on mobile. Grid should be 1 or 2 columns. Form should be usable.
- [ ] **History Persistence**: Refresh page. Previous batches should still be listed.
- [ ] **Image Modal**: Click image. Modal opens. "Copy Prompt" works.
- [ ] **Dark Mode**: Toggle theme. UI looks correct in both modes.

---

## Test Data Examples

**Positive Cases**
```json
{
  "positive_cases": [
    {"prompt": "sunset over mountains, golden hour", "category": "nature", "cfg": 7},
    {"prompt": "modern minimalist office workspace, macbook", "category": "business", "cfg": 8},
    {"prompt": "cyberpunk city street, rain, neon lights", "category": "technology", "cfg": 7.5}
  ]
}
```

**Negative/Edge Cases**
```json
{
  "negative_cases": [
    {"prompt": "", "category": "nature", "expected": "Validation Error"},
    {"prompt": "A very long prompt that exceeds the token limit of the model...", "category": "abstract", "expected": "Truncation or Success"},
    {"prompt": "test", "batch_size": 20, "expected": "Capped at 8"}
  ]
}
```

## Troubleshooting Guide

**Issue: "Proxy error: 504 - Gateway Timeout"**
- **Cause**: n8n took too long to respond (generation > 30s).
- **Fix**: Increase timeout in `n8n-client.js` or optimize ComfyUI speed (reduce steps).

**Issue: "Network Error"**
- **Cause**: CORS issue or n8n server down.
- **Fix**: Check n8n console logs. Verify `NEXT_PUBLIC_N8N_WEBHOOK_URL`.

**Issue: Images not loading**
- **Cause**: Image URLs returned by n8n are not accessible publically.
- **Fix**: Ensure n8n/ComfyUI saves images to a public folder or upload to S3/Drive and return signed URLs.
