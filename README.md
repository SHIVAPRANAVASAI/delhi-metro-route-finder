# Delhi Metro Route Finder

A user-friendly web application to help you find the best route between any two stations on the Delhi Metro network. This app provides an interactive map, detailed route information, and station details to make your commute easier.

## Features

*   **Interactive Metro Map:** Visualize the entire Delhi Metro network.
*   **Route Planning:** Find the shortest route, including interchanges and total travel time.
*   **Station Information:** Get details about any station, such as nearby points of interest.
*   **Natural Language Input:** Simply type your start and end stations to find a route.

## Tech Stack

*   **Frontend:** React, TypeScript, Vite
*   **AI Service:** Google Gemini API

## Getting Started

### Prerequisites

*   Node.js
*   A Gemini API Key

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/SHIVAPRANAVASAI/delhi-metro-route-finder.git](https://github.com/SHIVAPRANAVASAI/delhi-metro-route-finder.git)
    cd delhi-metro-route-finder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env.local` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=YOUR_API_KEY
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
