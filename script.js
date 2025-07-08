
// Get references to the buttons, dropdowns, and response div
const iceBtn = document.getElementById('iceBtn');
const factBtn = document.getElementById('factBtn');
const jokeBtn = document.getElementById('jokeBtn');
const weatherBtn = document.getElementById('weatherBtn');
const responseDiv = document.getElementById('response');
const contextType = document.getElementById('contextType');
const personaType = document.getElementById('personaType');

// Prompts for each button type and context
const promptTemplates = {
  icebreaker: {
    team: 'Give me a simple, friendly conversation starter for a team meeting.',
    classroom: 'Give me a simple, friendly conversation starter for a classroom.',
    game: 'Give me a simple, friendly conversation starter for a game night.'
  },
  fact: {
    team: 'Tell me a weird, surprising fact that would be fun to share in a team meeting.',
    classroom: 'Tell me a weird, surprising fact that would be fun to share in a classroom.',
    game: 'Tell me a weird, surprising fact that would be fun to share at a game night.'
  },
  joke: {
    team: 'Tell me a short, light, family-friendly joke for a team meeting.',
    classroom: 'Tell me a short, light, family-friendly joke for a classroom.',
    game: 'Tell me a short, light, family-friendly joke for a game night.'
  },
  weather: {
    team: 'Write a fun, friendly prompt that gets people in a team meeting to share what the weather is like where they are.',
    classroom: 'Write a fun, friendly prompt that gets people in a classroom to share what the weather is like where they are.',
    game: 'Write a fun, friendly prompt that gets people at a game night to share what the weather is like where they are.'
  }
};

// Function to call OpenAI API with context-based tone, conversation type, and persona
async function getOpenAIResponse(type) {
  // Get the selected conversation context (team, classroom, game)
  const context = contextType.value;
  // Get the selected persona
  const persona = personaType.value;
  // Show a fun loading message with emojis
  const loadingMessages = [
    '🧊 Breaking the ice... hold on!',
    '🤔 Thinking of something cool...',
    '✨ Cooking up a fun response...',
    '⏳ Just a moment, magic is happening!',
    '💡 Let me find something interesting...'
  ];
  // Pick a random loading message
  const randomMsg = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  responseDiv.textContent = randomMsg;

  // Set the system prompt based on the type and persona
  let systemPrompt = '';
  // Persona templates
  const personaTemplates = {
    friendly: {
      icebreaker: 'You are a friendly coworker who gives simple, welcoming conversation starters for everyone.',
      fact: 'You are a friendly coworker who shares fun, surprising facts in a positive way.',
      joke: 'You are a friendly coworker who tells light, family-friendly jokes.',
      weather: 'You are a friendly coworker who encourages people to share about the weather in a cheerful way.'
    },
    sassy: {
      icebreaker: 'You are a sassy intern who gives playful, cheeky conversation starters.',
      fact: 'You are a sassy intern who shares weird, surprising facts with a bit of attitude.',
      joke: 'You are a sassy intern who tells short, witty, family-friendly jokes.',
      weather: 'You are a sassy intern who encourages people to share about the weather in a fun, sassy way.'
    },
    professor: {
      icebreaker: 'You are Professor Bot, who gives thoughtful, intellectual conversation starters.',
      fact: 'You are Professor Bot, who shares fascinating, educational facts.',
      joke: 'You are Professor Bot, who tells clever, wholesome jokes suitable for all ages.',
      weather: 'You are Professor Bot, who encourages people to discuss the weather in an engaging, academic way.'
    }
  };

  // Fallback if something is missing
  systemPrompt = personaTemplates[persona]?.[type] || 'You are a helpful assistant for conversation starters.';

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        n: 3, // Ask for 3 completions
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptTemplates[type][context] }
        ],
        max_tokens: 60,
        temperature: 0.9 // Increase randomness for more variety
      })
    });

    // Parse the response as JSON
    const data = await res.json();
    // Collect all unique responses
    let responses = [];
    if (Array.isArray(data.choices)) {
      responses = data.choices
        .map(choice => choice.message?.content?.trim())
        .filter((msg, idx, arr) => msg && arr.indexOf(msg) === idx);
    }
    // Pick a random response from the list
    const message = responses.length > 0 ? responses[Math.floor(Math.random() * responses.length)] : null;
    // Show the message or a fallback
    if (message) {
      responseDiv.textContent = message;
    } else {
      responseDiv.textContent = '😅 Sorry, I couldn\'t think of anything right now. Try again!';
    }
  } catch (err) {
    // Show a friendly error message
    responseDiv.textContent = '🚧 Oops! Something went wrong. Please check your internet connection or try again in a moment.';
  }
}

// Add event listeners to each button
iceBtn.addEventListener('click', () => {
  getOpenAIResponse('icebreaker');
});

factBtn.addEventListener('click', () => {
  getOpenAIResponse('fact');
});

jokeBtn.addEventListener('click', () => {
  getOpenAIResponse('joke');
});

weatherBtn.addEventListener('click', () => {
  getOpenAIResponse('weather');
});
