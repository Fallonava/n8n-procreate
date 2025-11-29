# Debug Webhook n8n

## Checklist Troubleshooting

### 1. Cek Workflow di n8n
- [ ] Workflow `AI Stock Image Generator - ComfyUI Pipeline` sudah di-import?
- [ ] Webhook node sudah **ACTIVE** (ada toggle di kanan atas)?
- [ ] Webhook URL: `https://n8n.fallonava.my.id/webhook/generate-stock`

### 2. Cek Environment Variables
**Development (lokal):**
```bash
# Cek file .env.local
type .env.local
```

**Production (hosting):**
- Vercel: Settings → Environment Variables
- Pastikan ada `N8N_BASE_URL` dan `N8N_API_KEY`

### 3. Test Webhook Manual
**Test dengan curl:**
```bash
curl -X POST https://n8n.fallonava.my.id/webhook/generate-stock \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "test image",
    "category": "technology",
    "width": 1024,
    "height": 1024,
    "batch_size": 1,
    "enhance_prompt": true
  }'
```

**Expected response:**
```json
{
  "success": true,
  "job_id": "job_...",
  "images": [...]
}
```

### 4. Cek Browser Console
1. Buka browser DevTools (F12)
2. Tab **Console**
3. Klik tombol "Generate Batch"
4. Lihat error message

**Common errors:**
- `Failed to fetch` → CORS issue atau n8n tidak running
- `404 Not Found` → Webhook path salah atau workflow tidak active
- `Timeout` → n8n terlalu lama respond (normal untuk image generation)

### 5. Cek Network Tab
1. Browser DevTools → Tab **Network**
2. Klik "Generate Batch"
3. Cari request ke `/api/n8n/trigger`
4. Klik request → Tab **Preview** atau **Response**

**Check:**
- Status code: 200 OK?
- Response body: Ada error message?
- Request payload: Data terkirim dengan benar?

### 6. Cek Server Logs
**Development:**
```bash
npm run dev
# Lihat console output saat klik generate
```

**Production (Vercel):**
- Dashboard → Project → Deployments → Latest → Function Logs
- Atau: `vercel logs`

### 7. Test Webhook di n8n
1. Buka n8n workflow editor
2. Klik webhook node
3. Klik **"Listen for Test Event"**
4. Dari frontend, klik "Generate Batch"
5. Lihat apakah data masuk di n8n

### 8. Cek API Key
**Test API key valid:**
```bash
curl https://n8n.fallonava.my.id/api/v1/workflows \
  -H "X-N8N-API-KEY: eyJhbGci..."
```

**Expected:** List workflows (bukan 401 Unauthorized)

## Quick Fixes

### Fix 1: Workflow Tidak Active
1. Buka n8n
2. Workflow → Toggle **Active** (kanan atas)
3. Save

### Fix 2: CORS Error
Tambahkan di `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
      ],
    },
  ];
}
```

### Fix 3: Timeout Issue
Increase timeout di `lib/n8n-client.js`:
```javascript
this.timeout = config.timeout || 120000; // 2 minutes
```

### Fix 4: Wrong Webhook URL
Cek di `pages/api/n8n/trigger.js` baris 27:
```javascript
const webhookUrl = `${baseURL}/webhook/${workflowId}`;
console.log('🔄 Webhook URL:', webhookUrl);
```

## Hasil Test

**Tanggal:** _____________________

**Test 1 - Curl ke webhook:**
- [ ] Success
- [ ] Failed: _____________________

**Test 2 - Browser console:**
- [ ] No errors
- [ ] Error: _____________________

**Test 3 - Network tab:**
- Status: _____
- Response: _____________________

**Test 4 - n8n logs:**
- [ ] Request diterima
- [ ] Tidak ada request masuk

**Kesimpulan:**
_____________________
