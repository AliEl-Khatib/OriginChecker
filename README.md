# OriginChecker
OriginChecker is the frontend for an application that checks if text is AI-generated.

## Features
 - Text Input and file upload supported for input
 - Analysis Button: Mocks API request by randomizing AI-likelihood scores, and simulates network delay
 - Loading state: includes a spinner that is shown while the mocked API request is occuring
 - Results: displays a headline, percentage, and highlighted text based on AI probability
   - Highlighted
     - Red: Text is over 70% likely AI
     - Yellow: Text is over 40% likely AI
     - Green: Text is most likely human
 - Responsiveness: App works well on different devices like mobile, tablet, desktop
 - Dark Mode support: App adapts the user's OS theme

## Installation and Running
```
# Clone the repository
git clone https://github.com/AliEl-Khatib/OriginChecker.git

# Navigate into frontend
cd OriginChecker/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The app will then be running locally on a localhost address given by Vite
