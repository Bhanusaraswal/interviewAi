// Provider-agnostic LLM helper. Works with ANY OpenAI-compatible API
// (Gemini, OpenRouter, Groq, Ollama, Together, Mistral, DeepSeek, ...).
//
//   LLM_BASE_URL         e.g. https://generativelanguage.googleapis.com/v1beta/openai
//   LLM_API_KEY          your key
//   LLM_MODEL            main model
//   LLM_FALLBACK_MODEL   (optional) used if the main model stays overloaded
//
// Retries automatically on temporary errors (429 / 500 / 502 / 503 / 504).
// Requires Node 18+ (built-in fetch).

const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callModel({ model, prompt, maxTokens, temperature }) {
    const baseUrl = (process.env.LLM_BASE_URL || "").replace(/\/$/, "");
    const apiKey = process.env.LLM_API_KEY;

    const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey || "none"}`,
        },
        body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: maxTokens,
            temperature,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        const err = new Error(`LLM request failed (${res.status}): ${text.slice(0, 300)}`);
        err.status = res.status;
        throw err;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("LLM returned an empty response");
    return content.trim();
}

// Try one model up to `attempts` times with growing delays on temporary errors.
async function tryModel(model, opts, attempts = 4) {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
        try {
            return await callModel({ model, ...opts });
        } catch (err) {
            lastErr = err;
            if (!RETRYABLE.has(err.status)) throw err; // real error: don't retry
            if (i < attempts - 1) {
                const wait = 2000 * 2 ** i; // 2s, 4s, 8s
                console.warn(`[LLM] ${model} busy (${err.status}), retry in ${wait / 1000}s...`);
                await sleep(wait);
            }
        }
    }
    throw lastErr;
}

async function chat({ prompt, maxTokens = 1024, temperature = 0.5 }) {
    if (!process.env.LLM_BASE_URL || !process.env.LLM_MODEL) {
        throw new Error("LLM_BASE_URL and LLM_MODEL must be set in Backend/.env");
    }
    const opts = { prompt, maxTokens, temperature };

    try {
        return await tryModel(process.env.LLM_MODEL, opts);
    } catch (err) {
        const fallback = process.env.LLM_FALLBACK_MODEL;
        if (fallback && RETRYABLE.has(err.status)) {
            console.warn(`[LLM] switching to fallback model ${fallback}`);
            return await tryModel(fallback, opts, 3);
        }
        if (RETRYABLE.has(err.status)) {
            throw new Error("The AI service is busy right now. Please wait a minute and try again.");
        }
        throw err;
    }
}

// Calls the model and parses the first JSON object in the reply.
async function chatJSON(opts) {
    const raw = await chat(opts);
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI did not return valid JSON");
    return JSON.parse(match[0]);
}

module.exports = { chat, chatJSON };