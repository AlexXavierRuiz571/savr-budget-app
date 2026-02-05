# SAVR – Budget Simulation App

## Overview

**SAVR** is a responsive frontend budget simulation application designed to help users understand how their income is distributed across expenses, savings, debt, and lifestyle spending.

Unlike a traditional budget tracker, SAVR focuses on **simulation**. It combines user-entered values with real-world cost-of-living averages to provide a more realistic picture of a monthly budget. All values connect back to a central dashboard so users can see how individual financial decisions impact the overall balance.

This project is a complete refactor of an earlier version of SAVR and was rebuilt from the ground up with clearer structure, shared calculation logic, and a more intentional user experience.

---

## 🔗 Live Demo

[View on GitHub Pages](https://alexxavierruiz571.github.io/savr-budget-app/)

---

## Project Pitch Video

Check out [this video](https://drive.google.com/file/d/1L2K_I--Bqox4G_quCMheZ7Ws1hhMu9HH/view?usp=sharing), where I describe my
project and some challenges I faced while building it.

---

## 🛠️ Technologies Used

- React (component-based UI)
- React Router
- JavaScript (ES6+)
- CSS3 (Flexbox, Grid)
- Vite (development and build tooling)
- Git & GitHub for version control
- External cost-of-living API
- Local JSON fallback data

---

## 📦 Features

- Central dashboard with summary chart and totals
- Income input as the foundation for all calculations
- Expenses and Lifestyle pages powered by cost-of-living averages
- Graceful API fallback using curated local JSON data
- Savings and Debt pages with optional notes for context
- Reusable modal system for consistent data entry
- Automatic persistence using browser local storage
- Fully responsive layout across screen sizes

---

## ⚙️ How It Works

- The Main page acts as the central hub, aggregating all saved values and visualizing how income is allocated.
- Shared calculation logic ensures totals remain consistent across all pages.
- Expenses and Lifestyle use API-driven averages with fallback support to maintain reliability.
- Income, Savings, and Debt rely on direct user input and integrate cleanly into the same system.
- All data is stored locally in the browser. There is no authentication or remote database in this version.

---

## 🌍 Cost-of-Living Data

Expenses and Lifestyle estimates are based on cost-of-living data provided by **TravelTables**, which aggregates pricing information for food, rent, utilities, transportation, and other common expenses across thousands of cities worldwide.

SAVR accesses this data through the **Cost of Living and Prices API** hosted on RapidAPI.

- TravelTables website:
  https://traveltables.com
- Cost of Living and Prices API (RapidAPI):
  https://rapidapi.com/traveltables/api/cost-of-living-and-prices

Cost-of-living values are used strictly for simulation and planning purposes.

---

## 🚧 Known Limitations

- All data is stored locally in the browser and resets if browser storage is cleared
- Cost-of-living estimates depend on external data availability and accuracy
- The free tier of the cost-of-living API is subject to request limits and may restrict how often data can be fetched
- Some cities or categories may have limited or incomplete data

**Values are intended for planning and simulation purposes only, not exact financial advice!**

---

## 🔮 Future Plans

This version of SAVR is frontend-only. Future plans include adding a backend with persistent user profiles, authentication, expanded cost-of-living coverage, and remote data storage to make the application fully full-stack.

Additional improvements may include supporting more cities and countries, refining cost-of-living estimates, and expanding planning tools to provide more flexible and detailed budget simulations.

---

## 👨‍💻 Author

Alex Xavier Ruiz
[LinkedIn](https://www.linkedin.com/in/alex-xavier-ruiz-291a29373) || [GitHub](https://github.com/AlexXavierRuiz571)
