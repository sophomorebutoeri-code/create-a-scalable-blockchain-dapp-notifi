// Import required libraries and frameworks
const Web3 = require('web3');
const axios = require('axios');
const notifier = require('node-notifier');

// Define API endpoints and configuration
const API_ENDPOINT = 'https://api.scalablenotifier.com';
const NOTIFIER_API_KEY = ' ScalabNotifierApiKey1234567890';

// Define Web3 provider and contract information
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_PROJECT_ID');
const contractAddress = '0x...ContractAddress...';
const contractABI = [...contract ABI array...];

// Define notification triggers and filters
const notificationTriggers = [
  {
    event: 'Transfer',
    filter: async (event) => {
      return event.returnValues.value >= 0.1;
    },
    notification: {
      title: 'New Transfer',
      message: (event) => `New transfer of ${event.returnValues.value} tokens to ${event.returnValues.to}`,
    },
  },
  {
    event: 'Approval',
    filter: async (event) => {
      return event.returnValues.owner === '0x...Your Wallet Address...';
    },
    notification: {
      title: 'New Approval',
      message: (event) => `New approval from ${event.returnValues.spender} for ${event.returnValues.value} tokens`,
    },
  },
];

// Define notification sender function
async function sendNotification(notification) {
  try {
    const response = await axios.post(`${API_ENDPOINT}/send-notification`, {
      apiKey: NOTIFIER_API_KEY,
      notification,
    });
    console.log(`Notification sent: ${response.data.message}`);
  } catch (error) {
    console.error(`Error sending notification: ${error.message}`);
  }
}

// Define event listener function
async function listenForEvents() {
  const contract = new provider.eth.Contract(contractABI, contractAddress);
  contract.events.allEvents()
    .on('data', async (event) => {
      const notificationTrigger = notificationTriggers.find((trigger) => trigger.event === event.event);
      if (notificationTrigger && await notificationTrigger.filter(event)) {
        await sendNotification(notificationTrigger.notification);
      }
    })
    .on('error', (error) => {
      console.error(`Error listening for events: ${error.message}`);
    });
}

// Start event listener
listenForEvents();