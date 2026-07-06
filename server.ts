import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Increase body parsing size limits to support uploaded image maps in base64
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const DATA_DIR = path.join(process.cwd(), "data");
const CAMPAIGNS_FILE = path.join(DATA_DIR, "campaigns.json");

function writeCampaignsFile(campaigns: any[]) {
  const tmpFile = `${CAMPAIGNS_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(campaigns, null, 2), "utf-8");
  fs.renameSync(tmpFile, CAMPAIGNS_FILE);
}

function safeReadCampaigns(): any[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(CAMPAIGNS_FILE, "utf-8");
    if (!raw || !raw.trim()) {
      writeCampaignsFile([]);
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      writeCampaignsFile([]);
      return [];
    }

    return parsed;
  } catch (error) {
    console.error("Campaigns file is invalid, resetting:", error);
    writeCampaignsFile([]);
    return [];
  }
}

// Ensure data folder and campaigns.json exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CAMPAIGNS_FILE)) {
    // Write an empty array initially
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

ensureDataFile();

// API: Get Campaigns
app.get("/api/campaigns", (req, res) => {
  try {
    const campaigns = safeReadCampaigns();
    res.json(campaigns);
  } catch (error: any) {
    console.error("Error reading campaigns:", error);
    res.status(500).json({ error: "Failed to read campaigns data." });
  }
});

// API: Save Campaign (Insert or Update)
app.post("/api/campaigns", (req, res) => {
  try {
    const campaign = req.body;
    if (!campaign || !campaign.id) {
      return res.status(400).json({ error: "Invalid campaign data." });
    }

    let campaigns = safeReadCampaigns();

    // Replace or insert
    const index = campaigns.findIndex((c: any) => c.id === campaign.id);
    if (index !== -1) {
      campaigns[index] = campaign;
    } else {
      campaigns.push(campaign);
    }

    writeCampaignsFile(campaigns);
    res.json({ success: true, campaign });
  } catch (error: any) {
    console.error("Error saving campaign:", error);
    res.status(500).json({ error: "Failed to save campaign data." });
  }
});

// API: Delete Campaign
app.delete("/api/campaigns/:id", (req, res) => {
  try {
    const { id } = req.params;
    let campaigns = safeReadCampaigns();

    const filtered = campaigns.filter((c: any) => c.id !== id);
    writeCampaignsFile(filtered);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ error: "Failed to delete campaign." });
  }
});

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          ignored: ["**/data/**", "**/dist/**"],
        },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support Express v4 routing
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Traveler server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
