const express = require('express');
const axios = require('axios');
const cors=require('cors')
require('dotenv').config()
const app = express();
app.use(cors())
app.use(express.json())
const port = process.env.PORT;
// Replace with your OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;
app.get("/",(req,res)=>{
    res.status(200).send(`welcome to code converter app`)
})
app.post('/convert', async (req, res) => {
  try {
    const { code, targetLanguage } = req.body;
    console.log(apiKey,"is apikey")
    // Construct a prompt for code conversion
    const prompt = `Convert the following code into ${targetLanguage}:${code}`;

    // Set up data for the OpenAI API request
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful assistant that translates code.' }, { role: 'user', content: prompt }],
    };

    // Make a POST request to the OpenAI API
    const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });
console.log(response.data.choices,'are responses')
    const convertedCode = response.data.choices[0].message.content;
    // const cleanCode = convertedCode.replace(/\\/g, '');
    res.status(201).json({ convertedCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during code conversion.' });
  }
});

app.post('/debug', async (req, res) => {
try {
const { code } = req.body;

// Construct a prompt for debugging
const prompt = `Identify the errors in the following code and provide suggestions for fixes:\n${code}`;

// Set up data for the OpenAI API request
const data = {
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'system', content: 'You are a helpful assistant that assists with debugging code.' }, { role: 'user', content: prompt }],
};

// Make a POST request to the OpenAI API for code debugging
const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
});

const debugSuggestions = response.data.choices[0].message.content;
res.json({ debugSuggestions });
} catch (error) {
console.error(error);
res.status(500).json({ error: 'An error occurred during code debugging.' });
}
});
// to check quality of code
app.post('/quality', async (req, res) => {
  try {
    const { code } = req.body;

    // Construct a prompt for checking code quality
    const prompt = `Check the quality of the following code based on the following criteria:
    
    1. Readability
    2. Maintainability
    3. Comments and Documentation
    4. Consistency
    5. Testing
    6. Performance
    7. Security
    8. Error Handling
    9. Scalability
    10. Version Control
    11. Code Reviews
    12. Code Smells
    13. Code Complexity
    14. Testing Automation
    15. Documentation and Knowledge Sharing
    16. Robustness
    17. Usability
    18. Resource Efficiency
    19. Dependency Management
    20. Compatibility
    
    Code:
    
    ${code}`;

    // Set up data for the OpenAI API request
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful assistant that checks code quality.' }, { role: 'user', content: prompt }],
    };

    // Make a POST request to the OpenAI API for code quality check
    const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const qualityCheckResult = response.data.choices[0].message.content;
    res.json({ qualityCheckResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while checking code quality.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
