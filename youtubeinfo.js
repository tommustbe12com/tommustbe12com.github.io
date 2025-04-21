//GET YOUTUBE INFO FOR TOMMUSTBE12 (me :))
const channelId = "UCJJUPBhRVePwRmBP9xEh_hg";
console.log("SCRIPT.JS IS RUNNING.");

function getSubscriberCount() {
  const obfuscatedKey = "QUl6YVN5QmNvbVZ6WUlCeUc2c0tkUXB1YXVtbkV1cUVkUmx2U2hF"; // Base64 encoded
  const decodedKey = atob(obfuscatedKey);
  const scrambledKey = decodedKey.split('').reverse().join(''); // Reverse the key
  const apiKey = scrambledKey.split('').reverse().join(''); // Unscramble it back

  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const subscriberCount = data.items[0].statistics.subscriberCount;
      document.getElementById('subscribers').innerHTML = subscriberCount;
      console.log(subscriberCount.toString());
    })
    .catch(error => {
      document.getElementById("subscribers").innerHTML = "ERR";
      console.log("An error occurred: " + error);
    });
}

getSubscriberCount();
