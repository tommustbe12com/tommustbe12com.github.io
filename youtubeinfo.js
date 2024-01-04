//GET YOUTUBE INFO FOR TOMMUSTBE12 (me :))
const apiKey = "AIzaSyBcomVzYIByG6sKdQpuaumnEuqEdRlvShE"; 
const channelId = "UCJJUPBhRVePwRmBP9xEh_hg";
console.log("SCRIPT.JS IS RUNNING.")
function getSubscriberCount() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const theData = data.items[0].statistics;
      const subscriberCount = data.items[0].statistics.subscriberCount;
      function getSubs() {
        return subscriberCount;
      }
      document.getElementById('subscribers').innerHTML=subscriberCount;
      console.log(data.items[0].statistics.subscriberCount.toString())
      
    })
    .catch(error => {
      document.getElementById("subscribers").innerHTML="ERR";
      document.getElementById("views").innerHTML="ERR";
      document.getElementById("videos").innerHTML="ERR";
      console.log("An error occurred: " + error)
      //Error message
    });
}
  getSubscriberCount()
  