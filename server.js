const express = require("express");
const app = express();
const cors = require("cors");
let YourCampaigns = require("./Data/YourCampaigns.json");
const CampaignTypes = require("./Data/CampaignTypes.json");
const ProductDetails = require("./Data/ProductDetails.json");

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Home");
});

app.get("/yourcampaigns", (req, res) => {
  try {
    res.send(YourCampaigns);
  } catch (error) {
    console.error(error);
  }
});

app.get("/campaigntypes", (req, res) => {
  try {
    res.send(CampaignTypes);
  } catch (error) {
    console.error(error);
  }
});

app.get("/productdetails", (req, res) => {
  try {
    res.send(ProductDetails);
  } catch (error) {
    console.error(error);
  }
});

app.delete("/yourcampaigns/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    YourCampaigns = YourCampaigns.filter((campaign) => campaign.id !== id);

    res.send(YourCampaigns);
  } catch (error) {
    console.error(error);
  }
});

app.post("/yourcampaigns", (req, res) => {
  try {
    const body = req.body;

    YourCampaigns.push(body);

    res.send(YourCampaigns);
  } catch (error) {
    console.error(error);
  }
});

app.put("/yourcampaigns/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    YourCampaigns = YourCampaigns.map((campaign) => {
      if (campaign.id === id) {
        if (campaign.status === "live_now") {
          return { ...campaign, status: "paused" };
        } else if (campaign.status === "paused") {
          return { ...campaign, status: "live_now" };
        }
      }

      return campaign;
    });

    res.json(YourCampaigns);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
