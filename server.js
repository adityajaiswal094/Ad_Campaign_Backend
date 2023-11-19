const express = require("express");
const app = express();
const cors = require("cors");
const moment = require("moment");

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

app.get("/yourcampaigns/v2", (req, res) => {
  try {
    const platform = req.query.platform || "all_platform";
    const status = req.query.status || "all_status";
    const dateRange = req.query.dateRange || "1year";

    const filterCampaigns = YourCampaigns.filter((campaign) => {
      if (platform === "all_platform" && status === "all_status") {
        return true;
      } else if (platform === "all_platform") {
        return campaign.status === status;
      } else if (status === "all_status") {
        return campaign.campaignType.platform === platform;
      } else {
        return (
          campaign.campaignType.platform === platform &&
          campaign.status === status
        );
      }
    });

    const filteredCampaigns = filterCampaigns.filter((campaign) => {
      if (dateRange === "1week") {
        const createdOn = moment(moment(campaign.createdOn).format("ll"));
        const today = moment(moment().format("ll"));
        return today.diff(createdOn, "days") <= 7;
      } else if (dateRange === "30days") {
        const createdOn = moment(moment(campaign.createdOn).format("ll"));
        const today = moment(moment().format("ll"));
        return today.diff(createdOn, "days") <= 30;
      } else if (dateRange === "60days") {
        const createdOn = moment(moment(campaign.createdOn).format("ll"));
        const today = moment(moment().format("ll"));
        return today.diff(createdOn, "days") <= 60;
      } else if (dateRange === "1year") {
        const createdOn = moment(moment(campaign.createdOn).format("ll"));
        const today = moment(moment().format("ll"));
        return today.diff(createdOn, "years") <= 1;
      }
    });

    res.send(filteredCampaigns);
  } catch (error) {
    console.log(error);
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
