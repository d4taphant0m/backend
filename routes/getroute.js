import axios from 'axios';

const API_KEY = 'tgp_v1_p9Sp-ZhcY_0Li7WxzHfe_1lPiUZbDMVm4jfDWVhP-WM';
const MODEL_ID = 'ft:gpt-your-model-id'; // Replace with your fine-tuned model ID

async function generate(prompt) {
  const payload = {
    model: MODEL_ID,
    messages: [{ role: 'user', content: prompt }],
  };

  const response = await axios.post(
    'https://api.together.xyz/v1/chat/completions',
    payload,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('Model Response:', response.data.choices[0].message.content);
}

await generate('Explain overfitting in ML');
