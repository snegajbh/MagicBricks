const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const createJiraTicket = async (summary, description) => {
    const jiraHost = process.env.JIRA_HOST;
    const jiraUsername = process.env.JIRA_USERNAME;
    const jiraApiToken = process.env.JIRA_API_TOKEN;
    const jiraProjectKey = process.env.JIRA_PROJECT_KEY;

    const auth = Buffer.from(`${jiraUsername}:${jiraApiToken}`).toString('base64');

    try {
        const response = await axios.post(`https://${jiraHost}/rest/api/3/issue`, {
            fields: {
                project: { key: jiraProjectKey },
                summary: summary,
                description: {
                    type: 'doc',
                    version: 1,
                    content: [
                        {
                            type: 'paragraph',
                            content: [
                                { type: 'text', text: description }
                            ]
                        }
                    ]
                },
                issuetype: { name: 'Task' } // Adjust the issue type as needed
            }
        }, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('JIRA ticket created:', response.data.key);
        return response;
    } catch (error) {
        console.error('Error creating JIRA ticket:', error.response ? error.response.data : error.message);
        throw error;
    }
};

app.post('/analyze', async (req, res) => {
    const { testFailure } = req.body;

    if (!testFailure) {
        return res.status(400).send('Test failure details are required.');
    }

    try {
        console.log('Sending request to OpenAI with test failure:', testFailure);

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [
                { role: 'system', content: `Analyze the following test failure:\n\n${testFailure}` }
            ],
            max_tokens: 150,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const analysis = response.data.choices[0].message.content.trim();
        console.log('Received analysis from OpenAI:', analysis);

        // Create a JIRA ticket with the analysis
        const jiraResponse = await createJiraTicket('Automated Test Failure Analysis', analysis);
        res.send({ analysis, jiraTicket: jiraResponse.data.key });
    } catch (error) {
        if (error.response) {
            console.error('Error response from OpenAI API or JIRA API:', error.response.data);
            res.status(500).send('Error response from OpenAI API or JIRA API');
        } else if (error.request) {
            console.error('No response received from OpenAI API or JIRA API:', error.request);
            res.status(500).send('No response received from OpenAI API or JIRA API');
        } else {
            console.error('Error in setting up the request to OpenAI API or JIRA API:', error.message);
            res.status(500).send('Error in setting up the request to OpenAI API or JIRA API');
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
